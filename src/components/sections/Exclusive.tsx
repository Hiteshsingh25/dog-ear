import Image from 'next/image'
import { brand, exclusive } from '@/data/site'
import { COVER_H, COVER_W, coverSrc, original } from '@/lib/books'
import { StarBadge } from '../svg/Icons'
import { ButtonAlt } from '../ui/Buttons'
import { SliderControls } from './BookCard'

/** §11 Exclusive — the club-only anthology in a framed slide with notes pinned around it. */
export function Exclusive() {
  const book = original.book
  return (
    <section className="exclusive is--bg-white" id="originals">
      <div className="exclusive__container">
        <div className="exclusive__inner">
          <div className="exclusive__header">
            <div className="exclusive__header-container u-container">
              <div className="exclusive__header-content">
                <h2 className="exclusive__title u-heading-l">{exclusive.title}</h2>
                <p className="exclusive__paragraph u-paragraph-large">{exclusive.paragraph}</p>
              </div>
            </div>
          </div>
          <div className="exclusive__content">
            <div data-exclusive-slider className="exclusive-slider">
              <div className="exclusive-slider__collection">
                <div data-exclusive-slider-wrapper role="list" className="exclusive-slider__list">
                  <div role="listitem" className="exclusive-slider__list-item">
                    <div data-exclusive-slider-item className="exclusive-slider__item-outer">
                      <article className="exclusive-slider__item">
                        <div className="exclusive-slider__item-inner">
                          <div className="books-slider__review">
                            <div className="books-slider__review-content">
                              <span className="books-slider__review-title">{exclusive.ratingLabel}</span>
                              <span className="books-slider__review-number">{original.rating}</span>
                            </div>
                            <StarBadge className="books-slider__review-img" />
                          </div>
                          <div className="books-slider__item-bg" data-tone="violet">
                            <div className="books-slider__item-bg-bottom is--exclusive-slider" />
                            <div className="books-slider__item-cta is--exclusive-slider">
                              <ButtonAlt href={brand.appUrl} label={exclusive.cta} variant="small" />
                            </div>
                          </div>
                          <div className="books-slider__item-container">
                            <div className="books-slider__item-cover">
                              <Image src={coverSrc(book.slug)} alt={book.title} width={COVER_W} height={COVER_H} className="books-slider__item-img" sizes="22em" />
                            </div>
                            <div className="books-slider__item-content">
                              <div className="books-slider__item-text">
                                <h3 className="books-slider__item-title u-heading-s white-font">{book.title}</h3>
                                <div className="books-slider__item-paragraph u-paragraph-small white-font">
                                  <p>{book.blurb}</p>
                                </div>
                              </div>
                              <ul role="list" className="books-slider__genre-list">
                                {book.tags.map((t) => (
                                  <li key={t} className="books-slider__genre-list-item">
                                    <span className="tag-small">
                                      <span className="tag-small__text">{t}</span>
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </article>
                      <div className="exclusive-slider__add-on">
                        <div className="exclusive-slider__authors">
                          <h3 className="exclusive-slider__authors-title">Authors</h3>
                          <p data-exclusive-slider-authors className="exclusive-slider__authors-paragraph">
                            {original.authors}
                          </p>
                        </div>
                        <div className="exclusive-slider__quote-01">
                          <p className="exclusive-slider__handwritten-text u-handwritten-regular">{original.quote1}</p>
                        </div>
                        <div className="exclusive-slider__quote-02">
                          <p className="exclusive-slider__handwritten-text u-handwritten-regular is--quote-02">{original.quote2}</p>
                        </div>
                        <div className="exclusive-slider__emojis" aria-hidden="true">
                          <span className="exclusive-slider__emoji exclusive-slider__emoji-01">
                            <span>👻</span>
                          </span>
                          <span className="exclusive-slider__emoji exclusive-slider__emoji-02">
                            <span>🕯️</span>
                          </span>
                          <span className="exclusive-slider__emoji exclusive-slider__emoji-03">
                            <span>📚</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <SliderControls className="is--exclusive-slider" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
