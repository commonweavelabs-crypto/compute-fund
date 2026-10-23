# THE DATA WEALTH LAYER — brainstorm (v0, Gui's second architecture of the day)

*2026-10-22 · windows-hermes · status: BRAINSTORM (roadmap-visible, NOT in MVP,
nothing set in stone) · parent doctrines: HEPHAESTUS (fire → people),
receipts-first, NFX alignment · sibling doc: PILOT-PROPOSAL (the three
stages), docs/GAME-THEORY-MECHANISMS.md (the 12 mechanisms)*

## 0. What Gui said (the thesis, preserved)

- All the data the platform generates — outcomes, artifacts, answers,
  discoveries — is WEALTH (data is money in the future, together with compute)
- It must be OPEN and value-generating FOR THE PEOPLE: the users, creators,
  custodians of the platform. Never concentrated in one company's hands
  (the Sam Altman contrast: who owns AI's discoveries? we answer: the people
  with the provenance)
- The receipts make it possible: when any data/finding gets used, we know
  EXACTLY where it came from — so credit flows to the right people: the
  custodians, maintainers, pushers-forward of projects and ideas
- THE SECOND TOKEN: a memory-token / data-token — break platform data into
  small exchangeable pieces (pre-computed findings!) so a project that needs
  an answer PAYS THE PROJECT THAT ALREADY DID THE WORK in compute tokens
  instead of re-deriving everything (no wheel-reinvention)
- Eventually: cash/crypto bridges through external rails (explicitly NOT MVP)
- The role: CUSTODIANS — people who take custody of ideas/research, maintain,
  and push forward = the honored party in the wealth distribution

## 1. The user pitch gains a fourth leg (what users get, beyond excitement)

1. REAL OUTCOMES: the 3D character for their game, the mod they wanted, the
   research answer that mattered to their family
2. RECEIPTS AS CREDENTIALS: their funding/claims/work = a portable CV (M7)
3. THE CUSTODIAN ROLE: holding an idea's lineage publically — the credit layer
   that knows exactly what they pushed forward
4. **DATA WEALTH (this doc):** the work they fund/create keeps EARNING after
   delivery — via the data-trade market + attribution flows — always by
   receipts, always attributed

## 2. THE THREE LOOPS (the wealth engine, in one diagram)

```
  patrons -> COMPUTE CREDITS -> claims/milestones -> OUTCOMES
      ^                                        |
      |                              OUTCOME DATA (artifacts,
      |                              findings, datasets, chapters)
      |                                        |
  data-tokens <-- trade <----------------------+
      |
  a NEW project needs an answer -> PAYS THE OLD PROJECT'S CUSTODIANS in
  compute credits (for the pre-computed work) -> the old custodians get MORE
  FUEL -> they produce MORE outcomes -> more data -> loop compounds
```

- Compute credits = FUEL (closed-loop, no cash redemption — the existing walls)
- Data tokens = **claims on pre-computed work**, denominated IN compute credits
  (not a new currency: a MARKET over the same credits — avoids a second legal
  object entirely)
- The receipts + artifact checksums = the provenance spine: every data-token
  points at EXACTLY the chapter/receipt that produced the finding (the
  attribution problem nobody else has solved is one we already did)

## 3. What we can promise vs what we cannot (the honest walls)

**WE CAN PROMISE (design law):**
- Open-by-default licensing on outcomes (creator picks the license at
  publish; the platform DEFAULT nudges open — nice-by-default law)
- ATTRIBUTION FOREVER: receipt-proven provenance; the fork lineage preserves
  who made what (the record remains, M5.1)
- The trade MARKET: projects trading compute-credits for pre-computed findings
  (a marketplace mechanic, not a new asset class)
- The custodian credit layer: ranking/visibility/standing flows from proven
  contributions

**WE CANNOT PROMISE (and must never imply):**
- CASH returns to users from the data economy — that flips into securities
  territory (BUSINESS-MODEL trip-wire: "any expectation of return →
  securities; >$20k AND >200 txns to one recipient/yr → 1099-K"). Wealth
  returns ONLY inside the closed loop (credits/data-tokens), or as
  direct PATRON GIFTS via the fiscal host (gift law, not revenue-share)
- Ownership of creator outcomes: the CREATOR's chosen license owns the
  output (we enforce attribution, not ownership terms — creators may pick
  restrictive licenses; the default stays open)
- Data privacy shape: any dataset sale/sharing future = the passport +
  selective-disclosure layer FIRST (no user data leaves without consent).
  The receipts corpus itself (the trust data) = the platform's commons,
  never sold as a product

## 4. THE NAME (Gui's call — candidates, votable under M9)

- **MEMORY tokens** (his first name: "memory tokens for pre-computed findings"
  — strong: it says remember-not-recompute)
- KERNEL tokens (the reusable core of a finding) · FINDINGS tokens ·
  DEED tokens (a claim on work + provenance, like a property deed with
  receipts attached)
- The two-currency naming law that keeps us legally clean: compute credits
  (FUEL) stay the only money-like object; data/memory tokens = trade RIGHTS
  attached to receipts (like a deed to a specific chapter's finding). One
  asset class, one wall.

## 5. HOW THE TRADE WORKS (the mechanism, post-MVP)

1. A project's charter declares needed INPUTS (findings/datasets in the house)
2. The platform MATCHES: existing receipts/artifacts that satisfy or
   approximate the need (the Outcome Ledger as a queryable index!)
3. Price = the CUSTODIAN's ask (in compute credits) — set at publish or
   negotiated; the platform takes the M9-voted fee only
4. Payment path: buyer's credits → escrow (bounty-style, already specced) →
   the data (checksummed artifacts + license) → split per the receipt
   attribution (primary custodian, funders optional reward share — ALL
   in-credits)
5. The dispute/correction path = the fork (M6): bad data = fork the lineage,
  the record stands

## 6. WHY THIS IS HEPHAESTUS, CONTINUED (the manifesto paragraph)

Every funded outcome on the platform leaves two legacies: the artifact and
the proof it happened. The proof chain lets us route value BACK to whoever
carried the idea forward — custodians, maintainers, funders — instead of
letting one company capture the discovery and its fruits. We are not building
a platform where people work; we are building the ledger where THEIR work
keeps paying them. Distribution of wealth, by receipt.

## 7. The MVP rule (the firewall, respected)

NOTHING in this doc touches the MVP gate. The ONLY MVP-adjacent hook: keep
artifact checksums + receipt IDs + license fields in the schema from day one
(zero build cost, the join keys for this whole layer later). The wealth layer
= Phase 3+ (after the doors, the vouchers, and the receipts pipeline prove
themselves).

## 8. Open questions for Gui (for the next session — not urgent)

1. Name: MEMORY vs KERNEL vs FINDINGS vs DEED (votable)
2. Granularity: what is ONE data-token unit? (a chapter? an artifact? a
   finding-set?) — suggest: the ARTIFACT (checksum-addressed, receipt-
   attributed — the natural unit)
3. Does platform-curated AGGREGATED data (the corpus of all receipts, the
   benchmark datasets) get special treatment vs per-chapter data? (suggest:
   the corpus = the commons, never sold; the aggregates the platform derives
   = free to all users inside the loop)
4. The external cash/crypto bridge: WHICH rails eventually? (suggest: defer
   until the fiscal-host + Stripe reality is stress-tested; the wall docs
   then)
## 9. THE RENT MODE (Gui caught it, 10/22 — "we already do this") — BUY vs RENT

**Gui's insight is correct and the receipts exist:** compute-fund-v0 ALREADY
IMPLEMENTS the rent mode — src/lib/forks.ts: the fork pays ONE-HOP RENT to the
parent (rent recorded in plugin_splits: project_id = the fork that PAYS,
plugin_owner = parent project id, split_percentage = rent %, is_required).
Laws already encoded in v0:
- **FORK_RENT_MIN=5 / FORK_RENT_MAX=20, standing default 10** (Gui remembered
  "5 or 10 percent" — the actual law: 5-20, default 10)
- **GRANDFATHERING: fork_rent_pct FROZEN AT FORK TIME** — owner raising rent
  affects only FUTURE forks; existing forks keep the rate they copied. We
  never re-read the parent
- The fork = taking custody of the parent's lineage + discoveries = paying
  rent on exactly that pre-computed work (Gui's framing, verbatim)

THE UNIFIED MODEL (one provenance spine, two payment modes):
- **BUY (data-tokens, GATE+2):** spot payment for a specific finding/artifact
- **RENT (fork rent, v0-implemented):** success-contingent one-hop % on the
  lineage you carry forward
Both route value to custodians via receipt-attribution. Port scope grows
accordingly: D-port = auth + claims + FORKS/RENT (+showcase) from v0; note:
the SPRINT-001 clean-room dropped all of fork/rent/splits as well.

## 10. THE EXPANSION (Gui, 10/22 evening): the RECORD-KEEPER becomes the product

His push: the receipts system is a block chain in spirit — a spine that just
RECORDS — and that spine can serve far beyond modders:

**L4 — THE REGISTRY LAYER (aspirational, phase 5+):** institutions (governments,
enterprise) run their project accounting THROUGH our receipt format — funding
optional (they fund themselves; the platform = the record keeper):
- Anti-fraud forensics: "the children's-meals contractor claims 1,000 meals
  served — show the food-purchase receipts against the fund flows" (absence
  + presence both prove: receipts exist = audited; missing = flagged)
- History/claims: a disputed claim about a past project = check the
  time-stamped, checksummed trail (documentaries built on provenance)
- THE BLOCKCHAIN PART: Cardano commit-stamping + Midnight selective
  disclosure (ALREADY IN THE ROADMAP) = tamper-EVIDENT stamps + private
  payloads: institutions get privacy (their data stays theirs, possibly
  off-leaf) while the STAMPS stay public/checkable — the receipts brand's
  public-by-default law gets a middle state: public STAMPS, private
  PAYLOADS (selective disclosure)

**L5 — SECTIONAL ENTITLEMENTS (refines L2/L3's unit law):**
- Not whole-fork-or-nothing: buy RIGHTS TO ONE ARTIFACT (the Marvel-project
  example: 40 rigged characters, you need ONE — purchase that artifact's
  entitlement in credits instead of forking 40)
- The new project stitches the artifact in → the receipt TRAIL PRESERVES
  BOTH: the original custodian's provenance + the child's continuation
  (lineage: stitched-from — attribution compounds, never breaks)
- The license gate (honesty first): entitlements exist ONLY where the
  creator's chosen license allows resale/reuse; nobody's rights get sold
  without their own license saying so

**HONEST WALLS for the expansion (do not overpromise, ever):**
- Compliance-grade legal evidence = a different bar (legal hold, retention
  law, chain-of-custody, audit certifications per jurisdiction). Our
  checksums+stamps = tamper-EVIDENT (good), NOT court-grade evidence (yet);
  aim: the registry layer = feasibility study only at this stage, possibly
  its own product line later ("records" as the second product; the funding
  platform stays the first)
- Institution data = sensitive: adoption implies the passport/selective
  disclosure layer FIRST + jurisdiction questions (PII, FOIA shapes) —
  phase 5+ with real counsel
- The pitch to institutions is NOT anti-fraud promises; it is tamper-evident
  bookkeeping with public stamps and private payloads — understated, true

**THE REFRESH (Gui asked to re-hear the parked decision, plainly):**
We have two codebases: (A) the clean-room main line = small, strict, fully
tested for the money-gate (SQLite, demo-green), and (B) compute-fund-v0 =
the big rich one (Supabase+GitHub login, claims ladder, forks+rent, showcase)
ALREADY DEPLOYED LIVE at compute-fund-site.vercel.app. Piece-porting (A←B)
keeps growing (auth ✓, then claims, then forks/rent, then showcase...).
Option B': flip it — v0 becomes THE front door (it is already live and rich)
and the clean-room line becomes the test track where every new mechanism is
proven before it lands in v0. My recommendation: decide AFTER Gui's test
session — walk the clean-room first (it is the safest hands-on), then look
at the deployed vercel site side by side, and pick the front door with eyes
on both. No decision tonight.

## 11. THE TEST CASE (10/22, researched): Navier-Stokes / OpenAI vs Buckmaster-Alpöge

Gui's memory was directionally right; the file (links/navier-stokes-priority-
controversy.md + catalog #627) holds the verified receipts. Short form:
OpenAI announced a NS-variant proof Sept 8 2026 (10k agents, 88h, internal
model, Lean formalization, ~$22.5M compute reported). 12 HOURS before,
Buckmaster (Courant) published that his + Alpöge's Aug-15 Euler/IPM/Boussinesq
advances were LEAKED to OpenAI days earlier; a year of their secret work had
run on LLMs from BOTH labs (Codex included). OpenAI first denied seeing any of
it, then admitted session data as "de-identified, derived" training material;
offered Buckmaster authorship of a rewritten proof + the $1M Clay prize
("closest humans to the problem") while keeping the method/model internal and
excluding Alpöge; he declined. 28 Fields Medalists then signed a misalignment
warning. Public: the proof. Private: the method, the model, the credit
posture.
**THE OPINION Gui asked for (honest):**
- Does the Data Wealth Layer accomplish decentralization of discovery? On the
  MEASURABLE conditions, yes: (1) provenance on-record before need (their
  Euler advances as timestamped chapters → the leak dispute adjudicates
  itself from data, no tribunal), (2) fork economics route rent to lineages
  AUTOMATICALLY (a company adopting the Córdoba–Martínez-Zoroa programme on
  our rails = a fork = rent owed), (3) discovery ownership = the holding
  fork's (Gui's law, below), (4) the custodian/standing layer = credit that
  persists. The counterfactual is the pitch: their year on OUR rails = no
  press-release war, just receipts.
- The LIMIT we cannot legislate: our economy cannot force an OpenAI-sized
  lab to run its internal research through our ledger. Decentralization here
  means: the OPEN route becomes the profitable-default route (provable work,
  automatic attribution, rent by design) — so the next Buckmaster-Alpöge
  collaboration has a better place to stand. Pull, not force.
- QUANTIZATION (Gui's "can we measure the 80%?"): no principled percentage of
  human-vs-model contribution exists; anyone claiming one is selling
  something. What we CAN measure and pay on: WHO HELD WHICH RECEIPT WHEN.
  The market prices the receipt; the fork-rent chain compensates the lineage;
  the checkpoint unit of credit is the chapter/receipt, not a %.
- THE CASCADE LAW (Gui's question, stipulated 10/22 — brainstorm-v0.1):
  1. Post-fork DISCOVERIES belong exclusively to the holding fork (his law —
     ACCEPTED as default): a bought NS-receipt pays the fork in full.
  2. The DIRECT parent's one-hop rent (v0: 5-20%, default 10, frozen at fork
     time) applies to the fork's revenue INCLUDING discovery sales.
  3. Deeper ancestors (grandparent+): NOTHING by default (v0 one-hop law).
     Parked-votable alternatives: (a) keep one-hop — simple, predictable,
     already grandfathered everywhere; (b) decaying cascade — hop-2 gets a
     share of the rent (rent-on-rent), thin at depth; (c) VOLUNTARY
     custodian tips — winners thank their lineage by receipt-attributed tip,
     no mandate. RECOMMENDATION: (a) default + (c) as a feature; revisit (b)
     only if real market data shows ancestors systematically unpaid.

## 12. STEWARDS + COMPLIANCE-AS-TOGGLES (Gui, 10/22 night) — the positive-pitch law

**THE REFRAME (his, accepted):** never pitch this as fighting evil corporations.
The negative frame = a culture war; the WIN = smoothness: make cooperative,
open, receipt-routed resolution CHEAPER than litigation, so cooperation
happens more often (court systems already drowning = our smooth path is the
product). The M0 zero-tribunal law extends: we don't shame the hoarders; we
make the open economy the convenient one. PITCH LANGUAGE LAW: communities,
stewards, livelihoods, open flow — never villains.

**STEWARDS (his word — adopted as the human name of the custodian role):**
people who take a project and make it their LIFE'S WORK — paid, a living.
The portfolio shape is equally honored: "he created this, maintained it for
20 years, it forked into something better, he moved on" — the record remains
(M5.1), the passport carries it (M7/pilot). The steward arc = the P1
maintainer persona's future title (outreach §6 P1: the maintainer becomes
the steward, with a living).

**USER RECORDS AS WEALTH (his extension — the walls drawn tight):**
- What CAN trade, with consent: the creator's OWN records — chapters,
  work-notes, signatures, the [VOICE] layer, artifact datasets — license-
  gated like every artifact; they list it, they price it, buyers get the
  LICENSE + attribution-forever (the historian/documentary case: 300 years
  out, a fraud investigated a century back, checked against exact receipts)
- What CANNOT trade, ever: the person. Behavioral/surveillance data, private
  identities, anything resembling watching PEOPLE instead of WORK. The
  receipts brand = public record of work, not a data-broker of humans. (The
  passport's selective-disclosure law governs anything user-sensitive.)

**THE COMPLIANCE-AS-TOGGLES MECHANISM (his design — the smart part):**
- An account-type declares its policy PACK (machine-readable: "gov-pack v1:
  these toggles required"); different jurisdictions/entities = different
  packs. No bespoke per-law system — config, not legislation
- The platform NEVER judges and NEVER penalizes: it mechanically checks
  toggle-state and PUBLISHES flags ("public stream; the tracking/funding
  entity gets the head-up"). Penalty = the entity's domain (clawbacks etc.)
  — outside our hands, so our hands stay clean
- Receipts minted while a required toggle is OFF = carry the warning flag
  forever (append-only; retroactive taint is visible)
- CRITICAL AFFORDANCE TO ADD: TURNING A TOGGLE IS ITSELF RECEIPTED. You can
  switch compliance off — but the switching shows in the trail (no quiet
  clearing of lights before acting)

**CONFLICTS OF INTEREST Gui asked me to point out:**
1. WATCHER-FUNDED: government funds its project AND audits it = auditor and
   funder are one. Partial fix (his instinct): the FUNDERS watch, but the
   PUBLIC STREAM is the real corrective — everyone can see, so no watcher
   can quietly look away. Full fix = the neutral fiscal host publishes
   compliance state, parties dispute IN PUBLIC with receipts.
2. PLATFORM TRIPLE-ROLE: we host commerce, sell record access, and publish
   flags. Guardrails: flags are BOOLEAN machine checks (no editorial
   judgment = no censor power; M0 survives), the corpus/aggregate stays the
   commons (never sold as product), per-record sales flow BY THE CREATOR's
   license choice. We publish state; we never rule.
3. TOGGLE TRUTH: entities could toggle off precisely when misbehaving —
   handled by the receipt-the-toggle rule above (the change itself is
   evidence).
4. NEW ONE (mine): a "government account" classification is itself an
   attack surface — anyone claiming pack status gets premium trust. Fix:
   account-type claims carry VERIFICATION requirements (domain/registry
   checks) or they're just claims, and the pack still only binds if the
   FUNDING ACTUALLY CAME through the fiscal host (money proves the type).

**THE HISTORIAN MARKET (his 300-year case — the strongest chain argument):**
five-year audit = compliance; 300-year provenance = civilization
infrastructure. The blockchain toggle's real customer isn't the project that
wants immutability today — it's the FUTURE READER who can otherwise check
nothing. Optional-first toggle (post-MVP, phase 4+), institutional packs
later; Cardano/Midnight stamps already on the roadmap = the toggle's backend.
