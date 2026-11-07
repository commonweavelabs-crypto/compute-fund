# AGENT-PAYMENTS UNLOCKS — spec DRAFT (decision-gated to Gui, 2026-11-06)

Origin: Gui directive after the Stripe agent-payments signal (speedy_devv reel,
archived `speedydev-stripe-under-the-hood`): "document and turn into a milestone —
automatic rent, all of it, three or four ideas." All features = IDEAS SPECED FOR
BUILD, gated on R1-R5 (receipts engine) + Stripe agent-payments API verification.
SAFETY WALL (non-negotiable, extends standing law): every feature = human approval
at setup, hard absolute caps, Stripe TEST mode first, receipts public on both ends,
`funded-by-agent` provenance on every agent-initiated payment. Other people's money
cautious by design.

## A1 — AGENT PATRONS (auto-fund subscribed milestones)
Patron subscribes once to a project: agent auto-funds the project's NEW milestones
up to a hard cap (per-project + monthly), scoped to milestones that pass the charter's
done_criteria gate. Every payment = public receipt with `funded-by-agent` provenance +
link to the standing instruction. Kill switch = patron's dashboard + revoke token.
Dependencies: R1 (receipts), Stripe rails (live), Stripe agent-pay verification.
Charter-shaped acceptance: a subscribed agent funds exactly one milestone within cap;
revoke = zero further payments; the receipt chain shows instruction -> payment -> run.

## A2 — AUTOMATIC UPSTREAM RENT (the fork-economy rail)
When R5 (fork/rent) ships: rent to the DIRECT parent's custodian routes through
Stripe (incl. agent-pay rail) automatically on funding flows through forks. This is
the mechanism for imported upstreams (rea-video case): the original maintainer gets
paid by the platform rails without manual invoicing. Receipt shows fork-edge +
rent% (frozen at fork time) + payee (current custodian, cf_system until claimed).
Acceptance: one funded fork-flow emits the rent receipt to the parent's custodian.

## A3 — AGENT COMPUTE MARKETPLACE (B2B compute by handle)
A funded project buys GPU-hours/inference from ANOTHER organization by handle
(business-to-business by handle = Stripe's new rail). Our ledger records the full
chain: funder -> builder -> compute-provider with public receipts matching DATA-WEALTH
§16.4 logic. Scope: CFQ budget_credits already cap spend; the marketplace = provider
registry (opt-in orgs), by-handle payments, receipts both sides.
Acceptance: a project spends its budget_credits on a provider org's compute; both
parties' pages show the same matching receipt pair.

## A4 — AUTO-REPLENISH PATRON POOLS
Standard recurring (Stripe subscriptions): patron sets monthly patronage; when a
project's active pool drops below threshold, the patron's standing instruction tops
it up (hard monthly cap, pause switch, receipts each cycle).
Acceptance: low-pool event triggers exactly one top-up within cap + receipt.

## BUILD ORDER + GATES
A4+A1 need: R1 receipts + Stripe verification. A2 needs R5. A3 needs R1 + provider
registry (Phase 2). Stripe agent-payments API = VERIFY BEFORE any spec hardening
(the reel says "one command in the terminal, by handle, agent runs it once you say
yes" — treat as UNVERIFIED until the API docs are read; file under FOUNDER-WATCHLIST
verification pass).

## TAKEDOWN LAW (Gui 11/6 addendum)
Unclaimed imports must carry a creator-visible "request takedown" path: public page
footer -> takedown request form (identity-protected, routes to the platform inbox),
SLA action: hide import within 48h pending check. Open-source imports may still be
re-imported by anyone (the LICENSE governs reuse), but the PLATFORM copy comes down
on request. Law hook: "compliance-as-toggles" (DATA-WEALTH §12) — takedown = a
toggle, never a deletion of receipts provenance (receipts preserve the history;
the page hides).
