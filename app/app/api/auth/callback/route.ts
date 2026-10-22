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
  const db = getSupabase();
  if (!db) return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("Auth provider unavailable — try again.")}`);

  const { data, error } = await db.auth.exchangeCodeForSession(code);
  if (error || !data?.user) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("Sign-in exchange failed — try again.")}`);
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
  return NextResponse.redirect(`${origin}${safeNext}`);
}