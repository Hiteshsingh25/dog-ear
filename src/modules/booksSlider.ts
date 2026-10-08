import { gsap } from '@/lib/gsap'
import { ParallaxSlider, drive } from './sliders'
import { defineModule } from './types'

/** Monthly picks / winners: desktop drag slider; below 992px the list is a native scroll-snap row. */
export const booksSlider = defineModule({
  name: 'books-slider',
  selector: '[data-books-slider]',
  init(el) {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 992px)', () => {
      const wrapper = el.querySelector<HTMLElement>('[data-books-slider-wrapper]')
      if (!wrapper) return
      const controls = el.querySelector<HTMLElement>('[data-books-slider-controls]')
      const slider = new ParallaxSlider(wrapper, controls, '[data-books-slider-item]', {
        infinite: false,
        snap: false,
        dragSensitivity: 0.008,
        lerpFactor: 0.225,
        scrollSensitivity: 1,
        bounceLimit: 0.5,
        setOffset: ({ wrapperWidth }) => wrapperWidth - 32,
      })
      const stop = drive(slider)
      return () => {
        stop()
        slider.destroy()
      }
    })
    return () => mm.revert()
  },
})
