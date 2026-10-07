"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { projects, orgs, ledgerSummary, cfqDomains } from "../lib/data";
import { useTheme, AppHeader, AppFooter, OrgHoverCard } from "../components/chrome";

const SLOGANS = [
  { main: "Fund compute, not promises.", sub: "Patronage for open-source AI: money in → LLM compute credits out → every run publishes a public receipt. No investors, no returns, no equity — the community funds what it wants to see exist." },
];

const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

// prerender-safe: Date.now() is nondeterministic during static export (Next 16 law),
  // so days-left resolves after hydration; SSR/prerender shows "live" as placeholder.
function daysLeft(deadline: string | undefined): number | null {
  if (!deadline) return null;
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
}

function CardLink({ p, children }: { p: (typeof projects)[number]; children?: React.ReactNode }) {
  // HTML law: no <a> inside <a> (invalid; hydration killer). The card opens via a
  // stretched title-link + the article itself is NOT a link.
  return <article className="card">{children}</article>;
}

function Card({ p }: { p: (typeof projects)[number] }) {
  const pct = Math.min(100, Math.round((p.raised_usd / p.goal_usd) * 100));
  const sum = ledgerSummary(p);
  const org = orgs[p.org];
  const [dl, setDl] = useState<number | null>(null);
  useEffect(() => { setDl(daysLeft(p.deadline)); }, [p.deadline]);
  return (
    <CardLink p={p}>
      <div className="tags">
        {p.tags.map(t => <span key={t} className={`tag${t === "LIVE" || t === "QOTM" ? " live" : ""}`}>{t}</span>)}
      </div>
      <h2><Link href={`/project/${p.slug}`} className="cardlink">{p.name}</Link></h2>
      <p className="one">{p.one}</p>
      <div className="prog" aria-label={`${p.name} funding progress`}>
        <div className="row">
          <span>{money(p.raised_usd)} / {money(p.goal_usd)}</span>
          <span className="pct">{pct}%</span>
        </div>
        <div className="bar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}><i style={{ ["--pct" as string]: `${pct}%` }} /></div>
        <div className="row meta"><span>{dl === null ? "live" : dl > 0 ? `${dl} days left` : "ended"} • {p.location}</span></div>
      </div>
      <div className="tiers">{p.tiers.map(t => <button key={t} className="tier" type="button" tabIndex={-1}>fund ${t}</button>)}</div>
      {org && (
        <OrgHoverCard orgSlug={p.org}>
          <span className="orgmini"><span className="popavatar sm">{org.avatar}</span> {org.name}</span>
        </OrgHoverCard>
      )}
      <div className="receipts">
        <div className="rh"><span>COMPUTE RECEIPTS</span><span>LAST {p.receipts.length} RUNS</span></div>
        <ul>
          {p.receipts.slice().reverse().map(r => (
            <li key={r.id}>
              <span>{r.ts.slice(11, 19)}</span><span>{r.model}</span>
              <span className="cost">-${r.cost_usd.toFixed(4)}</span>
              <span className="ok">{r.outcome === "success" ? "✓" : "✗"}</span>
            </li>
          ))}
        </ul>
        <p className="receipt-note">{sum.runs} runs · ${sum.cost_usd.toFixed(4)} — demo ledger (no personal data)</p>
      </div>
    </CardLink>
  );
}

export default function Home() {
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const featured = projects.find(p => p.tags.includes("QOTM")) ?? projects[0];
  const rest = projects.filter(p => p.slug !== featured.slug);
  const totalRaised = projects.reduce((a, p) => a + p.raised_usd, 0);
  const pct = Math.min(100, Math.round((featured.raised_usd / featured.goal_usd) * 100));
  const [fdays, setFdays] = useState<number | null>(null);
  useEffect(() => { setFdays(daysLeft(featured.deadline)); }, [featured.deadline]);
  return (
    <>
      <AppHeader theme={theme} toggle={toggle} />

      <main className="wrap">
        <section className="hero center">
          <h1><span className="hl">Fund compute,</span> not promises.</h1>
          <p className="sub center">{SLOGANS[0].sub}</p>
        </section>

        {/* question of the month — featured 2-col */}
        <section className="feat" aria-label="question of the month">
          <Link href={`/project/${featured.slug}`} className="featart" aria-label={`open ${featured.name}`}>
            <div className="featframe">
              <span className="featsig">{orgs[featured.org].avatar}</span>
              <p className="featslogan">QUESTION OF THE MONTH</p>
              <p className="featq">{featured.cfq_question}</p>
            </div>
            <div className="featbar"><i style={{ ["--pct" as string]: `${pct}%` }} /></div>
            <span className="chip">almost funded</span>
          </Link>
          <div className="featmeta">
            <small className="catline">FEATURED · CFQ-{featured.cfq_id.split("-")[1]}-{featured.cfq_id.split("-")[2]}</small>
            <Link className="orgline" href={`/org/${featured.org}`}>
              <span className="popavatar">{orgs[featured.org].avatar}</span> {orgs[featured.org].name}
            </Link>
            <div className="pmeta">{mounted ? (fdays !== null && fdays > 0 ? `${fdays} days left` : "ended —") : "—"} • {pct}% funded</div>
            <p className="one">{featured.one}</p>
            <div className="tagchips">
              {featured.tags.slice(0, 2).map(t => <span key={t} className="tag">{t}</span>)}
              <span className="tag">{featured.location}</span>
            </div>
          </div>
        </section>

        {/* recommended strip */}
        <section className="rowhead"><h2>Live seed projects</h2><Link className="catlink strong" href="/discover">discover more →</Link></section>
        <section className="grid" aria-label="projects">
          {rest.map(p => <Card key={p.slug} p={p} />)}
          <Card p={featured} />
        </section>

        {/* for creators — guide cards */}
        <section className="rowhead"><h2>For creators</h2></section>
        <section className="guides">
          <Link href="/guide#cfq" className="guide">
            <div className="guideart ga1">◆</div>
            <div className="guidebody">
              <h3>How Compute Funding works</h3>
              <p>Every experiment starts with the same question: how will the compute be paid for? Name the data, the method, and the failure. Read the CFQ standard.</p>
              <span className="readguide">Read the guide →</span>
            </div>
          </Link>
          <Link href="/guide#receipts" className="guide">
            <div className="guideart ga2">▤</div>
            <div className="guidebody">
              <h3>What patrons see: the receipts</h3>
              <p>Money in, compute out, every run receipted in public — including the rejection trail. Overclaiming is structurally difficult here.</p>
              <span className="readguide">Read the guide →</span>
            </div>
          </Link>
        </section>

        <footer className="bottom big">
          <div className="footrow">
            <span>A <b>CommonWeave Labs</b> project — fund the compute, see the receipts. · {money(totalRaised)} raised across the seed projects</span>
            <nav className="socials" aria-label="social links">
              <a href="https://x.com/Commonweavelabs" target="_blank" rel="noopener noreferrer">X</a>
              <a href="https://www.youtube.com/@CommonweaveLabs" target="_blank" rel="noopener noreferrer">YouTube</a>
              <a href="https://github.com/commonweavelabs-crypto" target="_blank" rel="noopener noreferrer">GitHub</a>
            </nav>
          </div>
        </footer>
        <div className="endmark" aria-hidden="true">COMPUTE&nbsp;FUND</div>
      </main>
    </>
  );
}
