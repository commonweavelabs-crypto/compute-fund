# Compute Fund — Roadmap (consolidated 2026-10-07)

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
- [ ] **Project pages (v1.5)** — click a card → creator-authored page: hero, story, roadmap, funding state, receipts, CFQ id. (Current homepage becomes CommonWeave Labs profile page + avatar circle.)
- [ ] **Platform homepage v1.5 (KS-arrangement, our skin)** — header: logo + mock search + CFQ-domain category strip + "Start a project" + Log in; centered slogan; seasonal/featured **Question-of-the-Month** hero; Featured project (progress line ON the image, meta row "time left • % funded", desc, tag chips incl. location) + "Recommended for you" 2x2 with mini progress-underlines + pagination; "Home Stretch" urgency row; **creator hover-card popup** (X created · Y funded · community-loved count · joined date · mini bio → profile link); creator-guide cards ("Every experiment starts with the same question..." vertical accent bars); Crowdfunding/Compute Tips 4-card row; footer w/ CFQ-domain columns + giant wordmark + language/currency + legal row. **Layout law: arrangement adopted from KS reference shots (Oct 2026), skin 100% ours (Terminal Commons/Carbon Ledger); no KS branding, artwork, or copy.**
- [ ] **CFQ intake** — Question Standard enforced at project creation; LLM format-interpreter prompt published; lint = fields 2–7 machine-checked
- [ ] **Auth & accounts** — signup/login; user account first; org profile second (org = created under a user, linked, TRANSFERABLE to other users, not owned); backer can become creator by creating an org or a project; projects may live under personal profile OR org (both legal, org default-rec)
- [ ] **Stripe money-in** — David-era pattern reused (checkout + webhook, graceful fallback); receipt per patron incl. priority credit — **[E2E PROVEN 2026-11-04: sandbox account + keys in `app/.env.local` → tunnel (cloudflared) → signup email-auth → $25 checkout session `cs_test_a1JyjN...` → hosted checkout PAID (Stripe API: payment_status=paid) → webhook flipped `demo: 2 → 0` (don_4da0fc4de50549108417) → Big Tok $25.00 real funded. Fix landed with it: `allowedDevOrigins` in next.config.ts (Next 16 blocked /_next/hmr from the tunnel host = site-wide dead hydration). Remaining for MVP gate: Supabase ref csujyjibtxpccfvlaujm NXDOMAIN (project deleted/paused — OAuth pending; email-auth fine in test) + live keys + KYC at go-live.]**
- [ ] **LiteLLM gateway money-out** — virtual keys per project, hard cap = donated amount, model allowlist, endpoint scoping, audit log = receipts → replaces demo data (schema already matches)
- [ ] **ToS stack** — non-transferable/non-cash-out wall, Howey wall ("not an investment"), no-deduction clause, CFQ release/revoke clause; email+phone ID, OFAC screening
- [ ] **MVP gate:** one stranger signs up, funds a CFQ-passing project with a card, platform dispenses capped compute against that question, receipts post publicly. Nothing else counts.

## Phase 2 — Profiles, Copy-Project, community surfaces
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
- [ ] N-1 Name the network core: docs/NETWORK-CORE.md — receipts-graph as the
  core data-network effect; seed graph = pilot fleet + roster; open/data policy
- [ ] N-2 docs/RISK-INVENTORY.md: every risk stack (regulatory/payment-geo/
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
- [ ] D3-CREATE-FLOW: creator workspace: /create (CFQ lint EXISTS already) +
  image/logo upload (served statically; no third-party host) + repo/links
  fields + DRAFT state (private, personal-profile workspace) + PUBLISH ->
  public page + org/business-account creation under a user (transferable per
  existing law - org page already renders from data)
- [ ] D3-TEST: scripted integration tests for the whole create path (the
  SPRINT-001 stranger-loop test pattern extended); feature/debug PAIRED
- [ ] D2-CLAIM-FLOW: research-imported projects loaded as UNCLAIMED stubs
  (from the link-archive pilot targets: MiroFish/last30days/colibri/tierllama)
  + claim flow on the project page: maintainer proof -> executor role
- [ ] D3-PILOT-PIPE-TEST (Stage 0 of PILOT-PROPOSAL): Gui claims HIS dogfood
  project (tierllama bench row already seeded) + self-funds $50-100 + gateway
  run + receipts public = the first REAL receipts story
- [ ] MVP-GATE rerun with REAL USER (Gui): the stranger loop by the platform's
  first actual user, on the deployed tunnel

Build order: D1 -> D3 -> D2 -> tests -> Gui's walkthrough -> Stage 0 -> launch.

### GATE+2 milestone — THE DATA WEALTH LAYER (Gui's second architecture, 2026-10-22; after OUTREACH-1)

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


- [ ] DEBUG-SESSION (Wed): the vibe-code liability audit (from adilet, 10/26): (1) the a11y pass: keyboard-nav + alt-text on every interactive element (antislop-human skill); (2) the RLS verify on any Supabase-managed tables IF the auth path uses them (our core DB = SQLite server-side = immune by architecture; verify the auth-side); (3) the budget-alerts note: our cap_credits+spent_credits = the runaway defense ALREADY (the demo to users: the platform natively protects what vibe-coded apps do not!)

#### OUTREACH sub-milestones (broken out per Gui, 2026-10-26 — LAUNCH-PLAYBOOK-STARTER-STORY.md is the strategy source)
- **OUTREACH-0 (pre-stage ops, starts when D3 lands):** (a) the ONE-channel selection + the daily cadence calendar (S2; the day-50 patience datum = judge at week 7, not week 2); (b) the result-card design (S6 — the shareable receipt cards = the growth loop); (c) the honest comment→DM funnel spec (S11 — the keyword delivers the promised thing, never farms); (d) the creator-filtering prep (S1 — the Mom-Test interview rubric = the filter); (e) the patron-page framing (the Kickstarter-backing language + the legal walls: gifts not returns)
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
