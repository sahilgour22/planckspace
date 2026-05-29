'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ReceiptCard } from '@/components/ui/ReceiptCard'

gsap.registerPlugin(ScrollTrigger)

/* ── helpers ── */
function fmtUSD(n: number, dec = 0) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })
}

function countUpEl(el: HTMLElement, to: number, dur = 1200, prefix = '$') {
  const start = performance.now()
  const ease  = (t: number) => 1 - Math.pow(1 - t, 3)
  const tick  = (now: number) => {
    const t = Math.min(1, (now - start) / dur)
    el.textContent = prefix + Math.round(to * ease(t)).toLocaleString('en-US')
    if (t < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

/* ── Beat 1 ── */
function Beat1({ numRef }: { numRef: React.RefObject<HTMLDivElement> }) {
  return (
    <div className="beat" data-beat="1">
      <div className="beat-kicker"><span className="idx">01</span> The number</div>
      <div className="beat1-num" ref={numRef}>$0</div>
      <div className="beat1-sub">// total AI coding spend · this month · all tools</div>
    </div>
  )
}

/* ── Beat 2 ── */
function Beat2({
  usedRef, wasteRef, wasteLblRef,
}: {
  usedRef:     React.RefObject<HTMLDivElement>
  wasteRef:    React.RefObject<HTMLDivElement>
  wasteLblRef: React.RefObject<HTMLSpanElement>
}) {
  return (
    <div className="beat" data-beat="2">
      <div className="beat-kicker"><span className="idx">02</span> The waste</div>
      <div className="beat2-wrap">
        <div className="beat2-top">
          <span>$102,430 invoiced</span>
          <span style={{ color: 'var(--amber)' }}>
            <span ref={wasteLblRef}>$0</span> wasted
          </span>
        </div>
        <div className="beat2-bar">
          <div className="b-used" ref={usedRef} style={{ width: '0%' }} />
          <div className="b-waste" ref={wasteRef} style={{ width: '0%' }} />
        </div>
        <div className="beat2-legend">
          <span><span className="swatch" style={{ background: 'var(--paper)' }} /> productive — shipped work</span>
          <span><span className="swatch" style={{ background: 'var(--amber)' }} /> waste — abandoned &amp; re-read</span>
        </div>
      </div>
    </div>
  )
}

/* ── Beat 4 ── */
function Beat4({ saveRef }: { saveRef: React.RefObject<HTMLSpanElement> }) {
  return (
    <div className="beat" data-beat="4">
      <div className="beat-kicker"><span className="idx">04</span> The fix</div>
      <div className="fix-card">
        <div className="fix-tag">recommendation · savings found</div>
        <h3>
          Split <code>CLAUDE.md</code> into scoped context files.
          Stop re-reading 8k tokens on every turn.
        </h3>
        <div className="fix-save">
          <span className="save-num" ref={saveRef}>~$0</span>
          <span className="save-lbl">
            / month saved across<br />this repo&apos;s 31 contributors
          </span>
        </div>
      </div>
    </div>
  )
}

/* ── Reduced-motion fallback ── */
function DemoReduced() {
  return (
    <div className="demo-reduced">
      <div className="wrap">
        <div className="beat">
          <div className="beat-kicker"><span className="idx">01</span> The number</div>
          <div className="beat1-num">$102,430</div>
          <div className="beat1-sub">// total AI coding spend · this month · all tools</div>
        </div>
        <div className="beat" style={{ paddingTop: 56, borderTop: '0.5px solid rgba(247,245,240,0.12)' }}>
          <div className="beat-kicker"><span className="idx">02</span> The waste</div>
          <div className="beat2-wrap">
            <div className="beat2-top"><span>$102,430 invoiced</span><span style={{ color: 'var(--amber)' }}>$29,710 wasted</span></div>
            <div className="beat2-bar">
              <div className="b-used" style={{ width: '71%' }} />
              <div className="b-waste" style={{ width: '29%' }} />
            </div>
          </div>
        </div>
        <div className="beat" style={{ paddingTop: 56, borderTop: '0.5px solid rgba(247,245,240,0.12)' }}>
          <div className="beat-kicker"><span className="idx">03</span> The receipt</div>
          <ReceiptCard
            id="#cc-8f21a"
            repo="acme/checkout-api"
            tool="claude-code"
            model="opus-4"
            items={[
              { label: 'prompts', value: '28 × $0.62' },
              { label: 'CLAUDE.md re-reads', value: '19 × $0.94' },
              { label: 'tool calls', value: '141 × $0.04' },
            ]}
            total="$40.18"
            duration="2h 14m"
            outcome="abandoned"
          />
        </div>
        <div className="beat" style={{ paddingTop: 56, borderTop: '0.5px solid rgba(247,245,240,0.12)' }}>
          <div className="beat-kicker"><span className="idx">04</span> The fix</div>
          <div className="fix-card">
            <div className="fix-tag">recommendation · savings found</div>
            <h3>Split <code>CLAUDE.md</code> — save ~$840/month</h3>
            <div className="fix-save">
              <span className="save-num">~$840</span>
              <span className="save-lbl">/ month saved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════ */
export function DemoFlow() {
  const reduced    = useRef(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  /* beat element refs */
  const beatRefs   = useRef<(HTMLDivElement | null)[]>([null, null, null, null])
  const dotRefs    = useRef<(HTMLSpanElement | null)[]>([null, null, null, null])
  const fillRef    = useRef<HTMLDivElement>(null)

  /* beat-specific refs */
  const b1NumRef   = useRef<HTMLDivElement>(null)
  const b2UsedRef  = useRef<HTMLDivElement>(null)
  const b2WasteRef = useRef<HTMLDivElement>(null)
  const b2LblRef   = useRef<HTMLSpanElement>(null)
  const b4SaveRef  = useRef<HTMLSpanElement>(null)

  /* receipt reveal state */
  const [receiptVisible, setReceiptVisible] = useState(false)

  /* local progress trackers */
  const b3Played = useRef(false)
  const b4Played = useRef(false)

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    if (reduced.current || !sectionRef.current) return

    const section = sectionRef.current
    const beats   = beatRefs.current
    const dots    = dotRefs.current
    const fill    = fillRef.current

    const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
    const lerp  = (a: number, b: number, t: number) => a + (b - a) * t

    /* initial state — beat 0 visible */
    beats.forEach((b, i) => {
      if (!b) return
      b.style.opacity = i === 0 ? '1' : '0'
      b.style.pointerEvents = i === 0 ? 'auto' : 'none'
    })

    const update = (progress: number) => {
      if (fill) fill.style.width = (progress * 100).toFixed(2) + '%'

      const seg    = 1 / 4
      const active = Math.min(3, Math.floor(progress / seg))
      const local  = clamp((progress - active * seg) / seg)

      beats.forEach((b, i) => {
        if (!b) return
        const on = i === active
        b.style.opacity       = on ? '1' : '0'
        b.style.pointerEvents = on ? 'auto' : 'none'
        b.style.transform     = `translateY(${on ? lerp(18, -18, clamp(local * 1.2)) : 24}px)`
      })
      dots.forEach((d, i) => d?.classList.toggle('active', i === active))

      /* beat 1 — count */
      if (active === 0 && b1NumRef.current) {
        b1NumRef.current.textContent = fmtUSD(Math.round(lerp(0, 102430, clamp(local * 1.4))))
      }
      /* beat 2 — gap bar */
      if (active === 1) {
        const lp = clamp(local * 1.5)
        if (b2UsedRef.current)  b2UsedRef.current.style.width  = (lp * 71).toFixed(1) + '%'
        if (b2WasteRef.current) b2WasteRef.current.style.width = (lp * 29).toFixed(1) + '%'
        if (b2LblRef.current)   b2LblRef.current.textContent   = fmtUSD(Math.round(lerp(0, 29710, lp)))
      }
      /* beat 3 — receipt */
      if (active === 2 && !b3Played.current) { b3Played.current = true; setReceiptVisible(true) }
      if (active !== 2 && b3Played.current)  { b3Played.current = false; setReceiptVisible(false) }
      /* beat 4 — savings */
      if (active === 3 && !b4Played.current) {
        b4Played.current = true
        if (b4SaveRef.current) countUpEl(b4SaveRef.current, 840, 1000, '~$')
      }
      if (active !== 3 && b4Played.current) {
        b4Played.current = false
        if (b4SaveRef.current) b4SaveRef.current.textContent = '~$0'
      }
    }

    const trigger = ScrollTrigger.create({
      trigger:  section,
      start:    'top top',
      end:      'bottom bottom',
      pin:      '.demo-sticky',
      scrub:    0.6,
      onUpdate: (self) => update(self.progress),
    })

    update(0)

    return () => trigger.kill()
  }, [])

  if (reduced.current) return <DemoReduced />

  return (
    <div
      className="demo-section"
      ref={sectionRef}
      style={{ height: '460vh' }}
      id="demo"
    >
      <div className="demo-sticky">
        {/* rail */}
        <div className="demo-rail">
          <span className="demo-rail-title">// the demo flow — what planckspace surfaces</span>
          <div className="beat-dots" role="tablist" aria-label="Demo beats">
            {['01 number', '02 waste', '03 receipt', '04 fix'].map((label, i) => (
              <span
                key={i}
                ref={(el) => { dotRefs.current[i] = el }}
                className={`beat-dot${i === 0 ? ' active' : ''}`}
                role="tab"
                aria-label={label}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* stage */}
        <div className="demo-stage">
          {/* beat 1 */}
          <div ref={(el) => { beatRefs.current[0] = el }} className="beat" data-beat="1">
            <div className="beat-kicker"><span className="idx">01</span> The number</div>
            <div className="beat1-num" ref={b1NumRef}>$0</div>
            <div className="beat1-sub">// total AI coding spend · this month · all tools</div>
          </div>

          {/* beat 2 */}
          <div ref={(el) => { beatRefs.current[1] = el }} className="beat" data-beat="2">
            <div className="beat-kicker"><span className="idx">02</span> The waste</div>
            <div className="beat2-wrap">
              <div className="beat2-top">
                <span>$102,430 invoiced</span>
                <span style={{ color: 'var(--amber)' }}>
                  <span ref={b2LblRef}>$0</span> wasted
                </span>
              </div>
              <div className="beat2-bar">
                <div className="b-used"  ref={b2UsedRef}  style={{ width: '0%' }} />
                <div className="b-waste" ref={b2WasteRef} style={{ width: '0%' }} />
              </div>
              <div className="beat2-legend">
                <span><span className="swatch" style={{ background:'var(--paper)' }} /> productive — shipped work</span>
                <span><span className="swatch" style={{ background:'var(--amber)' }} /> waste — abandoned &amp; re-read</span>
              </div>
            </div>
          </div>

          {/* beat 3 — receipt */}
          <div ref={(el) => { beatRefs.current[2] = el }} className="beat" data-beat="3">
            <div className="beat-kicker"><span className="idx">03</span> The receipt</div>
            <ReceiptCard
              id="#cc-8f21a"
              repo="acme/checkout-api"
              tool="claude-code"
              model="opus-4"
              items={[
                { label: 'prompts',            value: '28 × $0.62' },
                { label: 'CLAUDE.md re-reads', value: '19 × $0.94' },
                { label: 'tool calls',         value: '141 × $0.04' },
              ]}
              total="$40.18"
              duration="2h 14m"
              outcome="abandoned"
              className={receiptVisible ? 'receipt-animate-in' : ''}
            />
          </div>

          {/* beat 4 */}
          <div ref={(el) => { beatRefs.current[3] = el }} className="beat" data-beat="4">
            <div className="beat-kicker"><span className="idx">04</span> The fix</div>
            <div className="fix-card">
              <div className="fix-tag">recommendation · savings found</div>
              <h3>
                Split <code>CLAUDE.md</code> into scoped context files.
                Stop re-reading 8k tokens on every turn.
              </h3>
              <div className="fix-save">
                <span className="save-num" ref={b4SaveRef}>~$0</span>
                <span className="save-lbl">/ month saved across<br />this repo&apos;s 31 contributors</span>
              </div>
            </div>
          </div>
        </div>

        {/* progress bar */}
        <div className="demo-progress" aria-hidden="true">
          <div className="fill" ref={fillRef} />
        </div>
      </div>
    </div>
  )
}
