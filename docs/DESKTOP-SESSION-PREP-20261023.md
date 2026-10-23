# DESKTOP-SESSION PREP — Today's Plan (2026-10-23)

*Written for Gui's shift to the desktop Hermes session. Telegram session = the
reference log (everything committed: all docs, 642-entry archive). This doc =
the single ordered checklist for today.*

## WHERE WE ARE (one screen)

- **Dual line:** main `app/` = the clean-room loop (auth port landed last
  night: Supabase GitHub OAuth → PKCE server-side callback → SQLite join;
  gate-green). v0 = the rich deployed reference (claims + forks + rent).
- **Docs:** SPEC-V2 · GAME-THEORY-MECHANISMS (12 mechanisms + appendices) ·
  DATA-WEALTH-LAYER (17 sections incl. merge, toggles, tombstone, N-Stokes
  case) · MISSION + TED speech · OUTREACH-STAGE · PILOT-PROPOSAL · ROADMAP
  (doors sprint on file). Nothing pending review except SPEC-V2 pass.
- **Archive:** 642 entries / 154 contacts, synced. Five independent
  convergences of the verify-before-use pattern now on file.

## MY PM TAKE ON YOUR LIST (the order, from the actual roadmap)

**Build order today (matches the doors sprint already on file: D1 → D3 → D2 →
tests → walkthrough → Stage 0):**

1. **D1-AUTH verify (15 min, not a build)** — the port landed last night.
   Today: open the tunnel, log in with GitHub, confirm the account joins the
   ledger. That closes D1 for real.
2. **GOOGLE SIGN-IN: skip for MVP.** My recommendation: GitHub-only. Why:
   (a) the audience for the money-gate test = devs/maintainers/creators =
   GitHub-native; (b) fewer paths = one clean loop to test; (c) when we DO
   add Google it's a Supabase dashboard toggle + the callback handles it
   already (provider-agnostic port) — five minutes, zero code. Defer to
   post-MVP with email OTP.
3. **STRIPE MONEY-IN (today's #1 build — the real MVP blocker).** Roadmap
   Phase-1 bullet. Plan: Stripe TEST-mode keys → checkout session endpoint →
   webhook receiver (verify + idempotent) → credit grant → ledger row →
   receipt page proves it. Test mode = the whole loop with no real money.
   **What I need from you: the sk_test/pk_test keys (paste in desktop).**
4. **D3-CREATE-FLOW (project creation)** — CFQ intake lint exists; add the
   /create workspace: image/logo upload (static, no third-party), repo/link
   fields, DRAFT→PUBLISH.
5. **Account + profile customization** — profile fields, avatar, and
   org/business account creation under a user (transferable per law).
6. **D2-CLAIM-FLOW debug (your "manual claim walkthrough")** — unclaimed
   stubs (MiroFish/last30days/colibri/tierllama seeded) → claim → maintainer
   proof → executor role. This doubles as the E2E test pass.
7. **Scripted tests paired per block** (D3-TEST pattern continues).
8. **Then: the PILOT PIPE TEST** — you claim your dogfood project, self-fund
   $50–100, gateway run, receipts go public = the first REAL receipts story.

**NOT today (parked, with tonight's new note):** the recipe-output PAIRED
receipt (see below) = roadmap note under SHOWCASE LAYER; Google OAuth; email
OTP; money-wire legal stack review; outreach stage (resources ready, gated).

## THE QUESTION YOU ASKED — "prompt stamped into the receipts: do we have it?"

**Short answer: the data model already supports it; the explicit PAIRED
RECIPT CLASS + the viewer are the two small things we don't have yet.**

- What exists: artifacts are first-class receipt objects
  (name/url/checksum/verified_use_count) and chapters carry whatever the
  creator uploads — a prompt CAN be an artifact today; disclosure is
  default-open.
- What's missing (now on the roadmap): (1) a **RECIPE artifact type** =
  the prompt + the output PAIRED as one minted object (the Skillry pattern:
  outcome playing, recipe underneath); (2) the **receipt viewer** where each
  card renders the outcome + the recipe below (our hero cards already 80%
  there — this extends them).
- **For:** the verify-before-use pattern is worth nothing without the recipe
  being provably attached to the outcome; authorship = the tradeable asset
  (the 703-authors wedge); remakes become linkable (stitched-from lineage);
  the recipe+output PAIR = the natural data-token sale unit.
- **Against (and how we answer it):** creators may want prompts private →
  recipe-disclosure = a choice (open default, sealed class for the edge —
  same law as receipts); long prompts = display noise → the viewer renders
  previews, the receipt holds the checksummed full text; free copying = the
  point under open license, exclusivity = priced via the data-token market.

## YOUR ASK LIST (what I need in the desktop session)

- [ ] Stripe test keys (sk_test + pk_test) — pasted when #3 starts
- [ ] Green light on the build order above (or re-order as you like)
- [ ] Confirm GitHub-only auth for MVP
- [ ] (When we reach the pilot) your $50–100 self-fund go

## SESSION LOGISTICS

New desktop session is fine — no salvage needed: every durable artifact is in
the repo (git-committed) and the memory carries the CF dual-line + mission.
This Telegram session = tonight's research log (17-section data-wealth
brainstorm, the N-Stokes case, the TED speech, 12 links vetted).