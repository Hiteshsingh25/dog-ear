import { gsap } from '@/lib/gsap'
import { defineModule } from './types'

/** The gift box still springs in (scale 0 → 1, over-rotating) once. */
export const gift = defineModule({
  name: 'gift',
  selector: '[data-gift]',
  init(el, ctx) {
    const item = el.querySelector('[data-gift-item]')
    if (!item || ctx.reducedMotion) return
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 72%', once: true } })
    tl.fromTo(item, { rotate: 30, scale: 0 }, { rotate: -21, scale: 1, ease: 'elastic.out(1,0.75)', duration: 0.95 })
    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  },
})
