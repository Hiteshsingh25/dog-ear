'use client'

import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { reducedMotion } from '@/lib/gsap'
import { getLenis } from '@/lib/lenis'
import { runLeave } from '@/modules/intro'
import { Mark } from './svg/Mark'

type Ctx = { navigate: (href: string) => void }
const TransitionContext = createContext<Ctx>({ navigate: () => {} })
export const useTransition = () => useContext(TransitionContext)

/**
 * Barba's lifecycle, App-Router-native: links call `navigate`, which plays the
 * leave stroke and then pushes the route; the new `template.tsx` instance runs
 * the enter animation. The overlay itself lives here (in the persistent layout)
 * so it survives the route swap.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const busy = useRef(false)

  const navigate = useCallback(
    async (href: string) => {
      if (busy.current) return
      const [path] = href.split('#')
      if (path === pathname || (path === '' && href.startsWith('#'))) return
      busy.current = true
      getLenis()?.stop()
      await runLeave(reducedMotion())
      router.push(href)
    },
    [pathname, router],
  )

  useEffect(() => {
    busy.current = false
  }, [pathname])

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div data-transition-wrap className="transition" aria-hidden="true">
        <div className="transition__shape">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" fill="none" preserveAspectRatio="none" className="transition__svg">
            <path d="M-260 980 C 60 1320, 420 -320, 1340 120" stroke="currentColor" strokeWidth="70%" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div data-load-reset data-transition-logo className="transition__logo">
          <Mark className="transition__logo-svg" />
        </div>
      </div>
    </TransitionContext.Provider>
  )
}
