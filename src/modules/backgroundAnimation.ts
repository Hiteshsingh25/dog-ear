import { gsap, ScrollTrigger } from '@/lib/gsap'
import { defineModule } from './types'

/** Ambient section backgrounds: the blob paths breathe (stroke swells, tiny rotation) while on screen. */
export const backgroundAnimation = defineModule({
  name: 'background-animation',
  selector: '[data-background-animation]',
  init(el) {
    const paths = el.querySelectorAll('path')
    if (!paths.length) return
    const strokeValue = el.hasAttribute('data-background-animation-small') ? 35 : 60
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.set(paths, { attr: { 'stroke-width': 0 }, rotate: 0, transformOrigin: 'center center', transformBox: 'fill-box' })
      const tl = gsap
        .timeline({ paused: true, repeat: -1 })
        .to(paths, { attr: { 'stroke-width': strokeValue }, rotate: 2, duration: 3, ease: 'sine.inOut' })
        .to(paths, { attr: { 'stroke-width': 0 }, rotate: 0, duration: 3, ease: 'sine.inOut' })
      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => tl.play(),
        onEnterBack: () => tl.play(),
        onLeave: () => tl.pause(),
        onLeaveBack: () => tl.pause(),
      })
      return () => {
        st.kill()
        tl.kill()
      }
    })
    return () => mm.revert()
  },
})
