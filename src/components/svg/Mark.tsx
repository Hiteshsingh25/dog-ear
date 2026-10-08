import type { SVGProps } from 'react'

/**
 * The Dog-Ear mark: a page with a folded ("dog-eared") corner and a face.
 * Single colour via currentColor with even-odd cut-outs, so it recolours
 * anywhere (pop-up buttons, the transition overlay, the benefits wall).
 */
export const MARK_PATH =
  'M32 8h28l30 30v34a20 20 0 0 1-20 20H32a20 20 0 0 1-20-20V28A20 20 0 0 1 32 8Z' +
  'M64 14v20h20Z' +
  'M41 56a5 5 0 1 0 0-.01Z' +
  'M63 56a5 5 0 1 0 0-.01Z' +
  'M52 74c-5.5 0-9-3-9-6.5S46.5 62 52 62s9 2 9 5.5S57.5 74 52 74Z'

export function Mark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" aria-hidden="true" {...props}>
      <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d={MARK_PATH} />
    </svg>
  )
}

/** Two-colour version used in the header wordmark. */
export function MarkDuo({ paper = '#fff', ink = 'currentColor', ...props }: SVGProps<SVGSVGElement> & { paper?: string; ink?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" aria-hidden="true" {...props}>
      <path fill={ink} d="M32 8h28l30 30v34a20 20 0 0 1-20 20H32a20 20 0 0 1-20-20V28A20 20 0 0 1 32 8Z" />
      <path fill={paper} d="M64 14v20h20Z" />
      <circle cx="41" cy="56" r="5" fill={paper} />
      <circle cx="63" cy="56" r="5" fill={paper} />
      <path fill={paper} d="M52 74c-5.5 0-9-3-9-6.5S46.5 62 52 62s9 2 9 5.5S57.5 74 52 74Z" />
    </svg>
  )
}
