---
type: risk-inventory
date: 2026-11-04
status: draft
serves: compute-fund
tags: [compute-fund, nfx, risk, ops, roadmap]
---

# Compute Fund — RISK INVENTORY (N-2, living doc)

*Fires the roadmap bullet: "N-2 docs/RISK-INVENTORY.md: every risk stack
(regulatory/payment-geo/provider-dependency/fraud/governance/cold-start/key-person),
owner-tagged" (docs/ROADMAP.md Phase 2 NFX block) — NFX-ALIGNMENT #4's "missing
artifact": "the STACK was never written down in one place". Sources read locally:
docs/ROADMAP.md (incl. the 2026-11-04 findings), docs/OPS-MANAGER.md v1,
docs/NFX-ALIGNMENT.md #4, docs/DATA-WEALTH-LAYER.md, docs/BUSINESS-MODEL.md,
docs/TOKEN-DISTRIBUTION.md, docs/SPEC-V2.md, docs/PILOT-PROPOSAL.md,
docs/LAUNCH-PLAYBOOK-STARTER-STORY.md, docs/OUTREACH-STAGE.md.*

**Standing posture (NFX-ALIGNMENT #3): market risk ≈ zero** (donating to
open-source = proven behavior; provisioning compute = proven) — **execution risk is
100% ours**, and the pilot is the execution-risk-only plan (PILOT-PROPOSAL; every
pilot carries an execution-risk-only checklist + boundary-layer metrics, NFX #3/#7).
Workstream note: each stack below names where it bites FIRST — platform-build /
ops / outreach (N-2's "compared across the three workstreams").

| Stack | Bites first | Owner (primary) | Status |
|---|---|---|---|
| 1 Regulatory | outreach + go-live | Gui (+ future: counsel) | walls BUILT, enforcement NOT-BUILT |
| 2 Payment-geo | ops/go-live | agent + Gui | rails BUILT (test), geo handling NOT-BUILT |
| 3 Provider-dependency | ops | agent | guardian BUILT; live-URL/live-keys NOT-BUILT |
| 4 Fraud/backdoor | platform-build | agent + future trust role | design defenses BUILT; live anomaly layer NOT-BUILT |
| 5 Governance (incl. moderation) | platform-build / community | Gui + future community | valves DESIGNED; vote machinery later phases |
| 6 Cold-start | outreach | Gui + agent | plan BUILT; cohort NOT-BUILT (gated) |
| 7 Key-person (incl. single-box) | ops | Gui + agent | ledger BUILT; redundancy NOT-BUILT |

## 1. REGULATORY

- **What it means for CF concretely:** patronage language must never drift into
  securities behavior — credits never carry cash value (SPEC-V2 §0.1); the
  standing trip-wires (BUSINESS-MODEL §3): credits redeemable for cash →
  stored-value/MTO; cash passed through to beneficiaries → money transmitter;
  **any expectation of return → securities; >$20k AND >200 txns to one
  recipient/yr → 1099-K; cross-beneficiary gift-tax edge → patron's Form 709.**
  The Howey wall sentence (TOKEN-DISTRIBUTION.md launch guardrail b): **"not an
  investment — no equity, no return, no revenue share."** KYC = the fiscal host's
  job, PRIVATE, never on a public receipt (DATA-WEALTH §13). One-asset-class law:
  credits are the only money-like object; data-tokens = trade RIGHTS denominated
  IN credits (DATA-WEALTH §4) — no second legal object ever created.
- **Mitigation — BUILT (design + docs):** standing law 1 (patronage framing only —
  never invest/equity/return/share language); ToS stack specced (ROADMAP Phase 1:
  non-transferable/non-cash-out wall, Howey wall "not an investment",
  no-deduction clause, CFQ release/revoke clause); gifts-not-returns framing law
  (LAUNCH-PLAYBOOK §Patronage side); comply-first posture (NFX #6: be AFTER
  regulation, never before); zero-fee-donations + printed compute-out margin
  (BUSINESS-MODEL §2).
- **Mitigation — NOT-BUILT:** lawyer + nonprofit-savvy CPA review before
  soliciting real money (BUSINESS-MODEL header law); KYC at go-live (ROADMAP
  MVP-gate row: "live keys + KYC at go-live"); email+phone ID and OFAC screening
  implementation; the deductible-patronage fiscal-host decision (deferred, §3).
- **Owner:** Gui (legal sign-off, language discipline) · agent (holds the wall
  language in every draft) · future role: counsel + CPA.
- **Trigger-to-watch:** ANY copy drifting toward "earn/return/profit/passive
  income"; any patron asking "when do I get money back"; the 1099-K threshold
  approaching for any creator.

## 2. PAYMENT-GEO

- **What it means for CF concretely:** every money-in rail runs through Stripe;
  geography controls who can fund and who can receive (Stripe country coverage),
  sanctioned regions must be excluded, and the patron audience is global while
  the fiscal rails are not. Processor passthrough (~2.9%+30¢) is visible, not
  skimmable (BUSINESS-MODEL §2); card minimums vs P3's low minimums ($5/mo
  tiers, Charlie's law) shape the tier design.
- **Mitigation — BUILT:** Stripe hosted Checkout + webhook, SDK-free REST
  (app/lib/stripe.ts); **E2E PROVEN 2026-11-04** (ROADMAP Phase 1): sandbox
  account → tunnel → signup email-auth → $25 checkout `cs_test_a1JyjN...` →
  hosted checkout PAID → webhook flipped `don_4da0fc4de50549108417` → Big Tok
  $25.00 funded. OFAC screening named in the ToS stack (ROADMAP Phase 1).
- **Mitigation — NOT-BUILT:** live keys + KYC at go-live; a geo-compatibility
  disclosure at intake ("cards we accept / not accepted from"); fiscal-host
  geography decision (Stack-1 vs Stack-2, BUSINESS-MODEL §4); sales-tax/VAT
  handling on margins.
- **Owner:** agent (rails, webhook re-registration) · Gui (go-live sign-off) ·
  future role: compliance/fiscal host.
- **Trigger-to-watch:** first declined-geo patron ticket; any sanctioned-region
  signup hitting the OFAC screen; webhook/tunnel URL mismatch (the E2E ran only
  because the webhook was re-registered to the fresh tunnel host).

## 3. PROVIDER-DEPENDENCY

- **What it means for CF concretely:** the platform lean on rented rails —
  Supabase (OAuth identity today), Stripe (money-in), LiteLLM gateway +
  aggregator pricing (money-out; NFX-ALIGNMENT #4 names this stack exactly
  "provider-dependency (aggregator pricing)"), Vercel (v0 front door),
  cloudflared tunnels, Gmail+himalaya. **THE 2026-11-04 DATUM: Supabase
  auto-pause.** Free-tier projects pause after ~7 idle days and LOSE THEIR DNS
  RECORD — project `csujyjibtxpccfvlaujm` showed NXDOMAIN and looked deleted;
  it was NOT deleted, just paused (status INACTIVE since ~Oct 27). Restored the
  same day via PAT + the management-API restore endpoint (~5-10 min to
  ACTIVE_HEALTHY, org `commonweavelabs`). **FIXED by guardian, now LIVE:**
  cron `aa401daa9afd`, script-only, every 3 days 9am ET,
  `~/AppData/Local/hermes/scripts/supabase-keepalive.sh` = real keep-alive
  traffic + status check + AUTO-FIRE restore + alert-only-on-failure (silent
  when healthy, verified). Gui's standing order: Supabase = agent-managed from
  now on; PAT rotate/revoke documented (OPS-MANAGER §1).
- **Mitigation — BUILT:** the guardian cron above; OPS-MANAGER.md as the single
  infra ledger with the new-service law (§8: every service gets a section + a
  guardian/sweep cron "if it can break without supervision"); the working ledger
  is SQLite server-side (provider-light by architecture — Postgres is a future
  Phase-2 migration); the Next 16 hydration fix (`allowedDevOrigins`, 2026-11-04)
  and 16.4.5 security upgrade; cron inventory §7 (4 jobs, each documented).
- **Mitigation — NOT-BUILT:** a stable public URL (named tunnel/domain — the
  quick tunnel changes every run; a named tunnel is the planned live
  alternative); LiteLLM gateway automation (ROADMAP Phase 1: virtual keys per
  project, hard cap = donated amount, model allowlist, endpoint scoping, audit
  log = receipts); aggregator price monitoring; Vercel/SQLite backup cadence.
- **Owner:** agent (guardians, tunnel ops, key hygiene) · Gui (deletions/
  destructive actions only; org rename = dashboard-only).
- **Trigger-to-watch:** ANY keyless/managed service going INACTIVE/NXDOMAIN;
  tunnel host drifting from the Stripe webhook endpoint; aggregator model-price
  jumps before the margin % prints; any service not yet in OPS-MANAGER §1-8.

## 4. FRAUD / BACKDOOR ("the wild")

- **What it means for CF concretely:** Sybil accounts farming Standing/votes;
  wash-merging to mint standing (DATA-WEALTH §16: "merging must never MINT
  standing"); self-donation laundering through one's own projects; anonymous
  receipts = worthless provenance; compliance-toggling off before misbehavior;
  vibe-coded frontend liabilities. **THE 2026-11-04/10-26 ADILET FINDINGS
  (ROADMAP DEBUG-SESSION):** (1) the a11y pass — keyboard-nav + alt-text on
  every interactive element (antislop-human skill) = still NOT-BUILT, scheduled
  at the Wed debug-session; (2) the RLS verify on any Supabase-managed tables IF
  the auth path uses them — our core DB = SQLite server-side = immune by
  architecture, but the auth-side must be verified = NOT-BUILT; (3) the
  budget-alerts note — our `cap_credits` + `spent_credits` = the runaway defense
  ALREADY = BUILT ("the demo to users: the platform natively protects what
  vibe-coded apps do not").
- **Mitigation — BUILT (in design/spec):** infrastructure-generated receipts
  (SPEC-V2 §0.2 — facts minted by meters, not testimony); trust never
  purchasable (§0.3); Standing-weighted votes, never raw counts (§0.4; review
  weights at the 0.01 floor = "bot bombs ≈ noise"); the minimum-disclosure
  floor's three stamps (account/state/lineage, DATA-WEALTH §13) + no
  fully-anonymous receipts ever; tombstone ≠ amnesty — a fraudster's trail stays
  queryable, erasure removes the person, never the record (§15); the
  receipt-the-toggle rule (switching compliance off is itself receipted, §12);
  anomaly layer = machine flags + fraud VOIDS only, never score exclusion
  (SPEC-V2 §2-R2); claim caps = `MIN(capacity_sized, trust_sized)` + the veto-
  regime cooldown ladder (§2-V1/V3); the wash-merge guard (§16).
- **Mitigation — NOT-BUILT:** the a11y pass (keyboard-nav + alt-text), the RLS
  verify on the auth-side Supabase tables, live anomaly-layer data, KYC/OFAC at
  go-live, sealed-receipt pricing enforcement (§13: the market must be able to
  SEE sealed and price it down).
- **Owner:** agent (a11y pass, RLS verify, anomaly flags) · Gui (judgment calls:
  voids, takedowns) · future role: trust & fraud reviewer (N-4 advisor bench
  reads weekly receipts).
- **Trigger-to-watch:** any Standing spike without delivered receipts behind it;
  any merge/claim pattern that mints standing without co-worked receipt trails;
  first `cap_credits` breach attempt; the a11y/RLS items landing unplanned in
  any sprint (the vibe-code liability audit happens at the Wed DEBUG-SESSION).

## 5. GOVERNANCE CAPTURE (+ the moderation stack)

- **What it means for CF concretely:** whale patrons or rep-rings steering
  allocation (oligarchy); the platform's triple role (host commerce + sell
  record access + publish flags — DATA-WEALTH §12 conflict note 2); moderation
  drift into censorship (NFX-ALIGNMENT #4 lists moderation as its own stack —
  folded here).
- **Mitigation — BUILT (design, specced):** Hephaestus doctrine flags (ROADMAP
  Phase 2 addition): non-tradeable governance objects; weight = 12-month average
  engagement with DECAY (anti-oligarchy); one flag staked per project per user;
  each flag raises that project's compute price — economic kill via price
  pressure, no ban lists; surpluses subsidize low-flag projects; values
  community-adjustable; schema prep compatible (donations table already carries
  user/amount/date; zero MVP-sprint impact). M9: fees/rules votable (fees start
  0%, then propose 3-5%); votes Standing-weighted (SPEC-V2 §0.4); flags are
  BOOLEAN machine checks — no editorial judgment, no censor power (§12); M0
  no-tribunal — market + valves only (§0.6, courts = a design failure, softened
  to "route around, never replace"). Moderation surface is deliberately small:
  comments ON RELEASES only + ratings (ROADMAP Phase 2).
- **Mitigation — NOT-BUILT:** the vote mechanism itself (Phase 3-5 per SPEC-V2
  §4); the Hephaestus flags layer live; comment/moderation tooling; the watcher-
  funded conflict's full fix (neutral fiscal host publishes compliance state,
  §12.1) — phase 5+.
- **Owner:** Gui (values/votes) · agent (boolean flag checks only) · future
  role: the community (the M9 valve + Phase-5 governance votes).
- **Trigger-to-watch:** single-donor share of any project pool crossing
  dominance; vote-weight concentration (Standing tiers, never raw counts);
  first flag/mint dispute that would tempt any editorial ruling.

## 6. COLD-START

- **What it means for CF concretely:** the classic two-sided hole — no creators
  without patrons, no patrons without a showcase; the trust loop only spins once
  real receipts exist; the graveyard is on record (NFX-ALIGNMENT #5: SourceCred
  wound down, token-curated registries died); restrictive incumbents can arrive
  with liquidity (DATA-WEALTH §20).
- **Mitigation — BUILT (plan + law):** the CREATOR/PATRON BALANCE standing law
  (ROADMAP 10/23): creators FIRST (supply builds the showcase), patrons second;
  spotlight scarcity (OUTREACH-STAGE §0 — few projects early = more eyes per
  project; the pitch is true, not hype); the seed graph = pilot fleet + roster +
  unclaimed stubs + Gui's dogfood node (see NETWORK-CORE.md §3); demo schema =
  production schema (no ledger reset between demo and reality, ROADMAP Phase 0);
  the two-offer structure covers both boundary-layer sides (NFX #7: donation
  long-tail + high-ASP done-for-you tier); the play-to-win gate (N-8): first
  GREEN pilot receipts → the all-in outreach sprint, posture flip scheduled not
  mood-based.
- **Mitigation — NOT-BUILT:** the live cohort (no send before the MVP gate is
  fully tested-robust — PILOT-TARGETS GO preconditions 2-4); the waitlist
  surface (S4's waitlist-then-launch arc, LAUNCH-PLAYBOOK); Stage-1's $500
  organic-donation watch window (the Stage-2 sponsor-pilot trigger, PILOT-PROPOSAL).
- **Owner:** Gui (the face + the un-delegable interviews, S22) · agent (prep,
  lists, ops) · future role: community/content partners at OUTREACH-1.
- **Trigger-to-watch:** organic donations ABSENT after a reasonable Stage-1
  window (the Stage-2 fallback trigger); the day-50 patience datum (S15: ~7
  weeks of cadence before judging the channel); claim-ladder conversion rate on
  the unclaimed stubs.

## 7. KEY-PERSON

- **What it means for CF concretely:** NFX #4 names it (with "the fund's own
  founder-dark case → M12-style redundancy in our ops"); concretely HERE: Gui =
  the face (S22 ONE-thing law: the only-Gui thing is BE THE FACE — the story,
  opinions, voice; and the judgment is un-delegable: interviews, Mom-Test gate,
  sends); the agent fleet carries the grind; ALL production infra lives on ONE
  box (crons, Supabase PAT, himalaya, cloudflared, the SQLite ledger) — a
  machine outage is a full production outage; ops knowledge concentration
  (PATs, app passwords, webhook re-registration).
- **Mitigation — BUILT:** the OPS-MANAGER ledger + new-service law (every
  management road documented; e.g. PAT path, rotate/revoke route, the
  dashboard-only org rename); every recurring op = cron + script + guardian
  (§§1-8); agent-managed services doctrine (Gui never touches keys); GitLab-grade
  honesty: remote main always pushed after milestones (OPS-MANAGER §4).
- **Mitigation — NOT-BUILT:** cross-box redundancy/backup for the ledger + keys;
  the N-4 advisor bench (2-3 scarred funding-platform operators reading weekly
  receipts — planned Phase 2, not staffed); a documented cron-succession note
  (who restores what if the supervisor dies); Gui's own delegation boundary kept
  honest (delegation covers the GRIND, never the JUDGMENT — S22).
- **Owner:** Gui + agent (joint) · future role: advisors + ops-compliance.
- **Trigger-to-watch:** any op only Gui can execute; any undocumented
  management road; box/host unavailability longer than the guardians' cadence
  (3-day Supabase window is the tightest fuse); single maintainer (early-churn
  analog from the archive's own vendor vetting rule).

## Cross-cutting note

The three 2026-11-04 findings are now anchored here as named evidence:
**Supabase auto-pause** (provider-dependency: the mechanism, the fix, the
guardian — OPS-MANAGER §1/§9), **the vibe-code liabilities** (fraud/backdoor:
a11y pass + RLS verify NOT-BUILT, cap_credits defense BUILT), and **the Stripe
sandbox E2E loop** (payment-geo: the money-in rail is proven to the point of a
paid webhook flip — remaining: live keys + KYC at go-live). This doc is LIVING:
new datum → new line; stacks get re-scored at each gate, not by mood.
