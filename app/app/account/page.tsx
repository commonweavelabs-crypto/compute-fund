"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Me = { display_name: string; email: string } | null;
type Row = Record<string, string | number>;

export default function AccountPage() {
  const [me, setMe] = useState<Me>(null);
  const [donations, setDonations] = useState<Row[]>([]);
  const [projects, setProjects] = useState<Row[]>([]);
  const [orgs, setOrgs] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [savedNote, setSavedNote] = useState("");
  const [orgName, setOrgName] = useState("");
  const [orgCreating, setOrgCreating] = useState(false);

  useEffect(() => {
    fetch("/api/account").then(r => r.json()).then(d => {
      if (d.user) {
        setMe(d.user); setDonations(d.donations ?? []); setProjects(d.projects ?? []); setOrgs(d.orgs ?? []);
        fetch("/api/account").then(r => r.json()).then(() => {});
        // pull bio/avatar from the profile row
        fetch("/api/account").then(r => r.json()).then(x => { setBio(String(x.user.bio ?? "")); setAvatar(String(x.user.avatar_path ?? "")); });
      }
      setLoading(false);
    });
  }, []);

  async function uploadAvatar(f: File | undefined) {
    if (!f) return;
    const fd = new FormData(); fd.set("file", f); fd.set("kind", "avatar");
    const r = await fetch("/api/upload", { method: "POST", body: fd });
    const d = await r.json().catch(() => ({}));
    if (r.ok && d.path) { setAvatar(d.path); setSavedNote("Avatar uploaded — press SAVE to keep it."); }
  }

  async function saveProfile() {
    const r = await fetch("/api/account", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fields: { bio, avatar_path: avatar || null } }) });
    setSavedNote(r.ok ? "Saved." : "Save failed.");
  }

  async function createOrg() {
    if (!orgName.trim()) return;
    setOrgCreating(true);
    const r = await fetch("/api/org", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: orgName }) });
    const d = await r.json().catch(() => ({}));
    setOrgCreating(false);
    if (r.ok) { setOrgName(""); fetch("/api/account").then(r => r.json()).then(d => setOrgs(d.orgs ?? [])); setSavedNote(`Org "${d.slug}" created — projects can be transferred to it.`); }
    else setSavedNote(d.error ?? "Org creation failed.");
  }

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
              {String(p.status) === "draft" && <span className="cfqbadge">DRAFT</span>}
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
      <section className="account-grid" aria-label="Profile and organizations">
        <div>
          <h2 className="row-head">Profile</h2>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {avatar ? <img src={avatar} alt="your avatar" style={{ width: 48, borderRadius: 24 }} /> : <div className="popavatar big">&#9619;</div>}
            <label className="lbl" style={{ flex: 1 }}>avatar
              <input className="inp" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={(e) => uploadAvatar(e.target.files?.[0])} />
            </label>
          </div>
          <label className="lbl">bio
            <textarea className="inp" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Who you are, in one or two lines" />
          </label>
          <button className="btn btn-primary" onClick={saveProfile}>SAVE profile</button>
          {savedNote && <p className="pmeta">{savedNote}</p>}
        </div>
        <div>
          <h2 className="row-head">Organizations</h2>
          {orgs.length === 0 && <p className="onedim">No org yet — projects default to you, orgs are the recommended home.</p>}
          {orgs.map(o => (
            <p className="receipt-line" key={String(o.slug)}><Link href={`/org/${o.slug}`}>{String(o.name)}</Link></p>
          ))}
          <div style={{ display: "flex", gap: 8 }}>
            <input className="inp" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="New org name (e.g. ACME Robotics)" aria-label="New org name" />
            <button className="btn ghost" onClick={createOrg} disabled={orgCreating}>{orgCreating ? "…" : "Create"}</button>
          </div>
        </div>
      </section>
    </main>
  );
}
