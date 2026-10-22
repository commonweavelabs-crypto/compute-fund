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