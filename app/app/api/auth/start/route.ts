// GET /api/auth/start?provider=github — OAuth START, server-side.
// Gui's login broke because the client-side supabase-js PKCE dance (async
// chunk loader) died silently in real browsers: button clicks did nothing.
// This route replaces that whole dance with a plain anchor: it generates the
// PKCE verifier, hands it to the callback via the cf_pkce cookie shim (the
// exact cookie the callback route already reads), and 302s to Supabase.
// Laws: allowlisted providers only; no token echoed; same-origin redirect_to.

import { NextRequest, NextResponse } from "next/server";
const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SKEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const PROVIDERS = new Set(["github", "google"]);

export async function GET(req: NextRequest) {
  if (!SUPA_URL || !SKEY) {
    return NextResponse.redirect(`${new URL(req.url).origin}/login?error=${encodeURIComponent("Auth provider unavailable — use email sign-in.")}`);
  }
  const provider = new URL(req.url).searchParams.get("provider") ?? "github";
  if (!PROVIDERS.has(provider)) {
    return NextResponse.redirect(`${new URL(req.url).origin}/login?error=${encodeURIComponent("Unsupported provider.")}`);
  }
  // Public origin: behind cloudflared the forwarded host is the real one.
  const fwdHost = req.headers.get("x-forwarded-host");
  const proto = req.headers.get("x-forwarded-proto") ?? (fwdHost ? "https" : "http");
  const origin = fwdHost ? `${proto}://${fwdHost}` : new URL(req.url).origin;
  const nextPath = new URL(req.url).searchParams.get("next");
  const safeNext = nextPath && /^\/[^/]/.test(nextPath) ? `?next=${encodeURIComponent(nextPath)}` : "";

  // PKCE: verifier 64 chars (43-128 allowed), challenge = BASE64URL(SHA256(verifier))
  const verifier = Array.from({ length: 64 }, () =>
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~"[Math.floor(Math.random() * 66)]
  ).join("");
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  const challenge = Buffer.from(new Uint8Array(digest)).toString("base64url");

  const authorize = new URL(`${SUPA_URL}/auth/v1/authorize`);
  authorize.searchParams.set("provider", provider);
  authorize.searchParams.set("code_challenge", challenge);
  authorize.searchParams.set("code_challenge_method", "S256");
  authorize.searchParams.set("redirect_to", `${origin}/api/auth/callback${safeNext}`);

  const res = NextResponse.redirect(authorize.toString());
  res.cookies.set("cf_pkce", verifier, {
    httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 600,
  });
  return res;
}
