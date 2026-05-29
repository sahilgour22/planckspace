interface GapBarProps {
  /** Total invoiced amount label, e.g. "$102,430 invoiced" */
  invoicedLabel: string
  /** Wasted amount label, e.g. "$29,710 wasted" */
  wastedLabel: string
  /** Percentage of total that is productive (0–100) */
  usedPct: number
  /** Percentage of total that is waste (0–100) */
  wastePct: number
  className?: string
}

/**
 * Horizontal spend bar with a notch-clipped amber segment representing waste.
 * The notch clip echoes the Planckspace logo.
 */
export function GapBar({
  invoicedLabel,
  wastedLabel,
  usedPct,
  wastePct,
  className = '',
}: GapBarProps) {
  return (
    <div className={`gapbar-wrap ${className}`}>
      <div className="gapbar-top">
        <span>{invoicedLabel}</span>
        <span style={{ color: 'var(--amber)' }}>{wastedLabel}</span>
      </div>

      <div className="gapbar" role="img" aria-label={`Spend breakdown: ${usedPct}% productive, ${wastePct}% wasted`}>
        <div className="used" style={{ width: `${usedPct}%` }} />
        <div className="waste" style={{ width: `${wastePct}%` }} />
      </div>

      <div className="gapbar-legend" aria-hidden="true">
        <span>
          <i className="u" style={{ width: 11, height: 11, display: 'inline-block' }} />
          productive — shipped work
        </span>
        <span>
          <i className="w" style={{ width: 11, height: 11, display: 'inline-block' }} />
          waste — abandoned &amp; re-read
        </span>
      </div>
    </div>
  )
}
