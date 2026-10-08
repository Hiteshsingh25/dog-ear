/**
 * Shared headless-Chromium helpers for the asset scripts.
 * Uses the Chromium in Playwright's cache via playwright-core from the sibling
 * `infracorp` project (no Playwright dependency in this package).
 */
import { existsSync, readdirSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath, pathToFileURL } from 'node:url'

export const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

export function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH
  const cache = path.join(os.homedir(), 'AppData', 'Local', 'ms-playwright')
  if (!existsSync(cache)) return null
  const found = []
  for (const dir of readdirSync(cache)) {
    if (!/^chromium-\d+$/.test(dir)) continue
    for (const sub of ['chrome-win64', 'chrome-win']) {
      const exe = path.join(cache, dir, sub, 'chrome.exe')
      if (existsSync(exe)) {
        found.push({ v: Number(dir.split('-')[1]), exe })
        break
      }
    }
  }
  found.sort((a, b) => b.v - a.v)
  return found[0]?.exe ?? null
}

export async function loadPlaywright() {
  const candidates = [
    path.join(root, 'node_modules', 'playwright-core', 'index.mjs'),
    path.join(root, '..', 'infracorp', 'node_modules', 'playwright-core', 'index.mjs'),
    path.join(root, '..', 'infracorp', 'node_modules', 'playwright', 'index.mjs'),
  ]
  for (const c of candidates) {
    if (existsSync(c)) return import(pathToFileURL(c).href)
  }
  throw new Error('playwright-core not found. `npm i -D playwright-core` or keep ../infracorp around.')
}

export async function launch({ gl = true } = {}) {
  const { chromium } = await loadPlaywright()
  const exe = findChromium()
  if (!exe) throw new Error("No Chromium in Playwright's cache. Set CHROMIUM_PATH to a chrome.exe.")
  return chromium.launch({
    executablePath: exe,
    args: gl ? ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] : [],
  })
}

const MIME = {
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.html': 'text/html',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
}

/**
 * Serve a virtual origin (http://dogear.local/) from disk:
 *   /            -> the html string given
 *   /three/*     -> node_modules/three/*
 *   /fonts/*     -> public/fonts/*
 *   /scene/*     -> scripts/scenes/*
 */
export async function installRoutes(page, html) {
  await page.route('http://dogear.local/**', async (route) => {
    const url = new URL(route.request().url())
    if (url.pathname === '/') return route.fulfill({ status: 200, contentType: 'text/html', body: html })
    let file
    if (url.pathname.startsWith('/three/')) file = path.join(root, 'node_modules', 'three', url.pathname.slice(7))
    else if (url.pathname.startsWith('/fonts/')) file = path.join(root, 'public', url.pathname)
    else if (url.pathname.startsWith('/scene/')) file = path.join(root, 'scripts', 'scenes', url.pathname.slice(7))
    if (!file || !existsSync(file)) return route.fulfill({ status: 404, body: 'not found' })
    const body = await readFile(file)
    return route.fulfill({ status: 200, contentType: MIME[path.extname(file)] ?? 'application/octet-stream', body })
  })
}

export const fromDataUrl = (d) => Buffer.from(d.slice(d.indexOf(',') + 1), 'base64')

export async function fontFaceCSS() {
  const faces = [
    ['Figtree', 'Figtree-var.woff2', '300 900'],
    ['Anton', 'Anton-400.woff2', '400'],
    ['Caveat', 'Caveat-var.woff2', '400 700'],
  ]
  let css = ''
  for (const [family, file, weight] of faces) {
    const b64 = (await readFile(path.join(root, 'public', 'fonts', file))).toString('base64')
    css += `@font-face{font-family:'${family}';font-weight:${weight};src:url(data:font/woff2;base64,${b64}) format('woff2');}`
  }
  return css
}
