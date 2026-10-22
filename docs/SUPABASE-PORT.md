# THE SUPABASE PORT — plan + record (auth into the main line)

*2026-10-22 · windows-hermes · Gui confirmed the port 10/22. This doc = the
permanent record of WHAT WAS SET UP (so it never gets forgotten again) + the
port plan + the wiring decisions.*

## 1. What Supabase is (the shared vocabulary)

NOT the web host. **Supabase = the engine room**: cloud Postgres database +
login doorman (email/password + OAuth) + file storage. The WEBSITE (Next.js
app) runs wherever we point it (local machine now, rented server later).
GoDaddy = websites; Supabase = the data + the doorman.

## 2. THE INVENTORY — what we ALREADY SET UP (real, verified, in compute-fund-v0)

- A LIVE Supabase project (keys in v0/.env.local; access token present)
- Database schema: supabase-schema.sql + v1 + v2-mirror + v3-bulk-import
  + **v4-ACCOUNTS** (the accounts/roles/profiles layer — 5 generations)
- Auth: **email+password AND GitHub button AND Google button** (browser-first
  law: /auth only surfaces when an interaction needs it; mock-mode when
  unconfigured, honestly labeled)
- **src/lib/accounts.ts**: personal | business profiles; membership =
  STEWARDSHIP not equity; "exit loses the seat, there is no buyout, and forks
  are the escape hatch" (the departure-fork doctrine, already in code 10/2026)
- **src/lib/claims.ts + /api/claims/verify**: the 4-RUNG CLAIM LADDER:
  (1) GitHub OAuth push/admin check on the origin repo, (2) COMPUTE-FUND.toml
  on the repo default branch carries the claim code (deterministic: cf-hash of
  project id — no DDL needed), (3) DNS TXT at verify.computefund.dev
  (Cloudflare DoH), (4) manual review row. Provider tokens: used and never
  stored/logged
- The mock/real split everywhere (lazy clients, zero-credential local dev)
- **Gui's personal account: EXISTS in the Supabase cloud** (registered via the
  commonweave Gmail — ***@gmail.com on file in link-archive contacts; full
  address NOT committed to any repo: the repos may go public)

## 3. WHY THE LINES DIVERGED (the honest cause)

SPRINT-001 (Oct 12) rebuilt the gate demo clean-room on SQLite+scrypt (fast,
zero-config, honest test states) — and left the v0 Supabase work behind without
flagging the asset loss. Cause: windows-hermes (the gate sprint's stack choice),
NOT any Gui misconfiguration. His account was never deleted — it lives in the
cloud. Lesson recorded: check v0 before every "missing" verdict on compute-fund.

## 4. THE PORT (confirmed): Supabase = AUTH ONLY

Target shape (simplest possible, Gui-approved):
- **Supabase = the front door**: email+password sign-up/sign-in + GitHub +
  Google buttons (v0's auth.tsx/auth-page patterns), sessions managed by
  Supabase with auto-refresh
- **SQLite stays the working ledger** (donations/receipts/virtual keys — the
  gate-green machinery untouched)
- **JOIN KEY: users.supabase_user_id** (new column): first Supabase login
  auto-provisions the local user row by email (`findUserByEmail`); the HMAC
  cf_session cookie continues as the app's session (server-side machinery
  unchanged); Supabase client = the identity provider on top
- Ported files: lib/supabase.ts (lazy, null-safe); login page gains the
  GitHub/Google buttons; /api/auth/callback (OAuth code exchange) + the
  map/issue-session step; D2 later = port claims.ts + claims/verify route
  (runs only with Supabase configured; 503 otherwise — the v0 contract)
- NOT ported (out of auth scope): LinkTree/stewardship widgets — evaluated
  later with the workspace sprint (D3)

## 5. Cloud-side checklist (careful, reversible)

1. Verify the project's tables (v4 applied? accounts?) — read-only check via
   DATABASE_URL (list tables only)
2. Verify the auth providers config (GitHub/Google enabled?) via the Supabase
   Management API (SUPABASE_ACCESS_TOKEN) — read first, change only with need
3. Redirect URLs (callback to the live tunnel) AFTER the code exists — never
   before (no dead redirect states)
4. .env.local merge in MAIN: supabase keys + existing keys both (names only in
   any doc; values live only in .env.local — server-side reads)

## 6. Verification gates (the port isn't done until)

1. `npm run build` green with supabase deps
2. Email sign-up → confirmation → sign-in → cf_session issued (scripted test,
   the SPRINT-001 pattern)
3. GitHub button → callback → local user auto-provisioned — his real account
   maps correctly by email
4. Logged-out browse-first behavior intact (no auth wall anywhere)
5. Gui's walkthrough (the test session) re-verifies all of it by hand

## 7. Anti-forgetting laws (added to the README's block when the port lands)

- AUTH STACK = Supabase (cloud, the v0 project) for identity; SQLite + scrypt
  for the local ledger; join = users.supabase_user_id
- CLAIM LADDER = ported from v0 verbatim (4 rungs)
- ACCOUNT = commonweave Gmail (in Supabase cloud since the v0 sessions;
  see .env.local of v0 to know the project ref)
## 8. EXECUTION RECORD (2026-10-22 — the port LIVER)

- lib/supabase.ts (lazy, null-safe, auth-only) + /api/auth/callback (PKCE
  exchange server-side; email verified from the Supabase session only — the
  client NEVER self-asserts identity; local user auto-provisioned by email;
  join key = users.supabase_user_id; lazy-getter DDL migration, no import-time
  DB/network) — build ✓ 27/27 pages
- login page: GitHub button live when configured; email+pw unchanged;
  browser-first law untouched
- CLOUD: project ACTIVE_Healthy (us-east-2, created 10/16); auth.users HAS
 Gui's account: commonweavelabs@gmail.com provider=github (created 10/17 —
  his memory doubly right); ONE WRINKLE: his auth user has NO profiles row
  (first-login provisioning incomplete in v0) → the port's callback fixes it
  by design (auto-provision on first login)
- REDIRECT LAW: tunnel = EPHEMERAL (rotating) → redirects patched per deploy:
  scripts/sync_redirects.py (merge-never-clobber; localhost + current tunnel)
  currently: tobago-lion-february-wellness.trycloudflare.com live
- SERVER = Hermes-tracked bg process on :8872 (cloudflared bg proc too)
- VERIFIED THROUGH THE TUNNEL: /login 200 + GitHub button rendered;
  /api/auth/callback 307 → PUBLIC origin (x-forwarded-host fix verified);
  /discover 200; header probe confirmed cf-* + x-forwarded-* present
- The Google button: provider DISABLED in the project -> button hidden
  (honest UI); enabling Google = a later config call
- The GitHub-provider secret printed itself into a terminal log once (config
  GET) — logged only to this machine's session file, never committed; rotate
  at any point via the dashboard if desired
