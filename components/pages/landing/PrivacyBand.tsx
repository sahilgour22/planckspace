import { Reveal } from '@/components/ui/Reveal'

const CHIPS = [
  'No code, ever',
  'No prompt content',
  'On-device computation',
  'Metadata-only egress',
  'SOC 2 in progress',
]

export function PrivacyBand() {
  return (
    <section className="privacy-band" id="privacy">
      <div className="wrap">
        <span className="eyebrow on-dark">Privacy-first by architecture</span>

        <Reveal>
          <h2>
            We measure the spend, never the{' '}
            <span style={{ color: 'var(--lime)' }}>source</span>.
          </h2>
        </Reveal>

        <p>
          Token counts, durations and outcomes are computed on-device. Your prompts, your
          code, and your repositories never leave your machine. Planckspace receives metadata
          only — and that&apos;s a guarantee enforced by design, not a policy you have to trust.
        </p>

        <div className="privacy-chips" role="list">
          {CHIPS.map((c) => (
            <span key={c} className="chip" role="listitem">
              <span className="tick" aria-hidden="true">✓</span>
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
