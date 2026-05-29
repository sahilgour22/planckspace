'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

/* ─────────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────────── */

const CODE_CMD = 'npx planckspace init'

const NAV_GROUPS = [
  {
    label: '// getting started',
    defaultOpen: true,
    items: [
      { label: 'Overview',   href: '#top' },
      { label: 'Install',    href: '#install' },
      { label: 'Quickstart', href: '#quickstart' },
    ],
  },
  {
    label: '// architecture',
    defaultOpen: true,
    items: [
      { label: 'Data flow',      href: '#architecture' },
      { label: 'Local storage',  href: '#architecture' },
    ],
  },
  {
    label: '// workspaces & privacy',
    defaultOpen: true,
    items: [
      { label: 'Privacy model',   href: '#privacy' },
      { label: 'Workspace types', href: '#privacy' },
    ],
  },
  {
    label: '// integrations',
    defaultOpen: false,
    items: [
      { label: 'Claude Code', href: '#' },
      { label: 'Cursor',      href: '#' },
      { label: 'Copilot',     href: '#' },
      { label: 'Windsurf',    href: '#' },
    ],
  },
  {
    label: '// cli reference',
    defaultOpen: false,
    items: [
      { label: 'Commands',       href: '#' },
      { label: 'Config file',    href: '#' },
      { label: 'API & webhooks', href: '#' },
      { label: 'Self-hosting',   href: '#' },
    ],
  },
  {
    label: '// faq',
    defaultOpen: false,
    items: [
      { label: 'Common questions', href: '#' },
    ],
  },
]

const QS_CARDS = [
  {
    title: 'Install the extension',
    desc:  'Run npx planckspace init and follow prompts to detect your AI coding tools.',
    href:  '#install',
  },
  {
    title: 'Run the log scraper',
    desc:  'The scraper reads local editor logs and builds a full session ledger on your machine.',
    href:  '#quickstart',
  },
  {
    title: 'Connect billing for reconciliation',
    desc:  'Add a read-only billing export key so we can reconcile invoices against usage.',
    href:  '#',
  },
]

const WORKSPACE_TYPES = [
  {
    tag:   '// personal',
    title: 'Personal',
    desc:  'Solo developer workspace. All data stays local. No cloud sync required. Zero setup.',
  },
  {
    tag:   '// collaborative',
    title: 'Collaborative',
    desc:  'Team workspace with repo attribution, SSO, and spend roll-ups by contributor and project.',
  },
  {
    tag:   '// education',
    title: 'Education',
    desc:  'Institution-wide visibility with anonymized student usage, budget guardrails and caps.',
  },
]

const POPULAR_GUIDES = [
  'How billing reconciliation works',
  'Setting up workspace attribution',
  'Understanding the privacy model',
  'Model routing and cost optimization',
  'Configuring team SSO',
  'Reading your first reconciled bill',
  'CLI command reference',
  'Self-hosting guide',
]

const CMDK_ITEMS = [
  { label: 'Overview — Get started in under 3 minutes', href: '#top',          cat: 'getting started' },
  { label: 'Install — npx planckspace init',            href: '#install',      cat: 'getting started' },
  { label: 'Quickstart — Three steps to your first bill', href: '#quickstart', cat: 'getting started' },
  { label: 'Architecture — Data flow and local storage', href: '#architecture', cat: 'architecture' },
  { label: 'Privacy model — What leaves your machine',  href: '#privacy',      cat: 'privacy' },
  { label: 'Workspace types — Personal, Collaborative, Education', href: '#privacy', cat: 'privacy' },
  { label: 'Popular guides — Index of all guides',      href: '#guides',       cat: 'guides' },
]

/* ─────────────────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────────────────── */

function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flex: 'none', color: 'var(--muted)' }}>
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden="true"
      style={{
        transition: 'transform 0.2s cubic-bezier(0.16,1,0.3,1)',
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
      }}
    >
      <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ArchArrow({ drawn, delay = 0, vertical = false }: { drawn: boolean; delay?: number; vertical?: boolean }) {
  const transition = (extra = 0) =>
    `stroke-dashoffset 0.65s cubic-bezier(0.16,1,0.3,1) ${delay + extra}ms`

  if (vertical) {
    return (
      <svg width="16" height="24" viewBox="0 0 16 24" fill="none" aria-hidden="true">
        <line
          x1="8" y1="2" x2="8" y2="19"
          stroke="var(--muted-2)"
          strokeWidth="1.2"
          strokeDasharray="17"
          strokeDashoffset={drawn ? 0 : 17}
          style={{ transition: transition() }}
        />
        <polyline
          points="3,13 8,21 13,13"
          fill="none"
          stroke="var(--muted-2)"
          strokeWidth="1.2"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray="15"
          strokeDashoffset={drawn ? 0 : 15}
          style={{ transition: transition(250) }}
        />
      </svg>
    )
  }

  return (
    <svg width="24" height="16" viewBox="0 0 24 16" fill="none" aria-hidden="true">
      <line
        x1="2" y1="8" x2="18" y2="8"
        stroke="var(--muted-2)"
        strokeWidth="1.2"
        strokeDasharray="16"
        strokeDashoffset={drawn ? 0 : 16}
        style={{ transition: transition() }}
      />
      <polyline
        points="11,3 19,8 11,13"
        fill="none"
        stroke="var(--muted-2)"
        strokeWidth="1.2"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeDasharray="14"
        strokeDashoffset={drawn ? 0 : 14}
        style={{ transition: transition(250) }}
      />
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────────── */

export function DocsClient() {
  /* state */
  const [cmdkOpen, setCmdkOpen]         = useState(false)
  const [cmdkQuery, setCmdkQuery]       = useState('')
  const [copied, setCopied]             = useState(false)
  const [codeDisplayed, setCodeDisplayed] = useState('')
  const [codeStarted, setCodeStarted]   = useState(false)
  const [archDrawn, setArchDrawn]       = useState(false)

  /* which nav groups are open */
  const [openGroups, setOpenGroups] = useState<Set<number>>(
    () => new Set(NAV_GROUPS.map((g, i) => (g.defaultOpen ? i : -1)).filter(i => i !== -1))
  )

  /* refs */
  const cmdkInputRef   = useRef<HTMLInputElement>(null)
  const codeBlockRef   = useRef<HTMLDivElement>(null)
  const archRef        = useRef<HTMLDivElement>(null)
  const pageRef        = useRef<HTMLDivElement>(null)

  /* ── ⌘K keyboard shortcut ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCmdkOpen(v => !v)
      }
      if (e.key === 'Escape') setCmdkOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  /* ── Focus input + body scroll lock when cmdk opens ── */
  useEffect(() => {
    if (cmdkOpen) {
      document.body.style.overflow = 'hidden'
      /* slight delay so the animation runs before focus */
      const t = setTimeout(() => cmdkInputRef.current?.focus(), 60)
      return () => clearTimeout(t)
    } else {
      document.body.style.overflow = ''
      setCmdkQuery('')
    }
    return () => { document.body.style.overflow = '' }
  }, [cmdkOpen])

  /* ── Typewriter: observe code block entering viewport ── */
  useEffect(() => {
    const el = codeBlockRef.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) { setCodeDisplayed(CODE_CMD); return }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setCodeStarted(true)
        observer.disconnect()
      }
    }, { threshold: 0.6 })

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  /* ── Typewriter: character-by-character effect ── */
  useEffect(() => {
    if (!codeStarted) return
    let i = 0
    const id = setInterval(() => {
      setCodeDisplayed(CODE_CMD.slice(0, i + 1))
      i++
      if (i >= CODE_CMD.length) clearInterval(id)
    }, 62)
    return () => clearInterval(id)
  }, [codeStarted])

  /* ── Architecture arrows: observe diagram entering viewport ── */
  useEffect(() => {
    const el = archRef.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) { setArchDrawn(true); return }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => setArchDrawn(true), 80)
        observer.disconnect()
      }
    }, { threshold: 0.25 })

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  /* ── Copy to clipboard ── */
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(CODE_CMD)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch { /* ignore — clipboard may be unavailable */ }
  }, [])

  /* ── Toggle nav group ── */
  const toggleGroup = (idx: number) => {
    setOpenGroups(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  /* ── Filtered cmdk results ── */
  const filteredCmdk = CMDK_ITEMS.filter(item =>
    cmdkQuery === '' ||
    item.label.toLowerCase().includes(cmdkQuery.toLowerCase()) ||
    item.cat.toLowerCase().includes(cmdkQuery.toLowerCase())
  )

  /* ── Detect mobile (for arrow orientation) ── */
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)')
    setIsMobile(mq.matches)
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', listener)
    return () => mq.removeEventListener('change', listener)
  }, [])

  /* ══════════════════════════════════════════════════════════
     Render
  ══════════════════════════════════════════════════════════ */

  return (
    <div className="docs-page" ref={pageRef} id="top">

      {/* ── 2-column shell ── */}
      <div className="docs-shell">

        {/* ══ Sidebar ══ */}
        <aside className="docs-side" aria-label="Docs sidebar">

          {/* Search / ⌘K trigger */}
          <button
            className="docs-search"
            onClick={() => setCmdkOpen(true)}
            aria-label="Search documentation (⌘K)"
          >
            <SearchIcon />
            <span>Search docs</span>
            <span className="kbd">⌘K</span>
          </button>

          {/* Collapsible nav groups */}
          <nav aria-label="Documentation navigation">
            {NAV_GROUPS.map((group, idx) => {
              const isOpen = openGroups.has(idx)
              return (
                <div key={idx} className="docs-nav-group">
                  <button
                    className="docs-nav-group-btn"
                    onClick={() => toggleGroup(idx)}
                    aria-expanded={isOpen}
                    aria-controls={`nav-group-${idx}`}
                  >
                    <h4>{group.label}</h4>
                    <span style={{ color: 'var(--muted-2)', display: 'flex', alignItems: 'center' }}>
                      <ChevronIcon open={isOpen} />
                    </span>
                  </button>
                  <div
                    id={`nav-group-${idx}`}
                    className={`docs-nav-items${isOpen ? ' open' : ''}`}
                  >
                    {group.items.map(item => (
                      <a key={item.label} href={item.href}>
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              )
            })}
          </nav>
        </aside>

        {/* ══ Main doc content ══ */}
        <article className="docs-main">

          {/* ── Hero heading ── */}
          <h1>Get started in under 3&nbsp;minutes.</h1>
          <p className="lede">
            Spend visibility for AI coding tools. Install once, and every session across
            Claude Code, Cursor, Copilot and Windsurf is measured, attributed and reconciled —
            without your code ever leaving your machine.
          </p>

          {/* ── Install ── */}
          <hr className="docs-section-divider" id="install" style={{ marginTop: 52 }} />
          <h2>Install</h2>
          <p>
            One line gets you running. The CLI installs the editor extension and local scraper,
            then starts a local ledger on your next session.
          </p>

          {/* Dark code block with typewriter */}
          <div className="docs-codeblock" ref={codeBlockRef}>
            <span className="cmd" aria-label={`Command: ${CODE_CMD}`}>
              <span className="prompt">$</span>
              <span className="cmd-text">{codeDisplayed}</span>
              {codeDisplayed.length < CODE_CMD.length && codeStarted && (
                <span className="docs-cursor" aria-hidden="true" />
              )}
              {!codeStarted && (
                <span className="docs-cursor" aria-hidden="true" />
              )}
            </span>
            <button
              className={`docs-copy-btn${copied ? ' copied' : ''}`}
              onClick={handleCopy}
              aria-label={copied ? 'Copied!' : 'Copy command to clipboard'}
            >
              {copied ? 'copied ✓' : 'copy'}
            </button>
          </div>
          <p className="docs-caption">
            Auto-detects Claude Code, Cursor, and your local logs. 30–90 days of history appears instantly.
          </p>

          {/* ── Quickstart ── */}
          <hr className="docs-section-divider" id="quickstart" style={{ marginTop: 52 }} />
          <h2>Quickstart</h2>
          <p>Three steps from zero to your first reconciled bill.</p>

          <div className="qs-grid" role="list">
            {QS_CARDS.map((card, i) => (
              <a key={i} href={card.href} className="qs-card" role="listitem">
                <span className="qs-n">0{i + 1}</span>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </a>
            ))}
          </div>

          {/* ── Architecture ── */}
          <hr className="docs-section-divider" id="architecture" style={{ marginTop: 52 }} />
          <h2>Architecture</h2>
          <p>
            Planckspace is privacy-first by design. Capture and measurement happen on-device;
            only aggregate metadata ever reaches the cloud.
          </p>

          {/* 3-box flow diagram with animated SVG arrows */}
          <div className="arch-flow" ref={archRef} aria-label="Architecture diagram: Extension and Scraper sends to Local SQLite, which sends metadata to Cloud">
            <div className="arch-box">
              <span className="ab-tag">// on-device</span>
              <h4>Extension + Scraper</h4>
              <p>
                Watches sessions across your AI coding tools — prompts, models,
                tool calls, durations. Runs entirely on your machine.
              </p>
            </div>

            <div className="arch-sep" aria-hidden="true">
              <ArchArrow drawn={archDrawn} delay={0} vertical={isMobile} />
            </div>

            <div className="arch-box">
              <span className="ab-tag">// on-device</span>
              <h4>Local SQLite</h4>
              <p>
                Token counts and costs computed and stored locally.
                Full session data stays on your machine. Your data, your control.
              </p>
            </div>

            <div className="arch-sep" aria-hidden="true">
              <ArchArrow drawn={archDrawn} delay={300} vertical={isMobile} />
            </div>

            <div className="arch-box cloud">
              <span className="ab-tag">▰ cloud</span>
              <h4>Metadata only</h4>
              <p>
                Costs, counts and outcomes sync for attribution &amp; reconciliation.
                Never code, never prompts, never source.
              </p>
            </div>
          </div>
          <p className="arch-note">// nothing crosses the line into the cloud except numbers</p>

          {/* ── Privacy ── */}
          <hr className="docs-section-divider" id="privacy" style={{ marginTop: 52 }} />
          <h2>Privacy model</h2>
          <p>
            The privacy guarantee is architectural, not a policy you have to trust.
            The scraper computes token counts and durations locally and emits only aggregate metadata.
            There is no code path that transmits source, prompt content, or repository contents
            off your machine.
          </p>

          <p style={{ marginTop: 16 }}>
            Repo names are hashed by default. You choose whether to map hashes to names
            in your own workspace. The workspace policy model lets you express data-sharing
            boundaries per team or project.
          </p>

          {/* Workspace policy cards */}
          <div className="workspace-grid" role="list">
            {WORKSPACE_TYPES.map((ws, i) => (
              <div key={i} className="ws-card" role="listitem">
                <span className="ws-tag">{ws.tag}</span>
                <h4>{ws.title}</h4>
                <p>{ws.desc}</p>
              </div>
            ))}
          </div>

          {/* ── Popular guides ── */}
          <hr className="docs-section-divider" id="guides" style={{ marginTop: 52 }} />
          <h2>Popular guides</h2>

          <div className="guides-list" role="list">
            {POPULAR_GUIDES.map((guide, i) => (
              <a key={i} href="#" role="listitem">
                <span>{guide}</span>
                <span className="guide-arr" aria-hidden="true">→</span>
              </a>
            ))}
          </div>

        </article>
      </div>

      {/* ══ ⌘K Command palette overlay ══
          position:absolute inside position:relative .docs-page.
          Body overflow:hidden when open — so this covers the exact viewport.
          Never position:fixed. ── */}
      {cmdkOpen && (
        <div
          className="cmdk-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Search documentation"
          onClick={() => setCmdkOpen(false)}
        >
          <div
            className="cmdk-box"
            onClick={e => e.stopPropagation()}
            role="search"
          >
            {/* Input row */}
            <div className="cmdk-header">
              <SearchIcon />
              <input
                ref={cmdkInputRef}
                type="text"
                placeholder="Search docs…"
                value={cmdkQuery}
                onChange={e => setCmdkQuery(e.target.value)}
                aria-label="Search docs"
                autoComplete="off"
                spellCheck={false}
              />
              <span className="cmdk-esc">esc</span>
            </div>

            {/* Results */}
            <div className="cmdk-results" role="listbox" aria-label="Search results">
              {filteredCmdk.length === 0 ? (
                <div className="cmdk-empty">
                  No results for &ldquo;{cmdkQuery}&rdquo;
                </div>
              ) : (
                filteredCmdk.map(item => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="cmdk-result"
                    role="option"
                    aria-selected={false}
                    onClick={() => setCmdkOpen(false)}
                  >
                    <span className="cmdk-result-icon" aria-hidden="true" />
                    <span>{item.label}</span>
                    <span className="r-cat">{item.cat}</span>
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
