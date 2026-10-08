/**
 * Canvas image-sequence engine shared by the hero (autoplay) and the box
 * (scroll-scrub). Fully parameterised by data-* attributes on the <canvas>:
 *
 *   data-desktop-src   URL prefix, frame number appended
 *   data-mobile-src    optional lower-res set (picked once at init, never swapped)
 *   data-static-src    single fallback frame (reduced motion)
 *   data-filetype      webp
 *   data-frames        120
 *   data-digits        3           → frame_000.webp … frame_119.webp
 *   data-index-start   0
 *
 * Frames load in a binary-split order (first, last, middle, quarters …) so a
 * scrub always has a nearby frame to draw. Decoded bitmaps live in a module
 * scope cache keyed by URL: a Strict Mode remount or a route round-trip reuses
 * them instead of fetching 120 WebPs again.
 */

type Asset = ImageBitmap | HTMLImageElement

const cache = new Map<string, Asset>()
const inflight = new Map<string, Promise<Asset | null>>()

async function fetchAsset(url: string): Promise<Asset | null> {
  const hit = cache.get(url)
  if (hit) return hit
  const pending = inflight.get(url)
  if (pending) return pending
  const p = (async () => {
    try {
      const res = await fetch(url, { priority: 'low' } as RequestInit)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const blob = await res.blob()
      let asset: Asset
      if ('createImageBitmap' in window) {
        asset = await createImageBitmap(blob, { imageOrientation: 'from-image' })
      } else {
        const img = new Image()
        const objectUrl = URL.createObjectURL(blob)
        try {
          img.src = objectUrl
          await img.decode()
        } finally {
          URL.revokeObjectURL(objectUrl)
        }
        asset = img
      }
      cache.set(url, asset)
      return asset
    } catch (err) {
      console.warn('[sequence] failed to load frame', url, err)
      return null
    } finally {
      inflight.delete(url)
    }
  })()
  inflight.set(url, p)
  return p
}

export type SequenceOptions = {
  canvas: HTMLCanvasElement
  element: HTMLElement
  onFrameLoaded?: (index: number) => void
}

export class ImageSequence {
  readonly frames: number
  readonly digits: number
  readonly indexStart: number
  readonly lastIndex: number
  readonly filetype: string
  readonly baseUrl: string
  readonly staticSrc: string | null
  readonly canvas: HTMLCanvasElement
  readonly element: HTMLElement
  private ctx: CanvasRenderingContext2D
  private loaded = new Map<number, Asset>()
  private queue: Array<[number, number]> = []
  private processing = false
  private destroyed = false
  private lastDrawn = -1
  private onFrameLoaded?: (i: number) => void

  constructor({ canvas, element, onFrameLoaded }: SequenceOptions) {
    this.canvas = canvas
    this.element = element
    this.onFrameLoaded = onFrameLoaded
    const d = canvas.dataset
    this.frames = parseInt(d.frames || '1', 10) || 1
    this.digits = parseInt(d.digits || '3', 10) || 3
    this.indexStart = parseInt(d.indexStart || '0', 10) || 0
    this.lastIndex = this.indexStart + this.frames - 1
    this.filetype = d.filetype || 'webp'
    const desktop = d.desktopSrc || ''
    const mobile = d.mobileSrc || desktop
    // picked once — reloading 120 frames mid-scroll is worse than a slightly-wrong resolution
    this.baseUrl = window.matchMedia('(max-width: 767px)').matches ? mobile : desktop
    this.staticSrc = d.staticSrc || null
    this.ctx = canvas.getContext('2d', { alpha: true })!
    this.resize()
  }

  url(i: number) {
    return `${this.baseUrl}${String(i).padStart(this.digits, '0')}.${this.filetype}`
  }

  /** DPR-scaled backing store, capped at 2. */
  resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const w = this.element.clientWidth
    const h = this.element.clientHeight
    if (!w || !h) return
    if (this.canvas.width !== Math.round(w * dpr) || this.canvas.height !== Math.round(h * dpr)) {
      this.canvas.width = Math.round(w * dpr)
      this.canvas.height = Math.round(h * dpr)
      this.canvas.style.width = `${w}px`
      this.canvas.style.height = `${h}px`
      this.lastDrawn = -1
    }
  }

  private drawCover(img: Asset) {
    if (this.destroyed) return
    const cw = this.canvas.width
    const ch = this.canvas.height
    const scale = Math.max(cw / img.width, ch / img.height)
    const x = (cw - img.width * scale) / 2
    const y = (ch - img.height * scale) / 2
    this.ctx.clearRect(0, 0, cw, ch)
    this.ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
  }

  get loadedCount() {
    return this.loaded.size
  }

  async loadFrame(i: number) {
    if (this.destroyed || this.loaded.has(i) || i < this.indexStart || i > this.lastIndex) return null
    const asset = await fetchAsset(this.url(i))
    if (this.destroyed || !asset) return null
    this.loaded.set(i, asset)
    this.onFrameLoaded?.(i)
    return asset
  }

  private async processQueue() {
    if (this.destroyed || this.processing) return
    this.processing = true
    while (this.queue.length && !this.destroyed) {
      const [a, b] = this.queue.shift()!
      if (b - a <= 1) continue
      const m = Math.floor((a + b) / 2)
      await this.loadFrame(m)
      this.queue.push([a, m], [m, b])
    }
    this.processing = false
  }

  /** first → draw, last, then binary split. */
  async start() {
    const first = await this.loadFrame(this.indexStart)
    if (first) this.drawIndex(this.indexStart)
    await this.loadFrame(this.lastIndex)
    this.queue.push([this.indexStart, this.lastIndex])
    void this.processQueue()
  }

  async drawStatic() {
    if (!this.staticSrc) return this.loadFrame(this.indexStart).then(() => this.drawIndex(this.indexStart))
    const asset = await fetchAsset(this.staticSrc)
    if (asset && !this.destroyed) this.drawCover(asset)
  }

  nearestLoaded(i: number) {
    for (let r = 1; r <= 10; r++) {
      if (this.loaded.has(i - r)) return i - r
      if (this.loaded.has(i + r)) return i + r
    }
    let nearest: number | null = null
    let min = Infinity
    for (const k of this.loaded.keys()) {
      const d = Math.abs(i - k)
      if (d < min) {
        min = d
        nearest = k
      }
    }
    return nearest
  }

  /** Draw exactly index i (or the nearest decoded stand-in). Skips a repaint when nothing changed. */
  drawIndex(i: number, force = false) {
    if (this.destroyed) return
    const idx = this.loaded.has(i) ? i : this.nearestLoaded(i)
    if (idx === null) return
    if (!force && idx === this.lastDrawn) return
    this.lastDrawn = idx
    this.drawCover(this.loaded.get(idx)!)
  }

  /** progress 0..1 → frame */
  render(progress: number, force = false) {
    const relative = progress * (this.frames - 1)
    this.drawIndex(this.indexStart + Math.round(relative), force)
  }

  redraw() {
    if (this.lastDrawn >= 0) this.drawIndex(this.lastDrawn, true)
  }

  destroy() {
    this.destroyed = true
    this.queue.length = 0
    this.loaded.clear()
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}

/** Defer heavy fetching until the page has loaded (sequence frames must not block LCP). */
export function afterLoad(fn: () => void) {
  if (document.readyState === 'complete') {
    const id = window.setTimeout(fn, 0)
    return () => window.clearTimeout(id)
  }
  window.addEventListener('load', fn, { once: true })
  return () => window.removeEventListener('load', fn)
}
