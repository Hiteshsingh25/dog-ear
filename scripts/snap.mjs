/**
 * QA screenshots with the local headless Chromium.
 *
 *   node scripts/snap.mjs [url] [width] [height] [scrollY...]
 *   REDUCED=1 node scripts/snap.mjs …   emulates prefers-reduced-motion
 *   node scripts/snap.mjs http://localhost:3130 1440 900 0 1200 2600
 *
 * Writes snap-<w>x<h>-<y>.png to .snaps/ and prints console errors. Scrolls in
 * steps first so scroll-triggered reveals have fired by the time we capture.
 */
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { launch } from './lib/chromium.mjs'

const [url = 'http://localhost:3130', w = '1440', h = '900', ...ys] = process.argv.slice(2)
const scrolls = ys.length ? ys.map(Number) : [0]
const out = path.join(process.cwd(), '.snaps')
await mkdir(out, { recursive: true })

const browser = await launch()
const page = await browser.newPage({ viewport: { width: Number(w), height: Number(h) }, deviceScaleFactor: 1 })
if (process.env.REDUCED) await page.emulateMedia({ reducedMotion: 'reduce' })
const errors = []
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text())
})
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 })
await page.waitForTimeout(4500)
console.log('document height:', await page.evaluate(() => document.documentElement.scrollHeight))
for (const y of scrolls) {
  // step towards the target so IntersectionObserver/ScrollTrigger reveals fire on the way
  const current = await page.evaluate(() => window.scrollY)
  const step = Number(h) * 0.6
  if (y > current) for (let s = current; s < y; s += step) {
    await page.evaluate((v) => window.scrollTo(0, v), s)
    await page.waitForTimeout(120)
  }
  await page.evaluate((v) => window.scrollTo(0, v), y)
  await page.waitForTimeout(1800)
  const file = path.join(out, `snap-${process.env.REDUCED ? 'rm-' : ''}${w}x${h}-${y}.png`)
  await page.screenshot({ path: file })
  console.log('wrote', path.relative(process.cwd(), file))
}
console.log(errors.length ? `\nCONSOLE ERRORS:\n${errors.join('\n')}` : '\nno console errors')
await browser.close()
