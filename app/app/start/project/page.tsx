"use client";
import { useState } from "react";
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
  const [fields, setFields] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<{ field: string; rule: string }[]>([]);
  const [created, setCreated] = useState<{ slug: string; cfq_id: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [needAuth, setNeedAuth] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: slugName, one_liner: oneLiner, budget_credits: Number(budget), deadline, ...fields }),
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
        <form onSubmit={submit} className="auth-form">
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
          <button className="btn btn-primary" disabled={busy}>{busy ? "Linting…" : "Submit to the standard"}</button>
        </form>
      </section>
    </main>
  );
}
