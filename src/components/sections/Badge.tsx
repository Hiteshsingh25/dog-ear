import { badge } from '@/data/site'

/** Scalloped ribbon background — a repeating wave in the ribbon's pale tint. */
function RibbonBg() {
  let d = ''
  for (let x = 0; x <= 2011; x += 60) d += `${x === 0 ? 'M' : 'L'}${x} ${x % 120 === 0 ? 20 : 60} `
  d += 'L2011 145 L0 145 Z'
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 2011 145" width="100%" className="badge__item-bg-svg" aria-hidden="true" preserveAspectRatio="none">
      <path d={d} fill="currentColor" opacity="0.55" />
      <path d="M0 110 Q 100 80 200 110 T 400 110 T 600 110 T 800 110 T 1000 110 T 1200 110 T 1400 110 T 1600 110 T 1800 110 T 2000 110 V145 H0Z" fill="currentColor" />
    </svg>
  )
}

/** §9 Badge — two stacked promo ribbons that drop and settle (`data-badge`). */
export function Badge() {
  return (
    <section className="badge">
      <div className="badge__container">
        <div data-badge className="badge__inner">
          <div data-badge-item className="badge__item is--first">
            <div className="badge__item-title-outer">
              <span className="badge__item-title">{badge.text}</span>
            </div>
            <div className="badge__item-bg">
              <RibbonBg />
            </div>
          </div>
          <div data-badge-item className="badge__item is--second">
            <div className="badge__item-title-outer">
              <span className="badge__item-title">{badge.text}</span>
            </div>
            <div className="badge__item-bg is--blue">
              <RibbonBg />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
