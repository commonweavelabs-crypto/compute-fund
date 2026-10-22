"use client";
import { useState } from "react";
import Link from "next/link";

// Real sign-in. Errors name the cause; no invented success states.
// Supabase OAuth (GitHub/Google, PKCE) when configured: the buttons redirect
// through /api/auth/callback, which exchanges the code server-side, maps the
// Supabase identity into the local ledger (users.supabase_user_id), and issues
// the app's cf_session. Email+password stays as the local fallback path.

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supaConfigured = Boolean(SUPA_URL && SUPA_ANON);

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

  function oauth(provider: "github" | "google" = "github") {
    import("@supabase/supabase-js").then(async ({ createClient }) => {
      if (!SUPA_URL || !SUPA_ANON) {
        setStatus("error");
        setMessage("OAuth not configured on this deployment.");
        return;
      }
      const next = new URLSearchParams(window.location.search).get("next");
      const redirectTo =
        `${window.location.origin}/api/auth/callback` + (next && next.startsWith("/") ? `?next=${encodeURIComponent(next)}` : "");
      const { data: authData, error: oauthError } = await createClient(SUPA_URL, SUPA_ANON, {
        auth: { persistSession: false, autoRefreshToken: false },
      }).auth.signInWithOAuth({ provider, options: { redirectTo } });
      if (oauthError) {
        setStatus("error");
        setMessage(oauthError.message || "OAuth failed — try again.");
      }
      // success: the browser navigates away; nothing else to render
    });
  }

  return (
    <main className="wrap">
      <section className="auth-card">
        <p className="ptitle">LOG IN</p>
        <h1 className="auth-h">Back to the fund.</h1>
        {supaConfigured && (
          <div className="oauth-row">
            <button type="button" className="btn btn-primary" onClick={() => oauth("github")}>
              Continue with GitHub
            </button>
          </div>
        )}
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
