// GET /api/auth/callback — Supabase OAuth callback (GitHub/Google), PKCE code flow.
// Exchanges the code SERVER-SIDE (never on the client), verifies the Supabase
// user, auto-provisions the local SQLite user by email, issues the app's
// cf_session cookie, and redirects. Unconfigured Supabase -> honest 503.
// Laws: no user enumeration errors; no token echoed; browse-first (redirect
// honors ?next= only for same-origin paths).

import { NextRequest, NextResponse } from "next/server";
import { getSupabase, isSupabaseConfigured } from "../../../../lib/supabase";
import { findUserByEmail, ensureUserByEmail } from "../../../../lib/db";
import { setSessionCookie, sessionTokenFor } from "../../../../lib/auth";

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
  const { createClient } = await import("@supabase/supabase-js");
  const SURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SKEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!SURL || !SKEY) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("Auth provider unavailable — try again.")}`);
  }
  const shim = {
    getItem: (k: string) => (k.endsWith("-code-verifier") ? pkce : null),
    setItem: () => {},
    removeItem: () => {},
  };
  const authDb = createClient(SURL, SKEY, {
    auth: { flowType: "pkce", persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, storage: shim as never },
  });

  const { data, error } = await authDb.auth.exchangeCodeForSession(code);
  if (error || !data?.user) {
    // TEMPORARY diagnostics (2026-11-07): surface the exchange failure reason
    // server-side in the log + as a short cause hint on the login redirect.
    // Supabase error messages are non-secret; the code/verifier are not echoed.
    const cause = error?.message ?? "no user in exchange response";
    console.error("[auth/callback] exchange failed:", cause);
    const short = cause.split(/[.;]/)[0].slice(0, 120);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("Sign-in exchange failed — try again.")}&cause=${encodeURIComponent(short)}`);
  }
  const su = data.user;
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

  await setSessionCookie(sessionTokenFor(user.id));
  const done = NextResponse.redirect(`${origin}${safeNext}`);
  done.cookies.delete("cf_pkce");
  return done;
}