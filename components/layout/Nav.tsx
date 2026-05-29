'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NotchLogo } from '@/components/ui/NotchLogo'

const NAV_LINKS = [
  // { label: 'Product',      href: '/#problem' },
  { label: 'Features', href: '/features' },
  { label: 'Integrations', href: '/integrations' },
  { label: 'Docs', href: '/docs' },
  { label: 'Pricing', href: '/pricing' },
]

const SCROLL_THRESHOLD = 24

export function Nav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const ctaBtnRef = useRef<HTMLAnchorElement>(null)
  const ctaWrapRef = useRef<HTMLSpanElement>(null)
  const rafRef = useRef<number>(0)

  /* ──────────────────────────────────────────────────────────
     Scroll detection via RAF poll — works with Lenis which
     drives scroll through gsap.ticker rather than firing
     native scroll events on every animation frame.
  ────────────────────────────────────────────────────────── */
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > SCROLL_THRESHOLD
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initialize state on mount

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* ── Magnetic CTA ── */
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const wrap = ctaWrapRef.current
    const btn = ctaBtnRef.current
    if (!wrap || !btn) return

    const strength = 0.32
    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect()
      btn.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * strength}px, ${(e.clientY - (r.top + r.height / 2)) * strength}px)`
    }
    const onLeave = () => { btn.style.transform = 'translate(0,0)' }

    wrap.addEventListener('mousemove', onMove)
    wrap.addEventListener('mouseleave', onLeave)
    return () => {
      wrap.removeEventListener('mousemove', onMove)
      wrap.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`} id="nav" aria-label="Main navigation">
      <Link href="/" className="brand">
        <NotchLogo size={22} variant="ink" />
        <span className="brand-name">planckspace</span>
      </Link>

      <div className="nav-links" role="list">
        {NAV_LINKS.map(({ label, href }) => {
          const isActive =
            href === '/' ? pathname === '/' : pathname.startsWith(href.replace('/#problem', ''))
          return (
            <Link
              key={href}
              href={href}
              role="listitem"
              aria-current={isActive ? 'page' : undefined}
            >
              {label}
            </Link>
          )
        })}
      </div>

      <div className="nav-right">
        <span ref={ctaWrapRef} className="magnetic">
          <Link ref={ctaBtnRef} href="/#cta" className="btn btn-primary">
            Get early access
          </Link>
        </span>
      </div>
    </nav>
  )
}
