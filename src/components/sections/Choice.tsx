import Image from 'next/image'
import { choice } from '@/data/site'
import { COVER_H, COVER_W, coverSrc, winners, books } from '@/lib/books'
import { Avatar } from '../svg/Avatar'
import { CardEars } from '../svg/Ears'
import { HeartIllustration, Starburst } from '../svg/Icons'
import { PopUp } from '../PopUp'
import { SliderControls } from './BookCard'

const avatarColors = ['#3b308f', '#670a2e', '#0f766e']

/** §10 Choice — readers' favourites slider on the yellow ground, with the emoji rain on entry. */
export function Choice() {
  const teaser = books[5]
  return (
    <section data-emoji-rain data-emoji-rain-type-1="party" data-emoji-rain-type-2="trophy" className="choice is--outer-clip is--bg-yellow" id="favourites">
      <div className="choice__container">
        <div className="choice__inner">
          <div className="choice__header">
            <div className="choice__header-container u-container">
              <div className="choice__easter-egg">
                <PopUp variant="right-bottom" />
              </div>
              <div className="choice__header-content">
                <h2 className="choice__title u-heading-l">{choice.title}</h2>
                <p className="choice__paragraph u-paragraph-large">{choice.paragraph}</p>
              </div>
            </div>
            <div data-plop-in className="choice__visual">
              <HeartIllustration data-plop-in-item className="choice__visual-img" />
            </div>
          </div>
          <div className="choice__content">
            <div data-books-slider className="choice-slider">
              <div className="choice-slider__collection">
                <div data-books-slider-wrapper role="list" className="choice-slider__list">
                  <div role="listitem" className="choice-slider__list-item">
                    <article data-books-slider-item className="choice-slider__item">
                      <div className="choice-slider__item-inner">
                        <div className="choice-slider__item-bg">
                          <CardEars prefix="choice-slider__item-bg" />
                        </div>
                        <div className="choice-slider__item-container">
                          <div className="choice-slider__item-cover">
                            <Image src={coverSrc(teaser.slug)} alt="" width={COVER_W} height={COVER_H} className="choice-slider__item-img" sizes="22em" />
                          </div>
                          <div className="choice-slider__year">
                            <div className="choice-slider__year-text-wrap">
                              <span className="choice-slider__year-text u-heading-l">{choice.year.slice(0, 2)}</span>
                              <span className="choice-slider__year-text u-heading-l">{choice.year.slice(2)}</span>
                            </div>
                            <Starburst className="choice-slider__year-img" />
                          </div>
                          <div className="choice-slider__next-voting">
                            <span className="choice-slider__next-voting-text u-paragraph-regular">{choice.nextVote}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>
                  {winners.map((w, i) => (
                    <div role="listitem" key={w.slug} className="choice-slider__list-item">
                      <article data-books-slider-item className="choice-slider__item">
                        <div className="choice-slider__item-inner">
                          <div className="choice-slider__item-bg">
                            <CardEars prefix="choice-slider__item-bg" />
                          </div>
                          <div className="choice-slider__item-container">
                            <div className="choice-slider__item-cover">
                              <Image src={coverSrc(w.slug)} alt={`${w.book.title} (${w.year} readers' favourite)`} width={COVER_W} height={COVER_H} className="choice-slider__item-img" sizes="22em" />
                            </div>
                            <div className="choice-slider__author">
                              <Avatar name={w.book.author} color={avatarColors[i % avatarColors.length]} className="choice-slider__author-img" />
                            </div>
                            <div className="choice-slider__year">
                              <div className="choice-slider__year-text-wrap">
                                <span className="choice-slider__year-text u-heading-l">{String(w.year).slice(0, 2)}</span>
                                <span className="choice-slider__year-text u-heading-l">{String(w.year).slice(2)}</span>
                              </div>
                              <Starburst className="choice-slider__year-img" />
                            </div>
                          </div>
                          <a aria-label={`Read more about ${w.book.title}`} href={`/books#${w.slug}`} className="choice-slider__item-link" />
                        </div>
                      </article>
                    </div>
                  ))}
                </div>
              </div>
              <SliderControls className="is--choice-slider" />
            </div>
          </div>
        </div>
      </div>
      <div data-emoji-rain-container className="choice__emoji-rain-container" aria-hidden="true">
        <div className="choice__single-rain-emoji is--hidden">
          <div className="choice__single-rain-emoji-image-party" />
        </div>
      </div>
    </section>
  )
}
