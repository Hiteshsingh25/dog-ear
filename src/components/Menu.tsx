import { brand, nav } from '@/data/site'
import { Logo } from './svg/Logo'
import { CloseIcon } from './svg/Icons'
import { Blobs } from './Blobs'
import { TransitionLink } from './TransitionLink'
import { Button, ButtonAlt, SocialButton } from './ui/Buttons'

/** Full-screen menu panel (below 991px). `data-lenis-prevent` keeps Lenis off its scroll area. */
export function Menu() {
  return (
    <div id="site-menu" data-menu data-lenis-prevent className="menu" aria-hidden="true">
      <div className="menu__inner">
        <div className="menu__container">
          <div className="menu__bg">
            <Blobs set="menu" className="menu__bg-svg" animate={false} />
          </div>
          <div className="menu__content">
            <header className="menu__header">
              <TransitionLink href="/" className="menu__header-title-link" aria-label={`${brand.name} — home`}>
                <Logo className="menu__header-title-logo" paper="#fd48f2" />
              </TransitionLink>
              <div className="menu__close">
                <button data-button-alt type="button" data-menu-close className="button-alt is--menu-toggle" aria-label="Close menu">
                  <span className="button-alt__icon-wrap">
                    <span className="button-alt__bg" />
                    <span className="button-alt__icon-outer">
                      <CloseIcon className="button-alt__icon is--menu-toggle" />
                    </span>
                  </span>
                </button>
              </div>
            </header>
            <nav className="menu__nav" aria-label="Menu">
              <ul role="list" className="menu__nav-list">
                {nav.map((item) => (
                  <li key={item.href} className="menu__nav-list-item">
                    <Button href={item.href} label={item.label} />
                  </li>
                ))}
              </ul>
            </nav>
            <footer className="menu__footer">
              <div className="menu__sub">
                <ul role="list" className="menu__sub-list">
                  <li className="menu__sub-list-item">
                    <SocialButton network="instagram" href={brand.socials.instagram} />
                  </li>
                  <li className="menu__sub-list-item">
                    <SocialButton network="tiktok" href={brand.socials.tiktok} />
                  </li>
                </ul>
              </div>
              <div className="menu__login">
                <ButtonAlt href={brand.appUrl} label="Log-in / Sign-up" />
              </div>
            </footer>
          </div>
        </div>
        <div className="menu__backdrop" />
      </div>
    </div>
  )
}
