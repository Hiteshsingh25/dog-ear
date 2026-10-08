import { benefits } from '@/data/site'
import { Blobs } from '../Blobs'
import { Mark } from '../svg/Mark'

/** §6 Benefits — five chips thrown around the mark; cursor velocity flings them (`data-momentum-hover`). */
export function Benefits() {
  const positions = ['is--first', 'is--second', 'is--third', 'is--fourth', 'is--fifth']
  return (
    <section data-benefits className="benefits" id="why">
      <div className="benefits__container">
        <div className="benefits__inner">
          <div className="benefits__content">
            <h2 className="benefits__logo-text u-heading-xxl">{benefits.title}</h2>
            <Mark className="benefits__logo" />
          </div>
          <div data-momentum-hover className="benefits__label-wrap">
            {benefits.items.map((item, i) => (
              <div key={item.label} data-momentum-hover-element className={`benefits__label ${positions[i]}`}>
                <div data-benefits-item data-momentum-hover-target className={`benefits__label-inner ${item.variant}`}>
                  <div className="benefits__label-text u-heading-l">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="benefits__bg">
            <Blobs set="benefits" className="benefits__bg-svg" />
          </div>
        </div>
      </div>
    </section>
  )
}
