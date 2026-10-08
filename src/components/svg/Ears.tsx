import type { SVGProps } from 'react'

/**
 * The two floppy ears that peek over cards / pop-ups / the active nav pill.
 * Kept in the same viewBoxes as the CSS sizing expects (44×45 and 29×80).
 */
export const LEFT_EAR_PATH = 'M5 45C-1 32 1 14 12 5 22-3 38 5 43 21c3 11-4 22-14 24H5Z'
export const RIGHT_EAR_PATH = 'M13 80C4 62 0 42 3 22 6 6 18-2 25 6c4 6 4 30 1 54-1 9-6 18-13 20Z'

export function LeftEar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 44 45" width="100%" aria-hidden="true" {...props}>
      <path fill="currentColor" d={LEFT_EAR_PATH} />
    </svg>
  )
}

export function RightEar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 29 80" width="100%" aria-hidden="true" {...props}>
      <path fill="currentColor" d={RIGHT_EAR_PATH} />
    </svg>
  )
}

/** Card ears (used by the book slider items, choice cards and pop-ups). */
export function CardEars({ prefix }: { prefix: string }) {
  return (
    <div className={`${prefix}-ears`}>
      <LeftEar className={`${prefix}-left-ear`} />
      <RightEar className={`${prefix}-right-ear`} />
    </div>
  )
}
