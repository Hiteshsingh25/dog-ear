import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap'
import { ImageSequence, afterLoad } from './sequence'
import { defineModule } from './types'

/**
 * Box: the frame index follows ScrollTrigger progress between data-scroll-start
 * and data-scroll-end. A short exponential lerp chases the target index so a
 * fast flick doesn't strobe. Copy blocks cross-fade at fixed progress points.
 */
export const boxSequence = defineModule({
  name: 'box-sequence',
  selector: '[data-box-sequence]',
  init(wrap, ctx) {
    if (wrap.dataset.sequenceInit === 'true') return
    const element = wrap.querySelector<HTMLElement>('[data-box-sequence-element]')
    const canvas = element?.querySelector<HTMLCanvasElement>('[data-box-sequence-canvas]')
    if (!element || !canvas) return
    wrap.dataset.sequenceInit = 'true'

    const text = wrap.querySelector<HTMLElement>('[data-box-sequence-handwritten-text]')
    const title = wrap.querySelector<HTMLElement>('[data-box-sequence-title]')
    const finalText = wrap.querySelector<HTMLElement>('[data-box-sequence-text-final]')
    const buttons = wrap.querySelectorAll<HTMLElement>('[data-box-sequence-button]')
    const isShort = wrap.hasAttribute('data-box-sequence-short')
    const startTrigger = wrap.dataset.scrollStart || 'top top'
    const endTrigger = wrap.dataset.scrollEnd || 'bottom top'

    const seq = new ImageSequence({ canvas, element, onFrameLoaded: () => seq.render(lastProgress) })
    let lastProgress = 0
    let lastWidth = window.innerWidth
    let resizeTimer: ReturnType<typeof setTimeout> | undefined
    const onResize = () => {
      if (window.innerWidth === lastWidth) return
      lastWidth = window.innerWidth
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        seq.resize()
        seq.render(lastProgress, true)
        ScrollTrigger.refresh()
      }, 200)
    }
    window.addEventListener('resize', onResize)

    const teardowns: Array<() => void> = [
      () => {
        window.removeEventListener('resize', onResize)
        clearTimeout(resizeTimer)
        seq.destroy()
        delete wrap.dataset.sequenceInit
      },
    ]

    if (ctx.reducedMotion) {
      void seq.drawStatic()
      // final state: copy visible, nothing animates
      gsap.set([title, finalText, ...buttons].filter(Boolean), { opacity: 1 })
      return () => teardowns.forEach((fn) => fn())
    }

    /* copy choreography */
    const tl = gsap.timeline({ paused: true })
    const splits: SplitText[] = []
    if (text) {
      const s = new SplitText(text, { type: 'words, chars', tag: 'span', charsClass: 'split-char', wordsClass: 'split-word' })
      splits.push(s)
      gsap.set(s.words, { display: 'inline-block' })
      gsap.set(s.chars, { display: 'inline-block', opacity: 0, rotate: 22, x: '-0.25em', y: '0.5em' })
      tl.to(s.chars, { opacity: 1, rotate: 0, x: '0em', y: '0em', ease: 'elastic.out(1, 0.75)', duration: 0.625, stagger: 0.011 })
    }
    const finalTl = gsap.timeline({ paused: true })
    if (finalText) {
      const s = new SplitText(finalText, { type: 'words, chars', tag: 'span', charsClass: 'split-char', wordsClass: 'split-word' })
      splits.push(s)
      gsap.set(s.words, { display: 'inline-block' })
      gsap.set(s.chars, { display: 'inline-block', opacity: 0, rotate: 22, x: '-0.25em', y: '0.5em' })
      finalTl.to(s.chars, { opacity: 1, rotate: 0, x: '0em', y: '0em', ease: 'elastic.out(1, 0.75)', duration: 0.625, stagger: 0.011 }, 'start')
    }
    if (title) {
      gsap.set(title, { opacity: 0, y: '1em' })
      finalTl.to(title, { opacity: 1, y: '0em', ease: 'elastic.out(1, 0.75)', duration: 0.625 }, 'start')
    }
    if (buttons.length) {
      gsap.set(buttons, { rotate: () => gsap.utils.random(-16, 16), scale: 0 })
      finalTl.to(buttons, { rotate: 0, scale: 1, ease: 'elastic.out(1, 0.75)', duration: 0.625, stagger: 0.026 }, 'start+=0.15')
    }
    teardowns.push(() => {
      tl.kill()
      finalTl.kill()
      splits.forEach((s) => s.revert())
    })

    /* frame scrub with lerp smoothing */
    const cancelLoad = afterLoad(() => void seq.start())
    teardowns.push(cancelLoad)
    let target = 0
    let current = 0
    let ticking = false
    const tick = () => {
      current += (target - current) * 0.35
      if (Math.abs(target - current) < 0.002) {
        current = target
        ticking = false
        gsap.ticker.remove(tick)
      }
      seq.render(current)
    }
    const setTarget = (p: number) => {
      target = p
      if (!ticking) {
        ticking = true
        gsap.ticker.add(tick)
      }
    }
    teardowns.push(() => gsap.ticker.remove(tick))

    let textState = 'before'
    let finalState = 'before'
    const st = ScrollTrigger.create({
      trigger: wrap,
      start: startTrigger,
      end: endTrigger,
      scrub: true,
      onUpdate: (self) => {
        lastProgress = self.progress
        setTarget(self.progress)
        if (self.progress >= 0.6) {
          if (textState !== 'reversed') {
            tl.timeScale(3.5).reverse()
            textState = 'reversed'
          }
        } else if (self.progress >= 0.3) {
          if (textState !== 'played') {
            tl.timeScale(1.5).play()
            textState = 'played'
          }
        } else if (textState !== 'before') {
          tl.timeScale(3.5).reverse()
          textState = 'before'
        }
        if (self.progress >= 0.81) {
          if (finalState !== 'played') {
            finalTl.timeScale(1.25).play()
            finalState = 'played'
          }
        } else if (finalState !== 'before') {
          finalTl.timeScale(3.5).reverse()
          finalState = 'before'
        }
      },
    })
    teardowns.push(() => st.kill())
    lastProgress = st.progress || 0
    current = target = lastProgress

    /* the canvas sits offset in its sticky box and slides up during the first quarter */
    const mm = gsap.matchMedia()
    const scrollAnim = (startY: number) =>
      gsap.to(canvas, {
        keyframes: [
          { yPercent: startY, duration: 0 },
          { yPercent: 0, duration: 0.25 },
          { yPercent: 0, duration: 0.75 },
        ],
        ease: 'none',
        scrollTrigger: { trigger: wrap, start: startTrigger, end: endTrigger, scrub: true },
      })
    mm.add('(min-width: 992px)', () => {
      const tw = scrollAnim(isShort ? 0 : -25)
      return () => tw.scrollTrigger?.kill()
    })
    mm.add('(max-width: 991px)', () => {
      const tw = scrollAnim(isShort ? 0 : -50)
      return () => tw.scrollTrigger?.kill()
    })
    teardowns.push(() => mm.revert())

    return () => teardowns.forEach((fn) => fn())
  },
})
