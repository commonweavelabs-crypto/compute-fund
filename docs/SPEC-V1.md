# Compute Fund — v1 Page Spec

**Status:** Gui-approved 2026-10-06 (all 4 Qs answered with recommendations)
**Repo:** github.com/commonweavelabs-crypto/compute-fund
**Design identity:** 03 Terminal Commons (dark, default) + 01 Carbon Ledger (light/comfort mode), one component skeleton, CSS custom properties only — never hardcode a hex.

## Problem statement (user's view)
Supporters can't see how open-source AI projects are funded and what their money became. Creators can't show receipts. Compute Fund fixes both: fund projects with money or crypto, beneficiaries receive LLM compute credits, and every compute run produces a public receipt.

## Solution (user's view)
One page that IS the product pitch by behaving like the product: a project grid where every card streams its funding + compute receipts live, tiers that read as patronage (never investment), and a footer that shows the platform funding itself the same way.

## Scope — v1 ONLY
1. **Project grid** — cards for official CommonWeave projects, seeded: Tierllama (live receipts from real decision-log counts), Compute Fund itself (the platform funding itself — dogfood law), jev-triage, ComfyUI Video UI. Each: name, one-liner, funding progress, tier buttons ($25/$100/$500 = the manifesto's patron tiers), recent receipt stream.
2. **Funding progress** — progress bar + % + raised/goal, receipt-green accent.
3. **Tier buttons** — $25/$100/$500 patron tiers, manifest-language (patronage, never invest/return/share).
4. **One dogfood feature: Tierllama live ledger** — a hardcoded ledger built from real Tierllama decision-log counts (runs routed, tokens saved vs cloud-only, days operating), clearly labeled demo where data is synthetic.
5. **Receipts (demo, grounded):** synthetic receipts that mirror the REAL schema the product will use (ts, project, model, tokens in/out, cost, run id, output hash placeholder). Plausible values derived from real measurements where we have them (e.g. Tierllama classify latencies, tok/s from bench data). NO personal data of Gui or any user — Gui appears only as founder name (public role), never keys/emails/addresses. Privacy law: private/user info is scraped out at content-freeze; this is a standing rule now in the spec.
6. **CommonWeave banner:** one footer line — "A CommonWeave Labs project — fund the compute, see receipts" + `investors: none` badge in the header + social links (X @Commonweavelabs, YouTube @CommonweaveLabs). Email: hello@ (platform address, later).
7. **Theme toggle:** dark (03) default, light (01) opt-in, via `data-theme` attribute + CSS vars.

## Out of scope (v2+: logged for later)
User accounts/profiles · project creation UI · Copy-Project button · search/discovery feed · real backend/ledger DB · payments rails (Stripe/BTCPay) · Cardano stamping · mirror-repo layer · community votes/ratings · project images/uploads · emails.

## Implementation decisions
- **Stack: Next.js (App Router) + React + TypeScript** — matches v0 exploration and Gui's comfyui-video-ui stack.
- Single-page app (v1) — no routing complexity; the page IS the product.
- `Ledger` = typed TS array (demo) shaped EXACTLY like the future DB schema (migration-cheap).
- Styling: CSS custom properties + modular CSS (no Tailwind debate in v1).
- Receipt stream: client-side ticker component, no backend — reads demo ledger JSON.
- Accessibility: keyboard nav, focus states, contrast verified in BOTH themes.
- Copy law (manifesto): patron/supporter/fund/compute credits. Banned words: investor, investment, return, ROI, share(holding), equity.
- Privacy law: no personal data of anyone (Gui = founder name only); no keys/tokens anywhere; `.env` placeholders only.

## Testing decisions
- Seams: (1) theme toggle flips ALL colors via `data-theme` (assert computed styles change), (2) receipt ticker renders N rows and updates, (3) tier buttons are keyboard-reachable + focus ring visible, (4) no banned words in rendered copy (test greps the page text), (5) cards render from data so adding a project = adding a data row, zero component edits.
- Playwright-free v1: React Testing Library + a11y smoke (headless DOM), same as video-UI patterns.

## Further notes
- This spec's language decisions come from the manifesto (patronage-based framing).
- Gui narrates the launch video; outro links here + niche register.
- v1 done = deployed preview (Vercel free tier ok for demo) OR local screenshot pack; deployment decision later with Gui.