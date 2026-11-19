"use client";
// REPORT & CONTACT (Gui 11/19): the front door for bugs, feature requests,
// support questions and takedowns. One page, picker-first, receipts law:
// every submission is stored and answerable; nothing silently dropped.
import { useState } from "react";
import Link from "next/link";

const KINDS = [
  { id: "bug", label: "Report a bug", hint: "Something broke, behaved oddly, or just looks wrong." },
  { id: "feature", label: "Request a feature", hint: "Something Compute Fund should do that it doesn't yet." },
  { id: "support", label: "Ask a question", hint: "How does X work? Great questions may join the Q&A section." },
  { id: "takedown", label: "Report content / takedown", hint: "Rights issues, misattribution, or policy problems with a project. Verified requests are honored within 48h." },
  { id: "other", label: "Get in contact", hint: "Anything else — partnerships, press, receipts questions." },
];

export default function ReportPage() {
  const [kind, setKind] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState(""); // honeypot: humans never see it
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [err, setErr] = useState("");

  const active = KINDS.find(k => k.id === kind);

  async function submit() {
    if (hp.trim()) { setDone("rpt_" + "ok"); return; } // honeypot trips: fake success, no row
    setBusy(true); setErr("");
    try {
      const r = await fetch("/api/report", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, subject, body: text, email, url: typeof window !== "undefined" ? window.location.href : "", _hp: hp }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.ok) setDone(d.id);
      else setErr(d.error ?? "Something went wrong — try again.");
    } finally { setBusy(false); }
  }

  return (
    <main className="wrap" style={{ maxWidth: 760 }}>
      {done ? (
        <section style={{ minHeight: "50vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", letterSpacing: "-0.02em", margin: "0 0 10px" }}>Received. Logged.</h1>
          <p style={{ opacity: 0.75, maxWidth: 460, lineHeight: 1.6 }}>
            Receipt <span className="mono">{done}</span> — your report is in the ledger and we're on it. Every submission is stored and answerable; nothing gets silently dropped.
          </p>
          <Link href="/" style={{ color: "inherit", textDecoration: "underline", marginTop: 14 }}>Back to the fund</Link>
        </section>
      ) : !active ? (
        <section style={{ minHeight: "55vh" }}>
          <h1 style={{ fontSize: "clamp(1.7rem, 4.5vw, 2.4rem)", letterSpacing: "-0.02em", margin: "26px 0 6px" }}>Report &amp; contact</h1>
          <p style={{ opacity: 0.7, margin: "0 0 22px", lineHeight: 1.55 }}>
            The front door for anything you need from us. Pick what brings you here:
          </p>
          <div style={{ display: "grid", gap: 10 }}>
            {KINDS.map(k => (
              <button key={k.id} onClick={() => setKind(k.id)} style={{
                textAlign: "left", padding: "14px 18px", borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.03)",
                cursor: "pointer",
              }}>
                <strong style={{ fontSize: "1rem" }}>{k.label}</strong>
                <div style={{ opacity: 0.7, fontSize: "0.9rem", marginTop: 2 }}>{k.hint}</div>
              </button>
            ))}
          </div>
          <p className="mono" style={{ opacity: 0.55, fontSize: "0.82rem", marginTop: 20 }}>
            Prefer email? commonweavelabs@gmail.com — same ledger, slower receipts.
          </p>
        </section>
      ) : (
        <section>
          <button onClick={() => { setKind(null); setErr(""); }} style={{ border: "none", background: "none", cursor: "pointer", opacity: 0.6, padding: 0, marginBottom: 12, fontSize: "0.9rem" }}>
            ← {KINDS.map(k => k.id).includes(active.id) ? "Pick a different door" : ""}
          </button>
          <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", letterSpacing: "-0.02em", margin: "0 0 4px" }}>{active.label}</h1>
          <p style={{ opacity: 0.7, margin: "0 0 18px", lineHeight: 1.55 }}>{active.hint}</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <label style={{ display: "block" }}>
              <span className="mono" style={{ opacity: 0.7, fontSize: "0.82rem" }}>SUBJECT</span>
              <input value={subject} onChange={e => setSubject(e.target.value)} maxLength={160} placeholder={active.id === "bug" ? "e.g. search results duplicate under ?tab=" : active.id === "feature" ? "e.g. dark mode for the receipts panel" : "what's on your mind"} style={{ width: "100%", marginTop: 6, padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.16)", background: "transparent", color: "inherit" }} />
            </label>
            <label style={{ display: "block" }}>
              <span className="mono" style={{ opacity: 0.7, fontSize: "0.82rem" }}>DETAILS</span>
              <textarea value={text} onChange={e => setText(e.target.value)} maxLength={4000} rows={7} placeholder={active.id === "bug" ? "What did you do, what did you expect, what happened instead? (the URL helps)" : "The more concrete, the faster it lands. If it's a feature: what would you use it for?"} style={{ width: "100%", marginTop: 6, padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.16)", background: "transparent", color: "inherit", fontFamily: "inherit", resize: "vertical" }} />
            </label>
            <label style={{ display: "block" }}>
              <span className="mono" style={{ opacity: 0.7, fontSize: "0.82rem" }}>EMAIL (optional — for a reply)</span>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@somewhere.dev" style={{ width: "100%", marginTop: 6, padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.16)", background: "transparent", color: "inherit" }} />
            </label>
            <input type="text" value={hp} onChange={e => setHp(e.target.value)} style={{ position: "absolute", left: -9999, opacity: 0, height: 0 }} tabIndex={-1} autoComplete="off" aria-hidden="true" />
            {err && <p style={{ color: "#ff8d7a", margin: 0, fontSize: "0.9rem" }}>{err}</p>}
            <button onClick={submit} disabled={busy || subject.trim().length < 4 || text.trim().length < 10} style={{
              padding: "12px 0", borderRadius: 10, fontSize: "1rem", cursor: busy ? "wait" : "pointer",
              opacity: busy || subject.trim().length < 4 || text.trim().length < 10 ? 0.45 : 1,
            }}>
              {busy ? "filing receipt…" : "Submit"}
            </button>
            <p className="mono" style={{ opacity: 0.55, fontSize: "0.8rem" }}>
              Stored with a receipt id, in the open. Never sold, never tracked back to you.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
