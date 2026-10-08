import { gsap, SplitText } from '@/lib/gsap'
import { defineModule } from './types'

/**
 * Per-character roll on hover: each glyph squashes down and springs back with
 * an elastic ease, staggered across the word. Text is split on the client only
 * on hover-capable, fine-pointer, motion-ok devices, so SSR keeps plain text.
 */
function charRoll(name: string, selector: string, textSelector: string) {
  return defineModule({
    name,
    selector,
    init(el) {
      const mm = gsap.matchMedia()
      mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const text = el.querySelector<HTMLElement>(textSelector)
        if (!text) return
        const split = new SplitText(text, { type: 'chars', tag: 'span', charsClass: 'split-char' })
        const targets = split.chars as HTMLElement[]
        gsap.set(targets, { display: 'inline-block', transformOrigin: 'center center', willChange: 'transform' })

        const tl = gsap.timeline({ paused: true })
        tl.to(targets, {
          keyframes: {
            '0%': { yPercent: 0, scaleY: 1, rotate: 0 },
            '20%': { yPercent: 55, scaleY: 0.3, rotate: 17, ease: 'power2.in' },
            '100%': { yPercent: 0, scaleY: 1, rotate: 0, ease: 'elastic.out(1,0.4)' },
          },
          duration: 0.725,
          stagger: { amount: 0.225 },
        })

        const hoverRoot = (el.closest('[data-hover]') as HTMLElement | null) || el
        const pause = () => {
          tl.pause()
          gsap.to(targets, { yPercent: 0, scaleY: 1, rotate: 0, duration: 0.2, ease: 'power2.out', overwrite: 'auto' })
        }
        const onEnter = () => tl.restart()
        const onLeave = () => pause()
        const onFocusIn = () => {
          if (hoverRoot.matches(':focus-visible')) tl.restart()
        }
        const onFocusOut = () => {
          if (hoverRoot.matches(':hover')) return
          pause()
        }
        hoverRoot.addEventListener('mouseenter', onEnter)
        hoverRoot.addEventListener('mouseleave', onLeave)
        hoverRoot.addEventListener('focusin', onFocusIn)
        hoverRoot.addEventListener('focusout', onFocusOut)
        return () => {
          hoverRoot.removeEventListener('mouseenter', onEnter)
          hoverRoot.removeEventListener('mouseleave', onLeave)
          hoverRoot.removeEventListener('focusin', onFocusIn)
          hoverRoot.removeEventListener('focusout', onFocusOut)
          tl.kill()
          split.revert()
        }
      })
      return () => mm.revert()
    },
  })
}

export const button = charRoll('button', '[data-button]', '[data-button-text]')
export const buttonAlt = charRoll('button-alt', '[data-button-alt]', '[data-button-alt-text]')
