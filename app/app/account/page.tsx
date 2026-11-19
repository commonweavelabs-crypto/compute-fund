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
  // D1.4 DATA CONSENT: version-gated. Not acked (or an older version) = the
  // honest consent screen greets before the dashboard; re-agree on big updates.
  const [consentState, setConsentState] = useState<"pending" | "needed" | "ok">("pending");
  const [ck, setCk] = useState(false);
  const [consentBusy, setConsentBusy] = useState(false);
  useEffect(() => {
    fetch("/api/privacy/ack").then(r => r.json()).then(d => {
      setConsentState(d.acked === "data-consent-2026-11-1" ? "ok" : "needed");
    }).catch(() => setConsentState("ok")); // fail-open: never lock the dashboard on a probe error
  }, []);


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

  if (consentState !== "ok") {
    return (
      <main className="wrap" style={{ maxWidth: 720, minHeight: "80vh", display: "flex", alignItems: "stretch", justifyContent: "center" }}>
        <section style={{
          width: "100%", alignSelf: "center",
          border: "1px solid rgba(255,255,255,0.14)", borderRadius: 18,
          padding: "34px 34px 28px", background: "rgba(255,255,255,0.03)",
        }}>
          <h1 style={{"fontSize": "clamp(1.6rem, 4vw, 2.2rem)", margin: "0 0 6px", letterSpacing: "-0.02em"}}>Your data. Your rules.</h1>
          <p className="mono" style={{ opacity: 0.65, margin: "0 0 20px", fontSize: "0.85rem" }}>what we record — and never record — before you set foot inside your dashboard</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: "0.97rem", lineHeight: 1.55 }}>
            <div style={{ borderLeft: "3px solid currentColor", paddingLeft: 12, opacity: 0.92 }}>
              <strong>Your clicks power your suggestions.</strong>
              <div style={{ opacity: 0.78, fontSize: "0.92em" }}>Signed-in activity shapes your feed — for your eyes only. Never sold, never an ad.</div>
            </div>
            <div style={{ borderLeft: "3px solid currentColor", paddingLeft: 12, opacity: 0.92 }}>
              <strong>Searches are logged anonymized.</strong>
              <div style={{ opacity: 0.78, fontSize: "0.92em" }}>Only the query, the timestamp, and the result count. No user id, no IP, no fingerprint — ever.</div>
            </div>
            <div style={{ borderLeft: "3px solid currentColor", paddingLeft: 12, opacity: 0.92 }}>
              <strong>Aggregates belong to everyone.</strong>
              <div style={{ opacity: 0.78, fontSize: "0.92em" }}>
                Community-level stats are published as open data (CC0),
                identity-free by design — and <a href="/privacy/data" style={{ color: "inherit", textDecoration: "underline" }}>the full policy lives here</a>.
              </div>
            </div>
          </div>

          <label style={{ display: "flex", gap: 10, alignItems: "flex-start", margin: "22px 0 14px", cursor: "pointer", fontSize: "0.93rem", opacity: 0.9 }}>
            <input type="checkbox" checked={ck} onChange={(e) => setCk(e.target.checked)} style={{ marginTop: 3, width: 16, height: 16, accentColor: "currentColor" }} />
            <span>I've read the data policy. Record my consent — version-stamped, so I'll be re-greeted if it ever changes meaningfully.</span>
          </label>

          <button
            disabled={!ck || consentBusy}
            onClick={async () => {
              setConsentBusy(true);
              try {
                const r = await fetch("/api/privacy/ack", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ version: "data-consent-2026-11-1" }) });
                if (r.ok) setConsentState("ok");
              } finally { setConsentBusy(false); }
            }}
            style={{
              width: "100%", padding: "12px 0", borderRadius: 10, cursor: ck ? "pointer" : "not-allowed",
              fontSize: "1rem", opacity: ck ? 1 : 0.45,
            }}
          >
            {consentBusy ? "recording…" : ck ? "Agree — enter your dashboard" : "Check the box to continue"}
          </button>
          <p className="mono" style={{ opacity: 0.55, margin: "14px 0 0", fontSize: "0.8rem", textAlign: "center" }}>
            Everything on Compute Fund works without consent — you'd just get the generic feed.
          </p>
        </section>
      </main>
    );
  }

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
