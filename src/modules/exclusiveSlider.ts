import { gsap } from '@/lib/gsap'
import { CenterSlider, drive } from './sliders'
import { defineModule } from './types'

/** Originals slider: centre-snapping; the author credit gets one author per line. */
export const exclusiveSlider = defineModule({
  name: 'exclusive-slider',
  selector: '[data-exclusive-slider]',
  init(el) {
    const authors = el.querySelectorAll<HTMLElement>('[data-exclusive-slider-authors]')
    const originals = new Map<HTMLElement, string>()
    authors.forEach((a) => {
      originals.set(a, a.innerHTML)
      a.innerHTML = a.innerHTML.replaceAll(',', ',<br>')
    })
    const mm = gsap.matchMedia()
    mm.add('(min-width: 992px)', () => {
      const items = el.querySelectorAll('[data-exclusive-slider-item]')
      const wrapper = el.querySelector<HTMLElement>('[data-exclusive-slider-wrapper]')
      if (items.length <= 1 || !wrapper) return
      const controls = el.querySelector<HTMLElement>('[data-books-slider-controls]')
      const slider = new CenterSlider(wrapper, controls, '[data-exclusive-slider-item]', {
        variableWidth: true,
        infinite: false,
        snap: true,
        dragSensitivity: 0.008,
        lerpFactor: 0.225,
        scrollSensitivity: 1,
        bounceLimit: 0.5,
      })
      slider.itemsEls.forEach((item) => item.style.setProperty('--exclusive-slider-item-rotate', item.style.getPropertyValue('--book-slider-item-rotate')))
      const stop = drive(slider)
      return () => {
        stop()
        slider.destroy()
      }
    })
    return () => {
      mm.revert()
      originals.forEach((html, a) => (a.innerHTML = html))
    }
  },
})
