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
- [ ] **Stripe money-in** — David-era pattern reused (checkout + webhook, graceful fallback); receipt per patron incl. priority credit
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

