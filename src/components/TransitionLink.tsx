'use client'

import Link, { type LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react'
import { getLenis } from '@/lib/lenis'
import { useTransition } from './TransitionProvider'

type Props = LinkProps & AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode }

/**
 * next/link with the page transition in front of it. Same-page hash links scroll
 * with Lenis instead of navigating. Modifier-clicks and external hrefs fall
 * through to the browser.
 */
export function TransitionLink({ href, onClick, children, ...rest }: Props) {
  const pathname = usePathname()
  const { navigate } = useTransition()
  const url = typeof href === 'string' ? href : String((href as { pathname?: string | null }).pathname ?? '/')

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    if (rest.target === '_blank' || /^https?:/.test(url)) return
    const [path, hash] = url.split('#')
    if ((path === '' || path === pathname) && hash) {
      e.preventDefault()
      const target = document.getElementById(hash)
      if (target) getLenis()?.scrollTo(target, { offset: 0, duration: 1.1, lock: true })
      return
    }
    if (path === pathname) {
      e.preventDefault()
      getLenis()?.scrollTo(0, { duration: 1 })
      return
    }
    e.preventDefault()
    navigate(url)
  }

  return (
    <Link href={href} onClick={handle} {...rest}>
      {children}
    </Link>
  )
}
