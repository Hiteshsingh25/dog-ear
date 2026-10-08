import { gsap, ScrollTrigger } from '@/lib/gsap'
import { defineModule } from './types'

/** Promo strip: the two stacked ribbons drop and settle with an elastic ease when scrolled into view. */
export const badge = defineModule({
  name: 'badge',
  selector: '[data-badge]',
  init(el) {
    const [item1, item2] = el.querySelectorAll<HTMLElement>('[data-badge-item]')
    if (!item1 || !item2) return
    const mm = gsap.matchMedia()
    mm.add({ motion: '(prefers-reduced-motion: no-preference)', mobile: '(max-width: 990px)' }, (context) => {
      const { motion, mobile } = context.conditions as { motion: boolean; mobile: boolean }
      if (!motion) return
      gsap.set(item1, { rotate: -2, y: '-2em' })
      gsap.set(item2, { rotate: 1, y: '-6em' })
      const tl = gsap
        .timeline({ paused: true })
        .to(item1, { y: '0em', rotate: 0, duration: 1, ease: 'elastic.out(1, 0.75)' }, 0)
        .to(item2, { y: mobile ? '-0.25em' : '-1em', rotate: -4.7, duration: 1, ease: 'elastic.out(1, 0.75)' }, 0.0088)
      const st = ScrollTrigger.create({ trigger: el, start: 'top 80%', end: 'bottom top', onEnter: () => tl.play() })
      return () => {
        st.kill()
        tl.kill()
      }
    })
    return () => mm.revert()
  },
})
