'use client'

import { useEffect, useRef, useState } from 'react'
import { Reveal } from '@/components/ui/Reveal'

export function FinalCTA() {
  const btnRef  = useRef<HTMLButtonElement>(null)
  const wrapRef = useRef<HTMLSpanElement>(null)
  const [email, setEmail] = useState('')

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
    const onLeave = () => { btn.style.transform = 'translate(0,0)' }
    wrap.addEventListener('mousemove', onMove)
    wrap.addEventListener('mouseleave', onLeave)
    return () => { wrap.removeEventListener('mousemove', onMove); wrap.removeEventListener('mouseleave', onLeave) }
  }, [])

  return (
    <section className="final-cta" id="cta">
      <div className="wrap">
        <span className="eyebrow lime">Early access</span>

        <Reveal>
          <h2>See where your AI spend goes in 10 minutes.</h2>
        </Reveal>

        <form
          className="capture"
          onSubmit={(e) => e.preventDefault()}
          aria-label="Final early access sign-up"
        >
          <input
            type="email"
            placeholder="you@company.com"
            aria-label="Work email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span ref={wrapRef} className="magnetic">
            <button ref={btnRef} className="btn btn-primary" type="submit">
              Get early access
              <svg className="arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </span>
        </form>

        <div className="privacy-line" style={{ justifyContent: 'center', marginTop: 22 }}>
          <svg viewBox="0 0 16 16" fill="none" style={{ width: 12, height: 12, flexShrink: 0 }} aria-hidden="true">
            <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.3" />
          </svg>
          Metadata only. We never see your code. Ever.
        </div>
      </div>
    </section>
  )
}
