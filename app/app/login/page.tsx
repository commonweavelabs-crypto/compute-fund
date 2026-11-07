"use client";
import { useState, useEffect } from "react";
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

  // Callback-route surface: show ?error= messages on load (they were invisible
  // before — that's why failures looked like "nothing happened").
  // IMPLICIT leg: if the OAuth response arrived as access_token in the hash
  // fragment (implicit flow — e.g. cached/legacy client bundles), hand it to
  // /api/auth/implicit, which validates it server-side and issues cf_session.
  useEffect(() => {
    const err = new URLSearchParams(window.location.search).get("error");
    if (err) { setStatus("error"); setMessage(err); return; }
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const at = hash.get("access_token");
    if (!at) return;
    setStatus("submitting");
    fetch(`/api/auth/implicit?next=${encodeURIComponent(new URLSearchParams(window.location.search).get("next") ?? "")}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: at, refresh_token: hash.get("refresh_token") ?? "" }),
    })
      .then(async (r) => ({ ok: r.ok, data: await r.json().catch(() => ({})) }))
      .then(({ ok, data }) => {
        if (ok) {
          // Kickstarter law: return to where the interaction started.
          window.location.href = data.next && data.next.startsWith("/") ? data.next : "/account";
        } else {
          setStatus("error");
          setMessage(data.error ?? "Sign-in failed — try again.");
          history.replaceState(null, "", window.location.pathname);
        }
      })
      .catch(() => { setStatus("error"); setMessage("Sign-in failed — try again."); });
  }, []);

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
      const callbackUrl =
        `${window.location.origin}/api/auth/callback` + (next && next.startsWith("/") ? `?next=${encodeURIComponent(next)}` : "");
      // PKCE + server-exchange law: the code verifier lives in the browser, but
      // the exchange happens on OUR server (callback route). Default storage is
      // deliberately used (persistSession:false would keep the verifier in
      // memory and kill it on the GitHub redirect). We hand the verifier to the
      // server via a short-lived cookie it reads at the callback.
      const { data: authData, error: oauthError } = await createClient(SUPA_URL, SUPA_ANON, {
        auth: { flowType: "pkce" },
      }).auth.signInWithOAuth({
        provider,
        options: { redirectTo: callbackUrl, skipBrowserRedirect: true },
      });
      if (oauthError || !authData?.url) {
        setStatus("error");
        setMessage(oauthError?.message || "OAuth failed — try again.");
        return;
      }
      const projectRef = SUPA_URL.replace(/^https?:\/\/([^.]+)\..*/, "$1");
      // auth-js stores the verifier in a flow slot: sb-<ref>-auth-token-flow-<flowId>-code-verifier
      // (signInWithOAuth RETURNS the flowId). Server exchange (no flowId) reads the
      // legacy `-code-verifier` key — our cookie shim serves it there.
      const flowId = (authData as unknown as { flowId?: string })?.flowId;
      const verifKey = flowId
        ? `sb-${projectRef}-auth-token-flow-${flowId}-code-verifier`
        : `sb-${projectRef}-auth-token-code-verifier`;
      const verifier = window.localStorage.getItem(verifKey) ?? "";
      document.cookie = `cf_pkce=${encodeURIComponent(verifier)}; Max-Age=600; Path=/; SameSite=Lax` + (location.protocol === "https:" ? "; Secure" : "");
      window.location.href = authData.url!;
    });
  }

  return (
    <main className="wrap">
      <section className="auth-card">
        <p className="ptitle">LOG IN</p>
        <h1 className="auth-h">Back to the fund.</h1>
        {supaConfigured && (
          <div className="oauth-row">
            {/* SERVER-SIDE OAuth START (2026-11-07 fix): the client-side
                supabase-js PKCE dance died silently in real browsers (async
                chunk loader never resolving = dead button). This anchor does
                the whole start handshake on the server via /api/auth/start —
                no client JS to break. */}
            <a type="button" className="btn btn-primary" href="/api/auth/start?provider=github">
              Continue with GitHub
            </a>
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
