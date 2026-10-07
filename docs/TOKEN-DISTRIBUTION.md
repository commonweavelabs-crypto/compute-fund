# Compute Fund — Token Distribution Architecture (v0 decision)

*Researched + decided 2026-10-07. We are a GOVERNOR, not a router, not a bank.*

## The rule (load-bearing)
**The platform holds the provider accounts. The beneficiary NEVER receives a raw provider
key, cash, or transferable credit.** The beneficiary gets a per-project VIRTUAL key through
our gateway. Three facts make this legal in-kind gifting rather than money transmission:
credits are (a) non-transferable, (b) non-exchangeable for cash, (c) single-purpose (one
approved project key). Unspent credits return to the fund pool — never to the beneficiary.

## Recommended stack (launch): self-hosted LiteLLM Proxy gateway
- Platform owns upstream credentials: OpenAI, Anthropic, OpenRouter, Ollama (local + cloud)
- Gateway issues **virtual keys** per project with:
  1. **Hard spend cap** = donated amount (strict — gateway rejects when exhausted; no rollover, no recharge)
  2. **Model allowlist** = only models named in the project's Question (field 4)
  3. **Endpoint scoping** — no cash-equivalent/non-metered routes (embeddings/finetune/realtime blocked unless the Question uses them)
  4. **Audit log = the receipts** — per call: ts, key, CFQ id, model, tokens, cost, request-id hash. Logs to Postgres (native)
  5. Beneficiary dashboard sees spend-remaining + own log; never the master credential; rotation is platform-side
- Alternative (zero-infra acceptable): central OpenRouter account + per-key spend caps + allowlists (same primitives, no self-hosting)

## Anti-patterns (explicitly banned)
- Beneficiary receives master/provider key
- Soft-capped or auto-recharging budgets (turns gifting into subscription)
- Cash pass-through to beneficiaries who buy their own credits (breaks the in-kind story)

## Legal floor (US, small scale; lawyer-review before launch — not legal advice)
- **Not money transmission** if credits are closed-loop, single-purpose, non-transferable, platform-spent directly on metered usage (FinCEN 31 CFR 1010.100(ff)(5)(i)(A) — "value that substitutes for currency" test; closed-loop gift-card analog)
- **Launch guardrails:** ToS with (a) non-cash/non-transferable/non-refundable-except-documented-failure, (b) "not an investment — no equity, no return, no revenue share" (Howey wall), (c) no charitable-deduction claims (no 501c3 unless registered), (d) transparent fee disclosure, (e) Question Standard (CFQ) embedded as release/revoke clause, (f) disputes/liability/privacy/DMCA
- **Do anyway at launch:** identity check for beneficiaries (email+phone minimum; ID check for larger awards), OFAC sanctions screening both sides, full contributor record trail
- **Regulation triggers (the walls):** credit redeemable/tradeable → stored-value/MTO; cash handed to beneficiary → MTA per state + FinCEN; any expectation of return → securities; single patron >~$18–19k/yr to one beneficiary → Form 709 (their obligation); facilitation >$20k AND >200 txns to one recipient → 1099-K; cross-border flows → CTR/FBTC + sanctions
- Sources: FinCEN FIN-2013-G001; SEC DLT Framework (sec.gov/files/dlt-framework.pdf); SEC v. Howey 328 U.S. 293; LiteLLM virtual-keys docs; OpenRouter spend-controls; Baker Institute crowdfunding-tax overview