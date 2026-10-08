'use client'

import { usePathname } from 'next/navigation'
import { brand, nav } from '@/data/site'
import { Logo } from './svg/Logo'
import { BurgerIcon } from './svg/Icons'
import { TransitionLink } from './TransitionLink'
import { Button, ButtonAlt, SocialButton } from './ui/Buttons'

/**
 * Fixed bar with pointer-events: none — only its children accept the pointer,
 * so it never blocks the hero. Title + socials slide away once scrolling starts.
 */
export function Header() {
  const pathname = usePathname()
  return (
    <header data-load-reset data-header className="header">
      <div className="header__inner">
        <div className="header__title">
          <TransitionLink href="/" aria-current={pathname === '/' ? 'page' : undefined} className="header__title-link" aria-label={`${brand.name} — home`}>
            <Logo className="header__title-logo" paper="#ffd24a" />
          </TransitionLink>
        </div>
        <nav className="header__nav" aria-label="Primary">
          <ul role="list" className="header__nav-list">
            {nav.map((item) => (
              <li key={item.href} className="header__nav-list-item">
                <Button href={item.href} label={item.label} current={pathname === item.href.split('#')[0] && !item.href.includes('#')} />
              </li>
            ))}
            <li className="header__nav-list-item">
              <ButtonAlt href={brand.appUrl} label="Log-in / Sign-up" />
            </li>
          </ul>
        </nav>
        <div className="header__sub">
          <ul role="list" className="header__sub-list">
            <li className="header__sub-list-item">
              <div className="lang-switch">
                <div role="list" className="locales-list">
                  <div data-button role="listitem">
                    <a data-button-text hrefLang="en" href="/" aria-current="page" className="link" aria-label="English">
                      en
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li className="header__sub-list-item">
              <SocialButton network="instagram" href={brand.socials.instagram} />
            </li>
            <li className="header__sub-list-item">
              <SocialButton network="tiktok" href={brand.socials.tiktok} />
            </li>
          </ul>
        </div>
        <div className="header__menu-toggle">
          <button data-button-alt type="button" data-menu-toggle className="button-alt is--menu-toggle" aria-controls="site-menu" aria-expanded="false">
            <span className="button-alt__text-wrap">
              <span className="button-alt__bg" />
              <span className="button-alt__text-outer">
                <span data-button-alt-text className="button-alt__text">
                  Menu
                </span>
              </span>
            </span>
            <span className="button-alt__icon-wrap">
              <span className="button-alt__bg" />
              <span className="button-alt__icon-outer">
                <BurgerIcon className="button-alt__icon is--menu-toggle" />
              </span>
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
