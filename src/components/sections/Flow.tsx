import { brand, flow } from '@/data/site'
import { Blobs } from '../Blobs'
import { Mark } from '../svg/Mark'
import { StepIllustration } from '../svg/StepIllustration'
import { ButtonAlt } from '../ui/Buttons'

/** §3 Flow — four numbered step cards fanned in a row; the cursor picks one up (`data-call-out`). */
export function Flow() {
  return (
    <section className="flow is--inner-clip is--bg-soft-pink" id="how">
      <div className="flow__container u-container">
        <div className="flow__inner">
          <header className="flow__header">
            <h2 className="flow__title u-heading-l">{flow.title}</h2>
            <div className="flow__text-wrap">
              <div className="flow__text-outer">
                <p data-handwritten-text-inview className="flow__text u-handwritten-regular">
                  {flow.handwritten}
                </p>
              </div>
            </div>
            <div className="flow__cta">
              <Mark className="flow__cta-logo" />
              <ButtonAlt href={brand.appUrl} label={flow.cta} />
            </div>
          </header>
          <div className="flow__content">
            <div data-call-out className="flow__list">
              {flow.steps.map((step, i) => (
                <div key={step.title} data-call-out-item className="flow__list-item">
                  <div data-call-out-child data-variant={step.variant} className="flow__card">
                    <div className="flow__card-inner">
                      <div className="flow__card-header">
                        <span className="flow__card-header-title u-handwritten-big">Step #{i + 1}</span>
                      </div>
                      <div className="flow__card-img-wrap">
                        <StepIllustration step={(i + 1) as 1 | 2 | 3 | 4} className="flow__card-img" />
                      </div>
                      <div className="flow__card-content">
                        <h3 className="flow__card-content-title u-heading-s">{step.title}</h3>
                        <p className="flow__card-content-paragraph u-paragraph-regular">{step.text}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flow__content-text-wrap">
              <div className="flow__content-text-outer">
                <p data-handwritten-text-inview className="flow__text u-handwritten-regular">
                  {flow.handwritten}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flow__bg">
        <Blobs set="flow" className="flow__bg-svg" />
      </div>
    </section>
  )
}
