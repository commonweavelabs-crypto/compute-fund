"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// Org page, rendered from DATA (the /api/puborg/[slug] DB rail; the static
// lib/data demo orgs stay for the seed home page only).
type OrgData = { org: { slug: string; name: string; avatar_path: string | null; bio: string | null }; projects: { slug: string; name: string; cfq_id: string; one_liner: string; funded_usd: number }[] };

function OrgPageInner() {
  const { slug } = useParams<{ slug: string }>();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [data, setData] = useState<OrgData | null>(null);
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => document.documentElement.setAttribute("data-theme", theme));
    return () => cancelAnimationFrame(id);
  }, [theme]);
  useEffect(() => {
    if (!slug) return;
    fetch(`/api/puborg/${slug}`).then(r => r.json()).then(d => { if (d.error) setMissing(true); else setData(d); }).catch(() => setMissing(true));
  }, [slug]);
  const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  if (missing) return <main className="wrap"><h1 className="nf">Unknown profile.</h1></main>;
  if (!data) return <main className="wrap"><p className="onedim">loading…</p></main>;
  const org = data.org;
  const total = data.projects.reduce((a, p) => a + p.funded_usd, 0);
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
          <div className="bigavatar">{org.avatar_path ? <img src={org.avatar_path} alt={`${org.name} logo`} style={{ width: 64, borderRadius: 8 }} /> : <span>&#9619;</span>}</div>
          <h1>{org.name}</h1>
          <div className="pmeta center">{data.projects.length} projects created • {money(total)} raised</div>
          <p className="popbio center">{org.bio ?? "An organization on the fund."}</p>
        </section>
        <section className="grid" aria-label="projects by this org">
          {data.projects.map(p => (
            <Link key={p.slug} href={`/p/${p.slug}`} className="card" style={{ color: "inherit" }}>
              <div className="tags"><span className="tag">{p.cfq_id}</span><span className="tag">{money(p.funded_usd)} funded</span></div>
              <h2>{p.name}</h2>
              <p className="one">{p.one_liner}</p>
            </Link>
          ))}
          {data.projects.length === 0 && <p className="onedim">No public projects yet.</p>}
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
