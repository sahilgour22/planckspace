'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NotchLogo } from '@/components/ui/NotchLogo'

const NAV_LINKS = [
  { label: 'Features',     href: '/features'     },
  { label: 'Integrations', href: '/integrations' },
  { label: 'Docs',         href: '/docs'         },
  { label: 'Pricing',      href: '/pricing'      },
]

const SCROLL_THRESHOLD = 24

export function Nav() {
  const pathname   = usePathname()
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [mounted,   setMounted]   = useState(false)

  const ctaBtnRef  = useRef<HTMLAnchorElement>(null)
  const ctaWrapRef = useRef<HTMLSpanElement>(null)

  /* ── scroll detection ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── client-only mount flag (prevents SSR flash of mob-menu) ── */
  useEffect(() => { setMounted(true) }, [])

  /* ── lock body scroll when menu open ── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  /* ── close menu on route change ── */
  useEffect(() => { setMenuOpen(false) }, [pathname])

  /* ── magnetic CTA ── */
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const wrap = ctaWrapRef.current
    const btn  = ctaBtnRef.current
    if (!wrap || !btn) return
    const S = 0.32
    const onMove  = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect()
      btn.style.transform = `translate(${(e.clientX-(r.left+r.width/2))*S}px,${(e.clientY-(r.top+r.height/2))*S}px)`
    }
    const onLeave = () => { btn.style.transform = 'translate(0,0)' }
    wrap.addEventListener('mousemove',  onMove)
    wrap.addEventListener('mouseleave', onLeave)
    return () => {
      wrap.removeEventListener('mousemove',  onMove)
      wrap.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  const toggleMenu = useCallback(() => setMenuOpen(v => !v), [])

  return (
    <>
      <nav
        className={`nav${scrolled ? ' scrolled' : ''}${menuOpen ? ' menu-open' : ''}`}
        id="nav"
        aria-label="Main navigation"
      >
        <Link href="/" className="brand">
          <NotchLogo size={22} variant={menuOpen ? 'lime' : 'ink'} />
          <span className="brand-name"
            style={menuOpen ? { color: 'var(--paper)' } : undefined}
          >
            planckspace
          </span>
        </Link>

        {/* Desktop links */}
        <div className="nav-links" role="list">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
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
          {/* Desktop CTA — hidden on mobile */}
          <span ref={ctaWrapRef} className="magnetic nav-cta-wrap">
            <Link ref={ctaBtnRef} href="/#cta" className="btn btn-primary">
              Get early access
            </Link>
          </span>

          {/* Hamburger — visible on mobile */}
          <button
            className={`nav-hamburger${menuOpen ? ' open' : ''}`}
            onClick={toggleMenu}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mob-menu"
          >
            <span className="hb-line" />
            <span className="hb-line" />
            <span className="hb-line" />
          </button>
        </div>
      </nav>

      {/* ── MOBILE MENU OVERLAY — client-only to prevent SSR flash ── */}
      {mounted && (
      <div
        id="mob-menu"
        className={`mob-menu${menuOpen ? ' open' : ''}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-label="Navigation menu"
      >
        <div className="mob-menu-inner">
          {/* Big nav links */}
          <nav className="mob-nav" role="list">
            {NAV_LINKS.map(({ label, href }, i) => {
              const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  role="listitem"
                  className={`mob-link${isActive ? ' active' : ''}`}
                  style={{ transitionDelay: menuOpen ? `${50 + i * 55}ms` : '0ms' }}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="mob-link-n">0{i + 1}</span>
                  {label}
                  <span className="mob-link-arr" aria-hidden="true">→</span>
                </Link>
              )
            })}
          </nav>

          {/* CTA */}
          <div
            className="mob-cta"
            style={{ transitionDelay: menuOpen ? '280ms' : '0ms' }}
          >
            <Link
              href="/#cta"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: '14px 20px' }}
              onClick={() => setMenuOpen(false)}
            >
              Get early access
              <svg className="arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {/* Footer line */}
          <p
            className="mob-footer-line"
            style={{ transitionDelay: menuOpen ? '330ms' : '0ms' }}
          >
            No code transmitted · Architecture, not policy.
          </p>
        </div>
      </div>
      )}
    </>
  )
}
