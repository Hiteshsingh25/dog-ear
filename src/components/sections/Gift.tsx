import { gift } from '@/data/site'
import { PressLogo } from '../svg/Icons'
import { ButtonAlt } from '../ui/Buttons'

/**
 * §8 Gift — the curved tagline (text on a path that runs off both edges, scrubbed
 * with the scroll) above the gifting pitch and the "as read in" strip.
 */
export function Gift() {
  return (
    <section data-tagline-curve className="gift" id="gift">
      <header className="tagline-curve">
        <div className="tagline-curve__header">
          <h2 data-tagline-curve-reference className="tagline-curve__title u-heading-xxl u-screen-reader">
            {gift.tagline}
          </h2>
        </div>
        <div className="tagline-curve__wrap" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 288" fill="none" data-tagline-curve-svg className="tagline-curve__svg">
            <path d="M-165.5 288 C33.686 173 810 0 1304 0 C1797.99 0 2262.5 178.181 2741.5 272" id="tagline-path" stroke="none" fill="none" />
            <text fontSize="169">
              <textPath data-tagline-curve-text href="#tagline-path" startOffset="100%" textAnchor="start">
                {gift.tagline}
              </textPath>
            </text>
          </svg>
        </div>
      </header>
      <div className="gift__container u-container">
        <div data-gift className="gift__inner">
          <div className="gift__content">
            <div className="gift__content-top">
              <p className="gift__content-paragraph u-paragraph-medium">{gift.paragraph}</p>
              <ButtonAlt href="#gift" label={gift.cta} />
            </div>
            <div className="gift__content-bottom">
              <div className="gift__content-handwritten-wrap">
                <div className="gift__content-handwritten-outer">
                  <p data-handwritten-text-inview className="gift__content-handwritten u-handwritten-regular">
                    {gift.handwritten}
                  </p>
                </div>
              </div>
              <div className="gift__content-box-wrap">
                {gift.press.map((name) => (
                  <div key={name} className="gift__content-box">
                    <PressLogo name={name} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="gift__visual">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="gift__visual-img" src="/img/box-still.webp" width={630} height={789} alt="" data-gift-item loading="lazy" decoding="async" />
          </div>
        </div>
      </div>
    </section>
  )
}
