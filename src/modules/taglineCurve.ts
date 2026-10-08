import { gsap } from '@/lib/gsap'
import { defineModule } from './types'

/**
 * Curved tagline: text on an SVG path that runs off both edges of the viewBox.
 * The hidden reference heading provides the font (so the SVG text scales with
 * the type scale); its width is measured with canvas measureText, converted to
 * a percentage of the path length, and startOffset is scrubbed 100% → -width%.
 */
export const taglineCurve = defineModule({
  name: 'tagline-curve',
  selector: '[data-tagline-curve]',
  init(el, ctx) {
    const svg = el.querySelector<SVGSVGElement>('[data-tagline-curve-svg]')
    const reference = el.querySelector<HTMLElement>('[data-tagline-curve-reference]')
    const textPath = el.querySelector<SVGTextPathElement>('[data-tagline-curve-text]')
    const path = svg?.querySelector('path')
    if (!svg || !reference || !textPath || !path) return

    const viewBoxWidth = svg.viewBox.baseVal.width || 1920
    const measureCanvas = document.createElement('canvas')

    const fontSizeInSvgUnits = () => {
      const px = parseFloat(getComputedStyle(reference).fontSize) || 16
      const rendered = svg.getBoundingClientRect().width || viewBoxWidth
      return px / Math.max(rendered / viewBoxWidth, 0.001)
    }
    const textWidth = () => {
      const ctx2 = measureCanvas.getContext('2d')!
      const cs = getComputedStyle(reference)
      ctx2.font = `${cs.fontWeight} ${fontSizeInSvgUnits()}px ${cs.fontFamily}`
      return ctx2.measureText(textPath.textContent?.trim() || '').width
    }

    let tween: gsap.core.Tween | null = null
    const update = () => {
      textPath.parentElement?.setAttribute('font-size', `${fontSizeInSvgUnits()}px`)
      const pathLength = path.getTotalLength()
      const finalOffset = -((textWidth() * 1.25 * 100) / pathLength)
      if (ctx.reducedMotion) {
        // final state: centred-ish and legible
        textPath.setAttribute('startOffset', `${(100 + finalOffset) / 2}%`)
        return
      }
      tween?.scrollTrigger?.kill()
      tween?.kill()
      textPath.setAttribute('startOffset', '100%')
      tween = gsap.to(textPath, {
        attr: { startOffset: `${finalOffset}%` },
        ease: 'none',
        scrollTrigger: { trigger: el, start: '-40% bottom', end: '60% top', scrub: 0.5 },
      })
    }

    let ready = true
    document.fonts?.ready.then(() => {
      if (ready) update()
    })
    update()
    let timer: ReturnType<typeof setTimeout> | undefined
    const onResize = () => {
      clearTimeout(timer)
      timer = setTimeout(update, 120)
    }
    window.addEventListener('resize', onResize)
    return () => {
      ready = false
      clearTimeout(timer)
      window.removeEventListener('resize', onResize)
      tween?.scrollTrigger?.kill()
      tween?.kill()
    }
  },
})
