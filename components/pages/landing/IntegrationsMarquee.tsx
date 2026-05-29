'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

const TOOLS = [
  'Claude Code', 'Cursor', 'GitHub Copilot', 'Windsurf',
  'Anthropic', 'OpenAI', 'GitHub', 'GitLab',
  'Linear', 'Jira', 'AWS Bedrock', 'Azure OpenAI',
  'Vercel', 'Okta', 'Datadog', 'Buildkite',
]

function MarqueeItem({ label }: { label: string }) {
  return (
    <span className="mq-item">
      <span className="gly" aria-hidden="true" />
      {label}
    </span>
  )
}

export function IntegrationsMarquee() {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced && trackRef.current) {
      trackRef.current.style.animation = 'none'
    }
  }, [])

  return (
    <section className="marquee-sec" id="integrations-mq" aria-label="Integrations">
      <div className="mq-label">// works with every tool, model &amp; provider in your stack</div>
      <div className="marquee-mask">
        <div className="marquee-track" ref={trackRef} aria-hidden="true">
          {TOOLS.map((t) => <MarqueeItem key={`a-${t}`} label={t} />)}
          {TOOLS.map((t) => <MarqueeItem key={`b-${t}`} label={t} />)}
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <Link
          href="/integrations"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            color: 'var(--muted)',
            textDecoration: 'none',
            letterSpacing: '-0.01em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
        >
          See all integrations
          <svg viewBox="0 0 16 16" fill="none" style={{ width: 12, height: 12 }} aria-hidden="true">
            <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
