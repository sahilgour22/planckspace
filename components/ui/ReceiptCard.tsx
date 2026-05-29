export interface ReceiptLineItem {
  label: string
  value: string
}

export interface ReceiptCardProps {
  id: string
  repo: string
  tool: string
  model: string
  items: ReceiptLineItem[]
  total: string
  duration: string
  outcome: 'shipped' | 'abandoned'
  className?: string
}

/**
 * Monospace paper receipt for a single AI coding session.
 * Dotted dividers, struck-through total on abandoned sessions.
 */
export function ReceiptCard({
  id,
  repo,
  tool,
  model,
  items,
  total,
  duration,
  outcome,
  className = '',
}: ReceiptCardProps) {
  const isAbandoned = outcome === 'abandoned'

  return (
    <div className={`receipt ${className}`} role="article" aria-label={`Session receipt ${id}`}>
      <div className="receipt-head">
        <span className="r-title">SESSION RECEIPT</span>
        <span className="r-id">{id}</span>
      </div>

      <div className="r-line">
        <span className="r-k">repo</span>
        <span className="r-v">{repo}</span>
      </div>
      <div className="r-line">
        <span className="r-k">tool · model</span>
        <span className="r-v">{tool} · {model}</span>
      </div>

      <div className="r-divider" aria-hidden="true" />

      {items.map((item, i) => (
        <div key={i} className="r-line">
          <span className="r-k">{item.label}</span>
          <span className="r-v">{item.value}</span>
        </div>
      ))}

      <div className="r-line">
        <span className="r-k">duration</span>
        <span className="r-v">{duration}</span>
      </div>

      <div className="r-total">
        <span className="r-k">TOTAL</span>
        <span className={`r-v${isAbandoned ? ' struck' : ''}`}>{total}</span>
      </div>

      <div className="r-outcome">
        <span className="r-k">outcome</span>
        <span className={`badge ${outcome}`}>
          {isAbandoned ? '✕ abandoned — 0 commits' : '✓ shipped'}
        </span>
      </div>
    </div>
  )
}
