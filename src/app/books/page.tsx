import type { Metadata } from 'next'
import Image from 'next/image'
import { books, COVER_H, COVER_W, coverSrc, genres } from '@/lib/books'
import { brand } from '@/data/site'
import { Blobs } from '@/components/Blobs'

export const metadata: Metadata = { title: `All books — ${brand.name}` }

/** Secondary route: the whole back catalogue. Exercises the page transition + module remount. */
export default function BooksPage() {
  return (
    <main className="main">
      <section className="hero-xs is--bg-pale-blue">
        <div className="hero-xs__container u-container">
          <div className="hero-xs__inner">
            <div className="hero-xs__content">
              <h1 data-intro-item className="hero-xs__title u-heading-xxl">
                All the books
              </h1>
              <p data-intro-item className="hero-xs__paragraph u-paragraph-large">
                Every pick we&rsquo;ve shipped so far, still available while stock lasts. Members can add any of them to a box.
              </p>
            </div>
          </div>
        </div>
        <div className="hero-xs__bg faq__bg" style={{ top: 'auto', bottom: 0 }}>
          <Blobs set="faq" className="hero-xs__bg-svg" />
        </div>
      </section>
      <section className="books-grid">
        <div className="u-container">
          <ul role="list" className="books-grid__list">
            {books.map((book) => (
              <li key={book.slug} id={book.slug} className="books-grid__item">
                <div className="books-grid__cover">
                  <Image src={coverSrc(book.slug)} alt={`${book.title} by ${book.author}`} width={COVER_W} height={COVER_H} sizes="(max-width: 991px) 30vw, 15vw" />
                </div>
                <h2 className="books-grid__title">{book.title}</h2>
                <p className="books-grid__author">
                  {book.author} · {genres[book.genre].replace('and more!', 'More')}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
