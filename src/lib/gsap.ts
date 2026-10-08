'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { useGSAP } from '@gsap/react'

let registered = false

/** Register plugins + the two custom eases exactly once (safe under HMR / Strict Mode). */
export function setupGSAP() {
  if (registered || typeof window === 'undefined') return
  registered = true
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, InertiaPlugin, DrawSVGPlugin, useGSAP)
  CustomEase.create('osmo', '0.625, 0.05, 0, 1')
  CustomEase.create('path-ease', '0.78, 0.18, 0.18, 1')
  CustomEase.create('energy', 'M0,0 C0.32,0.72 0,1 1,1')
  gsap.defaults({ ease: 'osmo', duration: 0.6 })
  ScrollTrigger.clearScrollMemory('manual')
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
}

export const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isDesktop = () => typeof window !== 'undefined' && window.matchMedia('(min-width: 992px)').matches

export { gsap, ScrollTrigger, SplitText, CustomEase, InertiaPlugin, DrawSVGPlugin, useGSAP }
