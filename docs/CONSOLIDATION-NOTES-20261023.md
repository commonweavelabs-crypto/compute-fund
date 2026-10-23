# CONSOLIDATION NOTES — 2026-10-23 (the cleanup turn, pre-desktop)

*Gui's ask: inspect the docs for conflicting/flaky ideas, flag clutter, write
review notes before the next buildout phase. = this file. Everything here is
FLAGGED for review, nothing deleted (append-only culture).*

## CONFLICTS FOUND (with resolutions proposed)

### C1 — Tombstone rebirth vs portable trust (M7/passport)
- **The collision:** §14's rebirth = a FRESH passport binding (severance);
  M7's passport = your CV that follows you (continuity). A rebirth that kept
  trust would let bad actors LAUNDER reputation via erase-and-reborn loops.
- **Resolution (proposed):** make it EXPLICIT law — a tombstone rebirth
  starts at ZERO trust by construction ("nobody inherits unearned trust" +
  the fraud-laundering guard). The passport's continuity = only for
  CONTINUING identities; severance = trust reset = the price of erasure.
  Flag: state this in SPEC-V2's User object notes at the next pass.

### C2 — Stitch rent vs fork rent (the double-jeopardy question)
- **The tension:** §18 routes "stitched-from RENT" on artifact reuse while
  v0's fork-rent covers lineage use. If BOTH fired on the same artifacts,
  a forked project could pay twice on its own parent's artifacts.
- **Resolution (proposed):** one-hop-per-path rule: a project pays rent
  through EITHER its fork lineage OR its stitch lineage per artifact —
  never both on the same receipt. The receipt's lineage mark carries which
  path applied. Needs Gui's eye at the SPEC-V2 pass.

### C3 — Patron-unlock thresholds vs the open-by-default law
- **The tension:** §18's unlock exists for restricted-license artifacts,
  but the default law = open licensing; over-eager creators could
  default-restrict to chase unlock revenue = the platform de-opens.
- **Resolution (proposed):** the unlock display law: restricted-license
  receipts are LABELED as such everywhere (the market discounts closed);
  Standing/badge math favors open disclosures (already: verified-use +
  open artifacts = the strongest trust signals). Review the incentive
  balance at the showcase-layer build.

### C4 — SPEC-V2 review gate = the standing blocker (flag, not conflict)
- The spec remains `pending-gui-review`; the doors sprint builds against
  the EXISTING schemas (v0 + SQLite). Before any spec-driven rebuild of
  claims/forks, the pass must happen. Do NOT port claim/fork logic into the
  main line until the SPEC-V2 pass or a explicit "build from v0 patterns"
  word.

## CLUTTER / MAINTENANCE FINDS

- **docs/ tree:** 20+ files, all active; the DATA-WEALTH doc = 18 sections
  (brainstorm-led) — RECOMMEND: a consolidation pass (promote the MERGE +
  PATRON-UNLOCK + disclosure floor into GAME-THEORY-MECHANISMS as
  M-mechanisms; DATA-WEALTH stays the economics doc) — schedule: after
  today's build blocks, not before.
- **Scratch dir:** filing scripts accumulate (15+ file_*.py); auto-pruned at
  24h idle — no action needed.
- **Roadmap:** current, but the "next 48h" block (desktop prep) overlaps the
  doors sprint wording — after today, collapse the two into one section.
- **Session/memory:** the CF dual-line + mission = in memory; the Telegram
  session = the research log; no /reset needed before the desktop session.

## THESIS-DATAPONTS FILED OVERNIGHT (for the record)
- Five independent verify-before-use/plan-as-artifact convergences (shader-
  skills, angus manifest, [CAM 01], Pj storyboards, opus-5.5-videos 9.6K★)
- The securities-path specimen (Monarch Reg CF: 'rewards follow you across
  titles' = the passport instinct on the heavy-legal rail)
- The provenance-in-the-wild pair (USAFacts source-stamped data; LocalShouty
  verified-visit micro-gigs)
- The guru-echo (Gadzhi selling the AI-income gap that our rails close)

## OPUS-AUTHORS HARVEST (Gui's ask: the 703 credited creators as contacts)
- Legal status: the repo = public (MIT); author credits = public metadata →
  HARVESTING handle/credit lists = legitimate (public data, no private info)
- Method: tree API lists /prompts/ in ONE call; author names live in
  filenames/metadata or the credits section — the HARVEST SCRIPT writes a
  STAGED file (pilot-targets/opus-video-authors.json with provenance +
  dates), NOT contacts.json (those stay for verified contacts per archive law)
- Balance answer: the creator/patron strategy already exists —
  OUTREACH-STAGE §6 (P1 maintainers / P2 two-lane / P3 crowd+patrons): the
  balance law = creators first (supply builds the showcase), patrons second
  (demand meets visible supply); the opus-authors = P2 seed candidates
- The harvest runs at the outreach phase (or in a desktop-session idle
  block) — the script is staged, rate-limit-safe (one tree call + light
  parse, no 703-file sweep)
## ADDED 10/23 (same turn — the license-environment brainstorm)

### C5 — LICENSE PROPAGATION (new flag, future milestone — not MVP)
- The question that surfaced it: can projects with OTHER licenses coexist?
  ANSWER: yes — the license/flow law (SPEC-V2 now invariant #8) makes the
  platform license-AGNOSTIC in-platform. The remaining hole = chains: a
  fork of a GPL project legally MUST stay GPL-family downstream; a copy-
  style platform must not let a fork "wash" a license family by relicense
  without right.
- PROPOSED (future milestone, phase 3+): **license propagation = the fork
  and the acquisition maneuver inherit the parent's license FAMILY by
  default; changing family = declared in the fork/merge contract + an
  attribution note (and only where the upstream actually allows)**. The
  license = a DECLARED FIELD (baked now — schema hooks already in), NOT a
  toggle; the toggles = display/compliance packs (the closed-seal label +
  pack states = showcase-layer build).
- Environment answer for Gui: OTHER licenses = same rails, same display
  law: every artifact shows its license seal; closed ones = market-
  discounted (Standing favors open disclosure); bake-in now = the field
  (free) + the law (invariant #8) + labels (showcase layer) + propagation
  rule (parked above).

### B2 — THE ROOT-BELIEFS NAME (Gui's "another word for our livebys")
- Candidates pitched ( votable, M9-style): 1) **THE LOAD-BEARING LAWS**
  (recommended — the constitution invariants = the beams; the rails
  metaphor matches the doc's own language), 2) **THE LIVEBYS** (his own
  word — warm, memorable, ours), 3) THE CONSTITUTION (existing, legal-
  heavy), 4) THE FAIRNESS INVARIANTS (plain, descriptive)
- The two new invariants (#7 courts-are-design-failure, #8 license/flow)
  = flagged as ADDED-BY-BRAINSTORM, subject to the pending SPEC-V2 pass

## C5 UPDATE (same turn) — FORK ELIGIBILITY BY LICENSE (Gui's MVP proposal adopted with 2 refinements)

THE LICENSE-CLASS TRUTH (which types can fork at all):
- PERMISSIVE (MIT/Apache-2.0/BSD/zlib): fork freely, relicense freely ✓
- COPYLEFT (GPL family): fork ALLOWED — but the fork must carry the family
  downstream (relicensing = not allowed without right). Forkable-in-law,
  complex-in-mechanics (the C5 propagation engine)
- Weak copyleft (MPL-2.0/LGPL): forkable with file/library-level care
- NO-DERIVATIVES (CC-BY-ND): CANNOT fork, period (the license says no)
- NON-COMMERCIAL (CC-BY-NC) on a money-routing platform: fork-restricted —
  commercial rails + NC = legal gray; treat as not-forkable until counsel
- SOURCE-AVAILABLE / BUSL / unlicensed-public-code: NOT forkable until the
  license's change date / never (viewing ≠ forking)
- LICENSE MISSING (the youpi-pg catch): default = all-rights-reserved = NOT
  forkable; intake flags it (publish floor already demands right-to-publish)

THE MVP LAW (Gui's simplification, my two refinements):
- **MVP fork rule = permissive-only**: `forkable = license ∈
  {MIT, Apache-2.0, BSD, zlib}` (M9-votable set) — one boolean in the
  schema + the seal display; NO per-license profiles (complexity refused)
- **Refinement 1 — non-permissive projects remain FULL CITIZENS** minus the
  fork button: funding, claims, bounties, patronage, receipts all work for
  GPL/NC/etc. from day one (the maintainer funding wedge = the core pitch;
  only the fork/merge economics wait for C5). The fork button shows the
  license seal + the reason ("GPL: fork requires license-family
  inheritance — coming with C5")
- **Refinement 2 — license-missing = blocked from fork AND flagged at
  intake** (a request-to-author path: "add a license and the fork opens")
- Everything else on this rail already stands: C5 propagation (future
  milestone), the license/flow law (invariant 8), seals at showcase layer
