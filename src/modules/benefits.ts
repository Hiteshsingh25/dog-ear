import { gsap } from '@/lib/gsap'
import { defineModule } from './types'

/** Benefit chips pop in with a stagger once the wall is 25% up the viewport. */
export const benefits = defineModule({
  name: 'benefits',
  selector: '[data-benefits]',
  init(el, ctx) {
    if (ctx.reducedMotion) return
    const items = el.querySelectorAll('[data-benefits-item]')
    if (!items.length) return
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 25%', once: true } })
    tl.fromTo(
      items,
      { rotate: () => gsap.utils.random(-33, 33), scale: 0 },
      { rotate: 0, scale: 1, ease: 'elastic.out(1,0.75)', duration: 0.85, stagger: 0.072 },
    )
    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  },
})
