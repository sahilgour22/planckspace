interface ReconciliationDiffProps {
  invoiced: string
  attributed: string
  gap: string
  /** 'dark' renders on the ink background (default); 'light' on paper */
  variant?: 'dark' | 'light'
  className?: string
}

/**
 * Git-style +/- diff showing Invoice / Attributed / Gap in Geist Mono.
 * Amber gap row immediately communicates the unresolved difference.
 */
export function ReconciliationDiff({
  invoiced,
  attributed,
  gap,
  variant = 'dark',
  className = '',
}: ReconciliationDiffProps) {
  return (
    <div
      className={`recon${variant === 'light' ? ' light' : ''} ${className}`}
      role="table"
      aria-label="Billing reconciliation"
    >
      <div className="rrow" role="row">
        <span role="cell">
          <span className="sign">&nbsp;</span>Invoice
        </span>
        <span role="cell">{invoiced}</span>
      </div>
      <div className="rrow plus" role="row">
        <span role="cell">
          <span className="sign">+</span>Attributed
        </span>
        <span role="cell">{attributed}</span>
      </div>
      <div className="rrow minus" role="row">
        <span role="cell">
          <span className="sign">−</span>Unexplained gap
        </span>
        <span className="gapv" role="cell">{gap}</span>
      </div>
    </div>
  )
}
