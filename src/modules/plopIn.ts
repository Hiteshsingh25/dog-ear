import { gsap, ScrollTrigger } from '@/lib/gsap'
import { defineModule } from './types'

/** Scale-in with an elastic overshoot when the parent enters the viewport. */
export const plopIn = defineModule({
  name: 'plop-in',
  selector: '[data-plop-in]',
  init(el) {
    const item = el.querySelector('[data-plop-in-item]')
    if (!item) return
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.set(item, { scale: 0, rotate: -20, y: '-4em' })
      const tl = gsap.timeline({ paused: true }).to(item, { scale: 1, y: '0em', rotate: 11, duration: 0.7, ease: 'elastic.out(1, 0.72)' })
      const st = ScrollTrigger.create({ trigger: el, start: 'top 80%', end: 'bottom top', onEnter: () => tl.play() })
      return () => {
        st.kill()
        tl.kill()
      }
    })
    return () => mm.revert()
  },
})
