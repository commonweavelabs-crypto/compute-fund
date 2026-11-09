# Compute Fund — Roadmap (consolidated 2026-10-07)

> **INFRASTRUCTURE LEDGER: `docs/OPS-MANAGER.md`** — THE document for every managed
> service (Supabase/Stripe/Gmail/GitHub/domains/tunnel): what it is, where its keys
> live, how it's managed, its cron. New service = new section there (new-service law,
> file §8). Read it FIRST when anything with keys/auth/billing acts up.

*Consolidates: current v1 build + David-era corpus (30+ docs: MANIFESTO/ZUCK-ESSAY/Golden
Ticket/prototype/case study) + Gui's 2026-10-07 direction (deterministic questions, MVP =
legal money-wire, profiles, project pages). Conflicts resolved per CONSOLIDATION.md.*

**The spine = the money wires:** money IN (patronage) → governed compute (Question Standard
+ gateway) → receipts OUT (public ledger). Everything else hangs off those three rails.

---

## Phase 0 — DONE (v1 static)
- [x] One-page grid: 4 seed projects, funding progress, $25/$100/$500 tiers
- [x] Dual themes (Terminal Commons dark / Carbon Ledger light, one skeleton)
- [x] Demo receipts schema = production schema (typed, migration-cheap)
- [x] CommonWeave footer + socials + investors:none badge
- [x] ORIGIN.md + attribution layer (tierllama, jev-triage, compute-fund)
- [x] Spec, Question Standard v0, Token Distribution arch, legacy consolidation

## Phase 1 — MVP: "the smallest legal loop that moves compute"
- [ ] SPEC-V2 WRITTEN (docs/SPEC-V2.md): the game-theory layer as data models + valves + phase mapping; 'build it' = section 7 sequence
- [ ] PILOT PROPOSAL DRAFTED (docs/PILOT-PROPOSAL.md): 'The Fire Pilot' done-for-you tier; awaiting Gui: green light + cap number + target pick + the send
*Gui's definition adopted: login + legal guardrails + real governed compute + receipts.*
- [x] **Project pages (v1.5)** — click a card → creator-authored page: hero, story, roadmap, funding state, receipts, CFQ id. [DONE 2026-11-04: story + roadmap = creator-authored long-form fields in the create form + rendered on /p/[slug]; everything in this box is LIVE; commit 227408a] (Current homepage becomes CommonWeave Labs profile page + avatar circle.)
- [x] **Platform homepage v1.5 (KS-arrangement, our skin)** — header: logo + mock search + CFQ-domain category strip + "Start a project" + Log in; centered slogan; seasonal/featured **Question-of-the-Month** hero; Featured project (progress line ON the image, meta row "time left • % funded", desc, tag chips incl. location) + "Recommended for you" 2x2 with mini progress-underlines + pagination; "Home Stretch" urgency row; **creator hover-card popup** (X created · Y funded · community-loved count · joined date · mini bio → profile link); creator-guide cards ("Every experiment starts with the same question..." vertical accent bars); Crowdfunding/Compute Tips 4-card row; footer w/ CFQ-domain columns + giant wordmark + language/currency + legal row. **Layout law: arrangement adopted from KS reference shots (Oct 2026), skin 100% ours (Terminal Commons/Carbon Ledger); no KS branding, artwork, or copy.** — BUILT 2026-11-04: /api/home + sections live, zero-rows path + a11y pass verified; commit 5c3e8dc
- [ ] **CFQ intake** — Question Standard enforced at project creation; LLM format-interpreter prompt published; lint = fields 2–7 machine-checked
- [ ] **Auth & accounts** — signup/login; user account first; org profile second (org = created under a user, linked, TRANSFERABLE to other users, not owned); backer can become creator by creating an org or a project; projects may live under personal profile OR org (both legal, org default-rec)
- [ ] **Stripe money-in** — David-era pattern reused (checkout + webhook, graceful fallback); receipt per patron incl. priority credit — **[E2E PROVEN 2026-11-04: sandbox account + keys in `app/.env.local` → tunnel (cloudflared) → signup email-auth → $25 checkout session `cs_test_a1JyjN...` → hosted checkout PAID (Stripe API: payment_status=paid) → webhook flipped `demo: 2 → 0` (don_4da0fc4de50549108417) → Big Tok $25.00 real funded. Fix landed with it: `allowedDevOrigins` in next.config.ts (Next 16 blocked /_next/hmr from the tunnel host = site-wide dead hydration). Remaining for MVP gate: Supabase ref csujyjibtxpccfvlaujm NXDOMAIN (project deleted/paused — OAuth pending; email-auth fine in test) + live keys + KYC at go-live.]**
- [ ] **LiteLLM gateway money-out** — virtual keys per project, hard cap = donated amount, model allowlist, endpoint scoping, audit log = receipts → replaces demo data (schema already matches)
- [ ] **ToS stack** — non-transferable/non-cash-out wall, Howey wall ("not an investment"), no-deduction clause, CFQ release/revoke clause; email+phone ID, OFAC screening
- [ ] **MVP gate:** one stranger signs up, funds a CFQ-passing project with a card, platform dispenses capped compute against that question, receipts post publicly. Nothing else counts.

## Phase 2 — Profiles, Copy-Project, community surfaces
- [x] **D5 discovery engine v1 (BUILT 2026-11-06, dev-verified): the SHOWCASE layer's data
  spine — one real event stream (events: view/fund/follow/claim, weights fund×10/follow×3/view×1
  hardcoded at query time, never stored) + follows ledger (per-user toggle, /api/follow) +
  SQL rollups in lib/discover.ts (velocity7d / buzzing / forkingReady abandonment law /
  communityPicks / mostFunded30d / affinity v1 with naive projects.category backfill) wired
  into the homepage mechanism rows (Staff picks = Gui-owned staff_pick flag, still 0
  everywhere; What's buzzing now / Ready for forking / Community picks / Most funded this
  month) and /api/home + /discover tabs (trending = velocity; community priority = follows
  + velocity tiebreak, the real M6.1 seed). Every row auto-hides under 2 qualifying projects
  (staff picks: 1) — an empty mechanism is an honest empty, NEVER a synthesized event.
  Tests: app/scripts/d5_discover_test.py (42 checks, rollup rules run the REAL lib against
  a seeded DB COPY; live wiring verified read-only + scratch-session HTTP).**
- [ ] Copy-Project button ("adopt and rename" — the bootstrap mechanic)
- [ ] Search + discovery (deliberately non-addictive: weekly top list, optional swipe mode, never a slot machine)
- [ ] SHOWCASE LAYER (Gui 10/18): weekly top-EXCITEMENT projects featured on the landing hero (computed: donation velocity + Standing-weighted engagement); discover page: categories + filter/search algorithms (Kickstarter-style taxonomy; research at milestone execution) + the M6.1 OPEN-GATES section (mismatch/up-for-grabs feed — see game-theory doc)
- [ ] Follow vs funding split; auto-follow on fund (David-era pattern)
- [ ] Comments ON RELEASES only; ratings; community badges ("Compute Sponsor")
- [ ] Public answer pages: popular-questions funding (v1 of manifesto's phases)


### Phase 2 addition — Community governance (Hephaestus Doctrine)
Flags: non-tradeable governance objects; weight = 12-month average engagement (decays;
anti-oligarchy); one flag staked per project per user; each flag raises that project's
compute price; economic kill via price pressure, no ban lists; surpluses subsidize
low-flag projects. Values community-adjustable. Safety layer ABOVE the CFQ intake lint.
Full thesis + mechanics + competitor scan:
`C:/Users/Guilherme/.hermes/projects/link-archive/brainstorms/hephaestus-doctrine-community-governance.md`
(schema prep already compatible: donations table carries user/amount/date already; zero
MVP-sprint impact).

### Phase 2 addition — NFX alignment (from NFX-ALIGNMENT.md, 2026-10-19)
Source: NFX Masterclass Ep.4 "Hidden Patterns of Great Startup Ideas" (full
transcript analysis; docs/NFX-ALIGNMENT.md). Not in stone:
- [x] N-1 Name the network core: docs/NETWORK-CORE.md — receipts-graph as the
  core data-network effect; seed graph = pilot fleet + roster; open/data policy
- [x] N-2 docs/RISK-INVENTORY.md: every risk stack (regulatory/payment-geo/
  provider-dependency/fraud/governance/cold-start/key-person), owner-tagged
- [ ] N-3 COMPLEXITY FIREWALL (standing law): new mechanisms phase-gated; MVP =
  charter + claim + receipts + ledger only (zero-MVP-impact, now explicit)
- [ ] N-4 advisor bench: 2-3 scarred platform operators reading weekly receipts
- [ ] N-5 Open-Gates = the red-ocean scanner (demand-proven, delivery-starved =
  priority fire targets)
- [ ] N-8 play-to-win gate: first GREEN PILOT receipts -> the all-in outreach
  sprint (posture flip scheduled, not mood-based)
(Execution-risk-only pilot checklist + boundary-layer tracking live in the
pilot proposal itself - see NFX-ALIGNMENT.md #3/#7.)

### Phase 1 addition — THE THREE DOORS sprint (Gui's test-run plan, 2026-10-22)

Gui opened the third stage: before ANY public opening, he runs the whole thing
as its first real user (claiming + creating + funding his own work). Doors:

- [ ] D1-AUTH: PORT THE SUPABASE AUTH from compute-fund-v0 (CORRECTION 10/22:
  Gui was right - the setup session was real; v0 holds @supabase/ssr wiring,
  auth.tsx, accounts.ts, supabase-schema-v4-accounts.sql AND src/app/api/
  claims/verify = the claim flow ALSO exists in v0; the SPRINT-001 SQLite
  rebuild left it behind; his Supabase account exists in the cloud already).
  Decision pending: supabase-auth as PRIMARY (port, recommended) with SQLite as
  local fallback, or re-verify email+pw first; his real account = already in
  the Supabase cloud (v4 accounts schema); GitHub login via supabase OAuth = the
  flow he tested
- [ ] [x] D3-CREATE-FLOW: creator workspace: /create (CFQ lint EXISTS already) +
  image/logo upload (served statically; no third-party host) + repo/links
  fields + DRAFT state (private, personal-profile workspace) + PUBLISH ->
  public page + org/business-account creation under a user (transferable per
  existing law - org page already renders from data)
- [x] D3-TEST: scripted integration tests for the whole create path (the
  SPRINT-001 stranger-loop test pattern extended); feature/debug PAIRED
- [x] D2-CLAIM-FLOW: research-imported projects loaded as UNCLAIMED stubs
  (from the link-archive pilot targets: MiroFish/last30days/colibri/tierllama)
  + claim flow on the project page: maintainer proof -> executor role (DONE
  2026-11-04: 4 stubs seeded unclaimed; claim = repo-proof gated, ownership
  TRANSFERS with an ops receipt; tierllama left UNCLAIMED for the pilot; tests all-pass)
- [ ] D3-PILOT-PIPE-TEST (Stage 0 of PILOT-PROPOSAL): Gui claims HIS dogfood
  project (tierllama bench row already seeded) + self-funds $50-100 + gateway
  run + receipts public = the first REAL receipts story
- [ ] MVP-GATE rerun with REAL USER (Gui): the stranger loop by the platform's
  first actual user, on the deployed tunnel

Build order: D1 -> D3 -> D2 -> tests -> Gui's walkthrough -> Stage 0 -> launch.

### R-series — THE RECEIPTS ENGINE (Gui directive 2026-11-06: MVP-critical, "the core of our engine")

Gui's standing correction 11/6: collecting money without a real receipt engine is
unacceptable — receipts ARE the offer. Modular law applies: the engine = backend
modules, swappable front-end; every receipt = platform DB row, append-only, public,
timestamped, hash-carrying, tying funder -> builder -> output. Blockchain anchoring =
opt-in TOGGLE (per project/user), designed-for now, integration later — never MVP-gated.

- [ ] **R1 RECEIPTS-CORE (solidify the spine):** receipts schema hardened + append-only
  law enforced at the DB level (no UPDATE/DELETE path in code), receipt kinds enumerated
  (ops / payment / milestone / artifact / commit / review / rent), provenance fields
  (actor, artifact sha256, external link, CFQ id, timestamps UTC), public receipts page
  per project (exists — carry forward), export endpoint (JSON, per project + per user
  passport view), demo-labeled test rows quarantined (carry the demo law). Done criteria:
  scripted test mints every kind + public pages render + exports verified; falsified by:
  any mutation path on a settled receipt, or a receipt kind invisible on the public page.
- [ ] **R2 RECEIPTS-INGEST-GITHUB:** project links its repo (D1-verified first); poller +
  webhook intake for commits/releases/issues tagged with the CFQ id (commit message or
  branch convention documented on the charter), idempotent minting (dedupe key = repo+sha),
  rate-limit-safe, toggle per project. GitHub = evidence source, NOT the ledger: our rows,
  our hashes. Done criteria: one real commit on a linked repo auto-mints exactly one
  receipt (idempotent on re-poll); falsified by: duplicate receipts or unverified commits
  minting rows. (Nexus Mods + other hosts ride the same intake interface — no special cases.)
- [ ] **R3 RECEIPTS-ARTIFACTS (non-git outputs):** the upload + verify flow for outputs
  living outside GitHub: artifact upload -> server-side sha256 -> receipt row -> external
  host link (Nexus Mods pattern, connector templates per host: nexus/itch/sketchfab
  generic shape) + peer-rating rollup attaches judgments to the receipt. Modular
  connector interface so new hosts plug in without engine changes. Done criteria: modder
  flow (upload artifact, link host, peers rate) produces a judged receipt end to end;
  falsified by: any output class needing a code branch outside the connector interface.
- [ ] **R4 RECEIPTS-ANCHOR (toggle-aware design):** hash-chain the receipt ledger
  (prev-hash rows), periodic Merkle root per project, OPTIONAL anchoring toggle (public
  chain, later); passport tie-in = personal receipts survive merges (DATA-WEALTH §16.4).
  MVP scope = the hash chain + toggle plumbing and one export format; NO chain integration.
  Done criteria: tamper-evident verification script (drop a row -> chain breaks visibly);
  falsified by: silent editability anywhere in the chain.
- [ ] **R5 FORK-RENT PORT (from compute-fund-v0; the D-port item, pulled forward as
  MVP per Gui 11/6):** port forks.ts + plugin_splits from v0 (fork edge, fork_rent_pct
  5-20 default 10 frozen at fork time, one-hop, capped-max inheritance on merge), fork
  buttons on project pages (forkable even when parent UNCLAIMED — payee = parent's
  current custodian, cf_system until claimed), fork-of-fork cascade = one-hop only,
  receipts for rent events; upstream-import law respected (fork the platform record,
  not just the git URL). Done criteria: fork an unclaimed import on-platform ->
  split row visible + receipt minted on first funded flow through the fork; falsified
  by: any cascade paying grandparent-level rent, or fork paying a frozen-rate violator.
- [ ] **R-dep D1-EXPAND CLAIM OWNERSHIP CHECK (expands existing D1-AUTH):** claim proof
  upgrades from string-match to GitHub ownership verification (claimant's GitHub identity
  linked, repo owner check via API: claimant must own/admin the repo OR fork from it
  per fork law); the negative test: claiming JuneYaooo/rea-video by a non-owner FAILS.
  Done criteria: negative test passes + one positive claim via verified identity;
  falsified by: a non-owner claiming an imported upstream.

### A-series — AGENT-PAYMENTS UNLOCKS (Gui directive 2026-11-06: spec + milestone; spec = docs/AGENT-PAYMENTS-UNLOCKS.md)

The Stripe agent-to-agent rail (business pays business by handle; an agent executes
once the human says yes) is the natural payment shape for the most agent-native
platform on the internet. ALL items are gated on R1 receipts + the Stripe agent-pay
API VERIFICATION (read the real docs first — the reel's claims stay UNVERIFIED until
checked against Stripe's published API; verification rides the FOUNDER-WATCHLIST pass).

- [ ] **A-VERIFY STRIPE AGENT-PAY** — read Stripe's published agent-payments docs/API;
  confirm: by-handle B2B payments, agent-scoped authorization, refund/dispute path.
  Output = a one-page verdict appended to docs/AGENT-PAYMENTS-UNLOCKS.md (GO / NO-GO /
  SHAPE-CHANGED). Falsified by: any A1-A4 build starting before this verdict exists.
- [ ] **A1 AGENT PATRONS** — subscribe-once auto-funding of a project's new milestones
  (per-project + monthly hard caps, charter gate on eligible milestones, kill switch,
  `funded-by-agent` provenance on every receipt). Charter-shaped acceptance: a
  subscribed agent funds exactly one in-cap milestone; revoke stops everything; the
  receipt chain shows instruction -> payment -> run.
- [ ] **A2 AUTOMATIC UPSTREAM RENT** — rides R5: rent to a fork's parent custodian
  routes through Stripe (incl. the agent rail) automatically on funded flows; the
  rea-video upstream case is the acceptance fixture (funded fork emits the rent
  receipt to the parent's current custodian, cf_system until claimed).
- [ ] **A3 AGENT COMPUTE MARKETPLACE** — opt-in provider registry; funded projects buy
  compute by handle; ledger records funder -> builder -> provider chain as matching
  public receipt pairs (DATA-WEALTH §16.4 logic). Phase-2 scope.
- [ ] **A4 AUTO-REPLENISH PATRON POOLS** — Stripe recurring: standing monthly
  patronage tops up a low pool within a hard cap; one top-up per event + receipt.
- [ ] **D-TAKEDOWN REQUEST PATH (Gui 11/6, import-law addendum)** — every UNCLAIMED
  import page carries a "request takedown" affordance (identity-protected form ->
  platform inbox); platform action = hide the import within 48h pending license
  check. Toggle law (DATA-WEALTH §12): takedown HIDES the page, never deletes
  receipt provenance. Open-source forks remain lawful per the upstream LICENSE.
  Done criteria: an unclaimed import can be hidden by platform action with the
  takedown receipt visible; falsified by: deletion of provenance, or no affordance
  on unclaimed pages.

### ### GATE+2 milestone — THE DATA WEALTH LAYER (Gui's second architecture, 2026-10-22; after OUTREACH-1)

The thesis: all platform-generated data is WEALTH — open, value-generating for
the PEOPLE (custodians/maintainers/creators), never concentrated (the HEPHAESTUS
law extends to data). The receipts + artifact checksums = the provenance spine
(already designed): when data gets used, credit routes to exactly who made it.
The instrument: MEMORY/DATA tokens = TRADE CLAIMS on pre-computed work,
denominated in compute credits (ONE asset class — no securities exposure);
a project needing an answer pays the project that already did the work in
credits instead of re-deriving. CUSTODIAN = the honored role.
WALLS (cannot promise, ever): cash returns to users (securities trip-wire);
ownership over creator outcomes (their license decides — default open).
Schema hooks from day one (free): artifact checksums + receipt ids + license
fields. Full brainstorm: docs/DATA-WEALTH-LAYER.md (the loops, trade mechanics,
name candidates, open questions).

- [ ] WEALTH-1: data-trade marketplace design (artifact-priced credits +
  escrow) + the receipt-attribution split + the custodian credit layer
- [ ] WEALTH-2 PATRON-UNLOCK (10/23): project-defined donation thresholds ->
  badge -> receipt access (donation-with-access-privilege, Patreon mechanics;
  licenses stay the creator's law); personal use = private/invisible;
  in-platform reuse = stitched-from receipt + rent routed; see
  DATA-WEALTH-LAYER 18

### FOUNDER WATCH-LIST (Gui 10/23: the 4 startup videos, watched AS we build)

Source: by.nwang reel (gate bypassed); all four identified + transcripts
filed (link-archive/transcripts/). Enforcement = each watch-block = the
FIRST checklist item of its assigned milestone; no milestone starts until
its video block is checked. Full mapping: docs/FOUNDER-WATCHLIST.md.

- [ ] WATCH #1 — YC "How to Start a Startup" (CS183B L1) → BEFORE Phase-1
  (the money-gate build): fundamentals = something people want (the CFQ's
  spirit, as lecture)
- [ ] WATCH #2 — The Mom Test (Rob Fitzpatrick 1h talk) → BEFORE OUTREACH-1
  + pilot creator interviews (the three rules: their life not your idea /
  specifics in the past / talk less listen more)
- [ ] WATCH #3 — Stanford CS183F "How to Find Product Market Fit" → BEFORE
  THE PILOT→LAUNCH TRANSITION (the funded-share/open-vs-closed metrics =
  PMF operationalized)
- [ ] READ #4 — Paul Graham "Do Things That Don't Scale" (the essay) → AT
  LAUNCH WEEK (concierge onboarding for the first creators; Gui = user #0)

### OUTREACH additions (10/23 morning)

- [ ] LAUNCH-ADS study frame: the Gadzhi hook (IG DeYzgMXMzkG, filed
  gadzhi-ai-income-challenge-funnel): 'why would you start X in 2026?' ->
  named gap -> dated free event; 17K likes; no returns-promises (our law);
  study frame for Stage-1 ads + entry link
- [ ] OPUS-AUTHORS HARVEST: the opus-5.5-videos repo (9.6K stars) credits
  ~703 prompt authors earning nothing = staged P2 seed list; harvest script
  writes pilot-targets/opus-video-authors.json (public-data only; a staged
  file, not contacts.json); runs at outreach phase
- [ ] CREATOR/PATRON BALANCE (the standing law): creators first (supply
  builds the showcase), patrons second (demand meets visible supply);
  OUTREACH-STAGE 6 carries the personas; the balance = sequencing, not
  separate strategies


- [ ] DEBUG-SESSION (Wed): the vibe-code liability audit (from adilet, 10/26): (1) the a11y pass: keyboard-nav + alt-text on every interactive element (antislop-human skill) [2026-11-04: SWEEP DONE on all surfaces — AX-tree verified, imgs all alt-ed, buttons named, no tabindex traps, overflow-x clipped]; (2) the RLS verify on any Supabase-managed tables IF the auth path uses them (our core DB = SQLite server-side = immune by architecture; verify the auth-side); (3) the budget-alerts note: our cap_credits+spent_credits = the runaway defense ALREADY (the demo to users: the platform natively protects what vibe-coded apps do not!)

#### OUTREACH sub-milestones (broken out per Gui, 2026-10-26 — LAUNCH-PLAYBOOK-STARTER-STORY.md is the strategy source)
- **OUTREACH-0 (pre-stage ops, starts when D3 lands) — DRAFTED 2026-11-04 (docs/OUTREACH-0-DRAFTS.md; every item = DRAFT, DECISION GUI; nothing sent):** (a) the ONE-channel selection + the daily cadence calendar (S2; the day-50 patience datum = judge at week 7, not week 2); (b) the result-card design (S6 — the shareable receipt cards = the growth loop); (c) the honest comment→DM funnel spec (S11 — the keyword delivers the promised thing, never farms); (d) the creator-filtering prep (S1 — the Mom-Test interview rubric = the filter); (e) the patron-page framing (the Kickstarter-backing language + the legal walls: gifts not returns)
- **OUTREACH-1 (the stage as planned):** the pilot interviews dual-purpose (S1+S4: the filter = the interviews), the pattern-break formats (S3: show receipts, don't explain), the competitor-keyword SEO pages + the ASA/TikTok tests WITH the intent caveat (S7 honesty note), the revenue-share creator offers (S10)
- **OUTREACH-2 (post-launch growth ops):** the churn-agent law rollout (S5: every recurring user task → agentic), the experiment culture on onboarding (S13: every UI change = a receipted AB), the affiliate program (S15's zero-free-plan debate → our answer = patronage + credits, not freemium), the demographic-balanced creator recruiting (S17), the credits-model validation continues (S15 = our L5 confirmed in the wild)

### GATE+1 milestone — THE OUTREACH STAGE (Gui's order, 2026-10-22)

Fires when: MVP gate FULLY tested-robust-ready + Guis walkthrough clean.
THE REVIVAL: docs/OUTREACH-STAGE.md is the standing plan (Pj first — two-lane
partner: hosts projects AND makes content; email wave to maintainers; organic
momentum first, paid hybrid later; the first-funded spotlight pitch; ask Pj's
content prices in the DM). The lookout order: MORE two-lane creators
(agent-native + DM-reachable + regular output) — tags: two-lane-creator.

- [ ] OUTREACH-1: open the outreach stage ( revival: read OUTREACH-STAGE.md
  back to Gui; Pj DM = prices + partnership; email wave per the claim-ladder
  contact plan; content partners produce the receipts story)
  RESOURCES ready at the trigger (research 2026-10-22): OUTREACH-STAGE.md #6-8 =
  THE MARKET (P1 maintainers / P2 two-lane creators / P3 patrons + the
  ads-targeting shortlist) + THE STRATEGY LIBRARY (the outreach-strategy
  tag in the archive) + THREE sample emails (maintainer/creator/DM) +
  docs/OUTREACH-RESEARCH-20261022.md (the last30days evidence run)

## Phase 3 — Sustainability rails
- [ ] Platform fee % — community-voted (starts 0%; vote mechanism first, then propose 3–5%)
- [ ] Printed compute spread on token dispensing (published %, receipts show it)
- [ ] Project images (AI-generated welcome), creator storefronts
- [ ] Unspent-credit return flows + treasury display

## Phase 4 — Trust hardening
- [ ] Mirror-repo layer: GitHub stays source-of-truth; mirrored repos on-platform = two independent record keepers
- [ ] Cardano commit stamping: mirrored commits hash-stamped on-chain; Midnight selective disclosure for private repos
- [ ] Receipt depth: rejection trails, overclaiming-resistant formats (case-study law)
- [ ] Commercial Layer (revenue projects pay compute forward) + Reserve Layer (emergency compute) — from legacy four-layer vision, re-scoped without co-ownership

## Phase 5 — Decentralization (graduation, not launch)
- [ ] Community governance votes (fee %, feature priority, allocations)
- [ ] Co-ownership/revenue-sharing ideas from the legacy manifesto are DISAVOWED (conflict with patronage lock — see CONSOLIDATION.md #2); replaced by compute-forward patronage
- [ ] Open GPU pools / democratic allocation (only if community carries it)
- [ ] "Central bank of the agent economy" currency framing: defer; the unit of value stays the receipt, not a token

### PILOT SEED GOAL — 1,000 PRE-IMPORTED PROJECTS AT LAUNCH (Gui directive 2026-11-06)

Launch bar: AT MINIMUM 1,000 open-source projects pre-imported as unclaimed stubs
("pre-load everything; the creator just hits claim"). No creator contact until launch
(sign-in/claim must work first). The pipeline is DOCUMENTED, SEARCHABLE, DURABLE:

- **Creators list (the master leads file):** docs/PILOT-PIPELINE-LEADS-2026-11-06.md
  (human report: grades, tables, contact lanes) + docs/leads-2026-11-06.json (machine:
  129 A+B leads w/ repo provenance flags) + scripts/leads-github-meta.json (GitHub API
  snapshot 2026-11-06). Every future vetted lead APPENDS here — never regenerate.
- **Import machinery:** scripts/import-leads-2026-11-06.ts (idempotent, DB-ground-truth
  dedupe, charter-shaped adopt-first-milestone stubs, takedown law in assumptions).
  Batch 1 executed 2026-11-06: 42 active grade-A evaluated -> 41 imported (CFQ-2026-028
  .. CFQ-2026-068), 11 deduped (already in engine). Engine: 68 rows / 47 unclaimed.
- **SPRINT-105 (2026-11-08, Gui's "+100" order — DONE, 175-row engine):** GitHub-API
  sweep across 17 topic lanes -> 177 quality candidates -> 50 wellness + 50 modding +
  5 security imported (CFQ-2026-071..175); the quality RE/decompilation leads the
  category filter dropped got a NEW CATEGORY instead of the bin (create-category
  law: security = reverse engineering / decompilation / static analysis). Full
  GitHub meta per project + `project_github_meta` table backfilled LIVE for 155
  unique repos (stars/forks/license/language/topics/handle/homepage/pushed — the
  seed-rating source until real user signals exist). Art: 119 plates rendered
  locally (Z-Image-Turbo via the Comfy Desktop server, name-free prompts after the
  ~23% garble lesson, per-project thematic anchors + 5-style rotation incl. 2 flat
  illustration styles), 3 contact-sheet QA passes + 1 surgical regen round ->
  ALL SHIP; 187 thumbs; art-map 163 plates; discover = 174 active / 22 pages.
  Recipe + pipeline saved for future sprints: references/art-recipes.md +
  scripts/render-sprint-art.py + scripts/gh_meta_backfill.py.
- **SPRINT-200 (2026-11-08, Gui's "do 200 — GO" — DONE, 372-row engine):** 20-lane
  GitHub sweep (2 passes) -> 1,091 raw -> 197 imported after the top-tier trim
  (Kept star floor 2255; junk/mirror/list/tutorial screens; dedupe pool 312 known URLs;
  dropped 27 sub-2255 rows stay in docs/candidates-sprint200-raw2.json for the
  400 run). Distribution after both sprints: tools 69, modding 59, infra 48, video
  45, gaming 39, wellness 50, research 31, security 14, decision models 16.
  project_github_meta = 352 refs. 199 plates rendered via the pipeline (18 new
  motif anchors for the new domains), 7 contact-sheet QA passes + 2 surgical regen
  rounds — ALL SHIP; art-map 360 plates / 388 thumbs / discover 371 active 47 pages.
  Pipeline law added: fetch_output picks the NEWEST _000NN_ suffix (first-match
  returned a stale render on blendertools — fresh take was _00003_).
- **CATEGORY EXPANSION + FLAGSHIP LAWS (Gui 11/8 evening, voice):**
  1. NEW CATEGORIES created from clusters (create-category-not-drop law): audio,
     home, education, finance, commons, artcraft, jev (+ subs in categories.ts).
     400-run imported 399 (+78 games/jev batch +20 artcraft) -> engine 868/846.
  2. ARTCRAFT SHOWCASE LAW (Gui): the storytold suite (Apache-2.0 clean-room Rust:
     PhotoCraft ⭐78K, artcraft ⭐40K, WordCraft/DeckCraft/GridCraft/PdfCraft/
     FilmCraft/LightCraft/VectorCraft/EffectCraft/CADCraft/SoundCraft/...) = its own
     category 'artcraft' + front-page shelf via staff_pick=1 on all 19 rows +
     logo_path = the suite's own dual-licensed icons (assets/app-icons, Apache/MIT;
     files at public/u/artcraft-*.png, LICENSE copies in docs/). Excluded per license
     law: artcraft-services (NOASSERTION), unlicensed repos. Fork duty: new name+art.
  3. CLEAN-ROOM LAW (Gui's Adobe question): reimplementation-from-scratch with no
     copied code/assets/trademarks is lawful (Sony v. ConnecTix / Sega v. Accolade
     doctrine) — importable when (a) its own FOSS license, (b) no upstream
     trademarks/logos/assets, (c) takedown honored. ArtCraft = the template case.
  4. PUBLIC-DOMAIN / OPEN-IP DIRECTION (Gui: "dive deep"): category commons hosts
     preservation; a dedicated sourcing pass for PD content campaigns (archive.org
     metadata API — curated, PD-verified per item, no trademarks/modern brandings —
     e.g. Steamboat Willie-era pre-1930 works; "fund a cartoon, receive the
     restored episodes as receipts") = M-PDCAMPAIGNS milestone, needs Gui walkthrough
     before first campaigns go live.
  5. GAMES LAW: playable open-source games import to gaming (18 imported: veloren,
     wesnoth, shattered-pixel-dungeon, shapez...). Recomp/preservation already in
     decomp & preservation/recomp ports subs (legal: clean-room decomp — no
     proprietary assets).
  6. JEV CATEGORY (Gui: "just for Jev"): top 'jev' (routed agents / brains &
     routers / jev tools) — 60 imported (jev-chat, jevgrep, OpenJev, fast-jev-
     compaction...). Watch: topic coverage spotty; keyword lane used.
- **M-SEARCH (MILESTONE, Gui green-lit):** platform search = FTS5 over projects
  (name/one_liner/topics/category) — state.db already runs FTS5; better-sqlite3
  carries it. Scope: /api/search + header search box (the disabled-search-box law
  lifts once real search ships) + category/sub filters compose acceptably (AND).
  Acceptance: query<latency 50ms on 1k rows, no-auth (public pages law), results
  ranked star-weighted. NEXT build milestone, not in the sprint-400 window.
- **Batch 1b (2026-11-08, Gui's "make them live" ask):** the 2 INACTIVE grade-A leads
  batch-1's 6-month filter skipped are now imported unclaimed — latentsync ⭐6255
  (bytedance/LatentSync, Apache-2.0) + warlock-studio ⭐258 (Ivan-Ayub97/Warlock-Studio,
  MIT) as CFQ-2026-069/070 via scripts/import-leads-batch1b.ts (same shape law). The
  grade-A import wave is COMPLETE: 44/44 accounted (41 batch + 1 D2 dedupe + 2 batch-1b).
  Engine after batch-1b: 70 rows / 48 unclaimed.
- **Import images completed (2026-11-08, Gui's "are the images completed?" ask):** the
  art agent's per-slug plates (cf-<slug>.png, 41 import plates on file) are WIRED into
  app/lib/art-map.ts (12 hand entries + 41 slug entries = 53 mapped) and 78 thumbs
  regenerated (make_art_thumbs.py, ~2.3MB thumb layer). On default plate until generated
  locally: comfyui-video-ui, latentsync, rea-video, warlock-studio. Board verified live:
  /discover = 69 active projects, import cards render their own art.
- **Base-board gate fix (2026-11-08):** the shared active-board query gated
  `AND p.budget_credits > 0` — a CFQ-question-era filter that made every import stub
  invisible on /discover AND every homepage discovery row (including the Open-for-claims
  row that exists to showcase them). Dropped in discovery/page.tsx + app/page.tsx +
  api/home/route.ts (status='active' only). /discover went 26 -> 69 active; homepage
  Open-for-claims row lit (14 CLAIM IT badges); demo-curation law unchanged (verified:
  zero demo rows leak into homepage surfaces; /discover keeps the honest full board per
  its own page comment law). D5 live-write regression run (dev 8872) deferred to the
  next consolidation pass — it injects throwaway rows into the live DB by design.
- **Growth sources for the remaining ~930 (Gui ask: best approach):** 1) GitHub-first
  direct sourcing — topic/star/license/activity queries via API (highest volume, best
  metadata, zero scraping-law risk; license + activity filters keep quality); 2) IG
  reviewer accounts (already proven: gittrend.io et al. — reach their catalog pages +
  reels; gives us the CREATOR LANE with the project); 3) modding communities (Nexus et
  al.) for non-git artifact projects later. Contact points accumulate lawfully ONLY:
  public repos/handles + creator-published emails/socials recorded in contacts.json.

## Standing laws (every phase)
1. Patronage framing only — never invest/equity/return/share language (Howey wall)
2. Receipts: money in / compute out, public; demo data always labeled
3. No personal data of Gui or any user; no keys/secrets in any artifact
4. Nothing gated: every feature works with zero payment and zero accounts (asks live in footers, walls live in law)
5. Fiction (Golden Ticket scripts) is inspiration, never spec — explicitly non-canonical

## Niche evidence (N-002) — modding community = first target market
Validated 2026-10-11 (echo-chamber checked, competitor-scanned). The decomp/recomp +
agent-modding wave = token-burning modders + patron players; CF is the funding rail.
Full thesis + market research: `../link-archive/brainstorms/modding-tokens-compute-fund-niche.md`
(DO NOT copy contents here — pointers only. Feature pressure recorded in the brainstorm:
roadmap voting priority, token-donation credit type, distribution stays external.)


## DOMAINS lane (added 2026-11-04, Gui request)
- [ ] **Domain negotiation outreach (send-when-Gmail-connected):** drafts live in
  `docs/DOMAIN-NEGOTIATION-2026-11-04.md` - one to the commonweave.org holder (registered
  2012, GoDaddy, empty 114-byte stub; quiet-buy window), one to the compute.fund holder
  (registered Jan 2024, Tucows, 'Coming Soon' stub). NO SEND without Gui's sign-off
  (Sign-off class).
  D1-verdicts: computefund.com/.org/.ai all TAKEN; compute-fund.com/.org AVAILABLE
  (~$10-15/yr); compute.fund.io AVAILABLE; .fund fresh retail = ~$30-45/yr.
- [ ] **compute.fund expiry watch: RDAP says EXPIRES 2027-01-22 (NOT Jan 2026 - Gui's
  'January 27th' was this-expiry confusion). Follow-up cadence: check RDAP monthly from
  2026-12; the drop-catch attempt = immediately after it lapses if un-negotiated. Owner is
  privacy-protected; if negotiation dies, re-check RDAP after 2027-01-22 for the 30-day
  redemption window and beyond.**
- [ ] **EMAIL CAPABILITY (must - Gui 2026-11-04):** the agent (Hermes) must be able to
  READ/SEND the CommonWeave Labs Gmail - weekly inbox sweep, follow-ups with negotiated
  parties, notifications to Gui for anything he must see directly. INVESTIGATED 2026-11-04:
  hosted Gmail connector NOT in this gateway's connector catalog (status list verified);
  SENDER IDENTITY = commonweavelabs@gmail.com (set in stone 2026-11-04, in memory + negotiation doc); reliable path = `himalaya` CLI skill (IMAP + app-password = stable, no OAuth re-connect
  churn). Setup after the Stripe session: (1) Gui enables 2FA + App Password on the
  CommonWeave Labs Google account; (2) hermes installs himalaya + writes config with the
  app password via keyring; (3) weekly inbox-sweep cron (no_agent triage script + agent
  digest + Telegram/desktop notification for must-see items).
  **[DONE 2026-11-04 evening]: himalaya v2.2.1 at C:/Users/Guilherme/bin/himalaya.exe
  (bin on PATH-collisions: full path always). Config C:/Users/Guilherme/.config/himalaya/config.toml
  (v2 schema: imap.sasl.plain.*, smtp.server smtps://...:465). VERIFIED END-TO-END: mailbox
  list OK, self-email sent AND received. CRON JOBS: bd75db84085b = weekly sweep (Mondays
  9am ET, deliver origin, attach=true) + 28ee17406cc6 = compute.fund RDAP one-shot chain
  kickoff (2026-12-05, self-rescheduling exponential). Weekly sweep = LLM digest per
  cron-job-design self-termination blueprint; renew-or-kill review at the 90-day mark.]**
- **[SUPABASE CLOSED 2026-11-13→11-04]: project csujyjibtxpccfvlaujm was NOT deleted —
  Supabase AUTO-PAUSED it (status INACTIVE since ~Oct 27 idle; paused = DNS record
  removed = the NXDOMAIN mystery). RESTORED via PAT (sbp_* = saved via `supabase login
  --token`, revocable in dashboard): status now ACTIVE_HEALTHY, DNS resolving, OAuth
  plumbing verified (authorize -> 302 github.com with PKCE/state/callback chain). The
  project's org = `commonweavelabs` (primary). DUPLICATE ORGS confirmed EMPTY (a full
  account projects list shows exactly ONE project): `commonweavelabs- COMPUTE.FUND`
  (nymhtuggwionmpobiqja) + `compute-fund` (qyrunrmwzsdirdjmozqg) — deletion candidates,
  awaiting Gui's explicit yes (destructive). Note: Nous-connector OAuth token can never
  list projects (Supabase platform rule) — PAT via CLI is the management road; PAT
  rotate/revoke at dashboard/account/tokens.]**
- **[SUPABASE PREVENTION 2026-11-04 (Gui: 'this cannot happen again')]:** root cause =
  free-tier INACTIVITY auto-pause (7-day idle => DNS removed). Prevention, now LIVE:
  guardian cron `aa401daa9afd` (script-only, zero tokens, every 3 days 9am):
  `~/AppData/Local/hermes/scripts/supabase-keepalive.sh` = sends real keep-alive traffic
  (auth health + rest), checks status, AUTO-FIRES restore if INACTIVE, alerts only on
  failure (silent-when-healthy verified: healthy run = empty stdout, exit 0). PAT at
  `C:/Users/Guilherme/.config/supabase/pat.txt` (ACL-restricted, never in any repo).
  Supabase = agent-managed from now on (Gui standing order). Org RENAME/DELETE = dashboard-only
  (no API route exists) - the 2 empty orgs die via one guided dashboard visit when Gui
  wants it; the org he keeps = 'commonweavelabs' (holds the live project).

- [x] **D5 — Discoverability engine v1** — [DONE 2026-11-06, commit 9f260f5] metric event stream (view/fund/follow/claim) + velocity-7d rollup (fund×10+follow×3+view×1) + ready-for-forking detector (funded ∧ unclaimed ∧ 14d quiet) + follows → community picks + staff_pick flag (Gui-owned) + affinity-first recommender; homepage rows mechanism-backed + auto-hiding (law: no hand-curated rows, no synthetic events). v2 (ML/collab-filter, A/B) waits for real event volume.

- [x] **D1 — GitHub login verified by Gui** — [DONE 2026-11-07] Gui signed in live on computefund.dev as CommonWeave Labs; session issued, header chip works.
- [x] **LIVE-CLAIM verified (Gui = user #0)** — [DONE 2026-11-07] Gui claimed a real project (ComfyUI Video UI) on computefund.dev end-to-end; ownership transfer + dashboard (my projects) verified in the live ledger.
- [ ] **M-AUTH-REFINE: account-type onboarding + multi-org linking** — new milestone, Gui specified 2026-11-07: at sign-in ask "person or entity"; a user account links MULTIPLE organizations; org/person distinction flows through profiles, dashboard, and claims. Scope after the funding gate.

## SPREAD-400 (planned 2026-11-08, Gui: "report first, then GO") — run-400 + new categories + image overhaul
**Gui decisions locked 2026-11-08:**
- Birth of a Nation STAYS OUT (optics law); community may add it later through the
  create-flow — never pre-seeded by us.
- SPOT IMPORTS (velocity add, below-star-floor Gui exception): crest (andrealo20/crest,
  GPL-3.0, 97⭐, reel-vetted DfSbiADARWE) + openbar (MF-DEEV/Openbar, the AI-agent
  dashboard sibling) — both now live in the NEW productivity category.
- NEW categories (created this commit): productivity (desktop apps / launchers & widgets /
  notes & docs / agent dashboards), 3d (modeling & sculpting / animation & rigging /
  3d scanning & capture), robotics (sim & control / drones & rovers / 3d printing &
  firmware), bigtech (ai models / dev infrastructure / frontend & runtimes). ArtCraft
  Tab UNTOUCHED (its own shelf, standing order).
- BIGTECH lane law: only genuinely open licenses (MIT/Apache/BSD). Llama = Llama
  Community License = NOT MIT (flagged honestly - excluded unless Gui overrides);
  DeepSeek = MIT (in), PyTorch/React/VSCODE/K8s/Firecracker (in). Qwen models carry
  permissive-but-not-OSI terms - case-by-case, license verified per row.
- BIGTECH homepage carousel = second featured-slice row (same mechanism as the ArtCraft
  suite shelf: slice category=bigtech, auto-hide) - wired during the sprint build.
- IMAGE OVERHAUL (Gui critique 2026-11-08: PD plates "bedroom+window" syndrome):
  root cause = lex anchor keyed on ambient words in film synopses (moon/night/harbor)
  + one style family filling the whole PD batch. Fixes, ON for run-400:
  1. PER-TITLE hand anchors for narrative works (the goat gets a goat; The General
     gets the locomotive).
  2. REFERENCE-IMAGE lane: Qwen-Image-Edit 2509 IS INSTALLED LOCALLY (fp8 + Lightning
     4-step LoRA + Qwen2.5-VL encoder verified in Documents/ComfyUI/models) — feed the
     ACTUAL public-domain film still as reference input; PD frames = free to use, and
     the plate then LOOKS like the work. No IPAdapter purchase needed.
  3. Chaplin-class likeness: stylize the PD FILM FRAME (the character in the PD film is
     PD; we never brand the estate's trademarks) — lawful, and more authentic.
  4. ANCHOR-DEDUPE law: max 2 rows per anchor-key family per batch.
  5. QA bar raised: "bland/repeat-family composition" = a failing class, same as garble.
- 400 count check (tool-verified): 12.67M repos with ≥2 stars (33M with ≥1, non-fork).
  400 = 0.003% — reasonable. Sourcing lanes: productivity, 3d, robotics (Kickstarter-style
  hardware heat), bigtech, + deeper fills for thin categories — same licenses law,
  dedupe vs all 930 known URLs, junk/mirror screens unchanged.
