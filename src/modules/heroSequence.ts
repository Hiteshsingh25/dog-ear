import { gsap, ScrollTrigger } from '@/lib/gsap'
import { ImageSequence, afterLoad } from './sequence'
import { defineModule } from './types'

/**
 * Hero: 120-frame loop autoplaying at `data-fps` while the hero is on screen.
 * Desktop only (the mobile hero shows a still). Reduced motion → static frame.
 */
export const heroSequence = defineModule({
  name: 'hero-sequence',
  selector: '[data-hero-sequence]',
  init(wrap, ctx) {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 992px)', () => {
      const element = wrap.querySelector<HTMLElement>('[data-hero-sequence-element]')
      const canvas = element?.querySelector<HTMLCanvasElement>('[data-hero-sequence-canvas]')
      if (!element || !canvas) return
      if (wrap.dataset.sequenceInit === 'true') return
      wrap.dataset.sequenceInit = 'true'

      const fps = parseInt(canvas.dataset.fps || '24', 10) || 24
      const seq = new ImageSequence({ canvas, element })
      const startTrigger = wrap.dataset.scrollStart || 'top bottom'
      const endTrigger = wrap.dataset.scrollEnd || 'bottom top'

      let tween: gsap.core.Tween | null = null
      let st: ScrollTrigger | null = null
      let cancelLoad: (() => void) | null = null
      let lastWidth = window.innerWidth
      let resizeTimer: ReturnType<typeof setTimeout> | undefined

      const onResize = () => {
        if (window.innerWidth === lastWidth) return
        lastWidth = window.innerWidth
        clearTimeout(resizeTimer)
        resizeTimer = setTimeout(() => {
          seq.resize()
          seq.redraw()
          ScrollTrigger.refresh()
        }, 200)
      }
      window.addEventListener('resize', onResize)

      if (ctx.reducedMotion) {
        void seq.drawStatic()
      } else {
        const playhead = { frame: 0 }
        const startLoop = () => {
          if (!tween) {
            tween = gsap.to(playhead, {
              frame: seq.frames,
              duration: seq.frames / fps,
              ease: 'none',
              repeat: -1,
              paused: true,
              onUpdate: () => seq.drawIndex(seq.indexStart + (Math.floor(playhead.frame) % seq.frames)),
            })
          }
          tween.play()
        }
        const stopLoop = () => tween?.pause()

        cancelLoad = afterLoad(() => void seq.start())
        st = ScrollTrigger.create({
          trigger: wrap,
          start: startTrigger,
          end: endTrigger,
          onEnter: startLoop,
          onEnterBack: startLoop,
          onLeave: stopLoop,
          onLeaveBack: stopLoop,
        })
      }

      return () => {
        cancelLoad?.()
        window.removeEventListener('resize', onResize)
        clearTimeout(resizeTimer)
        tween?.kill()
        st?.kill()
        seq.destroy()
        delete wrap.dataset.sequenceInit
      }
    })
    return () => mm.revert()
  },
})
