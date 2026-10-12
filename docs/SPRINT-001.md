# MVP Sprint Specification (SPRINT-001, 2026-10-11)
*Single source of truth for the Phase 1 build. Consolidates ROADMAP Phase 1, SPEC-V1,
QUESTION-STANDARD v0, TOKEN-DISTRIBUTION v0, CONSOLIDATION rulings 1–6, BUSINESS-MODEL
fee decisions. Where any doc conflicts, THIS file wins for the sprint; upstream docs
get the pointer, not a copy.*

## The one-sentence MVP gate (from ROADMAP, unchanged)
> One stranger signs up, funds a CFQ-passing project with a card, the platform dispenses
> capped compute against that question, receipts post publicly. Nothing else counts.

## Module map (build order = dependency order)

| # | Module | Path | Owns | Depends on |
|---|--------|------|------|-----------|
| 1 | **db** | `app/lib/db.ts` + `app/lib/schema.sql` | SQLite file DB; schema; typed queries; WAL mode | — |
| 2 | **auth** | `app/lib/auth.ts` + `app/app/api/auth/*` | signup/login/logout; scrypt password hash; HMAC-signed session cookie | db |
| 3 | **auth-ui** | `app/app/login/page.tsx`, `app/app/start/page.tsx` | real form flows: states (idle/submitting/error/success), honest copy | auth |
| 4 | **account** | `app/app/account/page.tsx` | own donations, own projects, sign-out | auth |
| 5 | **cfq** | `app/app/start/project/page.tsx` + `app/lib/cfq.ts` | creation form linting the 10 field rules (schema, not vibes) | auth, db |
| 6 | **stripe** | `app/app/api/checkout/*`, `app/app/api/webhook/*` | demo-mode checkout (no live key): session→donation→receipt write; live-key swap documented | db, cfq |
| 7 | **gateway** | `app/app/api/gateway/*` + `app/lib/gateway.ts` | virtual keys: per-project, hard cap = funded amount, model allowlist from CFQ field 4, spend logged as receipts | db, auth |
| 8 | **receipts** | `app/lib/receipts.ts` | append-only receipts (schema = live `Receipt` type; add CFQ id + output hash fields) | gateway |

## Decisions locked for this sprint (with sources)
- **DB = SQLite** (via `node:sqlite`, Node 22 native — no new deps, WAL mode). Postgres
  migration is a Phase-2 concern (LiteLLM native log store lands then). [SPEC-V1 impl 6]
- **Password hashing = Node crypto scrypt** (built-in, no bcrypt dependency).
- **Session = HMAC-signed cookie** (HttpOnly, SameSite=Lax, 30-day), no session table bloat:
  signed userId+expiry; server re-verifies. [standard practice; no framework lock-in]
- **Tiers for MVP:** $25/$100/$500 (Ruling 3). $5 micro-band = Phase 2.
- **Stripe = demo mode:** endpoints exist, write real donation rows + receipts, marked
  `demo: true`; live key drop-in documented in module README. No test keys committed.
- **Gateway = governed virtual keys** per TOKEN-DISTRIBUTION: hard cap (no rollover, no
  recharge), model allowlist = CFQ field 4 names, endpoint scoping, unspent returns to
  fund. MVP backend = our own LLM router (OpenAI-compatible; Ollama local + cloud keys).
- **Allocation = patron choice** (Ruling 1). Priority score = badge signal only.
- **No revenue-sharing anywhere** (Ruling 2). ToS wall text: non-transferable,
  non-cash-out, "not an investment" (Howey), no deduction claims.
- **CFQ intake = hard lint** of fields 2–10 per QUESTION-STANDARD (field 1 = platform-
  assigned `CFQ-YYYY-NNN`); reject at intake with specific field errors. [anti-cure-cancer]
- **Receipts stay append-only**; add `cfq_id` + `output_hash` columns (Ruling 4).

## Out of scope this sprint (per SPEC-V1 + ROADMAP)
Orgs/profiles (Phase 2), Copy-Project, comments/ratings, live Stripe mode, LiteLLM
self-host swap, OFAC/ID checks (launch-time), $5 tier.

## Verification law (sprint-wide)
- `npm run build` green before any serve.
- Each API module: curl-level integration test against the local server, output logged.
- Anchor-nesting walk + console-clean prod screenshot for every UI route touched.
- A scripted end-to-end "stranger loop": signup → fund (demo) → project passes CFQ →
  gateway spends → receipt appears. This script IS the MVP gate, automated.

## Honesty laws inherited (do not violate in code or copy)
Demo data labeled demo; no invented testimonials/numbers in UI; no fake success states;
every state has a real cause + next action (antislop-ui R-23/R-27); no em dashes in UI copy.