# CONSOLIDATION PASS — analysis + plan (2026-11-04 evening, post-walkthrough C-#)

*Gui's walkthrough finding: the first page he landed (Vercel) and the logged-in page
look like "two completely different websites." This document = the analysis + the plan.
NO CODE CHANGES YET — every decision below is open for Gui's spec pass. Flags numbered
C-1..C-7 per the audit-appendix law; fixes land numbered, never silently.*

## The origin of the two sites (C-1 — FACT, verified)

| | **Vercel site** (what he landed on first) | **Main line** (tunnel / localhost:8872) |
|---|---|---|
| Source | GitHub `commonweavelabs-crypto/compute-fund-site` = the **compute-fund-v0** repo (rich deployed reference, A1-A9 milestone era: 53 natural-photos art batch + living hero video via LTX-2.5, hero-video reduced-motion fallback) | THIS repo (`commonweavelabs-crypto/compute-fund`) — the SQLite main line: auth, CFQ, funding, receipts, claims, gateway |
| Deployed surface | ONE polished page + `/tos` — **everything else in its nav 404s** (Dashboard / Discover / My Projects = dead links) | FULL APP: home v1.5, /start/project (drafts+uploads), /p/[slug], /account, claim flow, Stripe paid loop, receipts |
| Footer | **NO <footer> element at all** (verified live HTML) | FULL footer: Discover (All projects · Final days · Question of the Month) · Creators (Start a project · CFQ guide · Receipt law) · About (Our rules · Source code · Brand assets) · tagline · X/YouTube/GitHub · giant wordmark |
| OAuth | GitHub attempt → `bad_oauth_state` (PKCE state stale between the deployed origin and the restored Supabase project) — NOT worth fixing on an archived site | wired + verified healthy |

**Verdict:** these really ARE two different websites. The platform of record = the MAIN
LINE (SQLite + Stripe + claims run on it; the $25 loops were real). The Vercel site is
the old design reference left deployed.

## C-2 — the Vercel deployment (Gui decides: park, or replace-with-redirect)
Options: (a) leave as static archived reference (zero work), (b) replace its deployment
with a one-line redirect page → the live platform URL (clean for partners clicking old
links), (c) custom domain later makes this moot. **NOT deleting anything** per law.

## C-3 — pre/post-login consistency (the bug as Gui felt it)
Audit result: the main line already mounts ONE Shell (header+footer) from the root
layout on every route — BUT (verified) the `/discover` Phase-2 stub page ships a
DUPLICATE header of its own (old furniture) = the inconsistency he can see pre-login.
Plan: de-duplicate /discover's furniture onto the single Shell; sweep every route
(`/login`, `/guide`, `/org/[slug]`, `/p/[slug]`, `/start/*`, `/account`) for furniture
drift with the scripted furniture-check (count header/footer mounts per page = must be
1/1).

## C-4 — what to PORT from v0 (the parts Gui values — his call, tick to build)
- [ ] **The footer items he listed** already exist on the main line (verified verbatim:
  Discover / Creators / About columns + socials + wordmark) — the fix = make them appear
  on EVERY page including login + discover-stub (C-3).
- [ ] **The 'Recommended for you' TABS** (trending / newest / ending soon / community
  priority) — v0 had them as UI; main-line has only newest. Port as real filters off
  /api/home (each = one sort/limit on existing columns; budget_credits + funded math).
- [ ] **The values trio band** ("A community of builders" / "Receipts you can verify" /
  "No dead tokens") — copy exists verbatim in the Vercel page text; drop into the
  main-line home below the fold.
- [ ] **The living hero + art batch** (53 natural photos + LTX-2.5 hero video loop +
  reduced-motion fallback — assets sit in the v0 repo's public/): port selected assets
  into the featured hero. Decision: which of video/photo/skin-only.
- [ ] **Nav completeness:** v0 promised Dashboard / My Projects / Discover. Main line has
  /account + /discover (stub) — wire the labels to the real routes and de-404 the set.

## C-5 — the /project/[slug] vs /p/[slug] split
Both coexist by design during the sprint (seeded hand-built pages vs DB pages).
Consolidation: keep both link types ONLY if seed pages keep value; else redirect
`/project/[slug]` → the DB-rendered page. Open for the spec pass — NOT changed today.

## C-6 — old-page archiving law
Nothing deleted. The v0 repo stays as the design corpus; this plan becomes the pointer.
Any v0 page/port decision that loses nothing: art assets are COPIES into the main-line
public/ when adopted, originals untouched.

## C-7 — the stable URL question (the walkthrough environment)
The Vercel confusion happened partly because TWO urls existed. Plan options (Gui
decides): (a) tunnel-only until live mode (current; ephemeral URLs, re-register webhook
each time), (b) named cloudflare tunnel → stable URL on the box (5 min, survives
reboots, no domain purchase), (c) full custom domain + deploy pipeline (Phase-3). The
walkthrough continues on (a)/(b) regardless.

## REVERSAL — recorded 2026-11-06 after Gui's walkthrough feedback (C-8..C-10)

**C-8 — direction correction (Gui's verdict, verbatim intent):** the v0 deployed page
(compute-fund-site.vercel.app) = the CORRECT template — "the redesign, the new layout…
it was perfect the way it was. We were just missing the footer." The main-line homepage
v1.5/v1.6 (terminal-minimal skin) mis-read the brief and reads as generic. The v0
DESIGN — its structure, tokens, typography (display/mono duo), hero with rotating
featured photo-card, Recommended-with-tabs, Open-for-funding strip, value props,
per-project ART imagery — becomes the main-line homepage's design language. The
working rails (SQLite, /api/home tabs, routes, claim/checkout/receipts) stay as-is.

**C-9 — project images return:** v0's public/project-art = 52 hand-batched PNGs
(plus hero.png + hero-loop.mp4). COPY ONLY the files mapped to live projects (repo
weight law; the full 62MB batch stays archived in the v0 repo). Card art = static
slug→file map (app/lib/art-map.ts), illustrations honestly labeled as illustrative
until a creator uploads their own.

**C-10 — footer fidelity + centering fix:** the FULL footer (all columns + items
verified 2026-11-04) is restyled into the v0 skin and the giant wordmark clipping/
centering bug is fixed (no cut-out glyphs anywhere, centered layout per element).
