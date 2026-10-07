# Compute Fund — Roadmap (consolidated 2026-10-07)

*Consolidates: current v1 build + David-era corpus (30+ docs: MANIFESTO/ZUCK-ESSAY/Golden
Ticket/prototype/case study) + Gui's 2026-10-07 direction (deterministic questions, MVP =
legal money-wire, profiles, project pages). Conflicts resolved per CONSOLIDATION.md.*

**The spine = the money wires:** money IN (patronage) → governed compute (Question Standard
+ gateway) → receipts OUT (public ledger). Everything else hangs off those three rails.

---

## Phase 0 — DONE (v1 static)
- [x] One-page grid: 4 seed projects, funding progress, $25/$100/$500 tiers
- [x] Dual themes (Terminal Commons dark / Carbon Ledger light, one skeleton)
- [x] Demo receipts schema = production schema (typed, migration-cheap)
- [x] CommonWeave footer + socials + investors:none badge
- [x] ORIGIN.md + attribution layer (tierllama, jev-triage, compute-fund)
- [x] Spec, Question Standard v0, Token Distribution arch, legacy consolidation

## Phase 1 — MVP: "the smallest legal loop that moves compute"
*Gui's definition adopted: login + legal guardrails + real governed compute + receipts.*
- [ ] **Project pages (v1.5)** — click a card → creator-authored page: hero, story, roadmap, funding state, receipts, CFQ id. (Current homepage becomes CommonWeave Labs profile page + avatar circle.)
- [ ] **CFQ intake** — Question Standard enforced at project creation; LLM format-interpreter prompt published; lint = fields 2–7 machine-checked
- [ ] **Auth & accounts** — signup/login; user account first; org profile second (org = created under a user, linked, TRANSFERABLE to other users, not owned)
- [ ] **Stripe money-in** — David-era pattern reused (checkout + webhook, graceful fallback); receipt per patron incl. priority credit
- [ ] **LiteLLM gateway money-out** — virtual keys per project, hard cap = donated amount, model allowlist, endpoint scoping, audit log = receipts → replaces demo data (schema already matches)
- [ ] **ToS stack** — non-transferable/non-cash-out wall, Howey wall ("not an investment"), no-deduction clause, CFQ release/revoke clause; email+phone ID, OFAC screening
- [ ] **MVP gate:** one stranger signs up, funds a CFQ-passing project with a card, platform dispenses capped compute against that question, receipts post publicly. Nothing else counts.

## Phase 2 — Profiles, Copy-Project, community surfaces
- [ ] Copy-Project button ("adopt and rename" — the bootstrap mechanic)
- [ ] Search + discovery (deliberately non-addictive: weekly top list, optional swipe mode, never a slot machine)
- [ ] Follow vs funding split; auto-follow on fund (David-era pattern)
- [ ] Comments ON RELEASES only; ratings; community badges ("Compute Sponsor")
- [ ] Public answer pages: popular-questions funding (v1 of manifesto's phases)

## Phase 3 — Sustainability rails
- [ ] Platform fee % — community-voted (starts 0%; vote mechanism first, then propose 3–5%)
- [ ] Printed compute spread on token dispensing (published %, receipts show it)
- [ ] Project images (AI-generated welcome), creator storefronts
- [ ] Unspent-credit return flows + treasury display

## Phase 4 — Trust hardening
- [ ] Mirror-repo layer: GitHub stays source-of-truth; mirrored repos on-platform = two independent record keepers
- [ ] Cardano commit stamping: mirrored commits hash-stamped on-chain; Midnight selective disclosure for private repos
- [ ] Receipt depth: rejection trails, overclaiming-resistant formats (case-study law)
- [ ] Commercial Layer (revenue projects pay compute forward) + Reserve Layer (emergency compute) — from legacy four-layer vision, re-scoped without co-ownership

## Phase 5 — Decentralization (graduation, not launch)
- [ ] Community governance votes (fee %, feature priority, allocations)
- [ ] Co-ownership/revenue-sharing ideas from the legacy manifesto are DISAVOWED (conflict with patronage lock — see CONSOLIDATION.md #2); replaced by compute-forward patronage
- [ ] Open GPU pools / democratic allocation (only if community carries it)
- [ ] "Central bank of the agent economy" currency framing: defer; the unit of value stays the receipt, not a token

## Standing laws (every phase)
1. Patronage framing only — never invest/equity/return/share language (Howey wall)
2. Receipts: money in / compute out, public; demo data always labeled
3. No personal data of Gui or any user; no keys/secrets in any artifact
4. Nothing gated: every feature works with zero payment and zero accounts (asks live in footers, walls live in law)
5. Fiction (Golden Ticket scripts) is inspiration, never spec — explicitly non-canonical