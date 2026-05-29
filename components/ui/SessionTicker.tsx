'use client'

import { useEffect, useState } from 'react'

interface TickerRow {
  id:     number
  cost:   string
  repo:   string
  model:  string
  status: 'shipped' | 'abandoned'
}

const REPOS  = [
  'acme/checkout-api', 'acme/web-dashboard', 'linear-clone/core', 'stripe-int/billing',
  'acme/auth-svc', 'data-pipe/etl', 'acme/mobile-ios', 'infra/terraform',
  'acme/search-idx', 'payments/ledger', 'acme/notifications', 'ml-team/ranking',
]
const MODELS = ['claude-opus-4', 'claude-sonnet-4', 'gpt-5-codex', 'cursor-fast', 'copilot-gpt5', 'windsurf-swe']
const TOOLS  = ['claude-code', 'cursor', 'copilot', 'windsurf']

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function fmtUSD(n: number)   { return '$' + n.toFixed(2) }

let idCounter = 0

function makeRow(): TickerRow {
  return {
    id:     ++idCounter,
    cost:   fmtUSD(Math.random() * 12 + 0.4),
    repo:   `${rand(TOOLS)} · ${rand(REPOS)}`,
    model:  rand(MODELS),
    status: Math.random() > 0.42 ? 'shipped' : 'abandoned',
  }
}

interface SessionTickerProps {
  interval?: number
  className?: string
}

/**
 * Live monospace telemetry feed.
 * Rows are seeded only on the client (inside useEffect) to avoid SSR/client
 * hydration mismatches from Math.random().
 */
export function SessionTicker({ interval = 2200, className = '' }: SessionTickerProps) {
  // Start with an empty array — server renders nothing, client seeds in useEffect
  const [rows, setRows] = useState<TickerRow[]>([])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Seed initial rows on first client render
    setRows(Array.from({ length: 7 }, makeRow))

    if (reduced) return

    const id = setInterval(() => {
      setRows((prev) => [makeRow(), ...prev].slice(0, 7))
    }, interval)

    return () => clearInterval(id)
  }, [interval])

  return (
    <section className={`ticker-band ${className}`} aria-label="Live session telemetry">
      <div className="ticker-head">
        <span className="live" aria-hidden="true" />
        <span>LIVE SESSION TELEMETRY · cost · tool · repo · outcome</span>
      </div>
      <div className="ticker-rows" role="log" aria-live="polite" aria-atomic="false">
        {rows.map((row) => (
          <div key={row.id} className="ticker-row">
            <span className="t-cost num">{row.cost}</span>
            <span className="t-repo">{row.repo}</span>
            <span className="t-model">{row.model}</span>
            <span className={`t-status ${row.status}`}>
              {row.status === 'shipped' ? '✓ shipped' : '✕ abandoned'}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
