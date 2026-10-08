import { gsap } from '@/lib/gsap'
import { defineModule } from './types'

/**
 * Pinned-footer reveal: the box still swings up into place while the dark
 * overlay lifts. `clamp()` on start/end so it can't over-run at the document end.
 */
export const footerParallax = defineModule({
  name: 'footer-parallax',
  selector: '[data-footer-parallax]',
  init(el, ctx) {
    if (ctx.reducedMotion) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 991px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'clamp(top bottom)', end: 'clamp(top top)', scrub: 0.2 },
      })
      const top = el.querySelector('[data-footer-parallax-top]')
      const bottom = el.querySelector('[data-footer-parallax-bottom]')
      const visual = el.querySelector('[data-footer-parallax-visual]')
      const overlay = el.querySelector('[data-footer-parallax-overlay]')
      if (top) tl.fromTo(top, { y: '-12.5em' }, { y: '0em', ease: 'none' })
      if (bottom) tl.fromTo(bottom, { y: '-12.5em' }, { y: '0em', ease: 'none' }, '<')
      if (visual) tl.fromTo(visual, { scale: 0.9, xPercent: -35, y: '17.5em', rotate: 30 }, { scale: 1, xPercent: 0, y: '0em', rotate: 0, ease: 'none' }, '<')
      if (overlay) tl.fromTo(overlay, { opacity: 0.55 }, { opacity: 0, ease: 'none' }, '<')
      return () => {
        tl.scrollTrigger?.kill()
        tl.kill()
      }
    })
    return () => mm.revert()
  },
})
