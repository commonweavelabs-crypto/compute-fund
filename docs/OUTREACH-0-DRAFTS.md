---
type: outreach-draft
date: 2026-11-04
status: draft
serves: compute-fund
tags: [compute-fund, outreach-0, drafts, starter-story, s-laws]
---

# OUTREACH-0 — THE PRE-STAGE OPS KIT (drafts a-e)

*Fires the roadmap bullet (docs/ROADMAP.md, OUTREACH sub-milestones, 2026-10-26):
"OUTREACH-0 (pre-stage ops, starts when D3 lands): (a) the ONE-channel selection +
the daily cadence calendar (S2; the day-50 patience datum = judge at week 7, not
week 2); (b) the result-card design (S6 — the shareable receipt cards = the growth
loop); (c) the honest comment→DM funnel spec (S11 — the keyword delivers the
promised thing, never farms); (d) the creator-filtering prep (S1 — the Mom-Test
interview rubric = the filter); (e) the patron-page framing (the Kickstarter-backing
language + the legal walls: gifts not returns)."
Strategy source: docs/LAUNCH-PLAYBOOK-STARTER-STORY.md (the S-law numbers); market
personas: docs/OUTREACH-STAGE.md #6; honesty doctrine: OUTREACH-STAGE #0/#8.

**NOTHING HERE SENDS. ALL FIVE DRAFTS: DRAFT — DECISION GUI.**

## (a) THE ONE-CHANNEL SELECTION + the cadence calendar — DRAFT — DECISION GUI

S2's law (Starter Story #5, the $0-across-100-apps arc): spray-and-pray = zero;
"ONE platform, once a day, documenting the journey — the cadence IS the strategy."
S15 (David, credits app, zero paid channels): build-in-public on X — "around day
50, it started working, then things went PARABOLIC." The wedge is the two-lane
creator (OUTREACH-STAGE #0/#6 P2: hosts projects AND makes content) plus the
email-first claims lane (P1 maintainers — email, per OUTREACH-STAGE §2; not a
social channel). Comparison for the daily-cadence channel:

| Lane | The case FOR | The case AGAINST | Verdict |
|---|---|---|---|
| X (build-in-public feed) | S15's exact winning pattern (day-50 inflection, zero paid); receipts screenshots = the native format (S2/S9: our own machinery produces the content); schedulers named on-air: Typefully + X Premium (tool appendix); the $500 X match credit amplifies at the paid stage (S1 mapping) | S16's honest base rate on DMs: "tons of DMs, very few responses"; builder-media skew (S17) — fine for us, but it is a niche crowd, not the consumer side | STRONGEST for the daily cadence |
| Reddit | P3's natural home (r/LocalLLaMA, r/SideProject, r/opensource — OUTREACH-STAGE #6); the Show-HN/HN evidence of big OSS launches (10/22 research run) | S2's own cost quote: "a lot of work, nurturing, you can't promote"; our existing read-only rule, now cost-confirmed; big subreddits 403-blocked keyless (research honest limits) | NOT the cadence channel — read-only intelligence lane (last30days), unchanged |
| YouTube | P2 creators' native home; S3's pattern-break long-form (SHOW the receipts, never explain); the Starter Story channel itself proves the interview format compounds | Weekly-production shape, highest cost per unit; cannot carry the DAILY law S2 prescribed | The destination archive at OUTREACH-1 — not the daily channel |
| X-ecosystem (DM-led creator economy + paid-stage ops) | The two-lane DM door (EMAIL-3 short-form exists, OUTREACH-STAGE §8); S16's volume-game framing keeps expectations honest; S21's speed-to-lead module = the ops shape if volume ever justifies automation | Same as X's DM base rate; automation before volume = wasted plumbing | Rides WITH X — the DM lane of the same pick, no separate cadence |

**RECOMMENDATION (DRAFT): X as the ONE cadence channel — once a day, documenting
the journey — with DMs as the partnership door; YouTube = the receipts-story
archive at OUTREACH-1; Reddit = read-only listening (existing law); IG/TikTok =
labeled content partners only (Pj pattern), never our personal cadence.**
SPECULATION (untested for OUR audience, marked): X engagement/DM response rates
before day 50; whether the two-lane cohort actually reads X vs IG-primarily (Pj's
native surface is IG — the answer arrives from the S4 interviews, not from this
draft). GROUNDED: S2/S15 cadence evidence, the Reddit cost quote, the read-only
law, the format fit (receipts screenshots), the tool appendix.

**THE CADENCE CALENDAR (S2 + the day-50 patience datum):** the daily slot is fixed
once and kept (Typefully scheduling); judge at WEEK 7, not week 2 (roadmap (a) +
S15: the day-50 inflection). Shape, starting when D3 lands:
- W1: the D3 dogfood receipts only (Stage-0 piping: Gui's $50-100 self-fund =
  the first REAL receipts story, ROADMAP D3-PILOT-PIPE-TEST) — the ledger posts
  the content, we do not invent anything (S9 dogfood loop).
- W2-3: one receipt or result card per day + ledger visualizations (S9); the
  story stays FIXED for the launch year (S20 evergreen-IP law); examples refresh,
  narrative does not.
- W4-5: pilot-run receipts as they exist (if a pilot partner is live — PILOT-PROPOSAL
  stages); W4 = mid-point review: posture only, never a verdict.
- W6-7: THE WEEK-7 JUDGE against the named metric (S2 action: "the daily post
  cadence = a named metric"): post streak held? follower/DM signals moving? any
  inflection near day 50 (S15)? Verdict options: hold / adjust format (S3) /
  escalate to the $500 paid test (Stage-1, PILOT-PROPOSAL §0) — escalation only
  on Gui's word.
- The rejection ledger (S28's offers-metric law): every no = filed acquisition
  data; the funnel's own honesty metric.

## (b) THE RESULT-CARD DESIGN SPEC (S6) — DRAFT — DECISION GUI

S6 (Geo game): 53% organic share rate, 98-99% of traffic word-of-mouth — "the
product is sharable." The mapped shareable artifact: **every completed milestone
renders a public, linkable, beautiful card — what was claimed, what it cost,
what came out** (S6 mapping); result-cards sit on the SPEC-V2 feature list as a
launch feature (share = the growth loop). Lockett check (twin laws): the card is
the intrinsic share surface — it must LIVE where the user already is (the
project's people, their feeds), not behind a swipe.

- **FIELDS (all derivable from existing objects — SPEC-V2 §1 + Chapter Format v0):**
  required: receipt id (short form); project name + CFQ id; the milestone
  `verdict_line` (the [VOICE] human line); `gateway_meter_summary` (model(s),
  tokens, cost — the meter facts, never invented); fund state (funded total /
  pool lot state); `staged_at` date; checksum short-codes (`artifact_refs`
  checksums); project URL; CommonWeave wordmark footer.
  optional: verified-use rating; patron count line ("funded by N patrons");
  license seal (open vs closed-C3, DATA-WEALTH §20); lineage line when applicable
  (stitched-from / fork-of — the attribution the platform exists to mint).
- **SKINS:** the two shipped skeletons (ROADMAP Phase 0): **Terminal Commons dark
  = the dark-terminal skin, default for X** (the receipts aesthetics ARE the
  content format, S9); Carbon Ledger light = alternate. One skeleton, theme swap
  — the layout law (arrangement ours, skin 100% ours; no third-party branding).
- **SIZES (draft values — Gui's call):** 1200×630 (link/OG preview), 1080×1080
  (feed square: X/IG), 1920×1080 (video cutdowns: YouTube/reels). One render,
  three crops, one skeleton.
- **THE ALT-TEXT LAW:** from adilet's vibe-code liability audit item 1 (ROADMAP
  DEBUG-SESSION: keyboard-nav + alt-text on every interactive element, antislop
  human skill): **every result card SHIPS WITH drafted alt-text** — the receipt
  facts in prose (id, verdict, model, cost, outcome). It satisfies the a11y pass
  AND the share loop (the story travels where images do not render: quote-post,
  link previews, screen readers).
- **HONESTY RULES baked into the template:** no invented numbers (the receipts
  hold only what the ledger holds); unfunded and failed milestones render cards
  too — transparency applies to failures first (PILOT-PROPOSAL kill-switch law);
  demo data always labeled (standing law 2); the seed graph's demo rows never
  visually mimic real receipts.

## (c) THE HONEST COMMENT→DM FUNNEL SPEC (S11) — DRAFT — DECISION GUI

The datum (S11, Stella + Jake): "Comment 'download' and I send you your custom
affirmations" (ManyChat); "conversions happen in the comments" — the pinned
comment is the conversion point. We ALREADY document the shady versions of this
funnel (the gate codes) — **ours = the honest version: the keyword delivers THE
PROMISED THING, never farms** (roadmap (c); S11 note). Constraint stack (all
existing law): comment-seed cadence 3/week, no links in comment text, platform
named, read-back verified (OUTREACH-STAGE §2); sponsored always labeled; no
invented numbers; replies = the rejection-is-data law (OUTREACH-STAGE #8).

- **MECHANISM:** trigger keyword in an organic/pinned comment — candidate:
  **"RECEIPTS"**. The automated DM returns ONE message containing the promised
  artifact (the receipts one-pager / the pilot offer) and nothing else — no
  extra capture step, no "join to receive it" gate, no count-faking scarcity.
- **SLA:** instant where automation exists (ManyChat-class = the tool candidate,
  S11; S21's speed-to-lead module as the ops shape); at our first-stage volume,
  manual same-day is honest and sufficient.
- **DELIVERABLES that may be promised (existing artifacts only):** the receipts
  story one-pager; the pilot offer; the project's claim link. NEVER: access
  theater, a "download" that is a newsletter trap, numbers the ledger does not show.
- **COPY DRAFT — the pinned comment:**
  "Building Compute Fund: patrons fund open-source + AI projects in compute, and
  every run posts a public receipt — model, tokens, cost. Comment 'RECEIPTS' and
  the DM sends you the pilot one-pager: the first project's charter, meter, and
  receipts. Real numbers only — the ledger itself is the show."
- **COPY DRAFT — the DM it must deliver:**
  "You asked for it — the receipts one-pager: {link}. It holds only numbers the
  public ledger holds; anything not measured yet is marked as such. If this is
  not for you, reply with why — the rejection is data, and we build by receipts:
  yours counts."

## (d) THE MOM-TEST CREATOR INTERVIEW RUBRIC (S1) — DRAFT — DECISION GUI

The machine (S1, Snag/10X): reach ~100 UGC-ish creators → INTERVIEW each → ~10%
pass the filter → passing creators make organic videos → any organic video
crossing ~50K views becomes a paid-ad candidate → check ROAS → scale/refresh.
Dual purpose at OUTREACH-1 (roadmap): the pilot interviews = the filter = the
first ~50 of Fastlane's 2,000-calls engine (S4; the interview target = 50 pilot
interviews pre-outreach-stage).

**PRECONDITIONS (hard):** WATCH #2 (The Mom Test, Rob Fitzpatrick) must be
checked BEFORE the first interview — the founder watch-list law: "no milestone
starts until its video block is checked" (ROADMAP). And S22's law: the face
walks in — the judgment is un-delegable (delegation covers the grind, never the
judgment).

**THE THREE MOM-TEST RULES (ROADMAP WATCH #2, verbatim sources):**
(1) their life, not your idea · (2) specifics in the past · (3) talk less, listen
more.

**THE FIVE QUESTIONS (each drafted to obey the rules):**
1. "Walk me through your last shipped project — how did it actually get made,
   step by step?" (their life; past specifics; the real workflow, not the reel)
2. "When did you last pay for compute or model access out of your own pocket —
   what happened, and what did it cost?" (the actual behavior, past tense)
3. "Have you tried getting work like that funded before — GitHub Sponsors,
   Kickstarters, sponsorships? What actually happened?" (evidence over opinions;
   grounds the P1 pitch: existing rails exist and pay most maintainers nothing —
   OUTREACH-STAGE #6)
4. "What have you already done to fix the funding/tooling pain that annoys you
   most?" (the workaround audit = demand evidence, past actions)
5. "What would you need to see to run your next project on rails like ours
   this month — and can we make that concrete step happen now?" (the commitment
   probe: a concrete next step — pick the project they would claim, or schedule
   the Stage-0 run — commitment and advancement, not praise, is the only signal)

**THE FILTER (pass looks like):** names the pain in THEIR words with dates and
numbers; active output in the last 30 days (PILOT-PROPOSAL roster rule:
PROVEN demand — audience + active output); commits to a concrete next step
without our persuading. **Fail looks like:** future-tense enthusiasm, "great
idea" without their specifics, asks what you want them to say.
**Funnel expectations:** pass rate ~10% (S1's datum); top-of-funnel sources:
the creator roster (PILOT-TARGETS Tier 1), contacts.json (82 entries), the
opus-authors staged list (~703, public-data only — ROADMAP); every no filed as
acquisition data (S28's offers-metric law; the email law: "a reply explaining
why is worth more than the claim").

## (e) THE PATRON-PAGE FRAMING — DRAFT — DECISION GUI

The law (LAUNCH-PLAYBOOK §Patronage side, Gui 10/26): people don't "buy" — **they
BACK a project they love and they UNLOCK PERKS** (the Kickstarter frame people
ALREADY understand); perks = fixed, honest unlockables (early-access seats, named
receipt lines, beta lanes, creator-status badges) — **GIFTS for backing
(gift-law safe), NOT obligations of return-on-money**; on top: the receipts —
the backer sees exactly what their compute funded (the public ledger = Kickstarter's
transparency, permanent). Language law (BUSINESS-MODEL §3): "patronage/support,"
not "donation" (no deductible-gift claims without status); credits = prepaid
utility/service credits, non-transferable, zero cash redemption.
- **THE HOWEY WALL SENTENCE — on the page verbatim
  (TOKEN-DISTRIBUTION.md launch guardrail b, ROADMAP standing law 1):**
  **"Not an investment — no equity, no return, no revenue share."**
- **Fourth leg allowed, walls unchanged (OUTREACH-STAGE §10):** the work keeps
  earning via receipt-tracked attribution (data-tokens denominated in credits,
  GATE+2) — cash returns to users = NEVER; creator licenses decide ownership.
- **Tier mechanics (DATA-WEALTH §18):** patron-unlock thresholds are
  PROJECT-defined (donation-with-access-privilege, Patreon mechanics); tiers are
  honor, not ransom — an open-license receipt never gate-keeps; personal use =
  their business; in-platform reuse = the stitched-from receipt + routed rent.
- **Fee honesty on-page (BUSINESS-MODEL §2):** zero platform fee on donations;
  processor passthrough visible; the margin lives on compute-out, printed as one
  number on every receipt; circular dogfood margin never counts as revenue.
- **Template law:** the platform provides the template, the creator fills it —
  unlocks are creator-owned promises; the platform never promises outcomes.

**COPY DRAFT — the patron CTA blurb:**
"Back this work. Your backing buys compute for the exact question the creator
put on the ledger. Not an investment — no equity, no return, no revenue share.
What you get: the perks behind the tier they set, and the receipts — every run
your compute funded, public and permanent. What you never get: owed money.
What the record gets: your name on the receipt line, forever."

---

**The send-law (applies to all five):** every item above is DRAFT — DECISION GUI.
OUTREACH-0 starts when D3 lands (roadmap); nothing sends before the MVP gate is
fully tested-robust (PILOT-TARGETS GO preconditions 2-4) and Gui's sign-off per
contact (Sign-off class). When the stage opens, the revival read is
docs/OUTREACH-STAGE.md #6-8 + the S-laws here.
