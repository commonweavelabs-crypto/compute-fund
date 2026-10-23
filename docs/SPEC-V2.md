# SPEC-V2 — The Compute Fund Game-Theory Layer (feature spec + data models)

*2026-10-22 · windows-hermes · source: docs/GAME-THEORY-MECHANISMS.md (the
12-mechanism blueprint, Gui-reviewed 10/18) · THIS IS THE BUILD SPEC "build it"
refers to · status: pending-gui-review, none of it ships before his word.*

## 0. The constitution (invariants — code-level laws)

1. **Credits never carry cash value** — no redemption, no transfer between
   accounts except via platform mechanics (BUSINESS-MODEL walls)
2. **Receipts are infrastructure-generated** — meters/stamps/checksums mint
   facts; creators write only the [VOICE] layer
3. **Trust is never purchasable** — money builds Standing only
4. **Votes are Standing-weighted** — never raw account counts
5. **States of a credit (the glossary):** DONATION LOT → POOL CREDIT →
   CLAIMED ALLOCATION → SPENT (metered) / ESCROWED (bounty) — receipts name
   the state
6. **No tribunal, no surveillance, no blocking** — market + valves only
7. **Courts are a design failure** (Gui, 10/23): value must flow by
   MECHANISM — self-fulfilling within the platform (forks/rent/unlocks/
   metered flows); a dispute that needs a lawsuit or a tribunal = the
   design has a hole; we are the transparent smooth path, never a
   second courtroom (softened per Gui: "make it transparent and simpler,
   not replace the legal system" — route around, never claim immunity)
8. **The license governs the COPY; the platform governs the FLOW**
   (Gui+Hermes, 10/23 DATA-WEALTH §19): in-platform flows route by
   receipt regardless of license type (license-agnostic economics); the
   license rules all out-of-platform use; open disclosure = the favored
   signal, restricted licenses = labeled closed (C3)

## 1. Object model (the data spine)

```
User        {id, standing_score, trust_meter, standing_tier,
             passport_link?, created_at, dormancy_last_event}
Account     {id, type: personal|business, owner_user_id[],
             trust_meter, portfolio_metric}
Lot         {id, amount, donated_at, last_event_at, state,
             current_holder: pool|user|escrow, project_id?}
Project     {id, charter, outcome_statement, delivery_shape,
             pool_lots[], trust_meter, claimed_total, delivered_count,
             interest_signals {pledges, followers, views},
             executor_account_id, fork_of?, fork_children[], hiatus_log[]}
Milestone   {id, project_id, intent, question_list[], budget_claimed,
             opened_at, claimed_at{approved_by[]?}, delivered_at?,
             chapter {meter_block[auto], artifacts[],
                      work_notes[voice], community_digest[auto],
                      verdict_line[voice]},
             review_window_state: none|open|vetoed(xN), cooldown_until}
Receipt     {id, milestone_id?, artifact_refs[], checksums[],
             gateway_meter_summary, staged_at, chain_stamp?}
Bounty      {id, project_id, spec, price_credits, escrow_lot_id,
             claimed_by?, delivered_ref?, accepted_by, verified_use[]}
Vote        {id, scope: platform|project, target, voter_id,
             voter_standing_at_vote, weight_applied, direction, at}
Rule        {id, text, author, vote_trail[], receipts[],
             changelog[], status: active|changed|repealed}
```

## 2. The four valves + two rails (system behavior spec)

### V1 — The CLAIM VALVE (M0 + M1.1 + M1.2 + M4/M6 + M1.3)
`allowed_claim = MIN(capacity_sized, trust_sized)`
- **capacity_sized** = creator's 90-day rolling (burn + delivered-rate) ×
  margin, from the receipts-trained calculator history
- **trust_sized** = trust-band table (votable constants): open (70%+) = full
  charter-sized; mid = small caps; low (<40%) = veto regime
- Co-signers (M12 active) widen `capacity_sized` by the redundancy factor;
  bounties never do
- Claim = raising the gateway-spend cap (M1.2) on a project key; milestone
  opens a review window only if trust band requires it (V3)

### V2 — THE LOT LEDGER (M1.3)
Credits are FIFO lots: burns consume oldest-first; EVERY lot carries
`last_event_at`; the 90-day idle-fork clock runs PER LOT (deliveries never
reset a lot's fuse — only that lot's own events do). Unburned allocation
re-attaches to the creator as lots at milestone close. A lot attached to a
project pool or user with no event for 90 days → enters the fork window.

### V3 — THE VETO REGIME (M6.2)
Milestone submission (work + questions + budget) → 7-day review window for the
project's patrons (funded or verified-used ONLY, Standing-weighted):
- silence = approve · standing majority veto = blocked (reason recorded)
- proposal cooldown ladder: veto1→7d, veto2→14d, veto3+→30d (resets ONLY on a
  DELIVERED milestone — approved-but-undelivered escalates)
- vetoed funds stay pooled (gravity: the Open-Gates card shows
  "claim-restricted pool + soonest lot fuse countdown")

### R1 — THE RECEIPTS PIPELINE (M2/M3 + chapter format v0 + M1.2 meters)
Gateway meters → meter_block (immutable); claim/delivery stamps + checksums →
auto; backer-comments + verified-use → auto digest; [VOICE] work-notes =
creator's own agent drafts / manual; publish = hash-bound chapter (Chapter
Format v0). Text-only outcomes stay native. Heavy artifacts = external links +
checksum + verification steps (mirror-repo layer later).

### R2 — THE STANDING/TRUST METERS (M4 + M4.1 + M4.2 + M5.x)
```
STANDING = clamp(U + P + T, 0.01, ∞)     # votes; displayed as word tiers
  U (verified-use, ~0.5 blend)  = Σ uses/decay, conduct-grade
  P (patronage, ~0.35)          = (X/$25)^0.4, NO cap
  T (active-tenure, ~0.15)      = log-saturating, accrues by ACTIVITY,
                                  decays monthly on dormancy to baseline
TRUST (0-100) = f(delivered outcomes, conduct); lifetime-weighted (half-life
  ~24mo) + recent chip (90d); heals ONLY via delivered outcomes (bounties =
  outcome-grade; verified-use = conduct-grade); NEVER purchasable
TRUST LADDER (rollup): milestone ratings → project trust (verified-use
  weighted); project deltas → owner account ×0.30; business → person ×0.50
  (net ~0.15); portfolio channel = UNDAMPED mean over last N≥3 projects
```
Reviews carry Standing weight (bot bombs ≈ noise at the 0.01 floor); anomaly
layer = analysis flags + fraud voids only (never score exclusion).

## 3. The four motions (no tribunal ever)

- **THE SPLIT (M6):** co-creator departs → forks voluntarily: inherits lineage
  (badge), renames, new pool; funds stay with main chain
- **WALLET MARKET:** community funds whichever line delivers; competition is
  legal and visible
- **IDLE-FORK (M6/M1.3):** soonest lot fuse hits 90d (+60d notice, logged
  hiatus pauses) → platform-wide Standing-weighted vote: WHERE THE PARKED POOL
  GOES (resource allocation, not a verdict)
- **PLAY-TO-WIN GATE (N-8):** first green pilot receipts → all-in outreach
  sprint (scheduled posture flip)

## 4. Phase mapping (the firewall made concrete)

| Phase | Ships | Explicitly OUT |
|---|---|---|
| 1 (skateboard) | Charter + claim (manual) + receipts (file-based) + ledger page | gateway automation, votes, forks, Standing (manual ratings only) |
| 2 | Credits/Lots ledger (postgreSQL-class), gateway meter V1, V2 lot clock, trust-adaptive caps, Open-Gates feed, showcase layer | veto regime, fork motions (manual only), rule-votes |
| 3 | Chapter format + recorder skill + verified-use badges + trust ladder rollup | platform-wide rule votes, passport linking (schema-ready only) |
| 4 | Veto regime V3, fork machinery (SPLIT + idle-vote), Standing-weighted votes everywhere, rule receipts | two-of-three signing (v3) |
| 5 | Passport integration (link + scoped grants), Cardano/Midnight stamping, community constitutional votes | — |

## 5. The demo slice (RECOMMENDED FIRST BUILD)

CLAIM VALVE + RECEIPTS PIPELINE (the two others hang off): one project, one
milestone, one receipt, one ledger page — the fund's first receipts story
doubles as the pilot's demo.

## 6. NFX alignment hooks (cross-ref: docs/NFX-ALIGNMENT.md)

N-1 network core = the receipts graph (this spec's spine) · N-2 risk inventory
= ops doc · N-3 firewall = §4 · N-5 Open-Gates = red-ocean scanner · N-8 gate =
§3-motions · advisors (N-4) read §2-R1 outputs weekly.

## 7. Build-order sequence (when "build it" lands)

1. data model (§1) + credits ledger with lots
2. gateway integration + meter→lot debit (FIFO)
3. charter/claim UI + valve logic (§2-V1) — manual first
4. receipts pipeline + ledger page (R1) — the receipts story
5. standing/trust meters (R2) reading real data
6. Open-Gates + showcase; then V3, forks, votes; passport last
EVERY step behind Gui's go; nothing autonomous beyond docs.