'use client'

import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { flushSync } from 'react-dom'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { Reveal } from '@/components/ui/Reveal'

gsap.registerPlugin(Flip)

/* ============================================================
   DATA
   ============================================================ */

type Status   = 'live' | 'beta' | 'soon'
type Category = 'coding' | 'llm' | 'cicd' | 'hosts' | 'issues' | 'identity' | 'billing'

interface Integration {
  id:     string
  name:   string
  cat:    Category
  status: Status
  desc:   string
}

const INTEGRATIONS: Integration[] = [
  // Coding tools
  { id: 'claude-code',    name: 'Claude Code',     cat: 'coding',   status: 'live', desc: 'AI coding agent · Anthropic'        },
  { id: 'cursor',         name: 'Cursor',           cat: 'coding',   status: 'live', desc: 'AI-powered code editor'             },
  { id: 'windsurf',       name: 'Windsurf',         cat: 'coding',   status: 'live', desc: 'AI coding by Codeium'              },
  { id: 'antigravity',    name: 'Antigravity',      cat: 'coding',   status: 'live', desc: 'Autonomous coding agent'           },
  { id: 'copilot',        name: 'Copilot',          cat: 'coding',   status: 'soon', desc: 'GitHub AI assistant'               },
  { id: 'cline',          name: 'Cline',            cat: 'coding',   status: 'soon', desc: 'Open-source AI agent · VS Code'    },
  { id: 'aider',          name: 'Aider',            cat: 'coding',   status: 'soon', desc: 'AI pair programmer · CLI'          },
  { id: 'cody',           name: 'Cody',             cat: 'coding',   status: 'soon', desc: 'Sourcegraph AI coder'              },
  { id: 'continue',       name: 'Continue',         cat: 'coding',   status: 'soon', desc: 'Open-source AI dev assistant'      },
  { id: 'zed-ai',         name: 'Zed AI',           cat: 'coding',   status: 'soon', desc: 'Zed editor AI features'            },
  { id: 'jetbrains-ai',   name: 'JetBrains AI',     cat: 'coding',   status: 'soon', desc: 'JetBrains suite · AI Assistant'    },
  // LLM providers
  { id: 'anthropic',      name: 'Anthropic',        cat: 'llm',      status: 'live', desc: 'Claude API · billing export'       },
  { id: 'openai',         name: 'OpenAI',           cat: 'llm',      status: 'soon', desc: 'GPT API · billing export'          },
  { id: 'aws-bedrock',    name: 'AWS Bedrock',      cat: 'llm',      status: 'soon', desc: 'Multi-model AWS inference'         },
  { id: 'azure-openai',   name: 'Azure OpenAI',     cat: 'llm',      status: 'soon', desc: 'Azure-hosted GPT models'           },
  { id: 'google-vertex',  name: 'Google Vertex / Gemini', cat: 'llm', status: 'soon', desc: 'Google Cloud AI platform'        },
  { id: 'groq',           name: 'Groq',             cat: 'llm',      status: 'soon', desc: 'Fast inference API'                },
  { id: 'together',       name: 'Together',         cat: 'llm',      status: 'soon', desc: 'Open model inference'              },
  { id: 'fireworks',      name: 'Fireworks',        cat: 'llm',      status: 'soon', desc: 'Fast model serving platform'       },
  // CI-CD
  { id: 'gh-actions',     name: 'GitHub Actions',   cat: 'cicd',     status: 'soon', desc: 'GitHub CI/CD workflows'            },
  { id: 'gitlab-ci',      name: 'GitLab CI',        cat: 'cicd',     status: 'soon', desc: 'GitLab pipelines'                  },
  { id: 'circleci',       name: 'CircleCI',         cat: 'cicd',     status: 'soon', desc: 'Continuous integration & delivery' },
  { id: 'buildkite',      name: 'Buildkite',        cat: 'cicd',     status: 'soon', desc: 'Scalable build infrastructure'     },
  // Code hosts
  { id: 'github',         name: 'GitHub',           cat: 'hosts',    status: 'live', desc: 'Repo & PR attribution'             },
  { id: 'gitlab',         name: 'GitLab',           cat: 'hosts',    status: 'soon', desc: 'Self-hosted & SaaS'                },
  { id: 'bitbucket',      name: 'Bitbucket',        cat: 'hosts',    status: 'soon', desc: 'Atlassian code hosting'            },
  // Issue trackers
  { id: 'linear',         name: 'Linear',           cat: 'issues',   status: 'soon', desc: 'Issue & sprint tracking'           },
  { id: 'jira',           name: 'Jira',             cat: 'issues',   status: 'soon', desc: 'Atlassian project management'      },
  { id: 'gh-issues',      name: 'GitHub Issues',    cat: 'issues',   status: 'soon', desc: 'Native GitHub issue tracking'      },
  // Identity
  { id: 'okta',           name: 'Okta',             cat: 'identity', status: 'soon', desc: 'SSO · SAML · SCIM provisioning'    },
  { id: 'google-ws',      name: 'Google Workspace', cat: 'identity', status: 'soon', desc: 'Google SSO & directory'            },
  { id: 'azure-ad',       name: 'Azure AD',         cat: 'identity', status: 'soon', desc: 'Microsoft Entra ID'                },
  // Billing
  { id: 'b-anthropic',    name: 'Anthropic',        cat: 'billing',  status: 'soon', desc: 'Claude billing export'             },
  { id: 'b-openai',       name: 'OpenAI',           cat: 'billing',  status: 'soon', desc: 'OpenAI billing export'             },
  { id: 'b-aws',          name: 'AWS',              cat: 'billing',  status: 'soon', desc: 'AWS Cost Explorer integration'     },
  { id: 'b-gcp',          name: 'GCP',              cat: 'billing',  status: 'soon', desc: 'Google Cloud billing export'       },
]

const CATEGORIES: { id: string; label: string }[] = [
  { id: 'all',      label: 'All'            },
  { id: 'coding',   label: 'Coding tools'   },
  { id: 'llm',      label: 'LLM providers'  },
  { id: 'cicd',     label: 'CI / CD'        },
  { id: 'hosts',    label: 'Code hosts'     },
  { id: 'issues',   label: 'Issue trackers' },
  { id: 'identity', label: 'Identity'       },
  { id: 'billing',  label: 'Billing'        },
]

/* ============================================================
   SUB-COMPONENTS
   ============================================================ */

function StatusPill({ status }: { status: Status }) {
  const map = { live: 'Live', beta: 'Beta', soon: 'Soon' } as const
  return <span className={`pill ${status}`}>{map[status]}</span>
}

/* ============================================================
   MAIN CLIENT COMPONENT
   ============================================================ */

export function IntegrationsClient() {
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [requestVal,   setRequestVal]   = useState('')
  const [requested,    setRequested]    = useState(false)

  const heroRef      = useRef<HTMLElement>(null)
  const filterRef    = useRef<HTMLDivElement>(null)
  const gridRef      = useRef<HTMLDivElement>(null)
  const reqBtnRef    = useRef<HTMLButtonElement>(null)
  const reqWrapRef   = useRef<HTMLSpanElement>(null)
  const reducedRef   = useRef(false)

  /* ── reduced-motion check ── */
  useEffect(() => {
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  /* ── hero + filter bar entrance ── */
  useEffect(() => {
    if (reducedRef.current) return
    const hero   = heroRef.current
    const filter = filterRef.current
    if (!hero) return

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo(hero,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.9 }
    )
    if (filter) {
      tl.fromTo(filter,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.5'
      )
    }
  }, [])

  /* ── card stagger entrance ── */
  useEffect(() => {
    if (!gridRef.current || reducedRef.current) return

    const el = gridRef.current
    const allCards = Array.from(el.querySelectorAll<HTMLElement>('.intg-card'))
    const firedRef = { current: false }

    gsap.set(allCards, { opacity: 0, y: 18 })

    const animate = () => {
      if (firedRef.current) return
      firedRef.current = true
      const visible = allCards.filter(c => !c.classList.contains('hide'))
      gsap.to(visible, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: 'power2.out',
        stagger: { each: 0.035, grid: 'auto', from: 'start' },
      })
    }

    // Fire immediately if already in view (covers most page-load cases)
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
      animate()
      return
    }

    // Otherwise observe scroll into view
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { animate(); obs.disconnect() } },
      { threshold: 0.01 }
    )
    obs.observe(el)
    const onScroll = () => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
        animate()
        obs.disconnect()
        window.removeEventListener('scroll', onScroll)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { obs.disconnect(); window.removeEventListener('scroll', onScroll) }
  }, [])

  /* ── magnetic request button ── */
  useEffect(() => {
    if (reducedRef.current) return
    const wrap = reqWrapRef.current
    const btn  = reqBtnRef.current
    if (!wrap || !btn) return

    const strength = 0.32
    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect()
      btn.style.transform = `translate(${(e.clientX - (r.left + r.width  / 2)) * strength}px, ${(e.clientY - (r.top  + r.height / 2)) * strength}px)`
    }
    const onLeave = () => { btn.style.transform = 'translate(0,0)' }

    wrap.addEventListener('mousemove', onMove)
    wrap.addEventListener('mouseleave', onLeave)
    return () => {
      wrap.removeEventListener('mousemove', onMove)
      wrap.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  /* ── category counts (static) ── */
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: INTEGRATIONS.length }
    INTEGRATIONS.forEach(i => { c[i.cat] = (c[i.cat] ?? 0) + 1 })
    return c
  }, [])

  /* ── visible ids (drives hide class) ── */
  const visibleIds = useMemo(() => new Set(
    activeFilter === 'all'
      ? INTEGRATIONS.map(i => i.id)
      : INTEGRATIONS.filter(i => i.cat === activeFilter).map(i => i.id)
  ), [activeFilter])

  /* ── GSAP Flip filter animation ── */
  const handleFilter = useCallback((cat: string) => {
    if (!gridRef.current) { setActiveFilter(cat); return }

    if (reducedRef.current) { setActiveFilter(cat); return }

    const grid     = gridRef.current
    const allCards = Array.from(grid.querySelectorAll<HTMLElement>('.intg-card'))

    // Kill any in-flight animations so they don't conflict
    gsap.killTweensOf(allCards)

    // Capture positions BEFORE DOM update
    const state = Flip.getState(allCards)

    // Synchronously update DOM (hide/show cards via class)
    flushSync(() => setActiveFilter(cat))

    // Animate FROM captured state TO new positions
    Flip.from(state, {
      duration: 0.5,
      ease: 'power2.inOut',
      stagger: { each: 0.025, from: 'start' },
      absolute: true,   // keep leaving els positioned so layout reflows cleanly
      nested:   true,
      onLeave: (els: Element[]) =>
        gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.22, ease: 'power2.in' }),
      onEnter: (els: Element[]) =>
        gsap.fromTo(els,
          { opacity: 0, scale: 0.94, y: 10 },
          { opacity: 1, scale: 1,    y: 0,  duration: 0.35, ease: 'power2.out', stagger: 0.03 }
        ),
    })
  }, [])

  /* ── request form submit ── */
  const handleRequest = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!requestVal.trim()) return
    setRequested(true)
    setRequestVal('')
    setTimeout(() => setRequested(false), 3000)
  }, [requestVal])

  /* ============================================================
     RENDER
     ============================================================ */
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <header className="page-hero" ref={heroRef}>
        <div className="wrap">
          <span className="eyebrow">Integrations</span>
          <h1>
            Every AI coding tool. Every model.
            One bill you can actually read.
          </h1>
          <p className="lede">
            Planckspace sits across your whole AI development stack — coding tools,
            model providers, CI&nbsp;/&nbsp;CD, code hosts, issue trackers and identity —
            and reconciles all of it into a single attributed ledger.
          </p>
        </div>
      </header>

      {/* ── FILTER + GRID ─────────────────────────────────────── */}
      <section style={{ paddingBottom: 80 }}>
        <div className="wrap">

          {/* Filter bar */}
          <div
            className="filterbar"
            ref={filterRef}
            role="tablist"
            aria-label="Filter integrations by category"
          >
            {CATEGORIES.map(({ id, label }) => (
              <button
                key={id}
                className={`fchip${activeFilter === id ? ' active' : ''}`}
                role="tab"
                aria-selected={activeFilter === id}
                onClick={() => handleFilter(id)}
              >
                {label}
                <span className="ct">{counts[id] ?? 0}</span>
              </button>
            ))}
          </div>

          {/* Integration grid */}
          <div
            className="intg-grid"
            ref={gridRef}
            id="intgGrid"
            aria-label="Integration cards"
          >
            {INTEGRATIONS.map((intg) => (
              <div
                key={intg.id}
                className={`intg-card${visibleIds.has(intg.id) ? '' : ' hide'}`}
                data-cat={intg.cat}
                data-id={intg.id}
              >
                <div className="ic-top">
                  <div className="intg-logo" aria-hidden="true" />
                  <StatusPill status={intg.status} />
                </div>
                <h3>{intg.name}</h3>
                <span className="ic-cat">{intg.desc}</span>
              </div>
            ))}
          </div>

          {/* ── RECONCILIATION CALLOUT ──────────────────────── */}
          <Reveal className="split-grid" style={{ marginTop: 56 }}>
            <div className="split-col them">
              <span className="split-tag">// the reconciliation</span>
              <h3>Every invoice, matched to the work that caused it.</h3>
              <p>
                We pull each provider&apos;s billing export and match it line-by-line against
                on-device usage. What can&apos;t be attributed becomes a named, visible gap —
                not a rounding error you&apos;ll never find.
              </p>
            </div>
            <div className="split-col us">
              <span className="split-tag">▰ reconciled · acme inc · may 2026</span>
              <div className="recon" style={{ marginTop: 8 }}>
                <div className="rrow">
                  <span><span className="sign">&nbsp;</span>Provider invoices</span>
                  <span>$34,210</span>
                </div>
                <div className="rrow plus">
                  <span><span className="sign">+</span>Attributed to repos</span>
                  <span>$32,180</span>
                </div>
                <div className="rrow minus">
                  <span><span className="sign">−</span>Unexplained gap</span>
                  <span className="gapv">$2,030</span>
                </div>
              </div>
              <p style={{ color: 'rgba(247,245,240,0.55)', fontSize: 13, marginTop: 16, fontFamily: 'var(--font-mono)' }}>
                94% attributed · gap flagged for review
              </p>
            </div>
          </Reveal>

          {/* ── REQUEST AN INTEGRATION ──────────────────────── */}
          <Reveal className="req-box">
            <div>
              <h3>Don&apos;t see your tool?</h3>
              <p>
                Tell us what&apos;s in your stack — we ship new integrations weekly
                during early access.
              </p>
            </div>
            <form
              className="capture"
              style={{ margin: 0, maxWidth: 440 }}
              onSubmit={handleRequest}
              aria-label="Request an integration"
            >
              <input
                type="text"
                placeholder="e.g. Replit Agent, Tabnine…"
                aria-label="Request integration"
                value={requestVal}
                onChange={(e) => setRequestVal(e.target.value)}
                disabled={requested}
              />
              <span ref={reqWrapRef} className="magnetic">
                <button
                  ref={reqBtnRef}
                  className="btn btn-primary"
                  type="submit"
                  disabled={requested}
                  style={requested ? { background: '#5e7d00', borderColor: '#5e7d00' } : undefined}
                >
                  {requested ? '✓ Requested' : 'Request'}
                </button>
              </span>
            </form>
          </Reveal>

        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section className="final-cta" id="cta">
        <div className="wrap">
          <span className="eyebrow lime">Early access</span>
          <h2 className="reveal" style={{ animationDelay: '0.1s' }}>
            One ledger for every tool in your stack.
          </h2>
          <form
            className="capture"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Early access sign-up"
          >
            <input type="email" placeholder="you@company.com" aria-label="Work email" />
            <span className="magnetic">
              <button className="btn btn-primary" type="submit">
                Get early access
                <svg className="arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            </span>
          </form>
          <div className="privacy-line" style={{ justifyContent: 'center', marginTop: 22 }}>
            <svg viewBox="0 0 16 16" fill="none" style={{ width: 12, height: 12, flexShrink: 0 }} aria-hidden="true">
              <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.3" />
            </svg>
            Metadata only. We never see your code. Ever.
          </div>
        </div>
      </section>
    </>
  )
}
