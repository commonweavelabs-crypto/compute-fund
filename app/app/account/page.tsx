"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Me = { display_name: string; email: string } | null;
type Row = Record<string, string | number>;

export default function AccountPage() {
  const [me, setMe] = useState<Me>(null);
  const [donations, setDonations] = useState<Row[]>([]);
  const [projects, setProjects] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/account").then(r => r.json()).then(d => {
      if (d.user) { setMe(d.user); setDonations(d.donations ?? []); setProjects(d.projects ?? []); }
      setLoading(false);
    });
  }, []);

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  if (loading) return <main className="wrap"><p className="onedim">loading…</p></main>;
  if (!me) return <main className="wrap"><p className="onedim">Not signed in. <Link href="/login">Log in</Link></p></main>;

  return (
    <main className="wrap">
      <section className="orgpage">
        <div className="popavatar big">&#9619;</div>
        <h1>{me.display_name}</h1>
        <p className="pmeta">{me.email}</p>
        <div className="socials">
          <a className="ghost" href="/start/project">Open a project</a>
          <button className="ghost" onClick={signOut}>Sign out</button>
        </div>
      </section>
      <section className="account-grid">
        <div>
          <h2 className="row-head">Your projects</h2>
          {projects.length === 0 && <p className="onedim">None yet. Start with a question: <Link href="/start/project">open a project</Link>.</p>}
          {projects.map(p => (
            <div className="card" key={String(p.slug)}>
              <h2><Link href={`/project/${p.slug}`} className="cardlink">{String(p.name)}</Link></h2>
              <span className="cfqbadge">{String(p.cfq_id)}</span>
            </div>
          ))}
        </div>
        <div>
          <h2 className="row-head">Your donations</h2>
          {donations.length === 0 && <p className="onedim">None yet. The <Link href="/">fund</Link> is live.</p>}
          {donations.map(d => (
            <p className="receipt-line" key={String(d.id)}>
              {String(d.created_at).slice(0, 10)} · ${String(d.amount_cents)} · <Link href={`/project/${d.slug}`}>{String(d.name)}</Link>{Number(d.demo) === 1 ? " (demo)" : ""}
            </p>
          ))}
        </div>
      </section>
    </main>
  );
}
