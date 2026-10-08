import Core from 'smooothy'
import { gsap } from '@/lib/gsap'

type Item = { el: HTMLElement; rotation: number; yOffset: number }

/**
 * smooothy-based drag sliders. The base class owns the drag/inertia; these
 * subclasses add the arrow controls, the drag-vs-click guard on the card links,
 * and the per-item tilt/parallax that makes the cards feel like a fanned deck.
 */
export class ParallaxSlider extends Core {
  itemsEls: HTMLElement[]
  itemSettings: Item[]
  prevBtn?: HTMLElement
  nextBtn?: HTMLElement
  private cleanups: Array<() => void> = []

  constructor(wrapper: HTMLElement, controls: HTMLElement | null, itemSelector: string, config: Partial<ConstructorParameters<typeof Core>[1]> = {}) {
    super(wrapper, config)
    this.itemsEls = [...wrapper.querySelectorAll<HTMLElement>(itemSelector)]
    this.itemSettings = this.itemsEls.map((el, index) => {
      const direction = index % 2 === 0 ? -1 : 1
      const rotation = gsap.utils.random(1.5, 3, 0.1) * direction
      const yOffset = gsap.utils.random(3, 9, 0.1) * direction
      el.style.setProperty('--book-slider-item-rotate', `${-rotation}deg`)
      el.style.willChange = 'transform'
      return { el, rotation, yOffset }
    })
    if (controls) this.createInterface(controls)
    this.guardLinks()
  }

  createInterface(controls: HTMLElement) {
    const [prev, next] = [...controls.children] as HTMLElement[]
    this.prevBtn = prev
    this.nextBtn = next
    const onPrev = () => this.goToPrev()
    const onNext = () => this.goToNext()
    prev?.addEventListener('click', onPrev)
    next?.addEventListener('click', onNext)
    this.cleanups.push(() => {
      prev?.removeEventListener('click', onPrev)
      next?.removeEventListener('click', onNext)
    })
    this.updateArrowState()
  }

  updateArrowState(endAt = 0.95) {
    if (!this.prevBtn || !this.nextBtn) return
    const currentSlide = this.currentSlide ?? 0
    const progress = gsap.utils.clamp(0, 1, this.progress ?? 0)
    this.prevBtn.classList.toggle('is--disabled', currentSlide <= 0 && progress <= 0.01)
    this.nextBtn.classList.toggle('is--disabled', progress >= endAt)
  }

  /** a drag must not count as a click on the card link */
  guardLinks() {
    const links = [...this.wrapper.querySelectorAll<HTMLAnchorElement>('a')]
    let startX = 0
    let startY = 0
    let pointerDown = false
    let dragged = false
    const onDown = (e: PointerEvent) => {
      startX = e.clientX
      startY = e.clientY
      pointerDown = true
      dragged = false
    }
    const onMove = (e: PointerEvent) => {
      if (!pointerDown) return
      if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) dragged = true
    }
    const onUp = () => {
      pointerDown = false
    }
    const onClick = (e: MouseEvent) => {
      if (dragged) {
        e.preventDefault()
        e.stopPropagation()
      }
      dragged = false
    }
    links.forEach((link) => {
      link.addEventListener('pointerdown', onDown)
      link.addEventListener('click', onClick, true)
    })
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    this.cleanups.push(() => {
      links.forEach((link) => {
        link.removeEventListener('pointerdown', onDown)
        link.removeEventListener('click', onClick, true)
      })
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    })
  }

  onUpdate = () => {
    this.updateArrowState()
    const wrapRect = this.wrapper.getBoundingClientRect()
    const wrapCenter = wrapRect.left + wrapRect.width / 2
    const maxDistance = wrapRect.width / 2 || 1
    for (const { el, rotation, yOffset } of this.itemSettings) {
      const rect = el.getBoundingClientRect()
      const norm = (rect.left + rect.width / 2 - wrapCenter) / maxDistance
      const strength = Math.sin(gsap.utils.clamp(-2, 2, norm) * 1.2)
      el.style.transform = `translateY(${strength * yOffset}%) rotate(${strength * rotation}deg)`
    }
  }

  destroy() {
    this.cleanups.forEach((fn) => fn())
    this.cleanups = []
    this.itemsEls.forEach((el) => {
      el.style.willChange = ''
      el.style.transform = ''
      el.style.removeProperty('--book-slider-item-rotate')
    })
    super.destroy()
  }
}

/** Centre-weighted variant: the active card sits highest and largest. */
export class CenterSlider extends ParallaxSlider {
  updateArrowState() {
    super.updateArrowState(0.75)
  }
  onUpdate = () => {
    this.updateArrowState()
    const wrapRect = this.wrapper.getBoundingClientRect()
    const wrapCenter = wrapRect.left + wrapRect.width / 2
    const maxDistance = wrapRect.width / 2 || 1
    for (const { el } of this.itemSettings) {
      const rect = el.getBoundingClientRect()
      const norm = gsap.utils.clamp(-1, 1, (rect.left + rect.width / 2 - wrapCenter) / maxDistance)
      const distance = Math.abs(norm)
      el.style.transform = `translateY(${-15 * distance}%) scale(${1 - 0.15 * distance})`
    }
  }
}

/** Drive a slider from GSAP's ticker (one clock for everything). Returns a stop fn. */
export function drive(slider: Core) {
  const fn = () => slider.update()
  gsap.ticker.add(fn)
  return () => gsap.ticker.remove(fn)
}
