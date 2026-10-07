"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { projects, orgs } from "../../../lib/data";

function OrgPageInner() {
  const { slug } = useParams<{ slug: string }>();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const id = requestAnimationFrame(() => document.documentElement.setAttribute("data-theme", theme));
    return () => cancelAnimationFrame(id);
  }, [theme]);
  const org = orgs[slug as string];
  const mine = projects.filter(p => p.org === slug);
  const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  if (!org) return <main className="wrap"><h1 className="nf">Unknown profile.</h1></main>;
  const total = mine.reduce((a, p) => a + p.raised_usd, 0);
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
      <main className="wrap">
        <section className="orgpage">
          <div className="bigavatar">{org.avatar}</div>
          <h1>{org.name}</h1>
          <div className="pmeta center">{mine.length} projects created • {money(total)} raised • joined {org.joined.slice(0,7)} • {org.location}</div>
          <p className="popbio center">{org.bio}</p>
          <nav className="socials center">
            <a href={org.links.x} target="_blank" rel="noopener noreferrer">X</a>
            <a href={org.links.youtube} target="_blank" rel="noopener noreferrer">YouTube</a>
            <a href={org.links.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          </nav>
        </section>
        <section className="grid" aria-label="projects by this org">
          {mine.map(p => (
            <Link key={p.slug} href={`/project/${p.slug}`} className="card" style={{ color: "inherit" }}>
              <div className="tags">{p.tags.map(t => <span key={t} className={`tag${t === "LIVE" ? " live" : ""}`}>{t}</span>)}</div>
              <h2>{p.name}</h2>
              <p className="one">{p.one}</p>
            </Link>
          ))}
        </section>
      </main>
      <footer className="bottom big"><div className="footrow">
        <span>A <b>CommonWeave Labs</b> project — fund the compute, see the receipts.</span>
      </div></footer>
    </>
  );
}

import { Suspense } from "react";
export default function OrgPage() {
  return (
    <Suspense fallback={<main className="wrap" style={{ padding: "80px 20px" }}><p className="onedim">loading…</p></main>}>
      <OrgPageInner />
    </Suspense>
  );
}
