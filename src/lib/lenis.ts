'use client'

import Lenis from 'lenis'
import { gsap, ScrollTrigger, setupGSAP } from './gsap'

let lenis: Lenis | null = null
let tickerFn: ((time: number) => void) | null = null

export function getLenis() {
  return lenis
}

/**
 * One Lenis for the life of the app. Wired to GSAP's ticker so ScrollTrigger and
 * Lenis share one clock — get this wrong and every pin drifts.
 */
export function initLenis() {
  if (lenis || typeof window === 'undefined') return lenis
  setupGSAP()
  lenis = new Lenis({ lerp: 0.2, anchors: true, autoRaf: false })
  lenis.on('scroll', ScrollTrigger.update)
  tickerFn = (time: number) => lenis?.raf(time * 1000)
  gsap.ticker.add(tickerFn)
  gsap.ticker.lagSmoothing(0)

  // header collapse flag (the title + socials slide away once scrolling started)
  const threshold = 50
  lenis.on('scroll', ({ scroll }: { scroll: number }) => {
    const started = scroll > threshold
    const current = document.body.getAttribute('data-scrolling-started')
    if (current !== String(started)) document.body.setAttribute('data-scrolling-started', String(started))
  })
  return lenis
}

export function destroyLenis() {
  if (tickerFn) gsap.ticker.remove(tickerFn)
  lenis?.destroy()
  lenis = null
  tickerFn = null
}

/* `--vw` is set from JS: mobile browsers move the URL bar and 100vw lies. */
let resizeBound = false
let resizeTimer: ReturnType<typeof setTimeout> | undefined
export function setViewportSizes() {
  const vw = document.body.clientWidth * 0.01
  document.documentElement.style.setProperty('--vw', `${vw}px`)
}
export function initViewport() {
  if (resizeBound || typeof window === 'undefined') return
  resizeBound = true
  setViewportSizes()
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(setViewportSizes, 60)
  })
}
