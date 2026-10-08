/**
 * Flat illustrations for the four "How it works" cards (720×588 like the
 * reference slots). Pure SVG, palette colours, no external assets.
 */
export function StepIllustration({ step, className }: { step: 1 | 2 | 3 | 4; className?: string }) {
  const common = { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 720 588', fill: 'none', className, 'aria-hidden': true } as const
  if (step === 1) {
    // browse the drop: a phone with a grid of books and a magnifier
    return (
      <svg {...common}>
        <rect x="200" y="40" width="320" height="520" rx="44" fill="#111" />
        <rect x="222" y="70" width="276" height="460" rx="28" fill="#fff" />
        {[0, 1, 2].map((r) =>
          [0, 1].map((c) => (
            <rect key={`${r}${c}`} x={246 + c * 120} y={100 + r * 140} width="108" height="118" rx="12" fill={['#ff008c', '#1ce8ed', '#ffd24a', '#9982de', '#f9a220', '#3b308f'][r * 2 + c]} />
          )),
        )}
        <circle cx="470" cy="400" r="86" fill="#ffd24a" stroke="#111" strokeWidth="14" />
        <circle cx="470" cy="400" r="54" fill="#fff" opacity="0.7" />
        <path d="m530 462 84 84" stroke="#111" strokeWidth="26" strokeLinecap="round" />
      </svg>
    )
  }
  if (step === 2) {
    // build your box: open mailer with three books dropping in
    return (
      <svg {...common}>
        <path d="M120 300h480l-40 220H160L120 300Z" fill="#fd48f2" stroke="#111" strokeWidth="12" strokeLinejoin="round" />
        <path d="M120 300 80 200h560l-40 100" fill="#feb6fa" stroke="#111" strokeWidth="12" strokeLinejoin="round" />
        <rect x="225" y="80" width="90" height="130" rx="10" fill="#0f766e" transform="rotate(-12 270 145)" />
        <rect x="320" y="40" width="90" height="130" rx="10" fill="#ff008c" transform="rotate(6 365 105)" />
        <rect x="420" y="90" width="90" height="130" rx="10" fill="#ffd24a" transform="rotate(16 465 155)" />
        <rect x="150" y="330" width="420" height="150" fill="#1ce8ed" opacity="0.6" />
      </svg>
    )
  }
  if (step === 3) {
    // watch the doorstep: a door, a mat and the box
    return (
      <svg {...common}>
        <rect x="200" y="40" width="320" height="420" rx="16" fill="#9982de" stroke="#111" strokeWidth="12" />
        <rect x="240" y="80" width="100" height="120" rx="10" fill="#d7cdf1" />
        <rect x="380" y="80" width="100" height="120" rx="10" fill="#d7cdf1" />
        <circle cx="478" cy="290" r="12" fill="#ffd24a" />
        <rect x="170" y="470" width="380" height="60" rx="14" fill="#f9a220" stroke="#111" strokeWidth="10" />
        <rect x="290" y="392" width="150" height="96" rx="12" fill="#fd48f2" stroke="#111" strokeWidth="10" />
        <path d="M290 420h150" stroke="#111" strokeWidth="8" />
      </svg>
    )
  }
  // talk it out: two chat bubbles
  return (
    <svg {...common}>
      <path d="M90 120a40 40 0 0 1 40-40h300a40 40 0 0 1 40 40v130a40 40 0 0 1-40 40H230l-80 70v-70h-20a40 40 0 0 1-40-40V120Z" fill="#ffd24a" stroke="#111" strokeWidth="12" strokeLinejoin="round" />
      <path d="M630 300a40 40 0 0 0-40-40H330a40 40 0 0 0-40 40v120a40 40 0 0 0 40 40h180l80 70v-70h0a40 40 0 0 0 40-40V300Z" fill="#1ce8ed" stroke="#111" strokeWidth="12" strokeLinejoin="round" />
      <path d="M280 220c-30-22-50-42-50-68 0-16 12-28 26-28 10 0 19 6 24 16 5-10 14-16 24-16 14 0 26 12 26 28 0 26-20 46-50 68Z" fill="#ff008c" />
      <rect x="350" y="310" width="60" height="84" rx="6" fill="#3b308f" />
      <rect x="420" y="310" width="60" height="84" rx="6" fill="#f9a220" />
      <rect x="490" y="310" width="60" height="84" rx="6" fill="#0f766e" />
    </svg>
  )
}
