'use client'

import { useEffect, useRef, useState } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { GapBar } from '@/components/ui/GapBar'
import { ReceiptCard } from '@/components/ui/ReceiptCard'
import { CountUp } from '@/components/ui/CountUp'

/* ─────────────────────────────────────────────
   Animated receipt: lines slide in one-by-one
───────────────────────────────────────────── */
function AnimatedReceipt() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(-1)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) { setStep(99); return }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        observer.disconnect()
        let i = 0
        const next = () => {
          setStep(i)
          i++
          if (i <= 5) setTimeout(next, 180)
        }
        setTimeout(next, 200)
      }
    }, { threshold: 0.4 })

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const lineClass = (idx: number) =>
    `ar-line${step >= idx ? ' in' : ''}`

  return (
    <div ref={wrapRef} className="mock-wrap">
      <div className="receipt" style={{ boxShadow: 'none', width: '100%' }}>
        <div className="receipt-head">
          <span className="r-title">SESSION RECEIPT</span>
          <span className="r-id">#cc-8f21a</span>
        </div>

        <div className={`r-line ${lineClass(0)}`}>
          <span className="r-k">repo</span>
          <span className="r-v">acme/checkout-api</span>
        </div>
        <div className={`r-line ${lineClass(1)}`}>
          <span className="r-k">prompts</span>
          <span className="r-v">28 × $0.62</span>
        </div>
        <div className={`r-line ${lineClass(2)}`}>
          <span className="r-k">CLAUDE.md re-reads</span>
          <span className="r-v">19 × $0.94</span>
        </div>
        <div className={`r-line ${lineClass(3)}`}>
          <span className="r-k">tool calls</span>
          <span className="r-v">141 × $0.04</span>
        </div>

        <div className={`r-total ${lineClass(4)}`}>
          <span className="r-k">TOTAL</span>
          <span className="r-v struck">$40.18</span>
        </div>

        <div className={`r-outcome ${lineClass(5)}`}>
          <span className="r-k">outcome</span>
          <span className="badge abandoned">✕ abandoned</span>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Magnetic CTA (reused from FinalCTA pattern)
───────────────────────────────────────────── */
function MagneticButton({ children }: { children: React.ReactNode }) {
  const btnRef  = useRef<HTMLButtonElement>(null)
  const wrapRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const wrap = wrapRef.current
    const btn  = btnRef.current
    if (!wrap || !btn) return
    const strength = 0.32
    const onMove  = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect()
      btn.style.transform = `translate(${(e.clientX-(r.left+r.width/2))*strength}px,${(e.clientY-(r.top+r.height/2))*strength}px)`
    }
    const onLeave = () => { btn.style.transform = '' }
    wrap.addEventListener('mousemove', onMove)
    wrap.addEventListener('mouseleave', onLeave)
    return () => {
      wrap.removeEventListener('mousemove', onMove)
      wrap.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <span ref={wrapRef} className="magnetic">
      <button ref={btnRef} className="btn btn-primary" type="submit">
        {children}
        <svg className="arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
    </span>
  )
}

/* ─────────────────────────────────────────────
   Main page component
───────────────────────────────────────────── */
export function FeaturesClient() {
  const [email, setEmail] = useState('')

  return (
    <>
      {/* ── HERO ──────────────────────────────── */}
      <header className="page-hero">
        <div className="wrap">
          <span className="eyebrow">Features</span>
          <h1>
            See what your AI did.{' '}
            <span className="amber-text" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '-0.05em' }}>
              Cut
            </span>{' '}
            what it wasted.{' '}
            Govern all of it.
          </h1>
          <p className="lede">
            Three acts. First we make AI coding spend visible down to the session.
            Then we cut the waste with concrete recommendations.
            Then we give you the controls to keep it that way.
          </p>
        </div>
      </header>

      {/* ── ACT 1 — SEE IT ───────────────────── */}
      <section className="act" id="see">
        <div className="wrap">
          <div className="act-label">
            <span className="n">Act 01</span> — See it
          </div>
          <Reveal>
            <h2>Visibility down to the session.</h2>
          </Reveal>
          <p className="act-lede">
            Spend stops being a single number on an invoice and becomes a map:
            per tool, per repo, per person, per outcome.
          </p>

          {/* Row 1 — Spend overview (text-left, mock-right) */}
          <Reveal className="feat-row">
            <div className="feat-text">
              <h3>Spend overview</h3>
              <p>
                One reconciled view across Claude Code, Cursor, Copilot and
                Windsurf. Trend it, slice it by team, and see exactly where
                the curve bends.
              </p>
              <div className="feat-meta">
                <div className="fm">
                  <span className="mk">·</span>
                  <span>Cross-tool totals, normalized to one currency of truth</span>
                </div>
                <div className="fm">
                  <span className="mk">·</span>
                  <span>Attribution by repo, team and contributor</span>
                </div>
              </div>
            </div>

            <div className="mock-wrap">
              <div className="mock-card">
                <div className="mock-head">
                  <span>SPEND · MAY 2026</span>
                  <span>all tools</span>
                </div>
                <div className="mock-bignum num">
                  <CountUp end={102430} prefix="$" duration={1600} />
                </div>
                <div className="mock-sub">+18% vs april · 4 tools · 31 repos</div>
                <div className="mock-row"><span>claude-code</span><span>$48,210</span></div>
                <div className="mock-row"><span>cursor</span><span>$31,940</span></div>
                <div className="mock-row"><span>copilot</span><span>$14,180</span></div>
                <div className="mock-row"><span>windsurf</span><span>$8,100</span></div>
              </div>
            </div>
          </Reveal>

          {/* Row 2 — Wasted spend (flip: mock-left, text-right) */}
          <Reveal className="feat-row flip">
            <div className="feat-text">
              <h3>Wasted spend, named</h3>
              <p>
                We don't just show a number — we name the waste. Abandoned
                sessions, repeated context re-reads, retries, and oversized
                models on trivial work.
              </p>
              <div className="feat-meta">
                <div className="fm waste">
                  <span className="mk">▰</span>
                  <span>~30% of spend flagged as recoverable on a typical team</span>
                </div>
                <div className="fm waste">
                  <span className="mk">▰</span>
                  <span>Each waste category traced to its root cause</span>
                </div>
              </div>
            </div>

            <div className="mock-wrap">
              <div className="mock-card dark">
                <div className="mock-head">
                  <span>WASTE BREAKDOWN</span>
                  <span style={{ color: 'var(--amber)' }}>$29,710</span>
                </div>
                <GapBar
                  invoicedLabel="$102,430 invoiced"
                  wastedLabel="$29,710 wasted"
                  usedPct={71}
                  wastePct={29}
                />
                <div className="mock-row" style={{ marginTop: 8 }}>
                  <span>abandoned sessions</span>
                  <span style={{ color: 'var(--amber)' }}>$13,400</span>
                </div>
                <div className="mock-row">
                  <span>context re-reads</span>
                  <span style={{ color: 'var(--amber)' }}>$9,210</span>
                </div>
                <div className="mock-row">
                  <span>oversized models</span>
                  <span style={{ color: 'var(--amber)' }}>$7,100</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Row 3 — Per-session deep dive (text-left, receipt-right) */}
          <Reveal className="feat-row">
            <div className="feat-text">
              <h3>Per-session deep dive</h3>
              <p>
                Every session opens as a monospace receipt: prompts, re-reads,
                tool calls, duration, total, and the outcome — shipped or
                abandoned. The truth, line by line.
              </p>
              <div className="feat-meta">
                <div className="fm">
                  <span className="mk">·</span>
                  <span>Struck-through totals on abandoned work</span>
                </div>
                <div className="fm">
                  <span className="mk">·</span>
                  <span>Linked to the commit or PR it produced — or didn't</span>
                </div>
              </div>
            </div>

            <AnimatedReceipt />
          </Reveal>
        </div>
      </section>

      {/* ── ACT 2 — CUT IT ───────────────────── */}
      <section className="act" id="cut">
        <div className="wrap">
          <div className="act-label">
            <span className="n">Act 02</span> — Cut it
          </div>
          <Reveal>
            <h2>From visible waste to concrete savings.</h2>
          </Reveal>
          <p className="act-lede">
            Seeing the waste is half the job. Planckspace tells you exactly
            what to change — and how much it'll save.
          </p>

          {/* Row 1 — Skill recommendations (text-left, dark mock-right) */}
          <Reveal className="feat-row">
            <div className="feat-text">
              <h3>Skill recommendations</h3>
              <p>
                We spot the patterns burning money — bloated context files,
                repeated re-reads, missing caching — and turn each into a
                specific, actionable fix.
              </p>
              <div className="feat-meta">
                <div className="fm save">
                  <span className="mk">✓</span>
                  <span>"Split CLAUDE.md → save ~$840/mo"</span>
                </div>
                <div className="fm save">
                  <span className="mk">✓</span>
                  <span>Ranked by savings, with one-click context</span>
                </div>
              </div>
            </div>

            <div className="mock-wrap">
              <div className="mock-card dark">
                <div className="mock-head">
                  <span>RECOMMENDATIONS</span>
                  <span style={{ color: 'var(--lime)' }}>3 found</span>
                </div>
                <div className="mock-row">
                  <span>Split CLAUDE.md context</span>
                  <span style={{ color: 'var(--lime)', fontFamily: 'var(--font-mono)' }}>~$840/mo</span>
                </div>
                <div className="mock-row">
                  <span>Enable prompt caching</span>
                  <span style={{ color: 'var(--lime)', fontFamily: 'var(--font-mono)' }}>~$610/mo</span>
                </div>
                <div className="mock-row">
                  <span>Cap retries at 3</span>
                  <span style={{ color: 'var(--lime)', fontFamily: 'var(--font-mono)' }}>~$290/mo</span>
                </div>
                <div className="mock-sub" style={{ marginTop: 14 }}>
                  est. total recoverable · $1,740 / mo
                </div>
              </div>
            </div>
          </Reveal>

          {/* Row 2 — Optimization engine (flip: mock-left, text-right) */}
          <Reveal className="feat-row flip">
            <div className="feat-text">
              <h3>Optimization engine</h3>
              <p>
                Continuous analysis across every team and repo. As your usage
                shifts, the recommendations re-rank — so the biggest lever is
                always at the top.
              </p>
              <div className="feat-meta">
                <div className="fm save">
                  <span className="mk">✓</span>
                  <span>Always-on, re-evaluated every session</span>
                </div>
                <div className="fm save">
                  <span className="mk">✓</span>
                  <span>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9em', background: 'var(--paper-2)', padding: '1px 6px', borderRadius: 4 }}>
                      CLAUDE.md
                    </code>
                    {' '}is 8,200 tokens → split it → save ~$840/month
                  </span>
                </div>
              </div>
            </div>

            <div className="mock-wrap">
              <div className="mock-card">
                <div className="mock-head">
                  <span>SAVINGS TRACKED</span>
                  <span>last 90 days</span>
                </div>
                <div className="mock-bignum num" style={{ color: 'var(--lime)', filter: 'brightness(0.62)' }}>
                  <CountUp end={24180} prefix="$" duration={1500} />
                </div>
                <div className="mock-sub">realized across 12 applied recommendations</div>
                <div className="mock-mini-bar">
                  <div className="mb-used" style={{ width: '42%' }} />
                </div>
                <div className="mock-sub">spend down 23% on optimized repos</div>
              </div>
            </div>
          </Reveal>

          {/* Row 3 — Model routing (text-left, dark mock-right) */}
          <Reveal className="feat-row">
            <div className="feat-text">
              <h3>Model routing</h3>
              <p>
                Not every task needs the biggest model. Planckspace surfaces
                where a smaller, cheaper model would have shipped the same
                outcome — and lets you route there by default.
              </p>
              <div className="feat-meta">
                <div className="fm save">
                  <span className="mk">✓</span>
                  <span>Right-size the model to the task</span>
                </div>
                <div className="fm save">
                  <span className="mk">✓</span>
                  <span>Policy routing without touching a single repo</span>
                </div>
              </div>
            </div>

            <div className="mock-wrap">
              <div className="mock-card dark">
                <div className="mock-head">
                  <span>ROUTING SUGGESTIONS</span>
                  <span style={{ color: 'var(--lime)' }}>auto</span>
                </div>

                <div
                  className="mock-bignum num"
                  style={{ color: 'var(--lime)', marginBottom: 4 }}
                  aria-label="80% savings on routed tasks"
                >
                  <CountUp end={80} suffix="%" duration={1400} />
                </div>
                <div className="mock-sub">savings on right-sized tasks</div>

                <div className="route-flow">
                  <div className="route-row">
                    <span className="r-from">opus-4 · lint fixes</span>
                    <span className="r-arr">→</span>
                    <span className="r-to">haiku-4</span>
                  </div>
                  <div className="route-row">
                    <span className="r-from">opus-4 · test scaffold</span>
                    <span className="r-arr">→</span>
                    <span className="r-to">sonnet-4</span>
                  </div>
                  <div className="route-row">
                    <span className="r-from">gpt-5 · docstrings</span>
                    <span className="r-arr">→</span>
                    <span className="r-to">gpt-5-mini</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── ACT 3 — GOVERN IT (muted roadmap) ── */}
      <section className="act" id="govern">
        <div className="wrap">
          <div className="act-label govern">
            <span className="n" style={{ color: 'var(--muted)' }}>Act 03</span>
            {' '}— Govern it ·{' '}
            <span style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.02em' }}>
              on the roadmap
            </span>
          </div>
          <h2 style={{ color: 'var(--muted)', fontSize: 'clamp(24px, 3vw, 38px)', letterSpacing: '-0.03em' }}>
            Controls to keep it that way.
          </h2>
          <p className="act-lede" style={{ fontSize: 15, opacity: 0.75 }}>
            Visibility and optimization come first. Governance is next — these
            are in active design with early-access teams.
          </p>

          <div className="govern-grid">
            <div className="govern-step">
              <span className="g-tag">soon — budgets</span>
              <h3>Team budgets &amp; alerts</h3>
              <p>
                Set per-team and per-repo budgets. Get notified before a
                threshold, not a week after the invoice lands.
              </p>
            </div>
            <div className="govern-step">
              <span className="g-tag">soon — policy</span>
              <h3>Model &amp; tool policy</h3>
              <p>
                Define which models and tools are allowed where, and enforce
                routing policy across the org automatically.
              </p>
            </div>
            <div className="govern-step">
              <span className="g-tag">soon — reporting</span>
              <h3>Finance-ready reports</h3>
              <p>
                Export attributed, reconciled spend straight into your FinOps
                workflow — no spreadsheet archaeology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────── */}
      <section className="final-cta" id="cta">
        <div className="wrap">
          <span className="eyebrow lime">Early access</span>

          <Reveal>
            <h2>See it. Cut it. Start this month.</h2>
          </Reveal>

          <form
            className="capture"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Early access sign-up"
          >
            <input
              type="email"
              placeholder="you@company.com"
              aria-label="Work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <MagneticButton>Get early access</MagneticButton>
          </form>
        </div>
      </section>
    </>
  )
}
