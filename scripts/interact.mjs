/**
 * Interaction QA: exercises the accordion, the books slider arrows, a genre
 * hover, the mobile menu, the pop-up and a route transition, screenshotting each.
 *
 *   node scripts/interact.mjs [url]
 */
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { launch } from './lib/chromium.mjs'

const [url = 'http://localhost:3130'] = process.argv.slice(2)
const out = path.join(process.cwd(), '.snaps')
await mkdir(out, { recursive: true })
const browser = await launch()
const errors = []
const shot = (page, name) => page.screenshot({ path: path.join(out, `it-${name}.png`) })
const scrollTo = async (page, sel, offset = -120) => {
  await page.evaluate(
    ([s, o]) => {
      const el = document.querySelector(s)
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + o)
    },
    [sel, offset],
  )
  await page.waitForTimeout(1200)
}

// ---- desktop
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 })
  await page.waitForTimeout(4000)

  // slider arrows
  await scrollTo(page, '[data-books-slider]', -300)
  await page.click('[data-books-slider] .books-slider__controls-button.is--next')
  await page.waitForTimeout(400)
  await page.click('[data-books-slider] .books-slider__controls-button.is--next')
  await page.waitForTimeout(1500)
  await shot(page, 'slider-next')

  // genre hover
  await scrollTo(page, '#genres', -200)
  const item = await page.$('[data-genre-interaction-item]:nth-child(3)')
  await item.hover()
  await page.waitForTimeout(1200)
  await shot(page, 'genre-hover')

  // accordion
  await scrollTo(page, '#faq', -100)
  await page.click('[data-accordion-summary]')
  await page.waitForTimeout(900)
  const open = await page.evaluate(() => document.querySelector('[data-accordion]').open)
  console.log('accordion open:', open)
  await shot(page, 'accordion')

  // pop-up
  const pop = await page.$('.faq__logo-easter-egg [data-pop-up-button]')
  await pop.hover()
  await page.waitForTimeout(900)
  await shot(page, 'popup')

  // sequence health
  const seq = await page.evaluate(() => {
    const c = document.querySelector('[data-box-sequence-canvas]')
    return { w: c.width, h: c.height, cssW: c.clientWidth }
  })
  console.log('box canvas', seq)

  // route transition
  await page.click('.header__nav a[href="/faq"]')
  await page.waitForTimeout(3500)
  console.log('after nav:', await page.evaluate(() => location.pathname + ' triggers=' + (window.ScrollTrigger ? '' : 'n/a')))
  await shot(page, 'faq-page')
  await page.goto(`${url}/books`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(3500)
  await page.evaluate(() => window.scrollTo(0, 700))
  await page.waitForTimeout(1200)
  await shot(page, 'books-page')
  await page.close()
}

// ---- mobile menu
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 })
  await page.waitForTimeout(3500)
  await page.click('[data-menu-toggle]')
  await page.waitForTimeout(1000)
  await shot(page, 'mobile-menu')
  await page.close()
}

console.log(errors.length ? `\nCONSOLE ERRORS:\n${errors.join('\n')}` : '\nno console errors')
await browser.close()
