import { MarkDuo } from './Mark'

/**
 * Wordmark = mark + "Dog-Ear" set in the display face. Built from live text so it
 * needs no image asset and recolours with `color`.
 */
export function Logo({ className = '', label = 'Dog-Ear Book Club', paper = '#fff' }: { className?: string; label?: string; paper?: string }) {
  return (
    <span className={`logo ${className}`} aria-label={label} role="img">
      <MarkDuo className="logo__mark" paper={paper} />
      <span className="logo__text" aria-hidden="true">
        Dog-Ear
      </span>
    </span>
  )
}
