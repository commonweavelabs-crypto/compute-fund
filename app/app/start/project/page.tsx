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
  const [logoPath, setLogoPath] = useState("");
  const [orgs, setOrgs] = useState<{ slug: string; name: string }[]>([]);
  const [orgSlug, setOrgSlug] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<{ field: string; rule: string }[]>([]);
  const [created, setCreated] = useState<{ slug: string; cfq_id: string; status: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [needAuth, setNeedAuth] = useState(false);
  const [uploading, setUploading] = useState(false);

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
        repo_url: repoUrl, links: links ? links.split("\n").map(l => { const [label, url] = l.split("|"); return { label: (label ?? "").trim(), url: (url ?? "").trim() }; }).filter(x => x.url) : [],
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
