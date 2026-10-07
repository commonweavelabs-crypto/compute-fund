"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Guide() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const id = requestAnimationFrame(() => document.documentElement.setAttribute("data-theme", theme));
    return () => cancelAnimationFrame(id);
  }, [theme]);
  return (
    <>
      <header className="top">
        <div className="wrap inner">
          <Link href="/" className="brand"><span className="sig">▚</span><b>COMPUTE&nbsp;FUND</b></Link>
          <button className="theme-toggle" type="button" onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}>
            {theme === "dark" ? "☾ terminal" : "☀ ledger"} — switch
          </button>
        </div>
      </header>
      <main className="wrap doc">
        <h1>The CFQ Guide</h1>
        <p className="sub">Every experiment starts with the same question: <b>how will the compute be paid for?</b> Compute Fund answers it — for questions that deserve an answer.</p>

        <section id="cfq" className="docsec">
          <h2>1 · What makes a project fundable: the Question Standard</h2>
          <p>A project answers a <b>CFQ</b> — a deterministic, falsifiable question. "Cure cancer" can be the title; the question underneath must name its data, its method, its deliverable, and — most importantly — <b>the observation that would prove it wrong.</b> If you cannot name the failure, the question is not fundable. Negative results are legitimate deliverables here.</p>
        </section>

        <section id="receipts" className="docsec">
          <h2>2 · The receipt law</h2>
          <p>Money in → compute out → <b>every run publishes a public receipt</b>: model, tokens, cost, CFQ id. Unspent credits return to the fund, never to a person. A receipt format that makes overclaiming <i>structurally difficult</i> is a feature, not a compliance cost — the rejection trail is part of the receipt.</p>
        </section>

        <section id="law" className="docsec">
          <h2>3 · Our rules</h2>
          <ul>
            <li>Patronage, not investment — no equity, no returns, no revenue share. Ever.</li>
            <li>Nothing gated: the code is open, the receipts are public, the walls are written.</li>
            <li>Credits are prepaid, single-purpose, non-transferable, zero cash value.</li>
            <li>Creator brand accounts are transferable — projects outlive their founders.</li>
          </ul>
        </section>

        <section id="brand" className="docsec">
          <h2>4 · Brand assets</h2>
          <p>The design system (tokens, both themes, component anatomy) lives in the repo: <a href="https://github.com/commonweavelabs-crypto/compute-fund/blob/main/docs/CF-DESIGN.md" target="_blank" rel="noopener noreferrer">docs/CF-DESIGN.md</a>. Use it, fork it, make it yours — attribution appreciated, never required.</p>
        </section>

        <p className="backline"><Link href="/" style={{ color: "var(--accent)" }}>← back to the grid</Link></p>
      </main>
      <footer className="bottom big"><div className="footrow">
        <span>A <b>CommonWeave Labs</b> project — fund the compute, see the receipts.</span>
        <nav className="socials">
          <a href="https://x.com/Commonweavelabs" target="_blank" rel="noopener noreferrer">X</a>
          <a href="https://www.youtube.com/@CommonweaveLabs" target="_blank" rel="noopener noreferrer">YouTube</a>
          <a href="https://github.com/commonweavelabs-crypto" target="_blank" rel="noopener noreferrer">GitHub</a>
        </nav>
      </div></footer>
    </>
  );
}
