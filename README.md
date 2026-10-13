# compute-fund

**The platform that pays open-source maintainers in compute.**

Patronage crowdfunding for LLM compute: money in, compute out, public receipts, transparent ledger. A [CommonWeave Labs](https://github.com/commonweavelabs-crypto) project.

> Maintenance of this stack is funded via Compute Fund — compute receipts public. Patronage, not investment. `investors: none`

## The one-sentence MVP gate

> One stranger signs up, funds a CFQ-passing project with a card, the platform dispenses
> capped compute against that question, receipts post publicly. Nothing else counts.

**Current status: gate green (demo mode).** The full stranger loop is verified end-to-end by scripted integration tests: signup → CFQ lint → demo funding → governed key → real completion against a local Ollama model → public receipt. Live Stripe is the documented drop-in (see `docs/SPRINT-001.md`).

## What exists (Phase 1)

- **Accounts** — signup/login/logout; scrypt password hashing; HMAC-signed HttpOnly session cookies
- **CFQ intake** — project creation lints the 10-field Compute Fund Question standard (`docs/QUESTION-STANDARD.md`); vague asks are rejected at the door with field-specific errors
- **Demo funding** — $25/$100/$500 tiers; Stripe checkout endpoints with demo-mode writes (marked `demo: true`), live-key swap documented
- **Governed compute keys** — per-project virtual keys: hard cap = dollars funded (no rollover, no recharge), model allowlist from the CFQ method field; raw key shown once, only the hash is stored
- **OpenAI-compatible governed endpoint** — `POST /api/gateway/v1/chat/completions`; wrong-model = 403, over-cap = 402
- **Append-only receipts** — tokens in/out, cost, `cfq_id`, output hash
- **Live project pages** — `/p/[slug]` renders real donation + receipt data

## Layout

```
app/
  app/              # Next.js App Router pages + API routes
  components/       # chrome, LiveProjectPanel
  lib/              # db (SQLite/WAL), auth, cfq lint, seed data
docs/
  SPRINT-001.md     # single source of truth for Phase 1 (conflicts: this file wins)
  ROADMAP.md        # phases; Phase 2 = community governance (Hephaestus Doctrine)
  QUESTION-STANDARD.md  # the 10-field CFQ spec
  TOKEN-DISTRIBUTION.md # closed-loop compute credits; the legal walls
  OUTREACH.md       # maintainer-pilot program + channels
  BUSINESS-MODEL.md · SPEC-V1.md · CONSOLIDATION.md · CF-DESIGN.md
```

## Run it

```bash
cd app
npm install
npm run build
npm run start -- -p 8872     # http://localhost:8872
```

SQLite initializes lazily on first request (`app/lib/schema.sql`, WAL mode). Demo funding requires no external keys; governed completions route to a local Ollama (`CF_GATEWAY_UPSTREAM=http://127.0.0.1:11434/v1`).

## Honesty laws

Demo data is labeled demo. No invented testimonials or numbers. No fake success states — every state names its real cause and next action. Receipts are append-only.

## The doctrine

Compute Fund keeps the fire in the hands of the people: donors fund, the community governs (Phase 2: engagement-weighted flags pricing compute, economic kill-switches instead of ban lists). The Hephaestus Doctrine lives on the CommonWeave shared Drive (`projects/commonweave-labs/HEPHAESTUS-DOCTRINE.md`); the module map is `MODULAR-ECOSYSTEM.md` in the same directory.

## License

Open core, complete. Attribution requested, not required.
