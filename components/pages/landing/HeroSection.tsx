'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'

/* ── helpers ── */
function countUp(
  setter: (v: string) => void,
  to: number,
  { dur = 1600, prefix = '$', suffix = '', dec = 0 }: { dur?: number; prefix?: string; suffix?: string; dec?: number } = {}
) {
  const start = performance.now()
  const ease  = (t: number) => 1 - Math.pow(1 - t, 3)
  const tick  = (now: number) => {
    const t = Math.min(1, (now - start) / dur)
    const v = to * ease(t)
    setter(prefix + v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suffix)
    if (t < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

export function HeroSection() {
  const reduced    = useRef(false)
  const heroRef    = useRef<HTMLElement>(null)
  const triRef     = useRef<HTMLSpanElement>(null)
  const ctaBtnRef  = useRef<HTMLAnchorElement>(null)
  const ctaWrapRef = useRef<HTMLSpanElement>(null)

  const [spendVal,    setSpendVal]    = useState('$0')
  const [wasteVal,    setWasteVal]    = useState('$0')
  const [strikeStruck, setStrikeStruck] = useState(false)
  const [strikeOn,    setStrikeOn]    = useState(false)
  const [email,       setEmail]       = useState('')

  /* ── on mount ── */
  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /* hero entrance */
    if (!reduced.current && heroRef.current) {
      gsap.fromTo(
        heroRef.current.querySelectorAll('.hero-copy > *'),
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, delay: 0.15 }
      )
    }

    /* notch triangle shear-off */
    const tri = triRef.current
    if (tri) {
      if (reduced.current) {
        tri.style.display = 'none'
      } else {
        const anim = tri.animate(
          [
            { transform: 'translate(0,0) rotate(0deg)',    backgroundColor: '#0B0B0C', opacity: 1 },
            { transform: 'translate(40px,-34px) rotate(20deg)', backgroundColor: '#C6FF3D', opacity: 1, offset: 0.5 },
            { transform: 'translate(150px,-120px) rotate(64deg)', backgroundColor: '#C6FF3D', opacity: 0 },
          ],
          { duration: 1500, delay: 700, easing: 'cubic-bezier(0.16,1,0.3,1)', fill: 'forwards' }
        )
        anim.onfinish = () => { if (tri) tri.style.display = 'none' }
      }
    }

    /* spend count-up → strike → waste */
    setTimeout(() => {
      countUp(setSpendVal, 34210, { dur: 1700 })
    }, 600)
    setTimeout(() => {
      setStrikeStruck(true)
      // add .on one frame later so CSS transition fires from scaleX(0) → scaleX(1)
      requestAnimationFrame(() => setStrikeOn(true))
      countUp(setWasteVal, 9840, { dur: 1200 })
    }, 2500)
  }, [])

  /* magnetic CTA */
  useEffect(() => {
    if (reduced.current) return
    const wrap = ctaWrapRef.current
    const btn  = ctaBtnRef.current
    if (!wrap || !btn) return
    const strength = 0.32
    const onMove  = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect()
      btn.style.transform = `translate(${(e.clientX-(r.left+r.width/2))*strength}px,${(e.clientY-(r.top+r.height/2))*strength}px)`
    }
    const onLeave = () => { btn.style.transform = 'translate(0,0)' }
    wrap.addEventListener('mousemove', onMove)
    wrap.addEventListener('mouseleave', onLeave)
    return () => { wrap.removeEventListener('mousemove', onMove); wrap.removeEventListener('mouseleave', onLeave) }
  }, [])

  return (
    <header className="hero" ref={heroRef}>
      <div className="wrap hero-grid">

        {/* ── LEFT COPY ── */}
        <div className="hero-copy" style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="eyebrow">FinOps for AI coding tools</span>

          <h1 style={{ marginTop: 20 }}>
            You&apos;re about to spend{' '}
            <span className="big-num">$25B</span> a year on AI coding tools.
            You have{' '}
            <span style={{ color: 'var(--muted)' }}>no idea</span>{' '}
            what you&apos;re getting.
          </h1>

          <p className="hero-sub">
            Planckspace is the spend visibility and optimization layer for Claude&nbsp;Code,
            Cursor, Copilot &amp; Windsurf. We tell you what your AI did, who used it, what
            shipped — and how to make it cheaper.
          </p>

          <form
            className="capture"
            style={{ marginTop: 36 }}
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
            <span ref={ctaWrapRef} className="magnetic">
              <Link ref={ctaBtnRef} href="#cta" className="btn btn-primary">
                Get early access
                <svg className="arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </Link>
            </span>
          </form>

          <div className="privacy-line">
            <svg viewBox="0 0 16 16" fill="none" style={{ width:12, height:12, flexShrink:0 }} aria-hidden="true">
              <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.3"/>
            </svg>
            We never see your code. Ever.
          </div>
        </div>

        {/* ── RIGHT VISUAL ── */}
        <div className="hero-visual">
          {/* animated notch logo mark */}
          <div className="notch-stage" aria-hidden="true">
            <div className="notch-square" />
            <span ref={triRef} className="cut-tri" />
            <span className="notch-label">the gap, surfaced</span>
          </div>

          {/* ledger card */}
          <div className="ledger" role="region" aria-label="Spend preview">
            <div className="ledger-row">
              <span className="ledger-key">monthly spend</span>
              <span className={`ledger-val${strikeStruck ? ' struck' : ''}${strikeOn ? ' on' : ''}`}>
                {spendVal}
                <span className="strike-line" aria-hidden="true" />
              </span>
            </div>
            <div className="ledger-row">
              <span className="ledger-key">wasted spend</span>
              <span className="ledger-val waste">{wasteVal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div className="scroll-cue" aria-hidden="true">
        <span>scroll</span>
        <span className="line" />
      </div>
    </header>
  )
}
