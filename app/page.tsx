import type { Metadata } from 'next'
import { LandingClient } from '@/components/pages/LandingClient'

export const metadata: Metadata = {
  title: 'Planckspace — Spend visibility for AI coding tools',
  description:
    'The spend visibility and optimization layer for Claude Code, Cursor, Copilot & Windsurf. ' +
    'We tell you what your AI did, who used it, what shipped — and how to make it cheaper.',
}

export default function LandingPage() {
  return <LandingClient />
}
