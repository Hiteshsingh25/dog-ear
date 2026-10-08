import { gsap, SplitText } from '@/lib/gsap'
import { defineModule } from './types'

/** Script-face annotations: characters tumble in one by one when the line enters the viewport. */
export const handwrittenText = defineModule({
  name: 'handwritten-text',
  selector: '[data-handwritten-text-inview]',
  init(el) {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const split = new SplitText(el, { type: 'words, chars', tag: 'span', charsClass: 'split-char', wordsClass: 'split-word' })
      gsap.set(split.words, { display: 'inline-block' })
      gsap.set(split.chars, { display: 'inline-block', opacity: 0, rotate: 22, x: '-0.25em', y: '0.5em' })
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 95%' } })
      tl.to(split.chars, { opacity: 1, rotate: 0, x: '0em', y: '0em', ease: 'elastic.out(1, 0.75)', duration: 0.75, stagger: 0.016 })
      return () => {
        tl.scrollTrigger?.kill()
        tl.kill()
        split.revert()
      }
    })
    return () => mm.revert()
  },
})
