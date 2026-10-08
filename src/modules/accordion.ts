import { defineModule } from './types'

/**
 * Native <details>/<summary>. Height animates in CSS via grid-template-rows
 * 0fr → 1fr; JS only sequences the `open` attribute around the transition so
 * the close can animate. Works without JS, accessible for free.
 */
export const accordion = defineModule({
  name: 'accordion',
  selector: '[data-accordion]',
  init(el, ctx) {
    const details = el as HTMLDetailsElement
    const summary = details.querySelector<HTMLElement>('[data-accordion-summary]')
    const content = details.querySelector<HTMLElement>('[data-accordion-content]')
    if (!summary || !content) return
    const ACTIVE = 'is--active'
    const CLOSING = 'is--closing'
    if (details.open) details.classList.add(ACTIVE)

    let closingTimer: ReturnType<typeof setTimeout> | undefined
    const open = () => {
      clearTimeout(closingTimer)
      details.classList.remove(CLOSING)
      details.open = true
      requestAnimationFrame(() => details.classList.add(ACTIVE))
    }
    const close = () => {
      details.classList.remove(ACTIVE)
      if (ctx.reducedMotion) {
        details.open = false
        return
      }
      details.classList.add(CLOSING)
      const done = () => {
        details.open = false
        details.classList.remove(CLOSING)
      }
      // grid-template-rows transition is 450ms; fall back on a timer if transitionend never fires
      const onEnd = (e: TransitionEvent) => {
        if (e.target !== content || e.propertyName !== 'grid-template-rows') return
        content.removeEventListener('transitionend', onEnd)
        clearTimeout(closingTimer)
        done()
      }
      content.addEventListener('transitionend', onEnd)
      closingTimer = setTimeout(() => {
        content.removeEventListener('transitionend', onEnd)
        done()
      }, 520)
    }
    const onClick = (e: Event) => {
      e.preventDefault()
      if (details.open && !details.classList.contains(CLOSING)) close()
      else open()
    }
    summary.addEventListener('click', onClick)
    return () => {
      summary.removeEventListener('click', onClick)
      clearTimeout(closingTimer)
      details.classList.remove(CLOSING)
    }
  },
})
