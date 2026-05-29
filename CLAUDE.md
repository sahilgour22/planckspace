# Planckspace — Developer Guide

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styles | Tailwind CSS v4 (CSS-first config in `globals.css`) |
| Smooth scroll | Lenis 1.x — wrapped in `Providers` client component |
| Animation | GSAP 3 + ScrollTrigger — registered once in `Providers`, driven by `gsap.ticker` |
| Fonts | Geist (sans) + Geist Mono (ALL numbers, money, code) via `next/font/google` |

## Design Source of Truth

The `claude-design/PlanckSpace/` directory in the repo root is the **visual source of truth**.  
Match its layout, colors, typography, spacing, radii, and component structure exactly.  
Do not invent styling — pull tokens from the bundle.

Animations are specified per page (see each page's prompt message).

## Token Table

| Token | Value | Use |
|---|---|---|
| `--paper` | `#F7F5F0` | Page background |
| `--paper-2` | `#F1EEE6` | Surface cards, hover states |
| `--ink` | `#0B0B0C` | Primary text, borders |
| `--ink-soft` | `#1A1A1C` | Slightly softened ink |
| `--lime` | `#C6FF3D` | **CTAs / logo notch / "savings found" only** |
| `--amber` | `#FF7A45` | **Wasted-spend figures only** |
| `--muted` | `#6B6B66` | Secondary text, labels |
| `--muted-2` | `#97978F` | Placeholder, de-emphasised |
| `--hair` | `rgba(11,11,12,0.12)` | Hairline borders |
| `--hair-strong` | `rgba(11,11,12,0.22)` | Stronger hairline borders |
| `--hair-w` | `0.5px` | Hairline border width |
| `--radius` | `12px` | Card border-radius |
| `--radius-sm` | `8px` | Small element radius |

All tokens are defined in `app/globals.css` `:root` and mapped to Tailwind utilities via `@theme inline`.

## Typography Rules

- **Sentence case everywhere** — never all-caps (eyebrow labels excepted: they are mono-spaced)
- **Geist Mono for every numeral** — money, token counts, durations, IDs, all code
- **No gradients, no shadows, no glow** — flat surfaces only
- **Paper grain overlay** — `<div class="grain">` fixed at z-9000, multiply blend

## Project Structure

```
app/
  layout.tsx          # Root layout: Geist fonts, Providers, Nav, Footer
  globals.css         # All design tokens + base styles (Tailwind v4 CSS config)
  page.tsx            # / — Landing page
  features/page.tsx   # /features
  integrations/page.tsx
  docs/page.tsx
  pricing/page.tsx

components/
  providers/
    Providers.tsx     # 'use client' — Lenis + GSAP ScrollTrigger wired together
  layout/
    Nav.tsx           # 'use client' — sticky nav, scroll detection, magnetic CTA
    Footer.tsx        # Server component
  ui/
    NotchLogo.tsx     # Notch-clipped square SVG mark
    ReceiptCard.tsx   # Per-session monospace paper receipt
    GapBar.tsx        # Horizontal spend bar with amber waste segment
    ReconciliationDiff.tsx  # Invoice / Attributed / Gap git-style diff
    SessionTicker.tsx # 'use client' — live telemetry feed with interval rows
    Reveal.tsx        # 'use client' — scroll-triggered clip-path wipe reveal
```

## Shared Component Props (quick ref)

### `<ReceiptCard>`
```tsx
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
```

### `<GapBar>`
```tsx
<GapBar invoicedLabel="$102,430 invoiced" wastedLabel="$29,710 wasted" usedPct={71} wastePct={29} />
```

### `<ReconciliationDiff>`
```tsx
<ReconciliationDiff invoiced="$34,000" attributed="$32,000" gap="$2,000" variant="dark" />
```

### `<SessionTicker>`
```tsx
<SessionTicker interval={2200} /> // interval in ms
```

### `<Reveal>`
```tsx
<Reveal as="section" className="my-custom-class">
  <h2>Content revealed on scroll</h2>
</Reveal>
```

## Motion Rules

- Lenis provides smooth inertia scroll (duration 1.1s)
- GSAP ScrollTrigger is synced via `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker`
- Magnetic buttons: `.magnetic` wrapper + `mousemove` translate, strength 0.32
- Diagonal clip-path reveal: `.reveal` → `.reveal.in` (triggered by `<Reveal>` component)
- **`prefers-reduced-motion`**: Lenis inertia disabled, all animations degraded to opacity fades, `.reveal` shows immediately

## Page Content Rule

Build page content **one page at a time** when the user sends the next prompt.  
The design HTML files in `claude-design/PlanckSpace/` are the specification for each page.
