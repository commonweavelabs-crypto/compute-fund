// Supabase auth clients — ported from compute-fund-v0 verbatim (lazy + null-safe).
// LAW (inherited): no module opens a network connection at import time; every
// call site checks for null and the app falls back to email+password auth.
// This main line uses Supabase AUTH ONLY (identity: email + GitHub + Google);
// the working ledger stays SQLite — joined by users.supabase_user_id.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

let browserClient: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;

export function isSupabaseConfigured() {
  return Boolean(URL && ANON);
}

/** Anon-key client for OAuth code exchange (server-side callback route). Null when unconfigured. */
export function getSupabase(): SupabaseClient | null {
  if (!URL || !ANON) return null;
  if (!browserClient) {
    browserClient = createClient(URL, ANON, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return browserClient;
}

/** Service-role client: verify-then-provision user lookup during OAuth callback. Server-only. */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!URL || !SERVICE) return null;
  if (!adminClient) {
    adminClient = createClient(URL, SERVICE, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return adminClient;
}