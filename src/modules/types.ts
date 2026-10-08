export type Teardown = () => void

export type MountContext = {
  /** the page container the module was discovered in */
  root: HTMLElement
  reducedMotion: boolean
}

/**
 * A module is a self-contained behaviour bound to a `data-*` attribute.
 * It is discovered at mount, initialised per element, and must return a
 * teardown that removes everything it created (ScrollTriggers, tweens,
 * listeners, DOM it appended). Nothing is bound by class name; nothing
 * knows about anything else.
 */
export type Module = {
  name: string
  selector: string
  init(el: HTMLElement, ctx: MountContext): Teardown | void
}

export function defineModule(m: Module): Module {
  return m
}
