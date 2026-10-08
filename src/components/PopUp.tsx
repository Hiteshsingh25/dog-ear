import { brand, popUp } from '@/data/site'
import { Mark } from './svg/Mark'
import { LeftEar, RightEar } from './svg/Ears'
import { ButtonAlt } from './ui/Buttons'

/** Logo easter egg: the mark as a button; hover/click opens a speech bubble with a sign-up CTA. */
export function PopUp({ variant = 'left' }: { variant?: 'left' | 'right' | 'right-bottom' }) {
  return (
    <div data-pop-up data-variant={variant} className="pop-up">
      <button type="button" data-pop-up-button aria-label="Show sign up" className="pop-up__button">
        <span className="pop-up__button-inner">
          <Mark className="pop-up__button-svg" />
        </span>
      </button>
      <div className="pop-up__overlay">
        <div className="pop-up__overlay-inner">
          <div className="pop-up__overlay-bg-wrap">
            <div className="pop-up__overlay-ears">
              <LeftEar className="pop-up__overlay-left-ear" />
              <RightEar className="pop-up__overlay-right-ear" />
            </div>
            <div className="pop-up__overlay-bg" />
          </div>
          <div className="pop-up__overlay-content">
            <h3 className="pop-up__overlay-title u-heading-xs">{popUp.title}</h3>
            <div className="pop-up__overlay-content-action">
              <ButtonAlt href={brand.appUrl} label={popUp.cta} variant="small" />
            </div>
          </div>
        </div>
        <div className="pop-up__overlay-target-zone" />
      </div>
    </div>
  )
}
