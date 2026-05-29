import Link from 'next/link'
import { NotchLogo } from '@/components/ui/NotchLogo'

const PRODUCT_LINKS = [
  { label: 'Features',     href: '/features' },
  { label: 'Integrations', href: '/integrations' },
  { label: 'Pricing',      href: '/pricing' },
  { label: 'Docs',         href: '/docs' },
]
const COMPANY_LINKS = [
  { label: 'About',    href: '#' },
  { label: 'Security', href: '#' },
  { label: 'Privacy',  href: '#' },
]
const CONNECT_LINKS = [
  { label: 'hello@planckspace.io', href: 'mailto:hello@planckspace.io' },
  { label: 'GitHub',    href: '#' },
  { label: 'Changelog', href: '#' },
]

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <Link href="/" className="brand">
            <NotchLogo size={22} variant="lime" />
            <span className="brand-name">planckspace</span>
          </Link>

          <div className="footer-cols">
            <div className="footer-col">
              <h4>// product</h4>
              {PRODUCT_LINKS.map(({ label, href }) => (
                <Link key={label} href={href}>{label}</Link>
              ))}
            </div>
            <div className="footer-col">
              <h4>// company</h4>
              {COMPANY_LINKS.map(({ label, href }) => (
                <a key={label} href={href}>{label}</a>
              ))}
            </div>
            <div className="footer-col">
              <h4>// connect</h4>
              {CONNECT_LINKS.map(({ label, href }) => (
                <a key={label} href={href}>{label}</a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Planckspace, Inc.</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            We never see your code. Ever.
          </span>
          <span>The gap, surfaced.</span>
        </div>
      </div>
    </footer>
  )
}
