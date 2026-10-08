import { defineModule } from './types'

/**
 * Instead of a colour variant per section, a component measures the background
 * it sits on (`data-check-contrast-bg`) and flips its text (`-text`) to black
 * or white by relative luminance. Re-runs on resize because backgrounds change
 * per breakpoint.
 */
export const checkContrast = defineModule({
  name: 'check-contrast',
  selector: '[data-check-contrast]',
  init(wrapper) {
    const bg = wrapper.querySelector<HTMLElement>('[data-check-contrast-bg]')
    const texts = wrapper.querySelectorAll<HTMLElement>('[data-check-contrast-text]')
    if (!bg || !texts.length) return
    const apply = () => {
      const rgb = getComputedStyle(bg).backgroundColor.match(/\d+(\.\d+)?/g)?.map(Number)
      if (!rgb || rgb.length < 3) return
      const [r, g, b, a = 1] = rgb
      if (a === 0) return
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
      const color = luminance > 0.5 ? '#000' : '#fff'
      texts.forEach((t) => (t.style.color = color))
    }
    apply()
    let timer: ReturnType<typeof setTimeout> | undefined
    const onResize = () => {
      clearTimeout(timer)
      timer = setTimeout(apply, 100)
    }
    window.addEventListener('resize', onResize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', onResize)
      texts.forEach((t) => (t.style.color = ''))
    }
  },
})
