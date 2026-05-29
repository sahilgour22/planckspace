'use client'

import { useEffect, useRef, useState } from 'react'
import { Reveal } from '@/components/ui/Reveal'

export function VantageVsUs() {
  const usColRef = useRef<HTMLDivElement>(null)
  const [lit, setLit] = useState(false)

  useEffect(() => {
    const el = usColRef.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) { setLit(true); return }

    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setLit(true); obs.disconnect() } },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section style={{ paddingBlock: 'clamp(80px,12vh,150px)' }} id="split">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="eyebrow">Why planckspace</span>
          <h2>Spend tools see the invoice. Planckspace sees the work.</h2>
          <p>
            Cloud cost platforms stop at the line item. We go one layer deeper — to the
            session, the outcome, and the fix.
          </p>
        </Reveal>

        <div className="vs-grid">
          {/* them */}
          <div className="vs-col them">
            <span className="vs-tag">// generic spend tooling</span>
            <h3>Sees the invoice</h3>
            <div className="vs-list">
              {[
                'A total dollar figure per provider',
                'Spend trended over time',
                'A budget alert when it\'s already too late',
                'No idea which repo, person, or PR it bought',
              ].map((t) => (
                <div key={t} className="vs-item">
                  <span className="mk">$</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* us */}
          <div ref={usColRef} className={`vs-col us${lit ? ' lit' : ''}`}>
            <span className="vs-tag">▰ planckspace</span>
            <h3>Sees the work</h3>
            <div className="vs-list">
              {[
                'Every session attributed to a repo & person',
                'Shipped vs abandoned — outcome on every dollar',
                'The waste, named: re-reads, retries, oversized models',
                'A concrete fix with the savings attached',
              ].map((t) => (
                <div key={t} className="vs-item">
                  <span className="mk">✓</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>

            {/* recon diff inline */}
            <div className="recon" style={{ marginTop: 28 }}>
              <div className="rrow"><span><span className="sign">&nbsp;</span>Invoice</span><span>$34,000</span></div>
              <div className="rrow plus"><span><span className="sign">+</span>Attributed</span><span>$32,000</span></div>
              <div className="rrow minus"><span><span className="sign">−</span>Unexplained gap</span><span className="gapv">$2,000</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
