import { brand, hero } from '@/data/site'
import { Blobs } from '../Blobs'
import { PopUp } from '../PopUp'
import { ButtonAlt } from '../ui/Buttons'

/**
 * §1 Hero — 87.5em tall (scales with the root, not the device). Headline copy
 * on the left, the 120-frame autoplay sequence floating over the yellow ground,
 * the logo easter egg bottom-right. Mobile swaps the canvas for a still.
 */
export function Hero() {
  return (
    <section data-intro-home className="hero is--bg-yellow" id="top">
      <div data-load-reset className="hero__container u-container">
        <div className="hero__inner">
          <div data-hero-content className="hero__content">
            <div className="hero__header">
              <h1 data-hero-title className="hero__title u-heading-xxl">
                {hero.title}
              </h1>
              <p data-hero-paragraph className="hero__paragraph u-paragraph-regular">
                {hero.paragraph}
              </p>
            </div>
            <ButtonAlt href={brand.appUrl} label={hero.cta} />
            <div className="hero__text-wrap">
              <div className="hero__text-outer">
                <p data-hero-handwritten-text className="hero__text u-handwritten-regular">
                  {hero.handwritten}
                </p>
              </div>
            </div>
          </div>
          <div className="hero__visual">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="hero__visual-img" src="/img/box-still.webp" width={630} height={789} alt="A Dog-Ear box, closed and printed edge to edge" data-hero-visual loading="eager" fetchPriority="high" decoding="async" />
          </div>
        </div>
      </div>
      <div data-hero-easter-egg className="hero__logo-easter-egg">
        <PopUp variant="left" />
      </div>
      <div data-hero-bg-intro data-hero-bg data-load-reset className="hero__bg">
        <Blobs set="hero" className="hero__bg-svg" small />
      </div>
      <div data-hero-sequence className="hero__sequence" data-scroll-start="top bottom" data-scroll-end="bottom top">
        <div data-hero-sequence-element className="hero__sequence-element">
          <canvas
            data-hero-sequence-canvas
            data-desktop-src="/seq/hero/frame_"
            data-static-src="/seq/hero/frame_000.webp"
            data-filetype="webp"
            data-frames="120"
            data-digits="3"
            data-index-start="0"
            data-fps="24"
            className="hero__sequence-canvas"
            width={1440}
            height={1050}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  )
}
