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

## 13. THE MINIMUM DISCLOSURE FLOOR (Gui, 10/22 night — "is that personal info?")

**His instinct (correct, formalized):** receipts must be stamped with WHO
stands behind them — not the legal NAME, the ACCOUNT PROFILE (his words:
"maybe not necessarily their name, but their profile so it will link to their
passport"). THE FLOOR (v0, three stamps on every receipt):
1. THE ACCOUNT STAMP: the stable platform profile (pseudonymous OK — GitHub
   norms) → links to the passport (Midnight; his self-correction noted)
2. THE STATE STAMP: toggle/pack state at mint time (§12's compliance layer)
3. THE LINEAGE STAMP: checksum chain (provenance — the spine)

WHY THE FLOOR IS NOT OPTIONAL: anonymous receipts = worthless provenance —
the whole product IS attribution. The floor is the minimum *accountability*:
one persistent, passport-verifiable identity per account (the anti-sybil
floor), NOT nameness. His pushback-free zone: this is right.

THE LEGAL ISSUES he asked about (verified against GDPR Art. 17 guidance):
- Profile-stamped receipts = normal social-platform pseudonymity (consented,
  disclosed, the service itself) — GitHub/npm pattern, low risk
- PAYOUTS are where law really bites: KYC = the FISCAL HOST's job, PRIVATE,
  never on a public receipt (money identity ≠ public identity — two rails)
- ERASURE vs IMMUTABLE RECORDS (the tension): solved with the TOMBSTONE
  PATTERN — erasure removes linkable human data (identity links, contacts,
  PII); the receipts keep the pseudonymous account stamp and the account
  becomes an archived tombstone ("the record remains"). Anonymized work
  records leave GDPR scope; archiving/historical research is even an
  explicit Art. 17(3) exemption. Pseudonymity ≠ anonymity: it survives.
- EDGE CASE — those who need to build quietly (shy builders through
  whistleblowers): the SEALED RECEIPT CLASS: stamps only "a standing-N
  passport holder, verified human, unique" (zero-knowledge — the Midnight
  case) + no profile reveal. Honest cost built in: sealed receipts are
  WEAKER provenance and the market discounts them — buyers can see it's
  sealed and price accordingly. Default = open stamp; sealed = the rare
  escape hatch, never the norm (the brand is attribution).

WALLS ADDITIONS: the floor means NO fully-anonymous receipts ever (the
anti-sybil floor above); the platform NEVER publishes payout KYC; tombstones
are labeled as tombstones (the record remains, visibly archived).

## 14. IDENTITY TOGGLES + TOMBSTONE-REBIRTH (Gui, 10/22 late — his mechanism, upgraded)

**HIS DESIGN (accepted parts):**
- PUBLIC-FIGURE TOGGLE: attaching your NAME to an account = voluntary, ON/OFF
  anytime. Name = an overlay the user controls; the platform never mandates it
- HANDLE ≠ ID: the handle changes freely; the internal account ID never
  public (his suggestion: the ID rides on the passport binding)
- ORG-SCOPED REQUIREMENTS: business/org accounts can REQUIRE member configs
  for members acting in that org's context (his Microsoft/CEO example: the
  CEO seat = public-handle required, so statements carry identity; leave the
  seat, go private again). He's right this is common — role-scoped
  publicness = the norm for prominent roles
- TEST-UNTIL-SOMETHING-BREAKS: accepted as the working method (this is
  literally what the clean-room line is FOR)

**THE PUSHBACK (the hole in the forgetting route as described):** toggle the
name off + change the handle ≠ forgotten. Two reasons:
1. RETROACTIVE INK: receipts stamped while public stay stamped forever (he
   acknowledged this) — the old name lives on the old chain entries
2. CORRELATION DEFEATS COSTUME CHANGES: the SAME account minting new
   receipts under a new handle links back via the lineage (same projects,
   same artifacts, same timestamps), content style, and internally via the
   passport binding. An observer with the old receipts + the new handle's
   project list re-links them in minutes. Stealth = security theater.

**THE UPGRADE — TOMBSTONE-THEN-REBIRTH PROTOCOL (the honest forgetting):**
- STEP 1 · RETIRE: invoke the tombstone — the account visibly archives ("this
  identity retired at T; N receipts sealed under it"), the NAME-link erases
  (erasure law satisfied), the handle retires permanently (never re-usable)
- STEP 2 · REBIRTH: the new account = a FRESH passport binding; the platform
  SEVERS the old↔new correlation AT THE TOMBSTONE (and must never carry
  internal link data across)
- RESULT: the work remains (provenance intact, attributed to the tombstone,
  visibly retired), the human is gone from the new trail. Forgetting becomes
  a CEREMONY, not a costume change — and ceremonies are auditable, which is
  the point: the trail shows a retirement happened, never who became whom.

**ORG-OVERRIDE GUARDRAILS (my additions to his org design):**
- The org requirement binds ONLY org-context receipts minted under that
  org's projects — never the member's personal account globally
- EXIT STAYS FREE: leaving the org = one click; the org retains nothing
  personal but the already-stamped org-context receipts
- HARASSMENT-AWARE PACKS: controversy-adjacent orgs may run no-forced-public
  packs (the sealed class covers members when needed) — forced exposure as a
  loyalty test = an abuse vector to watch

**SCHEMA/HOOKS:** toggles (public_figure, handle_history sealed list, org
pack memberships, tombstone state) = GATE+2 account-model fields; test order
in the clean-room: floor stamps → name overlay → handle change → tombstone
rebind → org pack on a member receipt.

## 15. THE JURISDICTION LAYER, CORRECTED (Gui's clarifying round, 10/22 late)

His reading (confirmed-with-corrections): tombstone = the human becomes
unknown on OUR platform (name + handle erased/archived; the account shell =
a visibly retired "unknown" with the work intact). TRUE in substance. And:
"whatever is on the blockchain is out of our jurisdiction." TRUE in control,
OVERREACHED in law — two corrections:

**CORRECTION 1 — NAMES NEVER TOUCH THE CHAIN (the design law this round
earned):** whatever the toggle state, chain stamps carry ONLY pseudonymous
data: account-ID/hash, checksums, pack states, lineage. The NAME lives
ONLY in the platform DB as the public-figure OVERLAY (erasable by
tombstone). Consequences:
- Nobody's NAME is immutable anywhere — not even public figures'. The
  IMMUTABLE thing = the WORK's provenance (which is all the historian
  needs): the receipts stay attributable to a persistent pseudonymous
  identity whose public-era association with the person existed in the
  world (community memory, mirrors, press) — not in our writes, not on
  chain
- This makes the chain minimal-personal-data BY CONSTRUCTION = the
  strongest defensible posture (and cheaper stamps)
- His Gates scenario still LANDS: the org-pack requires chain-stamping →
  the WORK is provably Microsoft's-CEO's-era work forever (stamps +
  lineage); the NAME association survives via the public era, not via
  chain-resident names. Erasure he CAN get (our overlay); the world's
  memory nobody can erase. The honest balance he actually wanted.

**CORRECTION 2 — NO IMMUNITY ILLUSIONS:** "user chose a third party → we
can't be sued" is not how liability works: WE (or our infra) operate the
stamping pipeline, so we remain an acting party. The REAL defense stack:
(1) explicit user CONSENT at stamping (disclosed, opt-in, permanent-choice
warning BEFORE first stamp), (2) chain stamps = pseudonymous/minimal (C1),
(3) the tombstone = good-faith erasure of everything WE control, (4) the
archiving/historical-research exemptions (Art. 17(3)), (5) org-required
stamps = disclosed as the ORG's requirement (the requiring party owns it).
Defensible, never immune. Our job = make consent real and data minimal.

**THE FRAUDSTER QUESTION he raised (erasure ≠ amnesty):** a fraudster
invoking the tombstone does NOT erase their trail: the receipts, stamps,
lineage, compliance flags (§12) all REMAIN — pseudonymous but queryable as
one account-shell; the name-link goes, the evidence stays; legal-claims
exemptions cover retention anyway. Erasure removes the person, never the
record. (The work is not the person — that's the whole architecture.)

**CONFIRMED:** the join-or-don't framing: compliance = the project's terms;
the user's real choice = join-with-requirements or don't-join.

**RISKS DISCLOSED TO USERS (the consent screen lists these):**
- First-stamp permanence: chain-stamped receipts are irreversible
  (toggle-off = prospective only) — warned at enable time
- Public-era association cannot be recalled: while public-figure is ON, the
  person↔account association propagates (screenshots, mirrors, memory);
  toggling off ≠ recalling the era
- Public-identity harassment exposure: name + work = a doxxing surface;
  sealed class + org packs mediate, never eliminate
- Tombstone ≠ fresh start mid-career: retirement is the ONLY unlink; ongoing
  accounts always correlate (§14)

## 16. THE MERGE + THE CONVERGENCE SIGNAL (Gui, 10/22 late night)

**THE VISION (accepted — it completes the fork):** forks today diverge and
never rejoin (the famous OSS reality: long-lived forks stay split). Gui's
instinct: if the platform shows forks working the same direction RISING in
parallel, it should make joining CHEAPER than competing — team up, pool
resources, put lineages together. Game theory: cooperation must be the
smooth path. THE MERGE = fork-in-reverse.

**THE MECHANISM SKETCH (v0, mutual-consent only):**
1. THE DAG-JOIN: lineages are chains; a merge = a join receipt with TWO
   parent edges (git's merge-commit shape). Shared-ancestor forks get the
   common prefix deduped automatically; cross-lineage merges = a fresh root
   with both lineages as parents. Provenance survives BOTH sides forever.
2. THE MERGE CONTRACT (the prenup — the real work): one on-receipt artifact:
   who brought what (contributed receipt ranges), credit/veto/exit rights,
   charter adoption (superset or side B's), name resolution (one canonical;
   the other tombstone-marked "merged into X"), rent allocation.
3. RENT INHERITANCE: the merged project inherits BOTH parents' one-hop rents
   — proposal: capped (max of the two, not the sum) — the ancestor collects
   its due once, not doubled. (Also the honest upside: two single forks each
   paying 10% rent become one project paying max(10%,10%) = the merge SAVES
   rent = a real economic pull toward cooperation. Watch it: it must not
   become a consolidation weapon — M6.2 accumulation-gravity rules apply.)
4. PERSONAL RECEIPTS SURVIVE EVERYTHING: the merge moves PROJECT lineage,
   never user receipts — passports untouched (the property that makes
   merging safe to try: your record never merges away).
5. THE UPSTREAM MERGE (the special case = the OSS loop closed): a fork
   merging BACK into its parent = our version of the pull request — the
   parent's custodian reviews; acceptance mints the upstream-merge receipt;
   the fork's author gets credited in the parent's lineage + a claim for
   the review work (the claim ladder feeds it — the maintainer pain point
   from outreach P1 finally has its payment rail).
6. THE CONVERGENCE SIGNAL (the discovery mechanism he described): the
   platform watches lineage siblings' velocity; when 2+ forks rise in
   parallel on the same direction, the discover page surfaces "converging
   work" — a NUDGE, never an auto-merge. Competitors become visible to
   each other; the platform never pushes them together.

**THE PUSHBACKS (his "tell me if I'm overcomplicating" reverse):**
- NOT overcomplicated — but the SPLIT between easy and hard must be honest:
  LEDGERS merge easily (append + DAG-join); ARTIFACTS do not. Two game
  engines can't auto-merge code. The merged project starts with both as
  sources + an integration milestone series (merge-plan receipts). The
  contract + the work = the creators'; the platform receipts the process.
- WASH-MERGE GUARD: merging must never MINT standing (standing recomputes
  from real receipts; a merge only unions lineages) — no sybil farming of
  "bigger pool" illusions.
- MERGE-AS-TAKEOVER: mutual consent + free exit (the split law stays
  available) + gravity rules. Cooperation without lock-out — the only
  stable cooperation.
- The two timeline versions he described are BOTH real and BOTH kept:
  business-account co-fork = the day-one version (start together); the
  merge = the converge-later version. Same mechanism family, opposite
  ends of time.

**PROMOTION NOTE:** this section promotes to GAME-THEORY-MECHANISMS as
M-THE-MERGE at the next consolidation pass (with the fork suite in M6).

## 17. THE RECIPE-OUTPUT PAIR (Gui, 10/23 morning — "prompt stamped into receipts")

His question: the Opus-videos gallery shows outcome + prompt together — is
that in our receipts? ANSWER: the data model supports it (artifacts are
first-class receipt objects; prompts can be artifacts; disclosure =
default-open). ADDED to the designs (roadmap: under SHOWCASE LAYER):
1. **RECIPE ARTIFACT TYPE**: prompt + output PAIRED as one minted object
(the Skillry pattern — outcome playing, recipe underneath, both checksummed)
2. **THE RECEIPT VIEWER**: hero/discovery cards render outcome + recipe (the
cards already 80% there; this extends them)
3. Disclosure = a choice (open default / sealed class — the receipts law);
the PAIR = the natural data-token unit; remakes link via stitched-from
lineage; the wedge stands: 703 credited authors earning nothing.

## 18. PATRON-UNLOCK (Gui, 10/23 morning — the individual-receipt incentive, untangled)

His scenario: a project outputs 40+ rigged FF-style HD characters; a user
wants ONE — not the fork, not the whole studio: the receipt (or a few). His
nonprofit-heard mechanic: donate a threshold → unlock a badge → access the
receipts. He asks: license or output-ownership? personal vs in-project use?
who gets paid when the model flows onward?

**THE ANSWER — it's a DONATION WITH ACCESS PRIVILEGE (Patreon-tier
mechanics), not a license sale.** The legal term he was fumbling for: we
never sell the license; the CREATOR's chosen license stays the law of what
the receipt allows (the license field on the artifact = the truth layer).
The donation = a GIFT (no profit expectation = inside the walls) + grants
ACCESS per the creator's thresholds + a patronage badge (Standing component,
Phase-2 "Compute Sponsor" badges = already planned). THE MECHANIC:
- Project defines PATRON-UNLOCK THRESHOLDS (their ask, per project; platform
  defaults = the existing $25/$100/$500 tiers scaled; credits-denominated
  thresholds votable under M9)
- Donate past a threshold → the badge → receipt-access on that project per
  the receipt's license terms (open license = could've been free anyway —
  the unlock exists for RESTRICTED-license artifacts + the patronage ethos +
  convenience; that's why the tiers are honor, not ransom: an open-license
  receipt never gate-keeps)
- PERSONAL USE (their own game, offline): not our business — the license's
  own terms govern (CC-BY-NC etc.); we see nothing, track nothing
- IN-PLATFORM USE (slotted into their Compute Fund project): receipted by
  construction — the use event mints the stitched-from lineage mark, and
  **flows through their project route the stitched-from RENT to the original
  custodian** (the §16 analog of fork rent, capped, one-hop). So: personal =
  free+private; platform = attributed+routed. No surveillance needed: only
  the platform's own economics are visible — nothing external is watched
- OWNERSHIP: never transfers. Output-ownership + commercial rights = the
  creator's license alone decides; the unlock = access + privilege, not deed

**COHERENCE CHECK (his "one life form" requirement):** every piece = existing
rails — donations tiers (Phase 0/1 exist) + community badges (Phase 2
planned) + sectional entitlements (GATE+2 L5) + stitch/fork rent (§16 + v0)
+ the M9 votability. The ONLY new object = the threshold→badge→access
BINDING (a join, not an engine). Zero conflicts with the walls: no profit
expectation (gift), no cash-out, no license-selling, no securities.

## 19. THE ACQUISITION MANEUVER (Gui, 10/23 — fork→merge replaces the paperwork)

His scenario: a project carries thousands of rigged FF characters; a modder
of the whole game wants the character SET living inside her project. Her
maneuver (his design, mid-thought): **fork the characters project → merge
the fork into my project** — two primitives we already built doing the job
of a licensing negotiation. He realized mid-stream that "merge then
unmerge" resolves to: fork ONCE (rent attaches), merge ONCE (lineage
joins), and never merge the FOLLOW-UP branches (the creator's future FF11
characters never touch you unless you merge again).

**THE MECHANICS (confirmed against the existing suite):**
1. FORK = the moment rent attaches (5-20%, default 10, frozen at fork time,
   one-hop to the characters' custodian — v0 law)
2. MERGE = the lineage joins: your merged project = two parent edges (yours
   + the characters'); the rent RIDES the characters-lineage inside your
   project — yes, you keep paying rent as long as the flows run, because
   the lineage stays alive as a parent edge, and the SPLIT law (M6) = the
   clean exit if you ever want it. (His unmerge instinct = the split.)
3. MERGE FEE: **NONE by default — and that IS the design law.** Cooperation
   must cost LESS than solo (the game-theory smoothness law, M0). A merge
   tax = fee-stacking = kills the very maneuver that makes joining cheap.
   What the merge-into party CAN set: nothing toll-like; review work is a
   CLAIMED milestone (upstream-merge). Extras = negotiated inside the
   MERGE CONTRACT (the prenup, §16) when both sides want them — the
   platform's only cut = the M9-voted share on flows, never a per-action
   toll.

**THE LICENSE/FLOW LAW (his licensing skepticism, resolved — this is the
load-bearing sentence):**
**The license governs the COPY. The platform governs the FLOW.**
- In-platform: every flow is receipted, metered, and routed (rent /
  verified-use / patronage) REGARDLESS of license — MIT, GPL, NC, or
  patchwork all ride the same economic rails. No license-interpretation
  bureaucracy: intake only checks the publish floor (provenance + "you
  have the right to publish this")
- Out-of-platform (personal use, exports): the license's own terms rule —
  we see nothing, govern nothing
- The platform's fairness job = NOT the enforcer of licenses, but the
  ROUTER of value + the DISPLAY of openness: "you took it, you give back"
  becomes automatic (flows route by receipt) instead of remembered
  (donations nobody sends)
- The open-incentive stays: open disclosure = the strongest standing/
  verified-use signals (C3 flag); default-open publish nudge; restricted
  licenses work on the same rails but show their closed seal

**THE THREE RAILS, ONE SPINE (the answer to "same mechanism?"):**
- SPOT = buy ONE receipt/artifact (the data-token, L5) — the one-character
  want
- BULK = fork→merge (the ACQUISITION) — the whole-character-set want
- PERSONAL = donate→badge→access (§18 patron-unlock) — the non-project use
All three: same provenance spine (receipts+checksums), same rent routes,
zero new mechanisms. The USER EXPERIENCE = maneuvers (fork / merge /
claim / fund), not paperwork — his closing instinct, kept verbatim: "you
maneuver yourself within the platform."

## 20. THE LICENSE COMPETITION (Gui, 10/23 — the game-theory guess + the pushbacks)

THE GAME AS DESIGNED (the surfaces already built): permissive = the full
maneuver stack; copyleft = full-minus-fork (until C5); NC/ND/BSL/none =
full-minus-fork + a visible closed seal. Three gradients press toward open:
(1) DISCOVERY: the fork/convergence graph = the community engine — a
closed-license project = an ISLAND (no forks = no fork-tree discovery, no
convergence feed, no lineage community) — structural, not censorship
(2) TRUST: standing math favors open disclosure (verified-use + open
artifacts = the strongest signals → bigger claim sizes, lighter review,
showcase rank)
(3) THE RENT ECONOMY: an open artifact gets USED — every in-platform use =
rent + verified-use compounding; a closed artifact = idle (nobody can
reuse it). Openness profits ON OUR RAILS by being reused, not by gating.
Scarcity note (honest): closed receipts = scarce = high spot-price/low
volume; open = low-price/high-volume/compounding — the market can price
either; the rails stay neutral, the GRADIENTS do the persuading.

THE EQUILIBRIUM PREDICTION (educated guess, per the game):
- Small/indie projects flip fast — exclusivity is worth little to them;
  the fork-community + discovery + reuse-rents are worth a lot
- Medium projects try hybrids (the real-world pattern: open core +
  restricted edge) — the platform handles hybrids fine (per-artifact
  license seals; the maneuver stack applies per receipt)
- Incumbents with brand/trust moats stay closed and lose the
  compounding network — becoming the "legacy licenses" Gui predicts
- THRESHOLD EFFECT: once open projects' funded-share passes critical
  mass, switching becomes a wave (network-effect bootstrapping = the NFX
  law; the cold-start risk = N-2 in the risk register: restrictive
  incumbents arrive with liquidity — supply-side P2 seeding = the answer,
  already the plan)
- OWNERS CAN SWITCH, but only PROSPECTIVELY: released versions stay
  governed by the license they shipped under; a relicense = a receipt-of-
  record (versioned license event); our frozen-at-fork law already
  snapshots license-at-event-time (C5's family inheritance reads the
  snapshot)

THE PUSHBACKS (where Gui is wrong — labeled and stated):
1. THE REVERSE-ENGINEERING INEVITABILITY ≠ LICENSE INEVITABILITY. AI
   recreates code-adjacent assets faster than ever — directionally his
   point holds. But the LEGAL world doesn't vanish with it: DMCA takedowns,
   EULA/§1201 claims, courts (the ones we route AROUND for our flows — the
   world still uses them), platform bans. Open clones of closed products
   live gray, get sued, die on app stores. The CLEAN route for a closed
   incumbent isn't a clone — it's OUR RAILS: get funded to open up, keep
   the stewardship, earn the reuse-rents. Compute Fund should be the
   open-up ladder, never the pirate bazaar (the publish floor +
   takedown-respect stands; legal suicide refused).
2. CLOSED ≠ VALUELESS — the un-cloneable moats survive recreation: brand,
   trust, stewardship, timing, relationships, community. Code moats erode;
   TRUST moats don't — and trust is exactly what receipts mint. Our thesis
   upgraded: in a world where everything gets recreated, the value shifts
   from HAVING the artifact to being its PROVEN CUSTODIAN — which is
   precisely the platform's product (don't compute what's computed: pay
   the rent; don't re-earn trust: carry the receipts).
3. SMALL CORRECTION ON "OPEN WILL PROFIT": profit here = platform-side
   income (funding + reuse-rents + standing), never gate-rents for
   closed... AND the rails stay neutral-by-design: the seal isn't a fine;
   if closed scarcity wins in some niche, that's M9-emergent behavior, not
   a failure. We tilt, we don't force. The M9 votability = the pressure
   valve if the gradient overreaches.

MILESTONE NOTE: no new milestone — this round = gradients already encoded
(fork table C5-update, standing math M4, seals showcase-layer, rent rails
§16/§18/19). The one watch-item: measure the funded-share of open vs
closed at the pilot (the threshold-effect evidence — a receipts question
we can answer with our own data; add to pilot metrics).

## 21. THE JOINT METER (Gui, 10/23 — project reputation from its people)

His idea: when a project opens with multiple people ("opening a business" =
co-managing a project), the PROJECT's reputation = the average of its
members' reputations.

**ALREADY HALF-ON-FILE:** projects carry their OWN receipt-earned
trust_meters (SPEC-V2 Project object); M12 co-signers = the vouching
mechanism (co-signs widen claim capacity, stake risk explicitly); the
M7 doctrine: nobody inherits unearned trust. The AVERAGING = the new part.

**THE THREE BITES ON PLAIN AVERAGING (the pushbacks he asked for):**
1. STAR-DRAG: the 90-rep veteran who mentors a 30-rep newcomer gets priced
   at 60 — averaging PUNISHES mentorship, the exact behavior we want more
   of (the school-group-project problem)
2. FREE-RIDER RIDE: the newcomer rides UP (30 becomes 60 by proximity) —
   parasitic joining: borrow a high-rep name, inflate your project
3. ALLIANCE FARMING: high-rep accounts marry each other's numbers upward —
   rep-rings (the mutual-averaging game)

**THE REFINement that keeps his core and kills the bites — REPUTATION
FOLLOWS CONTRIBUTION, NOT MEMBERSHIP:**
- **The project's reputation = the JOINT METER: earned only by RECEIPTS
  ITS MEMBERS CO-WROTE** — every co-delivered milestone writes into the
  project's own meter; the average EMERGES from shared work (both
  signatures on the receipts), never from identity-math at open-time. A
  fresh joint project starts NEUTRAL (his "co-fork from day one" thread =
  exactly this: founding together = authoring receipts together)
- **The head-start exists anyway, the honest way: M12 co-signing.** A
  veteran can vouch a newcomer's early claims — at the price of STAKED
  trust (the co-signer shares the risk if the milestone fails). Vouching
  = the average's honest cousin: explicit, priced, signed
- **The roster = the soft signal:** the project page SHOWS its members'
  standings (visible association, never a merged number)
- Personal passports stay untouched (their receipts survive any project
  outcome — §16's law)

**COHERENCE:** this = M4 + M7 + M12 + §16 combined, no new engine — his
instinct ("the average") is what a joint-authored receipt trail LOOKS
LIKE from the outside. The number is earned, not averaged.
