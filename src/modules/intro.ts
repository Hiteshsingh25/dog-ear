import { gsap, SplitText, isDesktop } from '@/lib/gsap'

/**
 * Page transitions. The overlay is a giant brush stroke (an SVG path drawn with
 * DrawSVG at a 70% stroke width) with the mark popping in its centre.
 *
 *   once(root)   first load: stroke wipes out, header drops, hero intro
 *   leave()      stroke wipes in, mark pops       (before router.push)
 *   enter(root)  stroke wipes out, mark shrinks, hero intro
 */

const overlay = () => document.querySelector<HTMLElement>('[data-transition-wrap]')

function heroIntro(root: HTMLElement, tl: gsap.core.Timeline, at: string) {
  const hero = root.querySelector<HTMLElement>('[data-intro-home]')
  if (!hero) return () => {}
  const bg = hero.querySelector('[data-hero-bg]')
  const visual = hero.querySelector('[data-hero-visual]')
  const title = hero.querySelector<HTMLElement>('[data-hero-title]')
  const paragraph = hero.querySelector('[data-hero-paragraph]')
  const button = hero.querySelector('[data-button-alt]')
  const text = hero.querySelector<HTMLElement>('[data-hero-handwritten-text]')
  const egg = hero.querySelector('[data-hero-easter-egg]')
  const sequence = hero.querySelector('[data-hero-sequence]')
  const desktop = isDesktop()

  const titleSplit = title ? new SplitText(title, { type: 'words', tag: 'span', wordsClass: 'split-word' }) : null
  const textSplit = text ? new SplitText(text, { type: 'words, chars', tag: 'span', charsClass: 'split-char', wordsClass: 'split-word' }) : null

  if (desktop && bg) tl.set(bg, { clipPath: 'ellipse(20% 0% at 100% 100%)' }, 0)
  if (titleSplit)
    tl.set(titleSplit.words, { willChange: 'transform', display: 'inline-block', transformOrigin: 'top left', yPercent: -10, xPercent: 40, scaleY: 0.1, scaleX: 0.85, rotate: 8, opacity: 0 }, 0)
  if (paragraph) tl.set(paragraph, { opacity: 0, y: '-0.75em' }, 0)
  if (button) tl.set(button, { opacity: 0, y: '-0.75em' }, 0)
  if (visual) tl.set(visual, { opacity: 0, y: '5em', rotate: -43 }, 0)
  if (egg) tl.set(egg, { opacity: 0 }, 0)
  if (textSplit) {
    tl.set(textSplit.words, { display: 'inline-block' }, 0)
    tl.set(textSplit.chars, { display: 'inline-block', opacity: 0, rotate: 22, x: '-0.25em', y: '0.5em' }, 0)
  }
  if (sequence) tl.set(sequence, { opacity: 0, scale: 1.15, rotate: 6 }, 0)

  if (desktop && bg) tl.to(bg, { clipPath: 'ellipse(150% 130% at 100% 100%)', duration: 1.1, delay: 0.2, ease: 'circ.out' }, at)
  if (titleSplit)
    tl.to(
      titleSplit.words,
      {
        keyframes: {
          '0%': { yPercent: -10, xPercent: 40, scaleY: 0.1, scaleX: 0.85, rotate: 8, opacity: 0 },
          '10%': { opacity: 1 },
          '100%': { yPercent: 0, xPercent: 0, scaleY: 1, scaleX: 1, rotate: 0, ease: 'elastic.out(1,0.72)' },
        },
        duration: 0.875,
        stagger: 0.088,
        delay: 0.25,
      },
      at,
    )
  if (paragraph) tl.to(paragraph, { opacity: 1, y: '0em', duration: 0.35, delay: 0.45, ease: 'energy' }, at)
  if (button) tl.to(button, { opacity: 1, y: '0em', duration: 0.35, delay: 0.525, ease: 'energy' }, at)
  if (textSplit) tl.to(textSplit.chars, { opacity: 1, rotate: 0, x: '0em', y: '0em', ease: 'elastic.out(1, 0.75)', duration: 0.75, delay: 0.45, stagger: 0.016 }, at)
  if (egg) tl.to(egg, { opacity: 1, duration: 0.35, delay: 0.45, ease: 'energy' }, at)
  if (sequence) tl.to(sequence, { opacity: 1, scale: 1, rotate: 0, duration: 0.85, delay: 0.5, ease: 'expo.out' }, at)
  if (visual) tl.to(visual, { opacity: 1, y: '0em', rotate: -21, duration: 0.75, delay: 0.5, ease: 'elastic.out(1, 0.72)' }, at)

  return () => {
    titleSplit?.revert()
    textSplit?.revert()
  }
}

/** Secondary pages: a soft rise of the hero-xs content. */
function pageIntro(root: HTMLElement, tl: gsap.core.Timeline, at: string) {
  const items = root.querySelectorAll('[data-intro-item]')
  if (!items.length) return
  tl.set(items, { opacity: 0, y: '2em' }, 0)
  tl.to(items, { opacity: 1, y: '0em', duration: 0.6, stagger: 0.08, delay: 0.3, ease: 'energy' }, at)
}

/** Reduced motion / no overlay: park the stroke and the mark out of sight immediately. */
function hideOverlay(wrap: HTMLElement) {
  gsap.set(wrap.querySelectorAll('svg path'), { drawSVG: '100% 100%' })
  gsap.set(wrap.querySelectorAll('[data-transition-logo]'), { autoAlpha: 0, scale: 0 })
}

export function revealResets(root: HTMLElement) {
  const targets = [...document.querySelectorAll('[data-load-reset]'), ...root.querySelectorAll('[data-load-reset]')]
  gsap.set(targets, { opacity: 1 })
}

export function runOnce(root: HTMLElement, reduced: boolean) {
  const wrap = overlay()
  const header = root.querySelector('[data-header]')
  const tl = gsap.timeline()
  revealResets(root)
  if (reduced || !wrap) {
    if (wrap) hideOverlay(wrap)
    return { tl, cleanup: () => {} }
  }
  const paths = wrap.querySelectorAll('svg path')
  const logo = wrap.querySelectorAll('[data-transition-logo]')

  if (header) tl.set(header, { yPercent: -100 }, 0)
  tl.set(paths, { drawSVG: '0% 100%', attr: { 'stroke-width': '70%' } }, 0)
  tl.set(logo, { scale: 0, rotate: -64, autoAlpha: 0 }, 0)

  const cleanup = heroIntro(root, tl, 'start+=1.1')
  pageIntro(root, tl, 'start+=1.1')

  tl.to(paths, { keyframes: { '95%': { attr: { 'stroke-width': '8%' }, ease: 'circ.out' }, '100%': { drawSVG: '100% 100%' } }, duration: 1.25, delay: 0.65 }, 'start')
  tl.to(logo, { scale: 1, rotate: 0, autoAlpha: 1, delay: 0.05, duration: 0.65, ease: 'elastic.out(1,0.72)' }, 'start')
  tl.to(logo, { scale: 0, rotate: 64, autoAlpha: 0, delay: 0.5, duration: 0.6, ease: 'elastic.in(1,0.72)' }, 'start')
  if (header) tl.to(header, { yPercent: 0, duration: 0.5, delay: 0.5, ease: 'energy' }, 'start+=1.1')
  return { tl, cleanup }
}

export function runLeave(reduced: boolean): Promise<void> {
  const wrap = overlay()
  if (reduced || !wrap) return Promise.resolve()
  const paths = wrap.querySelectorAll('svg path')
  const logo = wrap.querySelectorAll('[data-transition-logo]')
  return new Promise((resolve) => {
    const tl = gsap.timeline({ onComplete: resolve })
    tl.set(logo, { scale: 0, rotate: -64, autoAlpha: 0 })
    tl.set(paths, { attr: { 'stroke-width': '8%' }, drawSVG: '0% 0%' })
    tl.to(paths, { keyframes: { '15%': { attr: { 'stroke-width': '8%' } }, '90%': { drawSVG: '0% 100%' }, '100%': { attr: { 'stroke-width': '70%' } } }, duration: 1.25 }, 'leave')
    tl.to(logo, { scale: 1, rotate: 0, autoAlpha: 1, delay: 0.5, duration: 0.65, ease: 'elastic.out(1,0.72)' }, 'leave')
  })
}

export function runEnter(root: HTMLElement, reduced: boolean) {
  const wrap = overlay()
  const header = root.querySelector('[data-header]')
  const tl = gsap.timeline()
  revealResets(root)
  if (reduced || !wrap) {
    if (wrap) hideOverlay(wrap)
    return { tl, cleanup: () => {} }
  }
  const paths = wrap.querySelectorAll('svg path')
  const logo = wrap.querySelectorAll('[data-transition-logo]')
  if (header) tl.set(header, { yPercent: -100 }, 0)
  tl.set(paths, { drawSVG: '0% 100%' }, 0)
  const cleanup = heroIntro(root, tl, 'enter+=0.4')
  pageIntro(root, tl, 'enter+=0.4')
  tl.to(paths, { keyframes: { '95%': { attr: { 'stroke-width': '8%' }, ease: 'circ.out' }, '100%': { drawSVG: '100% 100%' } }, duration: 1.25 }, 'enter')
  tl.to(logo, { scale: 0, rotate: 64, autoAlpha: 0, duration: 0.45, ease: 'elastic.in(1,0.72)' }, 'enter')
  if (header) tl.to(header, { yPercent: 0, duration: 0.5, delay: 0.5, ease: 'energy' }, 'enter+=0.4')
  return { tl, cleanup }
}
