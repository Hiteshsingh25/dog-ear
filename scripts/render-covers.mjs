/**
 * Render every fictional cover in src/data/books.json to public/covers/<slug>.webp
 *
 *   npm run covers            all covers
 *   npm run covers -- slug    one cover
 */
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'
import { launch, installRoutes, fromDataUrl, fontFaceCSS, root } from './lib/chromium.mjs'
import { coverSVG, COVER_SIZE } from './lib/cover-svg.mjs'

const data = JSON.parse(await readFile(path.join(root, 'src', 'data', 'books.json'), 'utf8'))
const only = process.argv[2]
const OUT = path.join(root, 'public', 'covers')
await mkdir(OUT, { recursive: true })

const fontCSS = await fontFaceCSS()
const browser = await launch({ gl: false })
try {
  const page = await browser.newPage({ viewport: { width: COVER_SIZE.W, height: COVER_SIZE.H } })
  await installRoutes(page, `<!doctype html><html><head><meta charset="utf-8"><style>${fontCSS} html,body{margin:0;background:transparent}</style></head><body><canvas id="c" width="${COVER_SIZE.W}" height="${COVER_SIZE.H}"></canvas></body></html>`)
  await page.goto('http://dogear.local/')
  // make sure the fonts are decoded before the first SVG->canvas paint
  await page.evaluate(async () => {
    await Promise.all([
      document.fonts.load('400 40px Anton'),
      document.fonts.load('700 40px Figtree'),
      document.fonts.load('600 40px Figtree'),
      document.fonts.load('700 40px Caveat'),
    ])
  })

  const books = data.books.filter((b) => !only || b.slug === only)
  const t0 = Date.now()
  for (const book of books) {
    const svg = coverSVG(book, fontCSS)
    const dataUrl = await page.evaluate(async (svgText) => {
      const blob = new Blob([svgText], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const img = new Image()
      img.src = url
      await img.decode()
      const c = document.getElementById('c')
      const ctx = c.getContext('2d')
      ctx.clearRect(0, 0, c.width, c.height)
      ctx.drawImage(img, 0, 0, c.width, c.height)
      URL.revokeObjectURL(url)
      return c.toDataURL('image/webp', 0.84)
    }, svg)
    await writeFile(path.join(OUT, `${book.slug}.webp`), fromDataUrl(dataUrl))
  }
  console.log(`rendered ${books.length} covers in ${((Date.now() - t0) / 1000).toFixed(1)}s -> public/covers`)
} finally {
  await browser.close()
}
