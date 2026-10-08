import { gsap } from '@/lib/gsap'
import { defineModule } from './types'

/**
 * Genre list: hovering a genre anchors a "holding" layer at that row and four
 * cover stacks bloom out of it (CSS does the reveal/scale from custom props);
 * moving down the list slides the stacks with the cursor, and pointer position
 * feeds a light parallax into each stack. Everything here only writes CSS
 * variables + data attributes — the motion itself lives in the stylesheet.
 */
export const genreInteraction = defineModule({
  name: 'genre-interaction',
  selector: '[data-genre-interaction]',
  init(element, ctx) {
    const list = element.querySelector<HTMLElement>('[data-genre-interaction-list]')
    const scope = element.querySelector<HTMLElement>('[data-genre-interaction-scope]')
    const items = [...element.querySelectorAll<HTMLElement>('[data-genre-interaction-item]')]
    const boxes = [...element.querySelectorAll<HTMLElement>('[data-genre-interaction-box]')]
    if (!list || !scope || !items.length || !boxes.length) return
    if (ctx.reducedMotion) return

    type Pos = { width: number; height: number; x: number; y: number }
    const cache: Pos[] = []
    const populate = () => {
      cache.length = 0
      const { left, top } = list.getBoundingClientRect()
      items.forEach((item, i) => {
        item.dataset.index = String(i)
        const { width, height, x, y } = item.getBoundingClientRect()
        cache.push({ width, height, x: x - left, y: y - top })
      })
    }
    populate()
    window.addEventListener('resize', populate)

    let listBounds: DOMRect | undefined
    const setParallax = (e: PointerEvent) => {
      if (!listBounds) return
      const px = (e.clientX - listBounds.x) / listBounds.width - 0.75
      const py = (e.clientY - listBounds.y) / listBounds.height - 0.75
      boxes.forEach((b) => {
        b.style.setProperty('--px', String(px))
        b.style.setProperty('--py', String(py))
      })
    }

    let startIndex = 0
    let startWidth = 0
    const setAnchor = (e: Event) => {
      const li = (e.target as HTMLElement).closest('li')
      if (!li || !list.contains(li)) return
      const index = Number.parseInt(li.dataset.index || '0', 10)
      const bounds = cache[index]
      if (!bounds) return
      if (element.dataset.startSet !== 'true') {
        startIndex = index
        startWidth = bounds.width
        element.dataset.startSet = 'true'
        element.style.setProperty('--start-index', String(index))
        element.style.setProperty('--start-width', String(bounds.width))
      }
      scope.style.setProperty('--active-index', String(index - startIndex))
      scope.style.setProperty('--active-offset', String(bounds.width - startWidth))
      element.style.setProperty('--translate-speed', '0.2s')
      boxes.forEach((b) => {
        b.style.setProperty('--x', String(gsap.utils.random(-15, 15)))
        b.style.setProperty('--y', String(gsap.utils.random(-15, 15)))
        b.style.setProperty('--r', String(gsap.utils.random(-15, 15)))
      })
      element.dataset.activeParallax = 'true'
      listBounds = list.getBoundingClientRect()
      list.addEventListener('pointermove', setParallax, true)
    }

    const reset = () => {
      element.dataset.startSet = 'false'
      element.style.removeProperty('--start-index')
      element.style.removeProperty('--start-width')
      scope.style.removeProperty('--active-index')
      scope.style.removeProperty('--active-offset')
      element.style.removeProperty('--translate-speed')
      element.dataset.activeParallax = 'false'
      boxes.forEach((b) => {
        b.style.removeProperty('--px')
        b.style.removeProperty('--py')
      })
      listBounds = undefined
      list.removeEventListener('pointermove', setParallax, true)
    }

    const removeAnchor = async (e: Event) => {
      if ((e.target as HTMLElement).tagName !== 'LI') return
      // wait for the stacks to finish shrinking before dropping the anchor
      const anims = boxes[0].getAnimations().filter((a) => (a as CSSTransition).transitionProperty === 'scale')
      await Promise.allSettled(anims.map((a) => a.finished))
      if (anims.length && anims[0].playState === 'finished' && getComputedStyle(boxes[0]).scale === '0') reset()
    }

    list.addEventListener('pointerenter', setAnchor, true)
    list.addEventListener('pointerleave', removeAnchor, true)
    return () => {
      window.removeEventListener('resize', populate)
      list.removeEventListener('pointerenter', setAnchor, true)
      list.removeEventListener('pointerleave', removeAnchor, true)
      reset()
    }
  },
})
