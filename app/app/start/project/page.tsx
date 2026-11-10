"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

// The Question is the product. This form lints against the Question Standard before
// anything is written; platform assigns the CFQ id.
const FIELDS = [
  ["question", "The Question", 'One falsifiable sentence: "Given <input>, does applying <method> produce <output>?"'],
  ["data_inputs", "Data inputs", "Named, versioned, accessible: URL/hash/corpus + license."],
  ["method", "Method (JSON array of models/tools)", 'e.g. ["qwen3:8b","llama.cpp"] — also the gateway allowlist'],
  ["deliverable", "Deliverable", "The concrete artifact a stranger can inspect."],
  ["done_criteria", "Done criteria", "Quantified thresholds. Numbers required."],
  ["falsified_by", "Falsified by", "The observation that would refute the work. No hedging."],
  ["review_process", "Review process", "Who checks done-criteria and how."],
  ["assumptions", "Assumptions & risks", "Premises and pipeline breakage modes."],
] as const;

export default function ProjectStartPage() {
  const [slugName, setSlugName] = useState("");
  const [oneLiner, setOneLiner] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [links, setLinks] = useState("");
  const [story, setStory] = useState("");
  const [roadmap, setRoadmap] = useState("");
  const [logoPath, setLogoPath] = useState("");
  const [orgs, setOrgs] = useState<{ slug: string; name: string }[]>([]);
  const [orgSlug, setOrgSlug] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<{ field: string; rule: string }[]>([]);
  const [created, setCreated] = useState<{ slug: string; cfq_id: string; status: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [needAuth, setNeedAuth] = useState(false);
  const [uploading, setUploading] = useState(false);
  // SPREAD-400 (Gui 11/9): the content-policy agreement gate — the FIRST thing
  // a project-opener sees; the checkbox is required before the wizard renders.
  // Acceptance POSTs an append-only policy_acks record (receipts philosophy).
  const [ack, setAck] = useState(false);

  useEffect(() => {
    fetch("/api/org").then(r => r.json()).then(d => setOrgs(d.orgs ?? [])).catch(() => {});
  }, []);

  async function upload(f: File | undefined) {
    if (!f) return;
    setUploading(true);
    const fd = new FormData(); fd.set("file", f); fd.set("kind", "logo");
    const r = await fetch("/api/upload", { method: "POST", body: fd });
    const d = await r.json().catch(() => ({}));
    setUploading(false);
    if (r.ok && d.path) setLogoPath(d.path); else setErrors([{ field: "logo", rule: d.error ?? "Upload failed." }]);
  }

  async function submit(e: React.FormEvent, asDraft: boolean) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: slugName, one_liner: oneLiner, budget_credits: Number(budget), deadline,
        repo_url: repoUrl,
        links: links ? links.split("\n").map(l => { const [label, url] = l.split("|"); return { label: (label ?? "").trim(), url: (url ?? "").trim() }; }).filter(x => x.url) : [],
        story: story, roadmap: roadmap,
        logo_path: logoPath || undefined, status: asDraft ? "draft" : "active",
        org_slug: orgSlug || undefined, ...fields,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.ok) setCreated(data);
    else if (res.status === 401) {
      // Kickstarter law: the form was browsable; sign-in appears at submission, and returns here.
      setNeedAuth(true);
    }
    else setErrors(data.errors ?? [{ field: "server", rule: data.error ?? "Creation failed." }]);
  }

  if (created) {
    return (
      <main className="wrap">
        <section className="auth-card">
          <p className="ptitle">PROJECT OPEN</p>
          <h1 className="auth-h">{created.cfq_id}</h1>
          <p className="auth-lead">Your question is live at <Link href={`/project/${created.slug}`}>/project/{created.slug}</Link>.</p>
          <p className="auth-lead">Next: share it. When funding lands, issue your governed key from the project page — capped by what is funded, allowed models only.</p>
        </section>
      </main>
    );
  }

  if (needAuth) {
    return (
      <main className="wrap">
        <section className="auth-card">
          <p className="ptitle">ONE STEP</p>
          <h1 className="auth-h">Sign in to open this project.</h1>
          <p className="auth-lead">Your answers are still here when you return — sign in, then submit.</p>
          <p><a className="btn btn-primary" href={`/login?next=${encodeURIComponent("/start/project")}`}>Sign in</a></p>
        </section>
      </main>
    );
  }

  if (!ack) {
    return (
      <main className="wrap">
        <section className="auth-card">
          <p className="ptitle">BEFORE YOU OPEN A PROJECT</p>
          <h1 className="auth-h">The content agreement.</h1>
          <p className="auth-lead" style={{ textAlign: "left", lineHeight: 1.7 }}>
            One minute of education that protects you, everyone who funds you, and this platform:
          </p>
          <ul style={{ textAlign: "left", lineHeight: 1.9, margin: "14px 0 18px", paddingLeft: 22 }}>
            <li><b>Functionality is fair game.</b> Rebuilds, recompilations, decompilations and ports of how a program <i>works</i> are lawful engineering — courts have held it (<i>Sega v. Accolade</i>, <i>Sony v. Connectix</i>).</li>
            <li><b>Assets are not fair game.</b> Textures, models, sprites, music, characters and trademarks belong to their makers. A legal recomp with ripped textures is still a violation — make your own or license them.</li>
            <li><b>Inside Compute Fund, you fork — never copy.</b> A fork is public and credited; the original author stays visible in the ledger.</li>
            <li><b>Violations get pulled.</b> Verified takedown = your project goes (hidden, receipts preserved) in 48h. One honest miss = a fix window. Bad faith = removal.</li>
          </ul>
          <p className="auth-lead" style={{ textAlign: "left" }}>
            Read the full policy (educational, not legal advice):{" "}
            <Link className="mono" href="/policy/content" target="_blank" style={{ color: "var(--accent)" }}>/policy/content</Link>
          </p>
          <label className="lbl" style={{ display: "flex", gap: 10, alignItems: "flex-start", textAlign: "left", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={ack}
              onChange={(e) => setAck(e.target.checked)}
              style={{ marginTop: 4 }}
            />
            <span className="mono">
              I own the rights to everything I'm about to open, I've read the{" "}
              <Link href="/policy/content" target="_blank" style={{ color: "var(--accent)" }}>Content Policy</Link>, and if I break it I accept the project being pulled and my account being reviewed.
            </span>
          </label>
          <div style={{ marginTop: 18 }}>
            <button
              className="btn btn-primary"
              type="button"
              disabled={!ack}
              onClick={() => {
                setAck(true);
                fetch("/api/policy/ack", { method: "POST", headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ version: "content-policy-2026-11-1" }) }).catch(() => {});
              }}
            >
              Agree &amp; continue →
            </button>
          </div>
          <p className="hint" style={{ marginTop: 10 }}>
            Checkbox first, then the button. Version content-policy-2026-11-1 — acceptance logged when you're signed in.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="wrap">
      <section className="form-card">
        <p className="ptitle">OPEN A PROJECT</p>
        <h1 className="auth-h">Every experiment starts with the same question.</h1>
        {errors.length > 0 && (
          <div className="form-error-block" role="alert">
            <p className="form-error-h">The standard rejected these fields:</p>
            <ul>{errors.map((e, i) => <li key={i}><b>{e.field}</b>: {e.rule}</li>)}</ul>
          </div>
        )}
        <form onSubmit={(e) => { e.preventDefault(); submit(e, false); }} className="auth-form">
          <label className="lbl">project name
            <input className="inp" required value={slugName} onChange={(e) => setSlugName(e.target.value)} placeholder="Chunked analysis of the N-001 corpus" />
          </label>
          <label className="lbl">one-liner
            <input className="inp" required value={oneLiner} onChange={(e) => setOneLiner(e.target.value)} placeholder="What this project does in one line" />
          </label>
          {FIELDS.map(([key, label, hint]) => (
            <label className="lbl" key={key}>{label}
              <textarea className="inp" required rows={key === "question" ? 3 : 2}
                placeholder={hint}
                value={fields[key] ?? ""}
                onChange={(e) => setFields({ ...fields, [key]: e.target.value })} />
              <span className="hint">{hint}</span>
            </label>
          ))}
          <div className="grid-2">
            <label className="lbl">budget (credits)
              <input className="inp" type="number" required min={1} value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="2000" />
            </label>
            <label className="lbl">deadline
              <input className="inp" type="date" required value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </label>
          </div>
          <div className="grid-2">
            <label className="lbl">repo
              <input className="inp" type="url" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="https://github.com/you/the-work" />
            </label>
            <label className="lbl">logo
              <input className="inp" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" disabled={uploading}
                onChange={(e) => upload(e.target.files?.[0])} />
              {logoPath && <img src={logoPath} alt="project logo preview" className="projlogo" style={{ maxWidth: 64 }} />}
            </label>
          </div>
          <label className="lbl">links (one per line: label|url)
            <textarea className="inp" rows={2} value={links} onChange={(e) => setLinks(e.target.value)} placeholder="Code|https://github.com/you/the-work" />
          </label>
          <label className="lbl">the story
            <textarea className="inp" rows={4} value={story} onChange={(e) => setStory(e.target.value)} placeholder="What this is and why it matters — your words, your page." />
          </label>
          <label className="lbl">the build plan
            <textarea className="inp" rows={4} value={roadmap} onChange={(e) => setRoadmap(e.target.value)} placeholder="One milestone per line. People fund plans they can check." />
          </label>
          {orgs.length > 0 && (
            <label className="lbl">held by
              <select className="inp" value={orgSlug} onChange={(e) => setOrgSlug(e.target.value)}>
                <option value="">personal profile</option>
                {orgs.map(o => <option key={o.slug} value={o.slug}>{o.name}</option>)}
              </select>
              <span className="hint">org default-recommended; transferable any time, no re-create.</span>
            </label>
          )}
          <div className="grid-2">
            <button className="btn btn-primary" type="button" disabled={busy} onClick={(ev) => { ev.preventDefault(); submit(ev, false); }}>
              {busy ? "Linting…" : "Open the question"}
            </button>
            <button className="btn ghost" type="button" disabled={busy} onClick={(ev) => { ev.preventDefault(); submit(ev, true); }} title="Private to you until you press PUBLISH">
              {busy ? "…" : "Save as DRAFT"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
