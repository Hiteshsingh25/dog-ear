import Image from 'next/image'
import { genre } from '@/data/site'
import { COVER_H, COVER_W, coverSrc, genreShelves, genres } from '@/lib/books'
import { PopUp } from '../PopUp'

/**
 * §5 Genre — eleven genre labels; hovering one blooms four cover stacks out of
 * that row (the n-th cover in each stack belongs to the n-th genre). Neighbours
 * shove apart, the script face takes over the label, and the stacks follow the
 * cursor with a light parallax. Motion lives in CSS; JS only writes variables.
 */
export function Genre() {
  return (
    <section data-genre-interaction className="genre is--bright-pink" data-start-set="false" data-active-parallax="false" id="genres">
      <div className="genre__container u-container">
        <div className="genre__inner">
          <header className="genre__header">
            <h2 className="genre__title">{genre.title}</h2>
            <div className="genre__text-wrap">
              <div className="genre__text-outer">
                <p data-handwritten-text-inview className="genre__text u-handwritten-regular">
                  {genre.handwritten}
                </p>
              </div>
            </div>
          </header>
          <div className="genre__list-wrap">
            <ul data-genre-interaction-list role="list" className="genre__list">
              {genres.map((g, i) => (
                <li key={g} data-genre-interaction-item className="genre__list-item" data-index={i}>
                  <div className={`genre__link${g.length > 16 ? ' has--word-break' : ''}`}>
                    <span className="genre__link-default">{g}</span>
                    <span className="genre__link-hover" aria-hidden="true">
                      {g}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <div data-genre-interaction-holding className="genre__holding" aria-hidden="true">
              <div data-genre-interaction-scope className="genre__scope">
                {genreShelves.map((shelf, k) => (
                  <div key={k} data-genre-interaction-holder className="genre__holder">
                    <div data-genre-interaction-box className="genre__box">
                      {shelf.map((book) => (
                        <Image key={book.slug} src={coverSrc(book.slug)} width={COVER_W} height={COVER_H} alt="" className="genre__img" sizes="17em" loading="lazy" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="genre__easter-egg">
          <PopUp variant="right" />
        </div>
      </div>
    </section>
  )
}
