'use client'

import { useRef, type ReactNode } from 'react'
import { useGSAP, reducedMotion } from '@/lib/gsap'
import { getLenis, initLenis, initViewport } from '@/lib/lenis'
import { mountAll } from '@/modules/registry'
import { runEnter, runOnce } from '@/modules/intro'
import { Header } from '@/components/Header'
import { Menu } from '@/components/Menu'
import { Footer } from '@/components/Footer'

/* becomes true only after the first-load intro has actually run to its "page
   ready" point, so a Strict Mode double-invoke still counts as the first load */
let firstLoadDone = false

/**
 * Re-mounts per navigation (unlike layout.tsx). One `useGSAP` discovers every
 * `data-*` module inside the page container, plays the intro/enter animation,
 * and its gsap.context cleanup + the module teardowns undo everything on unmount
 * — which is what keeps Fast Refresh from stacking duplicate ScrollTriggers.
 */
export default function Template({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = ref.current
      if (!root) return
      initLenis()
      initViewport()
      const reduced = reducedMotion()
      document.documentElement.classList.remove('has--menu-open')
      window.scrollTo(0, 0)
      getLenis()?.scrollTo(0, { immediate: true, force: true })

      const teardown = mountAll(root)
      const { tl, cleanup } = firstLoadDone ? runEnter(root, reduced) : runOnce(root, reduced)
      const ready = tl.eventCallback('onComplete', () => {
        firstLoadDone = true
      })
      getLenis()?.start()

      // deep link (/#gift) after the intro has settled
      const hash = window.location.hash
      let hashTimer: number | undefined
      if (hash && hash.length > 1) {
        hashTimer = window.setTimeout(() => {
          const target = document.getElementById(hash.slice(1))
          if (target) getLenis()?.scrollTo(target, { duration: 1.2 })
        }, reduced ? 0 : 1800)
      }

      return () => {
        window.clearTimeout(hashTimer)
        ready.kill()
        cleanup()
        teardown()
      }
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className="page-wrapper" data-page-container>
      <Header />
      <Menu />
      {children}
      <Footer />
    </div>
  )
}
