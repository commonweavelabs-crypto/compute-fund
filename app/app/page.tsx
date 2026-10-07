"use client";
// Compute Fund — v1 page (spec-V1): project grid + funding progress + tier buttons
// + Tierllama dogfood ledger. Themes via data-theme (dark=03 Terminal Commons,
// light=01 Carbon Ledger). Copy law: patronage language only.

import { useEffect, useMemo, useState } from "react";
import { projects, ledgerSummary, type Project } from "../lib/data";

function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  return { theme, toggle: () => setTheme(t => (t === "dark" ? "light" : "dark")) };
}

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function Card({ p }: { p: Project }) {
  const pct = Math.min(100, Math.round((p.raised_usd / p.goal_usd) * 100));
  const sum = ledgerSummary(p);
  return (
    <article className="card" aria-label={`project: ${p.name}`}>
      <div className="tags">
        {p.tags.map(t => (
          <span key={t} className={`tag${t === "LIVE" ? " live" : ""}`}>{t}</span>
        ))}
      </div>
      <h2>{p.name}</h2>
      <p className="one">{p.one}</p>

      <div className="prog" role="group" aria-label={`${p.name} funding progress`}>
        <div className="row">
          <span>{money(p.raised_usd)} / {money(p.goal_usd)}</span>
          <span className="pct">{pct}%</span>
        </div>
        <div className="bar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <i style={{ ["--pct" as string]: `${pct}%` }} />
        </div>
      </div>

      <div className="tiers">
        {p.tiers.map(t => (
          <button key={t} className="tier" type="button">fund ${t}</button>
        ))}
      </div>

      <div className="receipts">
        <div className="rh"><span>COMPUTE RECEIPTS</span><span>LAST {p.receipts.length} RUNS</span></div>
        <ul>
          {p.receipts.slice().reverse().map(r => (
            <li key={r.id}>
              <span>{r.ts.slice(11, 19)}</span>
              <span>{r.model}</span>
              <span className="cost">-${r.cost_usd.toFixed(4)}</span>
              <span className="ok">{r.outcome === "success" ? "✓" : "✗"}</span>
            </li>
          ))}
        </ul>
        <p className="receipt-note">
          {sum.runs} runs · {sum.tokens_in.toLocaleString()} tok in · {sum.tokens_out.toLocaleString()} tok out · ${sum.cost_usd.toFixed(4)} — demo ledger (schema = production; no personal data)
        </p>
      </div>
    </article>
  );
}

export default function Home() {
  const { theme, toggle } = useTheme();
  const totalRaised = useMemo(() => projects.reduce((a, p) => a + p.raised_usd, 0), []);
  const runs = useMemo(() => projects.reduce((a, p) => a + ledgerSummary(p).runs, 0), []);
  return (
    <>
      <header className="top">
        <div className="wrap" style={{ display: "flex", alignItems: "center", gap: 12, width: "100%" }}>
          <div className="brand">
            <span className="sig">▚</span>
            <b>COMPUTE&nbsp;FUND</b>
          </div>
          <span className="badge-none">investors: none</span>
          <button className="theme-toggle" type="button" onClick={toggle}>
            {theme === "dark" ? "☾ terminal" : "☀ ledger"} — switch
          </button>
        </div>
      </header>

      <main className="wrap">
        <section className="hero">
          <h1>
            Fund <span className="hl">compute</span>, not promises.
          </h1>
          <p className="sub">
            Patronage for open-source AI: money in → LLM compute credits out → every run
            publishes a public receipt. No investors, no returns, no equity — the community
            funds what it wants to see exist, and sees exactly what each batch became.
          </p>
        </section>

        <section className="grid" aria-label="projects">
          {projects.map(p => <Card key={p.slug} p={p} />)}
        </section>

        <footer className="bottom">
          <span>
            A <b>CommonWeave Labs</b> project — fund the compute, see the receipts. · {runs} demo runs · {money(totalRaised)} raised across the seed projects
          </span>
          <nav className="socials" aria-label="CommonWeave Labs social links">
            <a href="https://x.com/Commonweavelabs" target="_blank" rel="noopener noreferrer">X</a>
            <a href="https://www.youtube.com/@CommonweaveLabs" target="_blank" rel="noopener noreferrer">YouTube</a>
            <a href="https://github.com/commonweavelabs-crypto" target="_blank" rel="noopener noreferrer">GitHub</a>
          </nav>
        </footer>
      </main>
    </>
  );
}
