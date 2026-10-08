/**
 * Shared browser-side helpers for the procedural Three.js scenes.
 * (Runs inside headless Chromium — see scripts/render-sequences.mjs.)
 */
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

export const PALETTE = {
  black: '#111111',
  white: '#ffffff',
  yellow: '#ffd24a',
  paleYellow: '#faed8f',
  brightPink: '#fd48f2',
  palePink: '#feb6fa',
  softPink: '#ffdbfd',
  magenta: '#ff008c',
  wine: '#670a2e',
  violet: '#3b308f',
  periwinkle: '#9982de',
  cyan: '#1ce8ed',
  paleBlue: '#a4f6f8',
  orange: '#f9a220',
  paleOrange: '#fbbe63',
  olive: '#857521',
  teal: '#0f766e',
  navy: '#0b2a6f',
  red: '#c8102e',
  cream: '#f3ecd8',
  card: '#b98a5a',
}

export function mulberry(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const clamp01 = (v) => Math.min(1, Math.max(0, v))
export const lerp = (a, b, t) => a + (b - a) * t
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
export const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
export const easeOutBack = (t, s = 1.4) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2)
export const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))
/** progress of t inside [a,b], clamped */
export const seg = (t, a, b) => clamp01((t - a) / (b - a))

export function makeRenderer(width, height) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: true })
  renderer.setPixelRatio(1)
  renderer.setSize(width, height)
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.NoToneMapping
  document.body.appendChild(renderer.domElement)
  return renderer
}

export function makeEnvironment(renderer, scene, intensity = 0.9) {
  const pmrem = new THREE.PMREMGenerator(renderer)
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = env
  scene.environmentIntensity = intensity
  return env
}

/** Camera with a fixed horizontal field of view so width framing survives aspect changes. */
export function setHorizontalFov(camera, hfovDeg, aspect) {
  const h = (hfovDeg * Math.PI) / 180
  camera.aspect = aspect
  camera.fov = (2 * Math.atan(Math.tan(h / 2) / aspect) * 180) / Math.PI
  camera.updateProjectionMatrix()
}

export function canvasTexture(canvas, { repeat = [1, 1], srgb = true } = {}) {
  const tex = new THREE.CanvasTexture(canvas)
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(repeat[0], repeat[1])
  tex.anisotropy = 8
  tex.needsUpdate = true
  return tex
}

/** Smooth closed blob path on a 2D context. */
export function blobPath(ctx, cx, cy, rx, ry, n, jit, rnd, rot = 0) {
  const pts = []
  for (let i = 0; i < n; i++) {
    const a = rot + (i / n) * Math.PI * 2 + (rnd() - 0.5) * ((Math.PI * 2) / n) * 0.5
    const k = 1 + (rnd() - 0.5) * 2 * jit
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k])
  }
  const P = (i) => pts[(i + n) % n]
  ctx.beginPath()
  for (let i = 0; i < n; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2)
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    if (i === 0) ctx.moveTo(p1[0], p1[1])
    ctx.bezierCurveTo(c1[0], c1[1], c2[0], c2[1], p2[0], p2[1])
  }
  ctx.closePath()
}

/** Halftone dot pattern usable as fill/stroke style. */
export function dotPattern(ctx, color = '#111', cell = 16, radius = 4.5) {
  const c = document.createElement('canvas')
  c.width = c.height = cell
  const x = c.getContext('2d')
  x.fillStyle = color
  x.beginPath()
  x.arc(cell / 2, cell / 2, radius, 0, Math.PI * 2)
  x.fill()
  return ctx.createPattern(c, 'repeat')
}

/** Simple folded-page-with-a-face mark used as the "brand sticker" in renders. */
export function drawMark(ctx, x, y, size, color = '#111', paper = '#fff') {
  const s = size
  ctx.save()
  ctx.translate(x, y)
  ctx.fillStyle = paper
  roundRect(ctx, -s / 2, -s / 2, s, s, s * 0.22)
  ctx.fill()
  // folded ear (top-right corner)
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(s * 0.5, -s * 0.5)
  ctx.lineTo(s * 0.5, -s * 0.05)
  ctx.lineTo(s * 0.05, -s * 0.5)
  ctx.closePath()
  ctx.fill()
  // eyes + nose
  ctx.beginPath()
  ctx.arc(-s * 0.18, s * 0.02, s * 0.06, 0, Math.PI * 2)
  ctx.arc(s * 0.12, s * 0.02, s * 0.06, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(-s * 0.03, s * 0.22, s * 0.1, s * 0.07, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/**
 * A hardcover: boards + spine + page block. `jacket` = {main, band, sticker}
 * width/height/depth in scene units. Origin at the book's centre.
 */
export function makeBook({ w = 2.3, h = 3.4, d = 0.42, jacket, seed = 1 }) {
  const group = new THREE.Group()
  const boardT = 0.055
  const rnd = mulberry(seed)

  // jacket texture — two-tone with a spine-side band and a small sticker
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 1512
  const ctx = c.getContext('2d')
  ctx.fillStyle = jacket.main
  ctx.fillRect(0, 0, c.width, c.height)
  ctx.fillStyle = jacket.band
  ctx.fillRect(0, 0, c.width * 0.3, c.height)
  // faint cloth grain
  ctx.globalAlpha = 0.07
  for (let i = 0; i < 2600; i++) {
    ctx.fillStyle = rnd() > 0.5 ? '#000' : '#fff'
    ctx.fillRect(rnd() * c.width, rnd() * c.height, 2, 14)
  }
  ctx.globalAlpha = 1
  if (jacket.sticker) drawMark(ctx, c.width * 0.8, c.height * 0.14, 120, jacket.sticker.ink, jacket.sticker.paper)
  const jacketTex = canvasTexture(c)

  // back cover: plain main colour
  const cb = document.createElement('canvas')
  cb.width = 64
  cb.height = 64
  const cbx = cb.getContext('2d')
  cbx.fillStyle = jacket.main
  cbx.fillRect(0, 0, 64, 64)
  cbx.fillStyle = jacket.band
  cbx.fillRect(44, 0, 20, 64)
  const backTex = canvasTexture(cb)

  // page edges: fine lines
  const cp = document.createElement('canvas')
  cp.width = 256
  cp.height = 256
  const cpx = cp.getContext('2d')
  cpx.fillStyle = PALETTE.cream
  cpx.fillRect(0, 0, 256, 256)
  cpx.strokeStyle = 'rgba(120,100,70,0.35)'
  cpx.lineWidth = 1
  for (let y = 2; y < 256; y += 4) {
    cpx.beginPath()
    cpx.moveTo(0, y + rnd())
    cpx.lineTo(256, y + rnd())
    cpx.stroke()
  }
  const pageTex = canvasTexture(cp, { repeat: [1, 6] })

  const boardMat = new THREE.MeshStandardMaterial({ map: jacketTex, roughness: 0.62, metalness: 0 })
  const backMat = new THREE.MeshStandardMaterial({ map: backTex, roughness: 0.62 })
  const spineMat = new THREE.MeshStandardMaterial({ color: jacket.band, roughness: 0.62 })
  const pageMat = new THREE.MeshStandardMaterial({ map: pageTex, roughness: 0.9 })

  const front = new THREE.Mesh(new THREE.BoxGeometry(w, h, boardT), [spineMat, spineMat, spineMat, spineMat, boardMat, spineMat])
  front.position.z = d / 2 - boardT / 2
  const back = new THREE.Mesh(new THREE.BoxGeometry(w, h, boardT), [spineMat, spineMat, spineMat, spineMat, spineMat, backMat])
  back.position.z = -d / 2 + boardT / 2
  const spine = new THREE.Mesh(new THREE.BoxGeometry(boardT, h, d), spineMat)
  spine.position.x = -w / 2 + boardT / 2
  const pages = new THREE.Mesh(new THREE.BoxGeometry(w - 0.14, h - 0.14, d - boardT * 2 - 0.01), pageMat)
  pages.position.x = -0.04
  group.add(front, back, spine, pages)
  return group
}
