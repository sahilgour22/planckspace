/** Pricing page stub — full content will be added in a subsequent prompt. */
export const metadata = {
  title: 'Pricing — Planckspace',
  description: 'Pricing that scales with what we save you — not what you spend.',
}

export default function PricingPage() {
  return (
    <div style={{ paddingTop: 150, paddingBottom: 120 }}>
      <div className="wrap">
        <span className="eyebrow">Pricing</span>
        <h1 style={{ fontSize: 'clamp(34px, 5.2vw, 66px)', letterSpacing: '-0.04em', lineHeight: 1.0, marginTop: 18 }}>
          Pricing that scales with what we{' '}
          <span className="lime-text">save</span> you.
        </h1>
        <p style={{ marginTop: 24, fontSize: 'clamp(16px,1.6vw,19px)', color: 'var(--muted)', maxWidth: '56ch', lineHeight: 1.5 }}>
          Full page content incoming.
        </p>
      </div>
    </div>
  )
}
