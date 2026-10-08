import Image from 'next/image'
import { COVER_H, COVER_W, coverSrc, type Book } from '@/lib/books'
import { CardEars } from '../svg/Ears'
import { ButtonAlt } from '../ui/Buttons'

/**
 * A monthly-pick card. The card ground (`data-tone`) varies per slot and the
 * title/blurb carry `data-check-contrast-text`, so the module picks black or
 * white by sampling the ground — one component for every colour.
 */
export function BookCard({ book, tone, href = '#' }: { book: Book; tone: string; href?: string }) {
  return (
    <div data-check-contrast role="listitem" className="books-slider__list-item">
      <article data-books-slider-item className="books-slider__item">
        <div className="books-slider__item-inner">
          <div data-check-contrast-bg data-tone={tone} className="books-slider__item-bg">
            <CardEars prefix="books-slider__item-bg" />
            <div className="books-slider__item-bg-bottom" />
            <div className="books-slider__item-cta">
              <ButtonAlt as="div" label="Read more" variant="small" />
            </div>
          </div>
          <div className="books-slider__item-container">
            <div className="books-slider__item-cover">
              <Image src={coverSrc(book.slug)} alt={`${book.title} by ${book.author}`} width={COVER_W} height={COVER_H} className="books-slider__item-img" sizes="(max-width: 991px) 40vw, 22vw" />
            </div>
            <div className="books-slider__item-content">
              <div className="books-slider__item-text">
                <h3 data-check-contrast-text className="books-slider__item-title u-heading-s">
                  {book.title}
                </h3>
                <div data-check-contrast-text className="books-slider__item-paragraph u-paragraph-small">
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
          <a aria-label={`Read more about ${book.title}`} href={href} className="books-slider__item-link" />
        </div>
      </article>
    </div>
  )
}

export function SliderControls({ className = '' }: { className?: string }) {
  return (
    <div data-books-slider-controls className={`books-slider__controls ${className}`}>
      <button type="button" aria-label="Previous slide" data-books-slider-control className="books-slider__controls-button is--previous is--disabled">
        <span className="books-slider__controls-button-bg" />
        <span className="books-slider__controls-button-icon-wrap">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 14 13" fill="none" aria-hidden="true" className="books-slider__controls-button-icon">
            <path d="M7.4.6 13 6.5l-5.6 5.9-1.5-1.4 3.2-3.5H1v-2h8.1L5.9 2 7.4.6Z" fill="currentColor" />
          </svg>
        </span>
      </button>
      <button type="button" aria-label="Next slide" data-books-slider-control className="books-slider__controls-button is--next">
        <span className="books-slider__controls-button-bg" />
        <span className="books-slider__controls-button-icon-wrap">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 14 13" fill="none" aria-hidden="true" className="books-slider__controls-button-icon">
            <path d="M7.4.6 13 6.5l-5.6 5.9-1.5-1.4 3.2-3.5H1v-2h8.1L5.9 2 7.4.6Z" fill="currentColor" />
          </svg>
        </span>
      </button>
    </div>
  )
}
