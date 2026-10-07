# CF DESIGN.md — Compute Fund's own design system (v1)

*Adapted from the TypeUI guideline format (MIT, docs/reference/KICKSTARTER-DESIGN-MD.md)
— same rigor, OUR identity. This is the file agents load before building any CF page.
Source of truth for components: app/app/globals.css (Terminal Commons + Carbon Ledger).*

## Mission
Create implementation-ready, token-driven UI guidance for Compute Fund, optimized for consistency, accessibility, and honest presentation of receipts.

## Brand
- Product/brand: Compute Fund (a CommonWeave Labs project)
- URL: https://github.com/commonweavelabs-crypto/compute-fund
- Audience: patrons, open-source builders, research creators
- Product surface: crowdfunding platform (project grid + project pages + profiles)

## Style Foundations
- Visual style: terminal-commons (dark default) / carbon-ledger (light comfort) — see globals.css
- Fonts: dark = JetBrains Mono (display+body); light = Georgia (display+body)
- Typography scale: 10.5 · 11.5 · 12.5 · 13.5 · 17 · 22 · 28px (display face for ≥17px)
- Tokens (dark): color.ink=#d7e4dc, color.dim=#7d8f88, color.accent=#5cff9d, color.signal=#ffb347, color.bg=#0c1013, color.panel=#131a1f
- Tokens (light): color.ink=#2b2118, color.dim=#6b5d4d, color.accent=#b3372b, color.signal=#8a6d1f, color.bg=#f4efe3, color.panel=#faf6ec
- Spacing scale: 4 · 6 · 10 · 12 · 14 · 18 · 22 · 34px (from v1 component usage)
- Radius: 4px dark / 2px light · Motion: 180–300ms ease transitions only
- Receipt accent law: success=accent, cost=signal(amber/red), failure=danger

## Accessibility
- Target: WCAG 2.2 AA (contrast verified in both themes)
- Keyboard-first: every interactive element reaches :focus-visible with a 2px accent ring
- Progress bars carry aria-valuenow/min/max; cards carry aria-labels

## Rules: Do
- Use CSS custom properties only — never hardcode a hex (theme law)
- Every component defines default/hover/focus-visible states (matches KS rigor)
- Receipts always show: ts, model, cost, outcome-sign — the receipt IS the brand
- Meta rows read "time left • % funded" (KS arrangement)
- Cards render from data (lib/data.ts) — adding a project = adding a row, zero markup

## Rules: Don't
- Don't copy Kickstarter/any brand's colors, fonts, artwork, or copy (layout law)
- Don't use investment language on any component (copy law: patron/patronage only)
- Don't hide platform economics — margin/fee lines print on receipts
- Don't add motion beyond 300ms transitions (deliberately non-addictive UX law)

## Component anatomy (v1.5 target)
- AppHeader: logo ▚ COMPUTE FUND · investors:none badge · search (mock v1.5) · category strip (CFQ domains) · Start-a-project · Log in
- ThemeToggle: ☾ terminal / ☀ ledger, persists choice
- ProjectCard: tags → title → one-liner → progress(meta row + bar) → 3 tier buttons → receipts list + summary note
- FeaturedHero: Question-of-the-Month, 4-tile width, seasonal accent, "Question status" chip
- CreatorHoverCard (popup): avatar · created/funded/community-loved counts · joined date · bio → profile link
- ProjectPage: hero image + CFQ id + story + roadmap + funding state + receipts + updates tabs
- GuideCard: illustration zone + title + one-line hook + vertical accent bar + "Read the guide"
- AppFooter: CFQ-domain link columns · giant wordmark · socials (X/YT/GitHub) · legal row

## QA checklist (every PR)
- [ ] Both themes verified (screenshot pair, Oil UI shoot.mjs evidence path)
- [ ] Keyboard reaches every interactive element; focus rings visible
- [ ] No hardcoded hex (grep)
- [ ] No banned words in rendered copy (investor/investment/return/ROI/equity)
- [ ] Receipt rows show ts/model/cost/outcome
- [ ] Cards driven by lib/data.ts only
- [ ] Mobile 390px + desktop 1280px screenshots clean