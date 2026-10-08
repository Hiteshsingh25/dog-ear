import { box } from '@/data/site'
import { PopUp } from '../PopUp'
import { AppButton } from '../ui/Buttons'

/**
 * §4 Box — the scroll-scrubbed 120-frame sequence. The wrap is 300svh tall; the
 * sticky stage pins for the duration and frame index follows progress between
 * `data-scroll-start` and `data-scroll-end`. Copy blocks cross-fade at fixed
 * progress points as the lid opens.
 */
export function BoxSection() {
  return (
    <section className="box" id="box">
      <div className="box__wrap" data-box-sequence data-scroll-start="top 85%" data-scroll-end="bottom 80%">
        <div className="box__sticky">
          <div className="box__element" data-box-sequence-element>
            <canvas
              className="box__canvas"
              data-box-sequence-canvas
              data-desktop-src="/seq/box/frame-"
              data-mobile-src="/seq/box-mobile/frame-"
              data-static-src="/seq/box/frame-119.webp"
              data-filetype="webp"
              data-frames="120"
              data-digits="3"
              data-index-start="0"
              width={1440}
              height={904}
              aria-hidden="true"
            />
            <div className="box__logo-easter-egg">
              <div className="box__logo-easter-egg-inner">
                <PopUp variant="left" />
              </div>
            </div>
            <div className="box__text-wrap">
              <div className="box__text-outer">
                <p data-box-sequence-handwritten-text className="box__text u-handwritten-regular">
                  {box.handwritten}
                </p>
              </div>
            </div>
            <div data-box-sequence-content className="box__content">
              <div className="box__header">
                <h2 data-box-sequence-title className="box__title u-heading-l">
                  {box.title}
                </h2>
              </div>
              <div className="box__content-text-wrap">
                <div className="box__content-text-outer">
                  <p data-box-sequence-text-final className="box__content-text u-handwritten-regular">
                    {box.finalText}
                  </p>
                </div>
              </div>
              <div className="box__action">
                <div data-box-sequence-button className="box__button-wrap">
                  <AppButton store="ios" label={box.appStore} href="#" />
                </div>
                <div data-box-sequence-button className="box__button-wrap">
                  <AppButton store="android" label={box.playStore} href="#" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
