'use client'

import { useState, useEffect, useRef } from 'react'
import { Reveal } from '@/components/ui/Reveal'

/* ─────────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────────── */

const FAQ_ITEMS = [
  {
    q: "Why won't you just give me a price?",
    a: "Because we're in early access and we'd be guessing. We're learning what savings look like across different team sizes and stacks before we commit to a number. Early-access teams help shape that — and get grandfathered terms for being early.",
  },
  {
    q: 'Is the free tier really free?',
    a: 'Yes — for students and solo builders with a verified .edu address, full visibility is free with no time limit. We think the next generation of engineers should grow up able to see what their AI tools actually cost.',
  },
  {
    q: 'Do you ever see our code?',
    a: "No. Measurement happens on-device; only metadata — costs, counts, outcomes — is ever transmitted. There is no code path that sends source or prompt content to us. It's a guarantee enforced by architecture, not a policy.",
  },
  {
    q: "What if you don't find any savings?",
    a: "Then you shouldn't pay much, and our pricing reflects that. If Planckspace can't surface a clear return, it hasn't earned its seat — and we'd rather you tell us that than quietly churn.",
  },
  {
    q: 'Can we self-host?',
    a: 'Self-hosting and data residency are available on the Enterprise tier, built alongside your security team. The local-first architecture means most of the sensitive work already happens on your machines.',
  },
  {
    q: 'How is this different from a cloud cost tool?',
    a: 'Cloud cost platforms stop at the invoice line item. Planckspace goes a layer deeper — to the session, the person, the repo and the outcome — and turns that into named waste and concrete fixes. They see the invoice; we see the work.',
  },
]

const PRINCIPLES = [
  {
    n: 'principle 01',
    h: 'You only pay when we save you money',
    p: "Charging a percentage of your bill rewards us when your costs balloon. We refuse to be incentivized against your interests.",
  },
  {
    n: 'principle 02',
    h: 'No charge for visibility on your own data',
    p: "Seeing your spend shouldn't cost extra. Free visibility is a baseline, not a premium feature — the value we earn is in the savings we surface.",
  },
  {
    n: 'principle 03',
    h: 'Free for education',
    p: 'The next generation of engineers should grow up knowing what their AI tools cost. Full visibility, no time limit, for verified .edu.',
  },
]

const FREE_FEATS  = ['All coding tools & providers', 'Per-session receipts', 'Local-first, metadata-only', 'Personal workspace', 'Full local dashboard', 'Skill recommendations']
const TEAM_FEATS  = ['Everything in Free, for the whole team', 'Wasted-spend detection', 'Billing reconciliation', 'Optimization engine & model routing', 'Team workspaces & attribution', 'SSO & audit log']
const ENT_FEATS   = ['Everything in Team', 'Self-hosting & VPC deployment', 'SAML, SCIM & audit logs', 'Organization & enterprise policies', 'Governance & budget controls (roadmap)', 'Dedicated support']

/* ─────────────────────────────────────────────────────────────
   Magnetic link/button — self-contained sub-components
───────────────────────────────────────────────────────────── */

function MagneticLink({
  href,
  className,
  children,
  style,
  block = false,
}: {
  href: string
  className?: string
  children: React.ReactNode
  style?: React.CSSProperties
  block?: boolean
}) {
  const wrapRef = useRef<HTMLSpanElement>(null)
  const btnRef  = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const wrap = wrapRef.current
    const btn  = btnRef.current
    if (!wrap || !btn) return

    const S = 0.32
    const onMove  = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect()
      btn.style.transform = `translate(${(e.clientX - (r.left + r.width  / 2)) * S}px,${(e.clientY - (r.top  + r.height / 2)) * S}px)`
    }
    const onLeave = () => { btn.style.transform = '' }
    wrap.addEventListener('mousemove',  onMove)
    wrap.addEventListener('mouseleave', onLeave)
    return () => {
      wrap.removeEventListener('mousemove',  onMove)
      wrap.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <span ref={wrapRef} className="magnetic" style={block ? { display: 'block' } : undefined}>
      <a ref={btnRef} href={href} className={className} style={style}>
        {children}
      </a>
    </span>
  )
}

function MagneticSubmit({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const wrapRef = useRef<HTMLSpanElement>(null)
  const btnRef  = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const wrap = wrapRef.current
    const btn  = btnRef.current
    if (!wrap || !btn) return

    const S = 0.32
    const onMove  = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect()
      btn.style.transform = `translate(${(e.clientX - (r.left + r.width  / 2)) * S}px,${(e.clientY - (r.top  + r.height / 2)) * S}px)`
    }
    const onLeave = () => { btn.style.transform = '' }
    wrap.addEventListener('mousemove',  onMove)
    wrap.addEventListener('mouseleave', onLeave)
    return () => {
      wrap.removeEventListener('mousemove',  onMove)
      wrap.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <span ref={wrapRef} className="magnetic">
      <button ref={btnRef} type="submit" className={className}>
        {children}
      </button>
    </span>
  )
}

/* ─────────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────────── */

export function PricingClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (i: number) =>
    setOpenFaq(prev => (prev === i ? null : i))

  return (
    <>
      {/* ══ Hero ══ */}
      <header className="page-hero">
        <div className="wrap">
          <Reveal>
            <span className="eyebrow lime">Pricing</span>
            <h1 style={{ marginTop: 18 }}>
              Pricing that scales with what we{' '}
              <span className="lime-text">save</span>{' '}
              you — not what you spend.
            </h1>
            <p className="lede">
              Charging more when your bill grows is backwards. We're building pricing around
              the savings we find — and during early access, we'd rather earn your trust
              than your money.
            </p>
            <p className="pricing-partner-note">
              Pricing is being set together with our first design partners.{' '}
              <a href="#tiers" className="partner-link">Join the conversation →</a>
            </p>
          </Reveal>
        </div>
      </header>

      {/* ══ Tier cards ══ */}
      <section id="tiers" className="tiers-section">
        <div className="wrap">
          {/* Each tier is its own <Reveal> so they stagger individually */}
          <div className="tiers">

            {/* ── Free ── */}
            <Reveal as="div" className="tier" style={{ transitionDelay: '0ms' }}>
              <span className="t-name">
                Free
                <span className="badge-soft">solo &amp; students</span>
              </span>

              <div className="t-price">$0</div>

              <div className="t-sub">
                Individual devs and verified .edu addresses get full visibility, on
                the house — no credit card, no expiry.
                <span className="badge-edu">Free forever for verified .edu</span>
              </div>

              <div className="t-cta">
                <MagneticLink href="/docs" className="btn btn-ghost" block
                  style={{ width: '100%', justifyContent: 'center' }}>
                  Start free
                </MagneticLink>
              </div>

              <ul className="tier-feats">
                {FREE_FEATS.map(f => (
                  <li key={f} className="tf">
                    <span className="mk">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* ── Team — recommended, lime-accented ── */}
            <Reveal as="div" className="tier feature" style={{ transitionDelay: '140ms' }}>
              <span className="t-name">
                Team
                <span className="badge-soft">early access</span>
              </span>

              <div className="t-price">Let's talk</div>

              <div className="t-sub">
                We price on value — a share of what we help you save.
                Become a design partner and lock in founder pricing.
              </div>

              <div className="t-cta">
                <MagneticLink href="#cta" className="btn btn-primary" block
                  style={{ width: '100%', justifyContent: 'center' }}>
                  Become a design partner
                </MagneticLink>
              </div>

              <ul className="tier-feats">
                {TEAM_FEATS.map(f => (
                  <li key={f} className="tf">
                    <span className="mk">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* ── Enterprise ── */}
            <Reveal as="div" className="tier" style={{ transitionDelay: '280ms' }}>
              <span className="t-name">Enterprise</span>

              <div className="t-price">Contact us</div>

              <div className="t-sub">
                SSO, audit logs, self-host/VPC, and organization &amp; enterprise
                policies — available when you need them.
              </div>

              <div className="t-cta">
                <MagneticLink href="#cta" className="btn btn-ghost" block
                  style={{ width: '100%', justifyContent: 'center' }}>
                  Talk to us
                </MagneticLink>
              </div>

              <ul className="tier-feats">
                {ENT_FEATS.map(f => (
                  <li key={f} className="tf">
                    <span className="mk">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ══ How we'll price — principles ══ */}
      <section className="how" style={{ paddingTop: 'clamp(70px, 11vh, 130px)' }}>
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow lime">How we'll price</span>
            <h2>Three principles we won't break.</h2>
          </Reveal>

          <Reveal className="price-principles" threshold={0.92}>
            {PRINCIPLES.map((p, i) => (
              <div key={i} className="pp">
                <span className="pp-n">{p.n}</span>
                <h3>{p.h}</h3>
                <p>{p.p}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section className="how" style={{ paddingTop: 0 }}>
        <div className="wrap" style={{ maxWidth: 880 }}>
          <Reveal className="section-head">
            <span className="eyebrow">Honest FAQ</span>
            <h2>The questions we'd ask too.</h2>
          </Reveal>

          <div className="faq" role="list">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className={`faq-item${openFaq === i ? ' open' : ''}`}
                role="listitem"
              >
                <button
                  className="faq-q"
                  onClick={() => toggleFaq(i)}
                  aria-expanded={openFaq === i}
                  aria-controls={`faq-answer-${i}`}
                >
                  <span>{item.q}</span>
                  <span className="pm" aria-hidden="true">+</span>
                </button>

                <div
                  id={`faq-answer-${i}`}
                  className="faq-a"
                  role="region"
                  aria-hidden={openFaq !== i}
                >
                  <div className="faq-a-inner">{item.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Final CTA ══ */}
      <section className="final-cta" id="cta">
        <div className="wrap">
          <span className="eyebrow lime">Early access</span>
          <Reveal>
            <h2>Let's find the savings first.</h2>
          </Reveal>

          <form
            className="capture"
            onSubmit={e => e.preventDefault()}
            style={{ marginTop: 40, justifyContent: 'center' }}
          >
            <input
              type="email"
              placeholder="you@company.com"
              aria-label="Work email"
              autoComplete="email"
            />
            <MagneticSubmit className="btn btn-primary">
              Get early access
              <svg className="arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </MagneticSubmit>
          </form>

          <p className="privacy-line">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <rect x="1.5" y="5" width="9" height="6" rx="1" stroke="currentColor" strokeWidth="1.1" />
              <path d="M4 5V3.5a2 2 0 0 1 4 0V5" stroke="currentColor" strokeWidth="1.1" />
            </svg>
            No code is ever transmitted. Architecture, not policy.
          </p>
        </div>
      </section>
    </>
  )
}
