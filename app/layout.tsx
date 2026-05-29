import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers/Providers'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'Planckspace — Spend visibility for AI coding tools',
  description:
    'The spend visibility and optimization layer for Claude Code, Cursor, Copilot & Windsurf. ' +
    'We tell you what your AI did, who used it, what shipped — and how to make it cheaper.',
  keywords: ['AI coding', 'FinOps', 'Claude Code', 'Cursor', 'Copilot', 'spend visibility'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        {/* Paper grain overlay — decorative */}
        <div className="grain" aria-hidden="true" />

        <Providers>
          <Nav />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
