import type { SVGProps } from 'react'

export function ArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 14 13" fill="none" aria-hidden="true" {...props}>
      <path d="M7.4.6 13 6.5l-5.6 5.9-1.5-1.4 3.2-3.5H1v-2h8.1L5.9 2 7.4.6Z" fill="currentColor" />
    </svg>
  )
}

export function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" width="100%" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M8.6 0h2.8v8.6H20v2.8h-8.6V20H8.6v-8.6H0V8.6h8.6V0Z" />
    </svg>
  )
}

export function MinusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" width="100%" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M0 8.6h20v2.8H0z" />
    </svg>
  )
}

/** Generic "camera" social glyph (stands in for a photo-sharing network). */
export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="100%" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm0 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7Zm5 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm5.2-3.4a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z"
      />
    </svg>
  )
}

/** Generic "note" social glyph (stands in for a short-video network). */
export function TiktokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="100%" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M14 3h2.6c.3 2.3 1.8 3.8 4.4 4v2.7c-1.7 0-3.1-.5-4.4-1.4v6.9a5.6 5.6 0 1 1-5.6-5.6c.3 0 .7 0 1 .1v2.8a2.9 2.9 0 1 0 2 2.7V3Z"
      />
    </svg>
  )
}

export function BurgerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" fill="none" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" fill="none" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M6.2 4.8 12 10.6l5.8-5.8 1.4 1.4-5.8 5.8 5.8 5.8-1.4 1.4-5.8-5.8-5.8 5.8-1.4-1.4 5.8-5.8-5.8-5.8 1.4-1.4Z" />
    </svg>
  )
}

function starPoints(cx: number, cy: number, outer: number, inner: number, n: number) {
  const pts: string[] = []
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? inner : outer
    const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2
    pts.push(`${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`)
  }
  return pts.join(' ')
}

/** Review badge — a 12-point seal with a drop shadow applied in CSS. */
export function StarBadge(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 147 141" aria-hidden="true" {...props}>
      <polygon points={starPoints(73.5, 70.5, 70, 56, 12)} fill="#ffd24a" />
    </svg>
  )
}

/** Eye-catcher starburst behind the winner year. */
export function Starburst(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" aria-hidden="true" {...props}>
      <polygon points={starPoints(100, 100, 98, 78, 18)} fill="#f9a220" />
    </svg>
  )
}

/** Hand-drawn heart with sparkles for the Readers' Favourites header. */
export function HeartIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 175 158" fill="none" aria-hidden="true" {...props}>
      <path
        d="M88 146C48 118 22 92 22 58 22 36 38 22 56 22c14 0 26 9 32 22 6-13 18-22 32-22 18 0 34 14 34 36 0 34-26 60-66 88Z"
        fill="#ff008c"
        stroke="#111"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <path d="M52 52c-6 4-10 12-10 22" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      <path d="M150 12v22M139 23h22M18 118v14M11 125h14M158 100v10M153 105h10" stroke="#111" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}

/** Press "logos" — fictional publications set as type. */
export function PressLogo({ name }: { name: string }) {
  const styles: Record<string, { family: string; size: number; weight: number; tracking?: number }> = {
    'The Margin': { family: 'var(--font-display)', size: 30, weight: 400, tracking: 1 },
    'Paper Trail': { family: 'var(--font-hand)', size: 40, weight: 700 },
    Nightstand: { family: 'var(--font-sans)', size: 22, weight: 800, tracking: 3 },
    'Bookish Times': { family: 'var(--font-sans)', size: 22, weight: 700 },
  }
  const s = styles[name] ?? styles['Bookish Times']
  const words = name.split(' ')
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="100%" role="img" aria-label={name}>
      {words.map((w, i) => (
        <text
          key={w}
          x="80"
          y={words.length === 1 ? 88 : 72 + i * (s.size + 4)}
          textAnchor="middle"
          fontFamily={s.family}
          fontSize={s.size}
          fontWeight={s.weight}
          letterSpacing={s.tracking ?? 0}
          fill="#111"
        >
          {name === 'Nightstand' ? w.toUpperCase() : w}
        </text>
      ))}
    </svg>
  )
}
