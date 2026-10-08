import { defineModule } from './types'

/** Logo easter-egg: hover opens the speech-bubble, click locks it open. */
export const popUp = defineModule({
  name: 'pop-up',
  selector: '[data-pop-up]',
  init(el) {
    const button = el.querySelector<HTMLElement>('[data-pop-up-button]')
    if (!button) return
    let lockedOpen = false
    const open = () => el.classList.add('is--open')
    const close = () => el.classList.remove('is--open')
    const onEnter = () => {
      if (!lockedOpen) open()
    }
    const onLeave = () => {
      if (!lockedOpen) close()
    }
    const onClick = (e: Event) => {
      e.preventDefault()
      lockedOpen = !lockedOpen
      el.classList.toggle('is--open', lockedOpen)
      button.setAttribute('aria-expanded', String(lockedOpen))
    }
    button.setAttribute('aria-expanded', 'false')
    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointerleave', onLeave)
    button.addEventListener('click', onClick)
    return () => {
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointerleave', onLeave)
      button.removeEventListener('click', onClick)
      close()
    }
  },
})
