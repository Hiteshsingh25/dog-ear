import { gsap } from '@/lib/gsap'
import { defineModule } from './types'

/**
 * The step cards: scattered at rest, they fly in from below once, and on desktop
 * the card under the cursor straightens + grows while its neighbours fan out.
 */
export const callOut = defineModule({
  name: 'call-out',
  selector: '[data-call-out]',
  init(el, ctx) {
    const cards = [...el.querySelectorAll<HTMLElement>('[data-call-out-item]')]
    const content = [...el.querySelectorAll<HTMLElement>('[data-call-out-child]')]
    if (!cards.length) return
    if (ctx.reducedMotion) return

    const scatter = () => ({
      xPercent: (Math.random() - 0.5) * 10,
      yPercent: (Math.random() - 0.5) * 10,
      rotation: (Math.random() - 0.5) * 15,
    })
    cards.forEach((card) => gsap.set(card, scatter()))

    const intro = gsap.from(cards, {
      rotation: (Math.random() - 0.5) * 15,
      yPercent: '+=150',
      duration: 1.05,
      ease: 'elastic.out(1, 0.75)',
      stagger: 0.088,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    })

    let currentPortion = 0
    const containerW = () => el.clientWidth
    const newPortion = (i: number) => {
      gsap.to(cards[i], { xPercent: 0, yPercent: 0, rotation: 0, duration: 0.85, scale: 1.075, ease: 'elastic.out(1, 0.75)' })
      content.forEach((c, index) => {
        gsap.to(c, { xPercent: index === i ? 0 : 45 / (index - i), ease: 'elastic.out(1, 0.75)', duration: 0.85 })
      })
    }
    const resetPortion = (i: number) => {
      gsap.to(cards[i], { ...scatter(), rotation: (Math.random() - 0.5) * 20, scale: 1, duration: 0.85, ease: 'elastic.out(1, 0.75)' })
    }
    const onMove = (e: MouseEvent) => {
      const x = e.clientX - el.getBoundingClientRect().left
      const active = Math.ceil((x / containerW()) * cards.length)
      if (currentPortion !== active && active > 0 && active <= cards.length) {
        if (currentPortion !== 0) resetPortion(currentPortion - 1)
        currentPortion = active
        newPortion(active - 1)
      }
    }
    const onLeave = () => {
      if (currentPortion > 0) resetPortion(currentPortion - 1)
      currentPortion = 0
      gsap.to(content, { xPercent: 0, ease: 'elastic.out(1, 0.75)', duration: 0.85 })
    }
    const mm = gsap.matchMedia()
    mm.add('(hover: hover) and (pointer: fine)', () => {
      el.addEventListener('mousemove', onMove)
      el.addEventListener('mouseleave', onLeave)
      return () => {
        el.removeEventListener('mousemove', onMove)
        el.removeEventListener('mouseleave', onLeave)
      }
    })
    return () => {
      mm.revert()
      intro.scrollTrigger?.kill()
      intro.kill()
      gsap.killTweensOf([...cards, ...content])
      gsap.set([...cards, ...content], { clearProps: 'transform' })
    }
  },
})
