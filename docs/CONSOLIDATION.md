# Compute Fund — Legacy Consolidation (2026-10-07)

*Resolves conflicts between the David-era corpus (Mined from My Drive/Hermes-Shared/david-backup,
30+ docs: manifestos, prototype, episode scripts, case study, milestone receipts) and the
current build. Rulings by Gui's standing direction + patronage law.*

## Ruling 1 — ALLOCATION MODELS (3 competing mechanisms found)
Legacy had three mutually incompatible selection mechanisms:
- (a) mechanical priority_score (+2 per contribution, cap 100; David-era prototype/Supabase)
- (b) community votes (video scripts/ZUCK-ESSAY)
- (c) audited pure lottery (Golden Ticket fiction — everyone equal odds)
**RULING:** short-term = priority score as an honorific signal (badge/discovery boost), NOT
allocation; allocation = patron choice (donors pick projects). Merit-layer voting re-enters
at Phase 5 governance. Lottery stays in fiction (non-canonical) but its fairness audit
pattern is reusable for any future public allocation.

## Ruling 2 — CO-OWNERSHIP/REVENUE-SHARING: DISAVOWED
Legacy MANIFESTO Phase 3 ("backers become co-owners, revenue-sharing — resource-sharing not
investment") directly violates the patronage lock and the Howey wall (see TOKEN-DISTRIBUTION).
**RULING:** disavowed. Replaced by "compute-forward" (projects that earn may donate compute
back into the fund — Commercial Layer in Phase 4). A note is added to the Drive manifesto to
prevent re-import.

## Ruling 3 — TIER AMOUNTS ($5 vs $25)
Manifesto said $5/$50/$500; prototype shipped $25/$100/$500.
**RULING:** $25/$100/$500 ships (v1 live). $5 micro-tier returns in Phase 2 as an
additional band once payment rails exist (micro-donations have fee-floor concerns).

## Ruling 4 — RECEIPT DEPTH: ADOPTED (additive)
David-era receipts law strengthens ours, adopted into QUESTION-STANDARD:
rejection trails captured; receipt format separates checkable-finding from
non-reproducible-search (ART case-study critique); a receipt format that makes overclaiming
structurally difficult is a feature, not a compliance cost.

## Ruling 5 — FOUR-LAYER VISION: RE-SCOPED
Baseline/Merit/Commercial/Reserve layers from the video scripts = long-term ARCHITECTURE,
not launch claims. Mapped: Baseline → post-MVP compute grants; Merit → Phase 5 votes;
Commercial → Phase 4 compute-forward; Reserve → Phase 4 emergency pool. Marketing (videos)
may CITE the vision, always labeled as roadmap, never as existing.

## Ruling 6 — CANONICAL SOURCES
- Current: this repo (ROADMAP/SPEC/QUESTION-STANDARD/TOKEN-DISTRIBUTION) + CommonWeave
  MANIFESTO.md + ATTRIBUTION-LAYER.md.
- David-era: treated as research corpus. ZUCK-ESSAY-2026-FULL (updated 2026-08-12) is the
  canonical legacy text where duplicates exist. Golden Ticket episodes = brand/inspiration
  only, explicitly non-canonical.
- Prototype (compute-fund-v0 src): pattern reference (Stripe flow, follow-on-fund,
  manifesto-lock card, project form fields) — reuse patterns, not code wholesale (different
  stack generation).

## Mined inventory (key sources)
30+ files incl. MANIFESTO/MISSION/ZUCK-ESSAY/VIDEO-SCRIPT, INITIAL-ROADMAP + milestones
(cfv-ms-001..004 with judge receipts), Next.js prototype + Stripe routes + Supabase schema
(projects: compute_goal_cents/compute_balance_cents/priority_score; ledger_entries kinds
funding/compute/badge/adjustment; compute_runs w/ raw_receipt jsonb), ART discovery case
study, Golden Ticket v1/v2, MemPalace tooling (NOTE: palace data store itself was not
present on the Drive — palace memories unrecoverable; only tooling + plists synced).
Registry + cross-video hooks (X Money rails, RLM efficiency funding, 402 credit-currency)
preserved as idea index in this file's commit history.