import { books as copy } from '@/data/site'
import { cardTones, monthlyPicks } from '@/lib/books'
import { BookCard, SliderControls } from './BookCard'

/** §2 Books — this month's picks in a smooothy drag slider (scroll-snap row on touch). */
export function Books() {
  return (
    <section className="books is--bg-white" id="books">
      <div className="books__container">
        <div className="books__inner">
          <div className="books__header">
            <div className="books__header-container u-container">
              <div className="books__header-content">
                <h2 className="books__title u-heading-l">{copy.title}</h2>
                <p className="books__paragraph u-paragraph-large">{copy.paragraph}</p>
              </div>
            </div>
            <div className="books__text-wrap">
              <div className="books__text-outer">
                <p data-handwritten-text-inview className="book__text u-handwritten-regular">
                  {copy.handwritten}
                </p>
              </div>
            </div>
          </div>
          <div className="books__content">
            <div data-books-slider className="books-slider">
              <SliderControls className="home" />
              <div className="books-slider__collection">
                <div data-books-slider-wrapper role="list" className="books-slider__list">
                  {monthlyPicks.map((book, i) => (
                    <BookCard key={book.slug} book={book} tone={cardTones[i % cardTones.length]} href={`/books#${book.slug}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
