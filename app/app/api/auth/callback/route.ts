// GET /api/auth/callback — Supabase OAuth callback (GitHub/Google), PKCE code flow.
// Exchanges the code SERVER-SIDE (never on the client), verifies the Supabase
// user, auto-provisions the local SQLite user by email, issues the app's
// cf_session cookie, and redirects. Unconfigured Supabase -> honest 503.
// Laws: no user enumeration errors; no token echoed; browse-first (redirect
// honors ?next= only for same-origin paths).

import { NextRequest, NextResponse } from "next/server";
import { getSupabase, isSupabaseConfigured } from "../../../../lib/supabase";
import { findUserByEmail, ensureUserByEmail } from "../../../../lib/db";
import { sessionTokenFor } from "../../../../lib/auth";
import { setGithubHandle } from "../../../../lib/db";

export async function GET(req: NextRequest) {
  // Public origin: behind the cloudflared tunnel req.url is the LOCAL url; the
  // forwarded headers carry the real public host. Localhost fallback = direct dev.
  const fwdHost = req.headers.get("x-forwarded-host");
  const proto = req.headers.get("x-forwarded-proto") ?? (fwdHost ? "https" : "http");
  const origin = fwdHost ? `${proto}://${fwdHost}` : new URL(req.url).origin;
  const nextPath = new URL(req.url).searchParams.get("next");
  const safeNext = nextPath && /^\/[^/]/.test(nextPath) ? nextPath : "/account";

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("Supabase not configured on this deployment — use email sign-in.")}`);
  }
  const code = new URL(req.url).searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("Sign-in was cancelled or the link expired — try again.")}`);
  }
  // PKCE server-exchange bridge: the browser hands us the verifier via a
  // short-lived cookie (cf_pkce) set right before the GitHub redirect; auth-js
  // reads its `-code-verifier` storage key, so we serve it from the cookie via
  // a one-shot storage shim. Cookie cleared after use.
  const pkceRaw = req.cookies.get("cf_pkce")?.value;
  const pkce = pkceRaw ? decodeURIComponent(pkceRaw) : "";
  if (!pkce) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("Sign-in was cancelled or the link expired — try again.")}`);
  }
  const SURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SKEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!SURL || !SKEY) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("Auth provider unavailable — use email sign-in.")}`);
  }
  // SERVER-SIDE DIRECT PKCE EXCHANGE (2026-11-07): bundled supabase-js throws
  // "PKCE code verifier not found in storage" before ever consulting a custom
  // storage shim (its own per-flow lookup contract). The token endpoint itself
  // takes {auth_code, code_verifier} directly — same grant, zero storage:
  const tkRes = await fetch(`${SURL}/auth/v1/token?grant_type=pkce`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SKEY, Authorization: `Bearer ${SKEY}` },
    body: JSON.stringify({ auth_code: code, code_verifier: pkce }),
  });
  const tkJson = (await tkRes.json().catch(() => null)) as
    | { access_token?: string; user?: { email?: string | null; id?: string } | null; error_description?: string; error?: string; msg?: string }
    | null;
  if (!tkRes.ok || !tkJson?.access_token || !tkJson?.user) {
    const causeShort = (tkJson?.error_description || tkJson?.msg || tkJson?.error || `token endpoint HTTP ${tkRes.status}`).split(/[.;]/)[0].slice(0, 120);
    console.error("[auth/callback] direct pkce exchange failed:", causeShort);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("Sign-in exchange failed — try again.")}&cause=${encodeURIComponent(causeShort)}`);
  }
  const su = tkJson.user as { email?: string | null; id?: string; user_metadata?: Record<string, unknown> | null };
  const email = (su.email ?? "").toLowerCase();
  if (!email) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("The connected account exposes no email — is your OAuth email public?")}`);
  }

  // Map into the local SQLite ledger: find by email; auto-provision on first login.
  let user = findUserByEmail(email) as { id: string; pw_hash: string } | undefined;
  if (!user) {
    const ensured = ensureUserByEmail(email, String(su.user_metadata?.name ?? su.user_metadata?.full_name ?? ""), String(su.id));
    if (!ensured) {
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("Account provisioning failed — try again or use email sign-in.")}`);
    }
    user = ensured as unknown as { id: string; pw_hash: string };
  }

  // 2026-11-07 claim-proof law: persist the GitHub handle from the identity.
  const ghHandle = (su.user_metadata?.user_name ?? (su.user_metadata as { login?: string } | null)?.login ?? "") as string;
  if (ghHandle) setGithubHandle(String(user.id), ghHandle);

  // THE COOKIE HOPS ON THE RETURNED RESPONSE (2026-11-07): cookies().set()
  // inside a handler is DROPPED when you return your own NextResponse redirect
  // in Next 16 — set it directly on the redirect object. secure is on because
  // the domain is https-only behind Cloudflare.
  const done = NextResponse.redirect(`${origin}${safeNext}`);
  done.cookies.set("cf_session", sessionTokenFor(user.id), {
    httpOnly: true, sameSite: "lax", secure: true, path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });
  done.cookies.delete("cf_pkce");
  return done;
}