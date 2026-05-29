interface NotchLogoProps {
  size?: number
  variant?: 'ink' | 'lime'
  className?: string
}

/**
 * The Planckspace notch mark — a square with the top-right corner
 * sheared off on a diagonal, echoing the product metaphor of "surfacing the gap".
 * clip-path: polygon(0 0, 62% 0, 100% 38%, 100% 100%, 0 100%)
 */
export function NotchLogo({ size = 22, variant = 'ink', className = '' }: NotchLogoProps) {
  const fill = variant === 'lime' ? 'var(--lime)' : 'var(--ink)'

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        background: fill,
        clipPath: 'polygon(0 0, 62% 0, 100% 38%, 100% 100%, 0 100%)',
        flexShrink: 0,
      }}
      aria-hidden="true"
    />
  )
}
