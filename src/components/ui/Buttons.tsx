import type { ReactNode } from 'react'
import { TransitionLink } from '../TransitionLink'
import { ArrowIcon, InstagramIcon, TiktokIcon } from '../svg/Icons'

type Common = { className?: string; ariaLabel?: string; current?: boolean }

const isExternal = (href: string) => /^https?:/.test(href) || href.startsWith('mailto:')

/** Pill button (`data-button`) — pale ground, character roll on hover, grows ears when current. */
export function Button({ href, label, className = '', ariaLabel, current }: Common & { href: string; label: string }) {
  const inner = (
    <>
      <span className="button__bg" />
      <span className="button__inner">
        <span data-button-text className="button__text">
          {label}
        </span>
      </span>
    </>
  )
  const props = { 'data-button': '', className: `button ${className}`, 'aria-label': ariaLabel, 'aria-current': current ? ('page' as const) : undefined }
  if (isExternal(href))
    return (
      <a href={href} target="_blank" rel="noreferrer" {...props}>
        {inner}
      </a>
    )
  return (
    <TransitionLink href={href} {...props}>
      {inner}
    </TransitionLink>
  )
}

/**
 * Primary button (`data-button-alt`): magenta ground, text + arrow tile that
 * tilt apart on hover. Renders as <a>, <button> or a plain <div> (inside a card link).
 */
export function ButtonAlt({
  href,
  label,
  variant = 'base',
  className = '',
  as = 'a',
  onClick,
  type = 'button',
  icon,
  ariaLabel,
}: {
  href?: string
  label: string
  variant?: 'base' | 'small' | 'big'
  className?: string
  as?: 'a' | 'button' | 'div'
  onClick?: () => void
  type?: 'button' | 'submit'
  icon?: ReactNode
  ariaLabel?: string
}) {
  const inner = (
    <>
      <span className="button-alt__text-wrap">
        <span className="button-alt__bg" />
        <span className="button-alt__text-outer">
          <span data-button-alt-text className="button-alt__text">
            {label}
          </span>
        </span>
      </span>
      <span className="button-alt__icon-wrap">
        <span className="button-alt__bg" />
        <span className="button-alt__icon-outer">{icon ?? <ArrowIcon className="button-alt__icon" />}</span>
      </span>
    </>
  )
  const cls = `button-alt ${className}`
  if (as === 'div')
    return (
      <div data-button-alt data-variant={variant} className={cls}>
        {inner}
      </div>
    )
  if (as === 'button' || !href)
    return (
      <button data-button-alt data-variant={variant} className={cls} type={type} onClick={onClick} aria-label={ariaLabel}>
        {inner}
      </button>
    )
  if (isExternal(href))
    return (
      <a data-button-alt data-variant={variant} className={cls} href={href} target="_blank" rel="noreferrer" aria-label={ariaLabel}>
        {inner}
      </a>
    )
  return (
    <TransitionLink data-button-alt data-variant={variant} className={cls} href={href} aria-label={ariaLabel}>
      {inner}
    </TransitionLink>
  )
}

export function SocialButton({ network, href, variant = 'base' }: { network: 'instagram' | 'tiktok'; href: string; variant?: 'base' | 'big' }) {
  const Icon = network === 'instagram' ? InstagramIcon : TiktokIcon
  const label = network === 'instagram' ? 'Go to Instagram' : 'Go to TikTok'
  return (
    <a aria-label={label} data-variant={variant} href={href} target="_blank" rel="noreferrer" className="button-social">
      <div className="button-social__inner">
        <span className="button-social__bg" />
        <span className="button-social__icon-outer">
          <Icon className="button-social__icon" />
        </span>
      </div>
    </a>
  )
}

/** Store badge stand-in: a black pill with a glyph and the store name. */
export function AppButton({ store, label, href, variant = 'base' }: { store: 'ios' | 'android'; label: string; href: string; variant?: 'base' | 'outline' }) {
  return (
    <a aria-label={label} data-variant={variant} href={href} className="button is--app" target="_blank" rel="noreferrer">
      <span className="button__bg is--app" />
      <span className="button__inner">
        {store === 'ios' ? (
          <svg className="button__app-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M16.4 12.6c0-2.4 2-3.5 2.1-3.6-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.3 1.2 9.7.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.2-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4.9-1.3 1.3-2.6 1.3-2.7 0 0-2.6-1-2.6-4ZM14.1 5.5c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.1-.6 2.8-1.4Z" />
          </svg>
        ) : (
          <svg className="button__app-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M4 3.5v17a.5.5 0 0 0 .8.4l9.2-8.9L4.8 3.1a.5.5 0 0 0-.8.4Zm11.6 7.2 2.8-1.6-11.6-6.7 8.8 8.3Zm0 2.6-8.8 8.3 11.6-6.7-2.8-1.6Zm4.6-2.6-3.1-1.8-3.2 3.1 3.2 3.1 3.1-1.8a1.5 1.5 0 0 0 0-2.6Z" />
          </svg>
        )}
        <span className="button__text">{label}</span>
      </span>
    </a>
  )
}
