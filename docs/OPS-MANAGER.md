# OPS-MANAGER — Compute Fund infrastructure ledger (v1, 2026-11-04)

*THE single home for "what does Compute Fund depend on, where do its keys live, who
manages what." Every new service we add to the website gets a section here. No secrets
in this file — keys live ONLY at the paths named inside each section.*

**Supabase truth (Gui 2026-11-04, confirmed by CLI):** ORGANIZATION = **`commonweavelabs`**
(the only org; the two empty duplicates were deleted by Gui same day). PROJECT =
**`csujyjibtxpccfvlaujm`**, project name `compute-fund`, region `us-east-2`, created
2026-10-16, engine PostgreSQL 17, status `ACTIVE_HEALTHY`. The app's env points at it via
`NEXT_PUBLIC_SUPABASE_URL = https://csujyjibtxpccfvlaujm.supabase.co`.

---

## 1. SUPABASE — auth provider (GitHub/Google OAuth) + future DB
- **Who manages it:** the agent (Hermes) — full management via Personal Access Token. Gui
  never touches keys.
- **What we use it for today:** OAuth identity only (GitHub + Google, PKCE, server-side
  callback at `/api/auth/callback` → SQLite ledger join). The working ledger = SQLite;
  Postgres is future Phase-2 migration.
- **Management roads (ranked):**
  1. **Supabase CLI v3.0.0** (`npx supabase`, token saved) — orgs/projects list, DB, deploys.
     Login state = PAT saved by `supabase login --token`.
  2. **Raw management API** `https://api.supabase.com/v1/...` with the PAT in the
     `Authorization: Bearer` header (the road used for the 2026-11-04 restore: `POST
     /v1/projects/{ref}/restore`).
- **KEY locations (no secrets here):**
  - PAT (`sbp_...`, named `hermes`): `C:/Users/Guilherme/.config/supabase/pat.txt`
    (ACL-restricted; also revocable at supabase.com/dashboard/account/tokens).
  - URL + anon key + SERVICE ROLE key: `app/.env.local` (git-ignored).
- **The auto-pause incident (documented so it is never mysterious again):** free-tier
  projects pause after ~7 days of NO traffic; a paused project LOSES ITS DNS RECORD, so
  the whole domain 404s/DNS-fails everywhere (looked like deletion on 2026-11-04;
  authoritative NXDOMAIN on dns.google/cloudflare). Restoration = `restore` endpoint,
  takes ~5-10 min ("COMING_UP" → "ACTIVE_HEALTHY"). NOT related to the Nov-2 Drive
  cleanup (that was Drive-only, per DRIVE-TRANSFER-LOG.md — verified).
- **Prevention, LIVE:** guardian cron `aa401daa9afd` — script-only, every 3 days 9am ET
  (`scripts/supabase-keepalive.sh`): sends real keep-alive traffic (auth health), checks
  status, AUTO-FIRES restore if paused, alerts only on failure. Silent when healthy
  (verified: healthy run = empty stdout, exit 0). Zero tokens.
- **Org rename/delete/refactor = dashboard-only** (no API/CLI route exists). 30 seconds
  at supabase.com/dashboard/orgs when wanted; cosmetic only.

## 2. STRIPE — money-in (test rails LIVE)
- **What we use:** hosted Checkout + webhook (SDK-free, `app/lib/stripe.ts`; REST only).
- **Account:** "CommonWeave Labs" sandbox (created 2026-11-04 under the CommonWeave Google
  identity). **TEST MODE = proven end-to-end:** $25 payment (`cs_test_a1JyjN...`,
  payment_status=paid) → webhook flipped pending row `demo:2→0` (`don_4da0fc4de50549108417`)
  → Big Tok $25.00 funded. Real money + live keys + KYC = deliberate go-live step.
- **KEY locations:** `app/.env.local` → `STRIPE_SECRET_KEY` (sk_test_),
  `STRIPE_PUBLISHABLE_KEY` (pk_test_), `STRIPE_WEBHOOK_SECRET` (whsec_). Git-ignored
  (`app/.gitignore` line 34). Revocable in the dashboard, keys page.
- **Webhook:** endpoint registered for `<public-url>/api/webhook/stripe`, event
  `checkout.session.completed`. The dev tunnel is EPHEMERAL — each new tunnel URL needs a
  new webhook endpoint (register via API + update env, ~2 min, agent does it).
- **Test card for the full loop:** 4242 4242 4242 4242, any future expiry, any CVC,
  fictional phone 305-555-0147. Sandbox badge on hosted checkout = normal.

## 3. EMAIL (CommonWeave Labs Gmail) — the secretary
- **Address (set in stone):** commonweavelabs@gmail.com
- **Road:** himalaya CLI v2.2.1 (`C:/Users/Guilherme/bin/himalaya.exe`) + config
  `C:/Users/Guilherme/.config/himalaya/config.toml` (IMAP smtps ports 993/465, v2
  `sasl.plain` schema). App password: stored IN that config (revocable in Google
  Account → Security → App passwords).
- **VERIFIED:** mailbox list + send/self-receive roundtrip (2026-11-04).
- **Cron:** `bd75db84085b` weekly sweep, Mondays 9am ET — triage (MUST-SEE / FOLLOW-UP /
  noise), digest, one Telegram ping per sweep. Read-only; replies = Gui's call.
- **v2 config gotchas:** `mailbox` not `folder`; `message add --mailbox X --send`;
  aliases = `folder.aliases.*` plural dotted keys.

## 4. GITHUB — source of truth
- Org/account: `commonweavelabs-crypto` (umbrella); repo
  `https://github.com/commonweavelabs-crypto/compute-fund`. Auth = Windows GCM OAuth
  device flow (self-refreshing; no PAT churn). Remote main = always pushed after
  milestones (verified pushed through 7260500).

## 5. DOMAINS — acquisition + watch
- Wanted: `commonweave.org` (2012-registered, GoDaddy, empty stub), `compute.fund` (2024
  Tucows, "Coming Soon" holder). TAKEN: computefund.com/.org/.ai. AVAILABLE:
  compute-fund.com/.org, compute.fund.io. compute.fund EXPIRES 2027-01-22 (monthly RDAP
  watch + drop-catch plan).
- Drafts + law: `docs/DOMAIN-NEGOTIATION-2026-11-04.md` (send gated on Gui's sign-off).
- Cron: `28ee17406cc6` RDAP chain (first tick 2026-12-05, self-rescheduling exponential).

## 6. TUNNELS (dev public URL)
- cloudflared quick tunnel: `C:/Users/Guilherme/bin/cloudflared.exe` → localhost:8872.
  The URL changes EVERY run → `CF_PUBLIC_URL` + webhook endpoint must be refreshed
  together with it (2 agent ops). A named tunnel/domain becomes the stable alternative
  when the site goes live.
- app: Next 16.4.5 (`npm run dev -- -p 8872`); known quirk: first `npm run dev` launch
  after npm changes exits to show its upgrade notice — run it twice; the second serves.
- `allowedDevOrigins` MUST include the tunnel host (Next 16 blocks dev resources from
  unknown origins; the block silently kills React hydration site-wide — bit us 11-04).

## 7. CRON INVENTORY (all scheduled jobs)
| job_id | name | cadence | kind |
|---|---|---|---|
| aa401daa9afd | Supabase guardian keepalive | every 3 days 9am | script-only |
| bd75db84085b | CommonWeave inbox sweep | Mondays 9am | LLM digest |
| 28ee17406cc6 | compute.fund RDAP chain | 2026-12-05 start, self-rescheduling | one-shot chain |
| (supervisor) | Hermes_Supervisor task | every 5 min | system (gateway liveness) |

## 8. NEW-SERVICE LAW (what happens when we add the next thing to the site)
1. Gui + agent co-drive the account creation (agent opens pages, Gui does the logins)
2. Keys land in `app/.env.local` (git-ignored) or an ACL-protected config file — never
   the repo, never committed
3. THIS document gets a new section (what/why/how managed/where keys/cron if any)
4. A guardian or sweep cron inherits it if it can break without supervision
5. Roadmap gets the milestone row; the commit lands on `main`; push verified

## 9. Session log — 2026-11-04 (the big day, one screen)
Telegram kill-loop (supervisor session bug) fixed+bounded · 24-link backlog fully vetted
(archive 818 entries) · compute-fund cluster deep-dive filed (N-002 evidence update) ·
Stripe sandbox account + keys + webhook + E2E paid loop PROVEN · hydration root-cause
fixed (allowedDevOrigins) · Next security upgrade 16.4.5 (build-verified, merged) · email
capability live (himalaya + sweeps) · domain negotiation drafts + RDAP chain armed ·
Supabase auto-pause mystery solved (NOT deletion) + restored + guardian deployed.

## STABLE URL — LIVE 2026-11-06 (commit of record: this file + .env.local update)
- DOMAIN: computefund.dev — registered IN Cloudflare (Registrar, at-cost: $8.20 first yr / $12.20 auto-renew; expires 2027-11-06; WHOIS redacted; commonweavelabs.dev also available but NOT yet bought).
- NAMED TUNNEL: `compute-fund` id 9f42eed9-4354-4f46-bf6a-3166acde43de; cert.pem + tunnel JSON in C:/Users/Guilherme/.cloudflared (KEEP SECRET). config.yml routes computefund.dev -> http://localhost:8872. Daemon = background cloudflared tunnel run compute-fund (proc id changes per boot: relaunch with `cd ~/bin && ./cloudflared.exe tunnel run compute-fund`).
- STRIPE: exactly ONE webhook endpoint we_1UYtEBLMEsbbCbMwjgbLcUxc -> https://computefund.dev/api/webhook/stripe (all old quick-tunnel endpoints deleted). .env.local CF_PUBLIC_URL=https://computefund.dev (do NOT rotate with deploys anymore — the domain is permanent).
- CLOUDFLARE ACCOUNT ACCESS: OAuth via Cloudflare MCP (hermes mcp config; browser-authorized 2026-11-06, offline_access). Skills suite installed. cf-login cert = for the CLI only.
- REGISTRAR RENEW-WATCH: expiry 2027-11-06; the RDAP cron (28ee17406cc6) covers it.
- SUPABASE AUTH ROOT FIX (2026-11-06): site_url was the OLD vercel app with an EMPTY additional-redirect allowlist = any origin could complete OAuth (root cause of Gui's "two sites after login"). PATCHed site_url -> https://computefund.dev (management API 200; verified on read-back). Login refusal to old domains now enforced by site_url (the allowlist key is dashboard-only in the management API). Old Vercel project itself: Git ALREADY CONNECTED=FALSE per its dashboard (that's why pushes never deployed); the frozen deployment archive stays per archive law.
- 2026-11-06: SERVICES-MAP.md created per Gui's order (plain-English accounts/roles document; keep updated when services change. Vercel = retired archive; Supabase = identity/engine not hosting; Cloudflare = domain+DNS+tunnel; box = host of record).
