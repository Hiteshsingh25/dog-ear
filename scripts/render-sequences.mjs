/**
 * Render the two canvas image sequences (and the product still) with the local
 * headless Chromium + SwiftShader. No footage exists — both films are code
 * (scripts/scenes/*.js).
 *
 *   npm run frames                 hero + box (desktop & mobile) + still
 *   npm run frames -- hero         one scene   (hero | box | still)
 *   npm run frames -- box --count 12   quick preview (12 evenly spaced frames)
 *
 * Output (all alpha WebP, 3-digit zero-padded, index starts at 0):
 *   public/seq/hero/frame_000.webp        1440×1050
 *   public/seq/box/frame-000.webp         1440×904
 *   public/seq/box-mobile/frame-000.webp  900×1200
 *   public/img/box-still.webp             630×789
 */
import { mkdir, rm, writeFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { launch, installRoutes, fromDataUrl, root } from './lib/chromium.mjs'

const SCENES = {
  hero: { module: 'hero-books.js', prefix: 'frame_', tiers: [{ dir: 'hero', width: 1440, height: 1050, quality: 0.8 }] },
  box: {
    module: 'box.js',
    prefix: 'frame-',
    tiers: [
      { dir: 'box', width: 1440, height: 904, quality: 0.8 },
      { dir: 'box-mobile', width: 900, height: 1200, quality: 0.76 },
    ],
  },
}

const args = process.argv.slice(2)
const only = args.find((a) => !a.startsWith('--'))
const countIdx = args.indexOf('--count')
const COUNT_OVERRIDE = countIdx >= 0 ? Number(args[countIdx + 1]) : null

const html = (mod) => `<!doctype html><html><head><meta charset="utf-8">
<script type="importmap">{"imports":{"three":"/three/build/three.module.js","three/addons/":"/three/examples/jsm/"}}</script>
<style>html,body{margin:0;background:transparent}canvas{display:block}
@font-face{font-family:Figtree;src:url(/fonts/Figtree-var.woff2) format('woff2');font-weight:300 900}</style></head>
<body><script type="module">import "/scene/${mod}"; window.__ready = true;</script></body></html>`

async function dirSize(dir) {
  let bytes = 0
  for (const f of await readdir(dir)) bytes += (await stat(path.join(dir, f))).size
  return bytes
}

async function openScene(browser, mod, width, height) {
  const page = await browser.newPage({ viewport: { width, height } })
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') console.log('  [page]', m.text())
  })
  page.on('pageerror', (e) => console.log('  [pageerror]', e.message))
  await installRoutes(page, html(mod))
  await page.goto('http://dogear.local/')
  await page.waitForFunction(() => window.__ready && window.SCENE, null, { timeout: 30000 })
  await page.evaluate(async () => {
    try { await document.fonts.load('700 40px Figtree') } catch {}
  })
  await page.evaluate(([w, h]) => window.SCENE.init(w, h), [width, height])
  await page.waitForFunction(() => window.__sceneReady, null, { timeout: 60000 })
  return page
}

async function renderScene(browser, name) {
  const scene = SCENES[name]
  const first = scene.tiers[0]
  const page = await openScene(browser, scene.module, first.width, first.height)
  const FRAME_COUNT = await page.evaluate(() => window.SCENE.FRAME_COUNT)
  const count = COUNT_OVERRIDE ?? FRAME_COUNT
  for (const tier of scene.tiers) {
    const dir = path.join(root, 'public', 'seq', tier.dir)
    await rm(dir, { recursive: true, force: true })
    await mkdir(dir, { recursive: true })
    await page.setViewportSize({ width: tier.width, height: tier.height })
    await page.evaluate(([w, h]) => window.SCENE.setSize(w, h), [tier.width, tier.height])
    const t0 = Date.now()
    for (let k = 0; k < count; k++) {
      const i = COUNT_OVERRIDE ? Math.round((k / Math.max(1, count - 1)) * (FRAME_COUNT - 1)) : k
      const dataUrl = await page.evaluate(
        ([f, q]) => {
          window.SCENE.renderFrame(f)
          return window.SCENE.export(q)
        },
        [i, tier.quality],
      )
      await writeFile(path.join(dir, `${scene.prefix}${String(i).padStart(3, '0')}.webp`), fromDataUrl(dataUrl))
      if ((k + 1) % 30 === 0 || k === count - 1) console.log(`  ${tier.dir} ${k + 1}/${count}  (${((Date.now() - t0) / 1000).toFixed(0)}s)`)
    }
    console.log(`  ${tier.dir.padEnd(11)} ${count} frames  ${((await dirSize(dir)) / 1048576).toFixed(2)} MB`)
  }
  await page.close()
}

async function renderStill(browser) {
  const page = await openScene(browser, 'box.js', 630, 789)
  const dataUrl = await page.evaluate(() => {
    window.SCENE.renderStill()
    return window.SCENE.export(0.86)
  })
  const dir = path.join(root, 'public', 'img')
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, 'box-still.webp'), fromDataUrl(dataUrl))
  console.log('  public/img/box-still.webp')
  await page.close()
}

const browser = await launch()
try {
  console.log('DOG-EAR — rendering sequences\n')
  if (!only || only === 'hero') await renderScene(browser, 'hero')
  if (!only || only === 'box') await renderScene(browser, 'box')
  if (!only || only === 'still') await renderStill(browser)
} finally {
  await browser.close()
}
console.log('\nDone.')
