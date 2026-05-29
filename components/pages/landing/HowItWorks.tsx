import { Reveal } from '@/components/ui/Reveal'
import { ReconciliationDiff } from '@/components/ui/ReconciliationDiff'

export function HowItWorks() {
  return (
    <section className="how" id="how">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="eyebrow">How it works</span>
          <h2>Three quiet inputs. One bill you can finally read.</h2>
          <p>
            Planckspace assembles a complete picture of spend without ever touching your source.
            Install in minutes; attribution starts on the next session.
          </p>
        </Reveal>

        <div className="how-grid">
          <Reveal className="how-step">
            <span className="step-n">01 — capture</span>
            <h3>Editor extension</h3>
            <p>
              A lightweight extension watches sessions across Claude Code, Cursor, Copilot
              &amp; Windsurf — prompts, tool calls, models, who ran what.
            </p>
            <div className="how-mono">
              <span className="c"># installs in</span> ~60s<br />
              <span className="c">tracks</span> session · model · repo
            </div>
          </Reveal>

          <Reveal className="how-step">
            <span className="step-n">02 — measure</span>
            <h3>Local log scraper</h3>
            <p>
              Token counts, re-reads and durations are tallied on-device into a local SQLite
              ledger. Costs are computed before anything leaves the machine.
            </p>
            <div className="how-mono">
              <span className="c"># on-device</span> SQLite<br />
              <span className="c">leaves machine →</span> metadata only
            </div>
          </Reveal>

          <Reveal className="how-step">
            <span className="step-n">03 — reconcile</span>
            <h3>Billing reconciliation</h3>
            <p>
              We match metered usage against each provider&apos;s invoice, attribute every
              dollar to a repo &amp; outcome, and surface the gap.
            </p>
            <div className="how-mono" style={{ padding: 0, background: 'transparent', border: 'none' }}>
              <ReconciliationDiff
                invoiced="$34,210"
                attributed="$32,180"
                gap="$2,030"
                variant="light"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
