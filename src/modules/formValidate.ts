import { defineModule } from './types'

/**
 * Newsletter form: a styled div acts as the submit button, fields validate live
 * after the first attempt, a 5 s honeypot-by-time guards against bots, and the
 * submit posts to the form's action with fetch (falls back to a native POST).
 */
export const formValidate = defineModule({
  name: 'form-validate',
  selector: '[data-form-validate]',
  init(root) {
    const form = root.querySelector<HTMLFormElement>('form')
    const fields = [...root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-validate] input, [data-validate] textarea')]
    const submitDiv = root.querySelector<HTMLElement>('[data-submit]')
    const submitInput = submitDiv?.querySelector<HTMLInputElement>('input[type="submit"]')
    const success = root.querySelector<HTMLElement>('[data-form-success]')
    const fail = root.querySelector<HTMLElement>('[data-form-fail]')
    if (!form || !submitDiv || !submitInput) return
    const loadTime = Date.now()
    const waitLabel = submitInput.dataset.wait || 'Please wait...'
    const cleanups: Array<() => void> = []

    const validateField = (field: HTMLInputElement | HTMLTextAreaElement) => {
      const parent = field.closest('[data-validate]')!
      const min = field.getAttribute('min')
      const max = field.getAttribute('max')
      let valid = true
      parent.classList.toggle('is--filled', field.value.trim() !== '')
      if (min && field.value.length < Number(min)) valid = false
      if (max && field.value.length > Number(max)) valid = false
      if (field.getAttribute('type') === 'email' && !/\S+@\S+\.\S+/.test(field.value)) valid = false
      if (field.required && !field.value.trim()) valid = false
      parent.classList.toggle('is--error', !valid)
      parent.classList.toggle('is--success', valid)
      field.setAttribute('aria-invalid', String(!valid))
      return valid
    }
    const live = new Set<Element>()
    const startLive = (field: HTMLInputElement | HTMLTextAreaElement) => {
      if (live.has(field)) return
      live.add(field)
      const fn = () => validateField(field)
      field.addEventListener('input', fn)
      cleanups.push(() => field.removeEventListener('input', fn))
    }
    const validateAll = () => {
      let all = true
      let firstInvalid: HTMLElement | null = null
      for (const f of fields) {
        const ok = validateField(f)
        if (!ok) {
          all = false
          firstInvalid ??= f
        }
        startLive(f)
      }
      firstInvalid?.focus()
      return all
    }
    const isSpam = () => Date.now() - loadTime < 5000

    let busy = false
    const submit = async () => {
      if (busy) return
      if (!validateAll()) return
      if (isSpam()) {
        if (fail) {
          fail.hidden = false
          fail.textContent = 'That was quick — give it a second and try again.'
        }
        return
      }
      busy = true
      const label = submitDiv.querySelector<HTMLElement>('[data-button-alt-text]')
      const original = label?.textContent
      if (label) label.textContent = waitLabel
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        form.hidden = true
        if (success) success.hidden = false
        if (fail) fail.hidden = true
      } catch {
        if (fail) fail.hidden = false
      } finally {
        busy = false
        if (label && original) label.textContent = original
      }
    }

    const onClick = () => void submit()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault()
        void submit()
      }
    }
    const onSubmit = (e: Event) => {
      e.preventDefault()
      void submit()
    }
    submitDiv.addEventListener('click', onClick)
    form.addEventListener('keydown', onKey)
    form.addEventListener('submit', onSubmit)
    cleanups.push(() => {
      submitDiv.removeEventListener('click', onClick)
      form.removeEventListener('keydown', onKey)
      form.removeEventListener('submit', onSubmit)
    })
    return () => cleanups.forEach((fn) => fn())
  },
})
