"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

// Entry: real sign-up, then the routing choice every new member faces.
export default function StartPage() {
  const [mode, setMode] = useState<"signup" | "done">("signup");
  const [form, setForm] = useState({ displayName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [user, setUser] = useState<{ display_name: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => { if (d.user) { setUser(d.user); setMode("done"); } });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.ok) setUser({ display_name: form.displayName });
    else setError(data.error ?? "Sign-up failed. Try again.");
  }

  return (
    <main className="wrap">
      <section className="auth-card">
        <p className="ptitle">START</p>
        {mode === "signup" && user === null ? (
          <>
            <h1 className="auth-h">Create your account.</h1>
            <form onSubmit={submit} className="auth-form">
              <label className="lbl">display name
                <input className="inp" required value={form.displayName}
                       onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                       placeholder="How projects credit you" />
              </label>
              <label className="lbl">email
                <input className="inp" type="email" required value={form.email}
                       onChange={(e) => setForm({ ...form, email: e.target.value })}
                       placeholder="you@example.com" />
              </label>
              <label className="lbl">password
                <input className="inp" type="password" required minLength={8} value={form.password}
                       onChange={(e) => setForm({ ...form, password: e.target.value })}
                       placeholder="at least 8 characters" />
              </label>
              {error && <p className="form-error" role="alert">{error}</p>}
              <button className="btn btn-primary" disabled={busy}>
                {busy ? "Creating…" : "Create account"}
              </button>
            </form>
            <p className="auth-alt">Already a member? <Link href="/login">Log in</Link></p>
          </>
        ) : (
          <>
            <h1 className="auth-h">Welcome{user?.display_name ? `, ${user.display_name}` : ""}.</h1>
            <p className="auth-lead">Two doors:</p>
            <div className="start-choices">
              <Link className="guide" href="/start/project">
                <div className="guideart ga1">?</div>
                <div className="guidebody">
                  <h3>Open a project</h3>
                  <p>Write a Question that passes the CFQ standard. Patrons fund it; the gateway dispenses compute against it.</p>
                  <span className="readguide">Write the question →</span>
                </div>
              </Link>
              <Link className="guide" href="/account">
                <div className="guideart ga2">$</div>
                <div className="guidebody">
                  <h3>Fund a question</h3>
                  <p>Pick a live project, choose a tier, watch every spent token land on the public ledger.</p>
                  <span className="readguide">Browse the fund →</span>
                </div>
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
