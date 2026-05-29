import type { Metadata } from 'next'
import { IntegrationsClient } from '@/components/pages/IntegrationsClient'

export const metadata: Metadata = {
  title: 'Integrations — Planckspace',
  description:
    'Every AI coding tool. Every model. One bill you can actually read. ' +
    'Planckspace integrates with Claude Code, Cursor, Copilot, Windsurf, and every provider in your stack.',
}

export default function IntegrationsPage() {
  return <IntegrationsClient />
}
