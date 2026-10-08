/**
 * Procedural book-cover generator (pure function -> SVG string).
 *
 * Every cover in the catalogue is fictional and drawn here from a handful of
 * parameters (background, ink, accent, motif, layout, typeface). The same file
 * is used by scripts/render-covers.mjs (headless Chromium -> WebP) so the app
 * never ships a publisher's artwork.
 */

const W = 640
const H = 986

const FACES = {
  display: { family: 'Anton', weight: 400, factor: 0.46, upper: true, lh: 0.92, max: 132 },
  sans: { family: 'Figtree', weight: 700, factor: 0.56, upper: false, lh: 0.98, max: 104 },
  hand: { family: 'Caveat', weight: 700, factor: 0.42, upper: false, lh: 0.9, max: 150 },
}

function mulberry(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619)
  return h >>> 0
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/** Greedy word wrap on an estimated glyph width. */
function wrap(text, face, maxWidth, size) {
  const words = text.split(' ')
  const lines = []
  let line = ''
  const width = (s) => s.length * face.factor * size
  for (const w of words) {
    const next = line ? `${line} ${w}` : w
    if (width(next) > maxWidth && line) {
      lines.push(line)
      line = w
    } else line = next
  }
  if (line) lines.push(line)
  return lines
}

function fitTitle(title, face, maxWidth, maxLines = 4) {
  let size = face.max
  for (; size > 40; size -= 4) {
    const lines = wrap(title, face, maxWidth, size)
    const longest = Math.max(...lines.map((l) => l.length * face.factor * size))
    if (lines.length <= maxLines && longest <= maxWidth) return { size, lines }
  }
  return { size, lines: wrap(title, face, maxWidth, size) }
}

/* ------------------------------------------------------------ motifs */

const motifs = {
  moon(a, i, r) {
    const cx = 380 + r() * 60
    const cy = 330 + r() * 60
    return `<circle cx="${cx}" cy="${cy}" r="210" fill="${a}"/><circle cx="${cx + 90}" cy="${cy - 40}" r="190" fill="var(--bg)"/>`
  },
  rings(a, i) {
    let s = ''
    for (let k = 0; k < 6; k++)
      s += `<circle cx="320" cy="430" r="${60 + k * 62}" fill="none" stroke="${k % 2 ? a : i}" stroke-width="22" opacity="${1 - k * 0.1}"/>`
    return s
  },
  stripes(a, i) {
    let s = ''
    for (let k = 0; k < 9; k++) s += `<rect x="-200" y="${120 + k * 78}" width="1100" height="34" fill="${k % 3 === 1 ? i : a}" transform="rotate(-18 320 493)" opacity="0.9"/>`
    return s
  },
  waves(a, i) {
    let s = ''
    for (let k = 0; k < 7; k++) {
      const y = 380 + k * 70
      s += `<path d="M-40 ${y} C 90 ${y - 60}, 200 ${y + 60}, 330 ${y} S 570 ${y - 60}, 700 ${y}" fill="none" stroke="${k % 2 ? i : a}" stroke-width="26" stroke-linecap="round" opacity="${0.95 - k * 0.08}"/>`
    }
    return s
  },
  eye(a, i) {
    return `<path d="M60 470 Q320 200 580 470 Q320 740 60 470Z" fill="${a}"/><circle cx="320" cy="470" r="120" fill="${i}"/><circle cx="320" cy="470" r="58" fill="var(--bg)"/><circle cx="352" cy="436" r="18" fill="${i}"/>`
  },
  arch(a, i) {
    return `<path d="M140 900 V 420 A 180 180 0 0 1 500 420 V 900 Z" fill="${a}"/><path d="M210 900 V 470 A 110 110 0 0 1 430 470 V 900 Z" fill="${i}" opacity="0.9"/>`
  },
  sun(a, i) {
    let s = `<circle cx="320" cy="400" r="150" fill="${a}"/>`
    for (let k = 0; k < 16; k++) {
      const ang = (k / 16) * Math.PI * 2
      const x1 = 320 + Math.cos(ang) * 190
      const y1 = 400 + Math.sin(ang) * 190
      const x2 = 320 + Math.cos(ang) * 300
      const y2 = 400 + Math.sin(ang) * 300
      s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${k % 2 ? a : i}" stroke-width="20" stroke-linecap="round"/>`
    }
    return s
  },
  dots(a, i, r) {
    let s = ''
    for (let y = 0; y < 8; y++)
      for (let x = 0; x < 6; x++) {
        const rad = 14 + r() * 34
        s += `<circle cx="${70 + x * 100}" cy="${170 + y * 96}" r="${rad}" fill="${(x + y) % 3 === 0 ? i : a}" opacity="${0.75 + r() * 0.25}"/>`
      }
    return s
  },
  mountain(a, i) {
    return `<path d="M-20 820 L 180 380 L 300 560 L 430 300 L 680 820 Z" fill="${a}"/><path d="M-20 900 L 120 640 L 260 760 L 420 560 L 680 900 Z" fill="${i}" opacity="0.9"/><circle cx="500" cy="230" r="70" fill="${i}"/>`
  },
  keyhole(a, i) {
    return `<circle cx="320" cy="420" r="150" fill="${a}"/><path d="M250 520 L 390 520 L 460 860 L 180 860 Z" fill="${a}"/><circle cx="320" cy="420" r="60" fill="${i}"/>`
  },
  stairs(a, i) {
    let s = ''
    for (let k = 0; k < 7; k++) s += `<rect x="${60 + k * 70}" y="${820 - k * 80}" width="${600 - k * 70}" height="80" fill="${k % 2 ? a : i}"/>`
    return s
  },
  bolt(a, i) {
    return `<path d="M380 60 L 150 540 L 320 540 L 240 920 L 520 400 L 350 400 Z" fill="${a}"/><path d="M380 60 L 150 540 L 320 540 L 240 920" fill="none" stroke="${i}" stroke-width="18" stroke-linejoin="round"/>`
  },
  heart(a, i) {
    return `<path d="M320 780 C 120 640, 60 520, 120 400 C 170 300, 290 300, 320 400 C 350 300, 470 300, 520 400 C 580 520, 520 640, 320 780Z" fill="${a}"/><path d="M320 700 C 190 600, 150 520, 190 440" fill="none" stroke="${i}" stroke-width="18" stroke-linecap="round" opacity="0.8"/>`
  },
  split(a, i) {
    return `<path d="M0 0 L 640 0 L 640 986 Z" fill="${a}"/><circle cx="320" cy="493" r="120" fill="${i}"/>`
  },
  zigzag(a, i) {
    let s = ''
    for (let k = 0; k < 6; k++) {
      const y = 200 + k * 120
      s += `<path d="M-20 ${y} L 90 ${y - 60} L 200 ${y} L 310 ${y - 60} L 420 ${y} L 530 ${y - 60} L 660 ${y}" fill="none" stroke="${k % 2 ? a : i}" stroke-width="22" stroke-linejoin="round"/>`
    }
    return s
  },
  window(a, i) {
    let s = `<rect x="110" y="200" width="420" height="560" fill="${a}"/>`
    for (let k = 1; k < 3; k++) s += `<rect x="${110 + k * 140 - 8}" y="200" width="16" height="560" fill="var(--bg)"/>`
    for (let k = 1; k < 4; k++) s += `<rect x="110" y="${200 + k * 140 - 8}" width="420" height="16" fill="var(--bg)"/>`
    s += `<circle cx="390" cy="340" r="40" fill="${i}"/>`
    return s
  },
  spiral(a, i) {
    let d = ''
    let ang = 0
    let rad = 8
    for (let k = 0; k < 220; k++) {
      const x = 320 + Math.cos(ang) * rad
      const y = 480 + Math.sin(ang) * rad
      d += (k ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1)
      ang += 0.22
      rad += 1.35
    }
    return `<path d="${d}" fill="none" stroke="${a}" stroke-width="24" stroke-linecap="round"/><circle cx="320" cy="480" r="30" fill="${i}"/>`
  },
  drip(a, i, r) {
    let s = `<rect x="0" y="0" width="640" height="200" fill="${a}"/>`
    for (let k = 0; k < 7; k++) {
      const x = 40 + k * 92
      const len = 120 + r() * 320
      s += `<path d="M${x - 26} 190 V ${190 + len} A 26 26 0 0 0 ${x + 26} ${190 + len} V 190 Z" fill="${a}"/>`
    }
    s += `<circle cx="470" cy="700" r="90" fill="${i}" opacity="0.9"/>`
    return s
  },
}

/* ------------------------------------------------------------- cover */

export function coverSVG(book, fontCSS = '') {
  const c = book.cover
  const face = FACES[c.face] || FACES.display
  const r = mulberry(hash(book.slug))
  const motif = (motifs[c.motif] || motifs.dots)(c.accent, c.ink, r)
  const title = face.upper ? book.title.toUpperCase() : book.title
  const pad = 56
  const { size, lines } = fitTitle(title, face, W - pad * 2)
  const lineH = size * face.lh
  const blockH = lines.length * lineH

  let y0
  if (c.layout === 'top') y0 = 120
  else if (c.layout === 'bottom') y0 = H - 150 - blockH
  else if (c.layout === 'stack') y0 = 220
  else y0 = (H - blockH) / 2 - 40

  const anchor = c.layout === 'stack' ? 'start' : 'middle'
  const x = c.layout === 'stack' ? pad : W / 2
  const titleEls = lines
    .map((l, k) => `<text x="${x}" y="${(y0 + lineH * (k + 0.82)).toFixed(1)}" text-anchor="${anchor}" font-family="${face.family}" font-weight="${face.weight}" font-size="${size}" fill="${c.ink}" letter-spacing="${face.upper ? -1 : -2}">${esc(l)}</text>`)
    .join('')

  const authorY = c.layout === 'top' ? y0 + blockH + 48 : c.layout === 'bottom' ? H - 96 : H - 110
  const author = `<text x="${W / 2}" y="${authorY}" text-anchor="middle" font-family="Figtree" font-weight="600" font-size="26" letter-spacing="4" fill="${c.ink}">${esc(book.author.toUpperCase())}</text>`
  const rule = `<rect x="${W / 2 - 40}" y="${authorY - 44}" width="80" height="4" fill="${c.ink}" opacity="0.8"/>`

  // panel behind the title so it stays legible over any motif
  const panel =
    c.layout === 'stack'
      ? ''
      : `<rect x="${pad - 16}" y="${y0 - 10}" width="${W - pad * 2 + 32}" height="${blockH + 20}" fill="${c.bg}" opacity="0.55" rx="10"/>`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="--bg:${c.bg}">
  <defs>
    <style>${fontCSS}</style>
    <linearGradient id="spine" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0.32"/><stop offset="0.06" stop-color="#000" stop-opacity="0.06"/><stop offset="0.12" stop-color="#fff" stop-opacity="0.12"/><stop offset="0.16" stop-color="#000" stop-opacity="0"/></linearGradient>
    <radialGradient id="vig" cx="0.5" cy="0.45" r="0.8"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.22"/></radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${c.bg}"/>
  <g opacity="0.96">${motif}</g>
  ${panel}
  ${titleEls}
  ${rule}
  ${author}
  <rect width="${W}" height="${H}" fill="url(#vig)"/>
  <rect width="${W}" height="${H}" fill="url(#spine)"/>
</svg>`
}

export const COVER_SIZE = { W, H }
