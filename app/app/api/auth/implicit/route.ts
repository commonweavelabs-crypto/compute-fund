// POST /api/auth/implicit — Supabase IMPLICIT-flow completion (fallback leg).
// When the OAuth response arrives as tokens in the URL fragment (implicit flow,
// e.g. pre-PKCE bundles or cached clients), the login page posts the token here;
// the server VALIDATES it against Supabase /user (the client's claim alone is
// never trusted), maps the identity into the local SQLite ledger (same auto-
// provision as the PKCE callback), issues cf_session, and reports the safe next.
// Laws: no token echoed in logs; no user enumeration; fragment tokens are
// single-use input, never stored.

import { NextRequest, NextResponse } from "next/server";
import { getSupabase, isSupabaseConfigured } from "../../../../lib/supabase";
import { findUserByEmail, ensureUserByEmail } from "../../../../lib/db";
import { setSessionCookie, sessionTokenFor } from "../../../../lib/auth";

export async function POST(req: NextRequest) {
  const origin = req.headers.get("x-forwarded-host")
    ? `${req.headers.get("x-forwarded-proto") ?? "https"}://${req.headers.get("x-forwarded-host")}`
    : new URL(req.url).origin;
  const nextPath = new URL(req.url).searchParams.get("next");
  const safeNext = nextPath && /^\/[^/]/.test(nextPath) ? nextPath : "/account";

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured on this deployment — use email sign-in." }, { status: 503 });
  }
  const body = await req.json().catch(() => null);
  const accessToken = body?.access_token;
  if (!accessToken || typeof accessToken !== "string" || accessToken.length > 8192) {
    return NextResponse.json({ error: "No valid access token in the sign-in response." }, { status: 400 });
  }
  const db = getSupabase();
  if (!db) return NextResponse.json({ error: "Auth provider unavailable — try again." }, { status: 503 });

  // Validate the token server-side: /auth/v1/user with Bearer token.
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    return NextResponse.json({ error: "The sign-in token was invalid or expired — sign in again." }, { status: 401 });
  }
  const su = (await res.json().catch(() => null)) as
    | { email?: string; id?: string; user_metadata?: { name?: string; full_name?: string; preferred_username?: string } }
    | null;
  const email = (su?.email ?? "").toLowerCase();
  if (!su?.id || !email) {
    return NextResponse.json({ error: "The connected account exposes no email — is your OAuth email public?" }, { status: 400 });
  }

  let user = findUserByEmail(email) as { id: string; pw_hash: string } | undefined;
  if (!user) {
    const ensured = ensureUserByEmail(email, String(su.user_metadata?.name ?? su.user_metadata?.full_name ?? ""), String(su.id));
    if (!ensured) {
      return NextResponse.json({ error: "Account provisioning failed — try again or use email sign-in." }, { status: 500 });
    }
    user = ensured as unknown as { id: string; pw_hash: string };
  }

  await setSessionCookie(sessionTokenFor(user.id));
  return NextResponse.json({ ok: true, next: safeNext });
}
