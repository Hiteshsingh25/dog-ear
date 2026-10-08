import { faq } from '@/data/site'
import { Blobs } from '../Blobs'
import { PopUp } from '../PopUp'
import { PlusIcon, MinusIcon } from '../svg/Icons'
import { ButtonAlt } from '../ui/Buttons'

export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="accordion">
      <div role="list" className="accordion__list">
        {items.map((item) => (
          <div role="listitem" key={item.q} className="accordion__item">
            <details data-accordion className="accordion__details">
              <summary data-accordion-summary className="accordion__summary">
                <span className="accordion__title-wrap">
                  <h3 className="accordion__title u-paragraph-large">{item.q}</h3>
                  <span aria-hidden="true" className="accordion__icon-wrap">
                    <PlusIcon className="accordion__icon-plus" />
                    <MinusIcon className="accordion__icon-minus" />
                  </span>
                </span>
              </summary>
              <div data-accordion-content className="accordion__content">
                <div className="accordion__content-inner">
                  <div className="rich-text">
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  )
}

/** §7 FAQ — three native <details> accordions; height animates with grid rows, no JS measuring. */
export function Faq() {
  return (
    <section className="faq is--bg-white" id="faq">
      <div className="faq__container u-container">
        <div className="faq__inner">
          <header className="faq__header">
            <h2 className="faq__title u-heading-l">{faq.title}</h2>
          </header>
          <div className="faq__content">
            <Accordion items={faq.items} />
            <ButtonAlt href="/faq" label={faq.cta} />
          </div>
        </div>
        <div className="faq__logo-easter-egg">
          <PopUp variant="left" />
        </div>
      </div>
      <div className="faq__bg">
        <Blobs set="faq" className="faq__bg-svg" />
      </div>
    </section>
  )
}
