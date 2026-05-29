'use client'

import { useEffect, useRef, useState } from 'react'
import { Reveal } from '@/components/ui/Reveal'

interface StatCard {
  tag:       string
  numTo:     number
  numPrefix: string
  numSuffix: string
  color?:    string
  desc:      string
}

const STATS: StatCard[] = [
  {
    tag:       '// projected dev cost · 2026',
    numTo:     200,
    numPrefix: '$',
    numSuffix: '–$2k',
    desc:      'Per developer per month — AI coding costs have grown 6× in 18 months with no sign of slowing.',
  },
  {
    tag:       '// avg tools per eng',
    numTo:     70,
    numPrefix: '',
    numSuffix: '%',
    color:     'var(--amber)',
    desc:      'Of engineers run 2–4 AI coding tools simultaneously. Every tool has its own billing, its own black box.',
  },
  {
    tag:       '// orgs with spend attribution',
    numTo:     0,
    numPrefix: '',
    numSuffix: '%',
    desc:      'Almost no org can map a dollar of AI spend to a repo, a person, or a shipped outcome. The invoice tells you nothing.',
  },
]

function StatCard({ card }: { card: StatCard }) {
  const [display, setDisplay] = useState(card.numPrefix + '0' + card.numSuffix)
  const ref     = useRef<HTMLDivElement>(null)
  const fired   = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const run = () => {
      if (fired.current) return
      fired.current = true
      if (card.numTo === 0) { setDisplay('0%'); return }

      const dur   = 1400
      const start = performance.now()
      const ease  = (t: number) => 1 - Math.pow(1 - t, 3)
      const tick  = (now: number) => {
        const t = Math.min(1, (now - start) / dur)
        setDisplay(card.numPrefix + Math.round(card.numTo * ease(t)).toLocaleString('en-US') + card.numSuffix)
        if (t < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    // Fire immediately if already in view, else wait for intersection
    const check = () => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) run()
    }
    check()

    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { run(); obs.disconnect() } },
      { threshold: 0 }
    )
    obs.observe(el)
    window.addEventListener('scroll', check, { passive: true })
    return () => { obs.disconnect(); window.removeEventListener('scroll', check) }
  }, [card])

  return (
    <div className="stat-card" ref={ref}>
      <span className="stat-tag">{card.tag}</span>
      <div className="stat-num" style={card.color ? { color: card.color } : undefined}>
        {display}
      </div>
      <p className="stat-desc">{card.desc}</p>
    </div>
  )
}

export function ProblemSection() {
  return (
    <section className="problem" id="problem">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="eyebrow">The problem</span>
          <h2>Your AI coding bill is the fastest-growing line item no one can read.</h2>
          <p>
            Tokens went up. Headcount didn&apos;t. Finance sees an invoice; engineering sees a
            black box. Nobody can tell you what the spend actually bought.
          </p>
        </Reveal>

        {/* Wrap in Reveal so the same tested clip-path wipe handles the entrance */}
        <Reveal threshold={0.15}>
          <div className="stat-grid">
            {STATS.map((card) => (
              <StatCard key={card.tag} card={card} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
