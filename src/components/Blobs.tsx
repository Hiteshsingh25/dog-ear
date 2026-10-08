import blobs from '@/data/blobs.json'

type PathSpec = { d: string; fill?: string; opacity?: number }
type Spec = { viewBox: string; paths: PathSpec[] }

const B = blobs as Record<string, string>

export const blobSets = {
  hero: {
    desktop: { viewBox: '0 0 1920 1403', paths: [{ d: B.heroDesktopA }, { d: B.heroDesktopB, fill: '#F9A220' }] },
    mobile: { viewBox: '0 0 402 874', paths: [{ d: B.heroMobileA }, { d: B.heroMobileB, fill: '#F9A220' }] },
  },
  flow: {
    desktop: { viewBox: '0 0 1920 1078', paths: [{ d: B.flowDesktop }] },
    mobile: { viewBox: '0 0 402 743', paths: [{ d: B.flowMobile }] },
  },
  benefits: {
    desktop: { viewBox: '0 0 1920 1080', paths: [{ d: B.benefitsA, opacity: 0.5 }, { d: B.benefitsB }] },
    mobile: { viewBox: '0 0 402 465', paths: [{ d: B.benefitsMobileA, opacity: 0.5 }, { d: B.benefitsMobileB }] },
  },
  faq: {
    desktop: { viewBox: '0 0 1919 1032', paths: [{ d: B.faqDesktop }] },
    mobile: { viewBox: '0 0 402 778', paths: [{ d: B.faqMobile }] },
  },
  menu: { desktop: { viewBox: '0 0 386 712', paths: [{ d: B.menuBg }] } },
} satisfies Record<string, { desktop: Spec; mobile?: Spec }>

/**
 * Ambient section background: one or two procedural blob paths in the section's
 * accent, breathing via `data-background-animation` (stroke swells + rotates).
 */
export function Blobs({ set, className, small, animate = true }: { set: keyof typeof blobSets; className: string; small?: boolean; animate?: boolean }) {
  const s = blobSets[set] as { desktop: Spec; mobile?: Spec }
  const render = (spec: Spec, variant: 'desktop' | 'mobile', animated: boolean) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox={spec.viewBox}
      className={`${className} is--${variant}`}
      aria-hidden="true"
      {...(animated ? { 'data-background-animation': '' } : {})}
      {...(animated && small ? { 'data-background-animation-small': '' } : {})}
    >
      {spec.paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.fill ?? 'currentColor'} stroke={p.fill ?? 'currentColor'} opacity={p.opacity} />
      ))}
    </svg>
  )
  return (
    <>
      {render(s.desktop, 'desktop', animate)}
      {s.mobile ? render(s.mobile, 'mobile', false) : null}
    </>
  )
}
