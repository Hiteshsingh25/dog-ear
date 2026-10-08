import { getLenis } from '@/lib/lenis'
import { defineModule } from './types'

/** Full-screen menu: toggle/close buttons, Escape, Lenis paused while open, focus returned on close. */
export const menu = defineModule({
  name: 'menu',
  selector: '[data-menu]',
  init(menuEl, ctx) {
    const toggle = ctx.root.querySelector<HTMLElement>('[data-menu-toggle]') || document.querySelector<HTMLElement>('[data-menu-toggle]')
    const close = menuEl.querySelector<HTMLElement>('[data-menu-close]')
    if (!toggle || !close) return
    const ACTIVE = 'is--active'
    const OPEN = 'has--menu-open'
    const links = menuEl.querySelectorAll<HTMLAnchorElement>('a[href]')

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        hide()
      }
    }
    const show = () => {
      getLenis()?.stop()
      window.addEventListener('keydown', onKey)
      menuEl.classList.add(ACTIVE)
      menuEl.setAttribute('aria-hidden', 'false')
      toggle.setAttribute('aria-expanded', 'true')
      document.documentElement.classList.add(OPEN)
      close.focus({ preventScroll: true })
    }
    const hide = () => {
      window.removeEventListener('keydown', onKey)
      menuEl.classList.remove(ACTIVE)
      menuEl.setAttribute('aria-hidden', 'true')
      toggle.setAttribute('aria-expanded', 'false')
      document.documentElement.classList.remove(OPEN)
      getLenis()?.start()
      toggle.focus({ preventScroll: true })
    }
    const onToggle = () => (menuEl.classList.contains(ACTIVE) ? hide() : show())
    const onLink = () => hide()
    toggle.addEventListener('click', onToggle)
    close.addEventListener('click', onToggle)
    links.forEach((a) => a.addEventListener('click', onLink))
    menuEl.setAttribute('aria-hidden', 'true')
    toggle.setAttribute('aria-expanded', 'false')
    return () => {
      toggle.removeEventListener('click', onToggle)
      close.removeEventListener('click', onToggle)
      links.forEach((a) => a.removeEventListener('click', onLink))
      window.removeEventListener('keydown', onKey)
      menuEl.classList.remove(ACTIVE)
      document.documentElement.classList.remove(OPEN)
      getLenis()?.start()
    }
  },
})
