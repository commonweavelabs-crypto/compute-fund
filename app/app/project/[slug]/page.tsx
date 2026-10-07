"use client";
// Project page (v1.5): hero, CFQ panel, roadmap, funding, receipts, org record
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { projects, orgs, ledgerSummary, type Project, type Org } from "../../../lib/data";

function daysLeft(deadline: string) {
  const d = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
  return d;
}

function ProjectPageInner() {
  const { slug } = useParams<{ slug: string }>();
    const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const id = requestAnimationFrame(() => document.documentElement.setAttribute("data-theme", theme));
    return () => cancelAnimationFrame(id);
  }, [theme]);
  const p = projects.find(x => x.slug === slug);
  if (!p) return (
    <main className="wrap" style={{ padding: "80px 20px" }}>
      <h1 className="nf">No such project (yet).</h1>
      <p className="onedim"><Link href="/" style={{ color: "var(--accent)" }}>← back to the grid</Link> · it may be planned, not live.</p>
    </main>
  );
  const org = orgs[p.org];
  const pct = Math.min(100, Math.round((p.raised_usd / p.goal_usd) * 100));
  const [dl, setDl] = useState<number | null>(null);
  useEffect(() => { setDl(daysLeft(p.deadline)); }, [p.deadline]);
  const sum = ledgerSummary(p);
  const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  return (
    <>
      <header className="top">
        <div className="wrap inner">
          <Link href="/" className="brand"><span className="sig">▚</span><b>COMPUTE&nbsp;FUND</b></Link>
          <span className="badge-none">investors: none</span>
          <button className="theme-toggle" type="button" onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}>
            {theme === "dark" ? "☾ terminal" : "☀ ledger"} — switch
          </button>
        </div>
      </header>

      <main className="wrap">
        {/* hero */}
        <section className="phero">
          <div className="phero-art" aria-hidden="true">
            <span className="phero-sig">{org.avatar}</span>
          </div>
          <div className="phero-meta">
            <div className="tags">
              {p.tags.map(t => <span key={t} className={`tag${t === "LIVE" ? " live" : ""}`}>{t}</span>)}
              <span className="tag">{p.location}</span>
            </div>
            <h1>{p.name}</h1>
            <div className="pmeta">{mounted ? (dl !== null && dl > 0 ? `${dl} days left` : "ended") : "—"} • {pct}% funded</div>
            <div className="prog">
              <div className="row"><span>{money(p.raised_usd)} / {money(p.goal_usd)}</span><span className="pct">{pct}%</span></div>
              <div className="bar"><i style={{ ["--pct" as string]: `${pct}%` }} /></div>
            </div>
            <div className="tiers">
              {p.tiers.map(t => <button key={t} className="tier" type="button">fund ${t}</button>)}
            </div>
          </div>
        </section>

        {/* org row — hover card */}
        <section className="orgrow">
          <span className="orgby">by</span>
          <OrgChip org={org} />
        </section>

        {/* the QUESTION */}
        <section className="cfq">
          <div className="cfqhead"><span className="cfqid">{p.cfq_id}</span><span>THE QUESTION (deterministic, falsifiable)</span></div>
          <p className="cfqq">{p.cfq_question}</p>
          <p className="cfqf"><b>falsified-by:</b> {p.cfq_falsified_by}</p>
        </section>

        {/* story + roadmap two-col */}
        <section className="twocol">
          <div className="col">
            <h2>The work</h2>
            <p className="story">{p.story}</p>
          </div>
          <div className="col">
            <h2>Roadmap</h2>
            <ul className="prmap">
              {p.roadmap.map(r => (
                <li key={r.title} className={r.state}>
                  <span className="dot" /> {r.title}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* receipts */}
        <section className="receipts full">
          <div className="rh"><span>COMPUTE RECEIPTS</span><span>{sum.runs} RUNS</span></div>
          <ul>
            {p.receipts.slice().reverse().map(r => (
              <li key={r.id}>
                <span>{r.ts}</span><span>{r.model}</span><span>{r.kind}</span>
                <span>{r.tokens_in.toLocaleString()} in / {r.tokens_out.toLocaleString()} out</span>
                <span className="cost">-${r.cost_usd.toFixed(4)}</span>
                <span className="ok">{r.outcome === "success" ? "✓" : "✗"}</span>
              </li>
            ))}
          </ul>
          <p className="receipt-note">
            demo ledger — same schema the production gateway will write (model, tokens, cost, CFQ id). No personal data. Unspent credits return to the fund.
          </p>
        </section>
      </main>

      <footer className="bottom big">
        <div className="footrow">
          <span>A <b>CommonWeave Labs</b> project — fund the compute, see the receipts.</span>
          <nav className="socials">
            <a href="https://x.com/Commonweavelabs" target="_blank" rel="noopener noreferrer">X</a>
            <a href="https://www.youtube.com/@CommonweaveLabs" target="_blank" rel="noopener noreferrer">YouTube</a>
            <a href="https://github.com/commonweavelabs-crypto" target="_blank" rel="noopener noreferrer">GitHub</a>
          </nav>
        </div>
      </footer>
    </>
  );
}

function OrgChip({ org }: { org?: Org }) {
  const [open, setOpen] = useState(false);
  if (!org) return null;
  return (
    <span className="orgwrap" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}>
      <button className="orgchip" onClick={() => setOpen(o => !o)} aria-haspopup="dialog" aria-expanded={open}>
        <span className="popavatar">{org.avatar}</span> {org.name}
      </button>
      {open && (
        <div className="popup" role="dialog" aria-label={`${org.name} record`}>
          <div className="pophead">
            <span className="popavatar">{org.avatar}</span>
            <div><b>{org.name}</b><div className="popmeta">{org.location} · joined {org.joined.slice(0, 7)}</div></div>
          </div>
          <p className="popbio">{org.bio}</p>
          <div className="popstats">
            <span><b>5</b> projects</span>
            <span><b>100%</b> receipts public</span>
          </div>
          <a className="popcta" href={org.links.github} target="_blank" rel="noopener noreferrer">GitHub profile →</a>
        </div>
      )}
    </span>
  );
}
import { Suspense } from "react";
export default function ProjectPage() {
  return (
    <Suspense fallback={<main className="wrap" style={{ padding: "80px 20px" }}><p className="onedim">loading…</p></main>}>
      <ProjectPageInner />
    </Suspense>
  );
}
