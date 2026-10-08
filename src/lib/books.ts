import data from '@/data/books.json'

export type Book = {
  slug: string
  title: string
  author: string
  genre: number
  tags: string[]
  blurb?: string
  cover: { bg: string; ink: string; accent: string; motif: string; layout: string; face: string }
}

export const genres: string[] = data.genres
export const books: Book[] = data.books as Book[]

const bySlug = new Map(books.map((b) => [b.slug, b]))
export const getBook = (slug: string) => {
  const b = bySlug.get(slug)
  if (!b) throw new Error(`Unknown book: ${slug}`)
  return b
}

export const coverSrc = (slug: string) => `/covers/${slug}.webp`
export const COVER_W = 640
export const COVER_H = 986

export const monthlyPicks = data.monthlyPicks.map(getBook)
export const winners = data.winners.map((w) => ({ ...w, book: getBook(w.slug) }))
export const original = { ...data.original, book: getBook(data.original.slug) }

/** genreShelves[k][g] = the k-th book of genre g (used by the four hover stacks). */
export const genreShelves: Book[][] = [0, 1, 2, 3].map((k) =>
  genres.map((_, g) => {
    const list = books.filter((b) => b.genre === g && b.slug !== data.original.slug)
    return list[k % list.length]
  }),
)

/** Alternating card grounds so `data-check-contrast` has real work to do. */
export const cardTones = ['pink', 'violet', 'yellow', 'wine', 'blue', 'orange'] as const
