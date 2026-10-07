# Compute Fund — Business Model Decision Doc (v1, 2026-10-07)

*Research-backed (sources in commit history) — education for a first-time founder, not legal advice.
Lawyer + nonprofit-savvy CPA review required before soliciting real money.*

## 1. The tour (how open-source platforms actually pay bills)

| Model | Example | Who pays | Outcome | Lesson for CF |
|---|---|---|---|---|
| Donation/foundation | Wikipedia, Blender Fdn | patrons/grants | thrived (tiny budgets, lean teams) | possible as mission, poor as salary plan |
| Sponsorship | Heartbeat.dev; Tidelift (died) | companies | mixed | Tidelift lesson: funding maintainers ≠ sellable product |
| Patreon patronage | Patreon itself | patrons, **8–12% fee** | thrived | recurring > one-off; fee is visible, charged openly |
| Kickstarter | Kickstarter | backers, **5%+fees** | thrived | prepayment-for-deliverable ≠ investment (our framing's ancestor) |
| Open-core | GitLab, Sentry | companies (convenience tiers) | thrived | crisp public line: $ buys ops/SLA, patronage buys public goods |
| Hosted OSS | Supabase, Cal.com, n8n | companies (hosting) | thrived | the classic "GitHub free, hosting paid" |
| Fiscal host | Open Collective | **~5-10% host fee, all visible** | alive | public per-transaction receipts ARE the trust product |
| VC+OSS | HashiCorp (license flip), Redis, MongoDB | — | relicensed, community fallout | cautionary: VC pressure broke the open promise |
| BSL/FSL license tiers | MariaDB, Sentry→FSL | vendors | mixed | not needed unless we have code worth protecting that way |

**Net lesson:** every survivor either (a) charges a visible fee for a service, (b) charges for hosting/convenience, or (c) runs tiny on donations. There is no example of a platform that stayed free of fees AND paid full-time people. "Fee" is not the enemy — HIDDEN fees are.

## 2. The fee question — resolved
- Kickstarter 5%+processing · Patreon 8–12% · OpenCollective ~5–10% · GoFundMe 0%+tips (the 0% is paid by tip pressure)
- **Gui's instinct is sound** with a refinement: fees on PATRONAGE feel like skimming charity and measurably reduce giving. Fees on COMPUTE-OUT are just... pricing.
- **Decision: zero platform fee on donations.** Processor passthrough only (~2.9%+30¢), visible. Optional tip-to-platform default-OFF (Open Collective pattern).
- **Decision: margin lives on compute-out.** Every credit redemption runs through platform metered compute at cost + a stated margin, **printed as one number on every receipt.** Like RHEL pricing / OpenRouter's spread. The platform's revenue line is public arithmetic, not a hidden cut.
- **Dogfood honesty rule:** Compute-Fund-donating-to-itself (LLM tokens) is a demo and bootstrap — **circular margin never counts as revenue in public accounting** until external patrons cover it. Labeled as such, always.
- Tokens-can't-pay-rent rule: token patronage proves the model; USD margin pays Vercel. Both rails exist by design.

## 3. Legal structure — decision
**NOW (pre-revenue):** nothing to file; keep clean books from day one, donation flows segregated from any margin.
**AT MONEY-IN (MVP):** single-member **LLC** owning the platform + margin. Patreon-style language: "patronage/support," not "donation" (no deductible-gift claims without status). Credits = prepaid utility/service credits, non-transferable, **zero cash redemption** (keeps Reg CF/Howey out).
**LATER (if deductible patronage is demanded):** fiscal sponsorship Model C under an established 501(c)(3) — deductibility without founding a nonprofit; clean spin-out path preserved.
**501(c)(3) direct:** deferred — mission-lock + no-margin rules fit a foundation, not a margin-funded platform. Mozilla is the exception that proves the cost.
**Co-op/PBC:** revisit at community-governance phase (Phase 5); PBC is the honest instrument if we ever raise outside capital while keeping the mission in the charter.
**Standing trip-wires (regulation triggers):** credits redeemable for cash → stored-value/MTO; cash passed through to beneficiaries → money transmitter; any expectation of return → securities; >$20k AND >200 txns to one recipient/yr → 1099-K; cross-beneficiary gift-tax edge → patron's Form 709. All walls documented in TOKEN-DISTRIBUTION.md.

## 4. Revenue stacks for the first 24 months (ranked)

**STACK 1 (recommended — "the printed margin"):**
1. MVP: donations pass through at cost (zero fee) + compute-out margin on every receipt (published %, starts ~5–8%)
2. Phase 2: recurring patronage tiers (Patreon-shaped) for the platform's own project — in USD, not only tokens
3. Phase 3: hosted/managed tier for creators (bigger compute pools, priority metering, dashboards — GitLab-line drawn publicly)
4. Phase 5: enterprise fund-tracking (per-investor funnels) if demands appear
- Pros: every dollar has public arithmetic; incentives clean (no taxing charity); scales with real usage. Cons: dies if compute consumption stays hypothetical — volume is the whole engine.

**STACK 2 (fallback — "the fiscal host"):** partner with a fiscal sponsor; host fee 5–10% on collectives; deductibility as the draw. More overhead, faster trust for nonprofits. Only if Stack 1 stalls AND nonprofit projects show up.

**STACK 3 (last resort — "the Patreon fork"):** pure donation/subscription platform, platform fee 5%. Abandons the compute-out identity; kept as the honest comparison, not the plan.

## 5. Standing education list (Gui, money as a strength)
- Read: The Heartbeat.dev "Sustain" essays; GitLab's pricing-page philosophy (public line between free/paid); Open Collective's fee transparency docs
- Do: 2h with a nonprofit-savvy CPA BEFORE first 501(c)(3)-adjacent dollar; lawyer re-verify prepaid-credit framing at nontrivial volume
- Discipline: publish fee schedule + margin % as repo docs; receipts > code as the trust product