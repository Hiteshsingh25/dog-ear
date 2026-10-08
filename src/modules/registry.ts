'use client'

import { ScrollTrigger, reducedMotion, setupGSAP } from '@/lib/gsap'
import type { Module, Teardown } from './types'
import { backgroundAnimation } from './backgroundAnimation'
import { heroSequence } from './heroSequence'
import { boxSequence } from './boxSequence'
import { button, buttonAlt } from './button'
import { callOut } from './callOut'
import { handwrittenText } from './handwrittenText'
import { footerParallax } from './footerParallax'
import { popUp } from './popUp'
import { booksSlider } from './booksSlider'
import { exclusiveSlider } from './exclusiveSlider'
import { accordion } from './accordion'
import { badge } from './badge'
import { benefits } from './benefits'
import { momentumHover } from './momentumHover'
import { gift } from './gift'
import { taglineCurve } from './taglineCurve'
import { formValidate } from './formValidate'
import { genreInteraction } from './genreInteraction'
import { plopIn } from './plopIn'
import { emojiRain } from './emojiRain'
import { checkContrast } from './checkContrast'
import { menu } from './menu'

/** Order matters only in that sequences + buttons run first (they were "before enter" in the original). */
export const registry: Module[] = [
  backgroundAnimation,
  heroSequence,
  button,
  buttonAlt,
  callOut,
  handwrittenText,
  footerParallax,
  popUp,
  booksSlider,
  exclusiveSlider,
  accordion,
  badge,
  benefits,
  momentumHover,
  gift,
  taglineCurve,
  formValidate,
  genreInteraction,
  boxSequence,
  plopIn,
  emojiRain,
  checkContrast,
  menu,
]

/**
 * Discover every module inside `root` (root itself included), init each match,
 * and hand back one teardown. Idempotent: an element already mounted by this
 * pass is skipped via a WeakSet, so Strict Mode's double effect can't stack.
 */
export function mountAll(root: HTMLElement, extraRoots: HTMLElement[] = []): Teardown {
  setupGSAP()
  const ctx = { root, reducedMotion: reducedMotion() }
  const teardowns: Teardown[] = []
  const roots = [root, ...extraRoots]
  for (const m of registry) {
    const seen = new Set<HTMLElement>()
    for (const r of roots) {
      const els = [...r.querySelectorAll<HTMLElement>(m.selector)]
      if (r.matches(m.selector)) els.unshift(r)
      for (const el of els) {
        if (seen.has(el)) continue
        seen.add(el)
        try {
          const td = m.init(el, ctx)
          if (td) teardowns.push(td)
        } catch (err) {
          console.error(`[module:${m.name}]`, err)
        }
      }
    }
  }
  // let layout settle (fonts, images) before measuring pins
  const refresh = () => ScrollTrigger.refresh()
  const t = window.setTimeout(refresh, 50)
  document.fonts?.ready.then(refresh)
  return () => {
    window.clearTimeout(t)
    for (let i = teardowns.length - 1; i >= 0; i--) {
      try {
        teardowns[i]()
      } catch (err) {
        console.error('[module teardown]', err)
      }
    }
  }
}
