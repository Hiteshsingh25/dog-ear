/**
 * Author avatar placeholder: coloured disc + monogram. Replace with photography.
 */
export function Avatar({ name, color = '#9982de', ink = '#fff', className }: { name: string; color?: string; ink?: string; className?: string }) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 144" role="img" aria-label={name} className={className}>
      <rect width="144" height="144" fill={color} />
      <circle cx="72" cy="58" r="30" fill={ink} opacity="0.18" />
      <path d="M22 144c6-32 26-50 50-50s44 18 50 50Z" fill={ink} opacity="0.18" />
      <text x="72" y="86" textAnchor="middle" fontFamily="var(--font-display)" fontSize="52" fill={ink} letterSpacing="2">
        {initials}
      </text>
    </svg>
  )
}
