"use client";
import { useState } from "react";
import Link from "next/link";

// Real sign-in. Errors name the cause; no invented success states.
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error" | "ok">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setStatus("ok");
      // Kickstarter law: login returns the user to where the interaction started.
      const next = new URLSearchParams(window.location.search).get("next");
      window.location.href = next && next.startsWith("/") ? next : "/account";
    }
    else { setStatus("error"); setMessage(data.error ?? "Sign-in failed. Try again."); }
  }

  return (
    <main className="wrap">
      <section className="auth-card">
        <p className="ptitle">LOG IN</p>
        <h1 className="auth-h">Back to the fund.</h1>
        <form onSubmit={submit} className="auth-form">
          <label className="lbl">email
            <input className="inp" type="email" required value={email}
                   onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>
          <label className="lbl">password
            <input className="inp" type="password" required value={password}
                   onChange={(e) => setPassword(e.target.value)} placeholder="at least 8 characters" />
          </label>
          {status === "error" && <p className="form-error" role="alert">{message}</p>}
          <button className="btn btn-primary" disabled={status === "submitting"}>
            {status === "submitting" ? "Signing in…" : "Log in"}
          </button>
        </form>
        <p className="auth-alt">New here? <Link href="/start">Start a project</Link> or just browse the <Link href="/">fund</Link>.</p>
      </section>
    </main>
  );
}
