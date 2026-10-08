import { brand, box, footer } from '@/data/site'
import { Logo } from './svg/Logo'
import { AppButton, ButtonAlt, SocialButton } from './ui/Buttons'

/**
 * Four stacked layers with a parallax reveal: -top / -bottom slide down into
 * place, the box still swings up, and the dark overlay lifts (all scrubbed).
 */
export function Footer() {
  return (
    <footer data-footer-parallax className="footer">
      <div data-footer-parallax-top className="footer__top">
        <div className="footer__container u-container">
          <div className="footer__top-inner">
            <div className="footer__top-nav">
              <div className="footer__logo">
                <Logo className="footer__logo-img" paper="#3b308f" />
              </div>
              <div className="footer__cta">
                <AppButton store="ios" label={box.appStore} href="#" variant="outline" />
                <AppButton store="android" label={box.playStore} href="#" variant="outline" />
              </div>
              <div className="footer__socials">
                <SocialButton network="instagram" href={brand.socials.instagram} variant="big" />
                <SocialButton network="tiktok" href={brand.socials.tiktok} variant="big" />
              </div>
              <div className="footer__links">
                {footer.legal.map((l) => (
                  <a key={l.label} href={l.href} className="footer__link">
                    <span className="footer__bottom-text u-paragraph-extra-small">{l.label}</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="footer__top-form">
              <h3 className="footer__form-title u-heading-s">{footer.newsletterTitle}</h3>
              <div data-form-validate className="form">
                <form id="newsletter-form" name="newsletter" action="/api/subscribe" method="post" className="form__group" aria-label="Newsletter form">
                  <div data-validate className="form__field-group">
                    <label htmlFor="newsletter-email" className="form__label u-screen-reader">
                      Email address
                    </label>
                    <div className="form__field">
                      <input className="form__input" maxLength={256} name="email" placeholder={footer.newsletterPlaceholder} type="email" id="newsletter-email" required autoComplete="email" />
                    </div>
                  </div>
                  <div data-hover data-submit className="form__submit-group">
                    <ButtonAlt as="div" label={footer.newsletterCta} />
                    <input type="submit" data-wait="Please wait..." className="form__submit" value={footer.newsletterCta} tabIndex={-1} aria-hidden="true" />
                  </div>
                </form>
                <div data-form-success className="form__message" hidden tabIndex={-1} role="status">
                  <div className="u-heading-xs white-font">{footer.newsletterSuccess}</div>
                </div>
                <div data-form-fail className="form__message u-paragraph-small" hidden tabIndex={-1} role="alert">
                  {footer.newsletterError}
                </div>
              </div>
            </div>
            <div className="footer__mob-bottom">
              <div className="footer__mob-links">
                {footer.legal.map((l) => (
                  <a key={l.label} href={l.href} className="footer__link">
                    <span className="footer__bottom-text u-paragraph-extra-small">{l.label}</span>
                  </a>
                ))}
              </div>
              <div className="footer__mob-socials">
                <SocialButton network="instagram" href={brand.socials.instagram} />
                <SocialButton network="tiktok" href={brand.socials.tiktok} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div data-footer-parallax-bottom className="footer__bottom">
        <div className="footer__container u-container">
          <div className="footer__bottom-inner">
            <div className="footer__bottom-copyright">
              <span className="footer__bottom-text u-paragraph-extra-small">{footer.copyright}</span>
            </div>
            <div className="footer__bottom-credit">
              {footer.credits.map((c) => (
                <a key={c.label} href={c.href} className="footer__link">
                  <span className="footer__bottom-text u-paragraph-extra-small">{c.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="footer__visual">
        <div className="footer__visual-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="footer__visual-img" src="/img/box-still.webp" width={630} height={789} data-footer-parallax-visual alt="" loading="lazy" decoding="async" />
        </div>
      </div>
      <div data-footer-parallax-overlay className="footer__overlay" />
    </footer>
  )
}
