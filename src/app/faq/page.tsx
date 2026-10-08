import type { Metadata } from 'next'
import { brand, faq } from '@/data/site'
import { Accordion } from '@/components/sections/Faq'
import { Blobs } from '@/components/Blobs'
import { ButtonAlt } from '@/components/ui/Buttons'

export const metadata: Metadata = { title: `FAQ — ${brand.name}` }

/** Secondary route: the full FAQ. */
export default function FaqPage() {
  return (
    <main className="main">
      <section className="hero-xs is--bg-pale-pink">
        <div className="hero-xs__container u-container">
          <div className="hero-xs__inner">
            <div className="hero-xs__content">
              <h1 data-intro-item className="hero-xs__title u-heading-xxl">
                Questions, answered
              </h1>
              <p data-intro-item className="hero-xs__paragraph u-paragraph-large">
                Everything people ask us before they join, and a few things they ask after.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="faq is--bg-white is--faq" style={{ clipPath: 'inset(0 round 0 0 10em 10em)' }}>
        <div className="faq__container u-container">
          <div className="faq__inner">
            <div className="faq__content">
              <Accordion items={[...faq.items, ...faq.more]} />
              <ButtonAlt href={brand.appUrl} label="Still curious? Join the club" />
            </div>
          </div>
        </div>
        <div className="faq__bg">
          <Blobs set="faq" className="faq__bg-svg" />
        </div>
      </section>
    </main>
  )
}
