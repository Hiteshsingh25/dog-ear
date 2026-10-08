import { gsap, ScrollTrigger } from '@/lib/gsap'
import { defineModule } from './types'

/**
 * Emoji rain: ~40 clones with randomised scale/rotation/delay/speed and a
 * grid-snapped `left` fly from below the container to above it while the inner
 * element sways and counter-rotates on a yoyo. One "running" flag prevents
 * overlap; the DOM is cleared after the longest animation finishes.
 */
export const emojiRain = defineModule({
  name: 'emoji-rain',
  selector: '[data-emoji-rain]',
  init(el) {
    const container = el.querySelector<HTMLElement>('[data-emoji-rain-container]')
    if (!container) return
    let running = false
    let cleanupTimer: ReturnType<typeof setTimeout> | undefined
    const created: HTMLElement[] = []
    const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

    const createRain = (types: string[]) => {
      if (running) return
      running = true
      const h = container.offsetHeight
      for (let i = 0; i < 40; i++) {
        const scale = Math.random() * 0.7 + 0.4
        const rotate = rand(-28, 28)
        const delay = 0.001 * rand(0, 1250)
        const speed = rand(800, 1800) * 0.001
        const type = types[Math.floor(Math.random() * types.length)]
        const outer = document.createElement('div')
        outer.className = 'choice__single-rain-emoji is--append'
        outer.style.left = `${rand(0, 10)}0%`
        outer.setAttribute('aria-hidden', 'true')
        const inner = document.createElement('div')
        inner.className = `choice__single-rain-emoji-image-${type}`
        outer.appendChild(inner)
        container.appendChild(outer)
        created.push(outer)
        gsap.fromTo(outer, { y: h, xPercent: -50, rotate: 0.001, scale }, { y: '-110%', xPercent: -50, rotate: 0.001, delay, ease: 'power1.in', duration: speed })
        gsap.fromTo(inner, { xPercent: -25, rotate }, { xPercent: 25, rotate: -rotate, ease: 'power1.inOut', delay, duration: 0.8, repeat: -1, yoyo: true })
      }
      cleanupTimer = setTimeout(() => {
        created.splice(0).forEach((n) => {
          gsap.killTweensOf([n, n.firstChild])
          n.remove()
        })
        running = false
      }, 2750)
    }

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const type1 = el.getAttribute('data-emoji-rain-type-1') || 'party'
      const type2 = el.getAttribute('data-emoji-rain-type-2') || type1
      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        onEnter: (self) => {
          if (self.direction === 1) createRain([type1, type2])
        },
      })
      return () => {
        st.kill()
        clearTimeout(cleanupTimer)
        created.splice(0).forEach((n) => {
          gsap.killTweensOf([n, n.firstChild])
          n.remove()
        })
        running = false
      }
    })
    return () => mm.revert()
  },
})
