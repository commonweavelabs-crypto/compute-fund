---
type: n-doc
date: 2026-11-04
status: draft
serves: compute-fund
tags: [compute-fund, nfx, network-core, receipts, roadmap]
---

# Compute Fund — THE NETWORK CORE (N-1)

*Fires the roadmap bullet: "N-1 Name the network core: docs/NETWORK-CORE.md — receipts-graph
as the core data-network effect; seed graph = pilot fleet + roster; open/data policy"
(docs/ROADMAP.md, Phase 2 NFX-alignment block). Sources read locally: docs/NFX-ALIGNMENT.md
(#1-2), docs/DATA-WEALTH-LAYER.md (§0-2, §7, §13, §19-20), docs/SPEC-V2.md (§0-1),
docs/MISSION.md, docs/PILOT-PROPOSAL.md, docs/PILOT-TARGETS.md, docs/ROADMAP.md.
Nothing invented; every claim cites its doc.*

## 1. The thesis — the receipts graph IS the data-network effect

NFX-ALIGNMENT #1 scored Compute Fund "designed but UNNAMED": the components exist
(ledger, forks/lineage, votes, passport) but the network-effect core was never picked.
NFX's law (their masterclass, entry id `nfx-startup-idea-patterns-masterclass`): pick
the core and build it in BEFORE scaling. The named core:

**The receipts graph — the public record of every claim, receipt, ledger entry, and
fork lineage — is the data-network effect.** Each entry raises the value of the whole
graph for every party already on it: patrons (proof of where money went), creators
(portable credentials, DATA-WEALTH §1 legs 2-3), agents and future apps (a queryable
outcome index — DATA-WEALTH §5's Outcome-Ledger-as-index), and us (the trust product:
BUSINESS-MODEL "receipts > code as the trust product"). The passport adds the
cross-side effect later (portable trust to other apps — NFX-ALIGNMENT #1; Phase 5 in
SPEC-V2 §4). The GitHub analogy is exact: the contribution graph IS the product.

Why a data-NETWORK effect and not just a log: DATA-WEALTH §2 — the graph closes a
compounding loop (patrons → credits → claims → outcomes → outcome-data → data-tokens
↔ trade → new projects pay old custodians in credits → more fuel → more outcomes).
Every new node (receipt, fork edge, stitched-from mark) makes the previous nodes MORE
useful, because the attribution spine only thickens with density. NFX-ALIGNMENT #1:
"each entry raises the value of the whole graph for patrons, creators, agents and
future apps."

## 2. The provenance spine (schema from day one, zero build cost)

The spine is already designed and already cheap (DATA-WEALTH §7: "keep artifact
checksums + receipt IDs + license fields in the schema from day one (zero build cost,
the join keys for this whole layer later)"):

- **SPEC-V2 §1 object model:** `Receipt {id, milestone_id?, artifact_refs[],
  checksums[], gateway_meter_summary, staged_at, chain_stamp?}`;
  `Project {fork_of?, fork_children[], trust_meter, ...}` = the lineage edges;
  `Milestone.chapter {meter_block[auto], artifacts[], work_notes[voice],
  community_digest[auto], verdict_line[voice]}`.
- **SPEC-V2 §0 constitution:** #2 receipts are INFRASTRUCTURE-generated (meters,
  stamps and checksums mint facts; creators write only the [VOICE] layer) — the
  graph is not user-authored testimony, it is machine-minted record; #8 "the license
  governs the COPY; the platform governs the FLOW" — the license field is the truth
  layer of what every node allows (DATA-WEALTH §19).
- **Phase-0 fact (ROADMAP):** "Demo receipts schema = production schema (typed,
  migration-cheap)" — the graph's shape was proven before the money loop was.
- **Minimum-disclosure floor (DATA-WEALTH §13):** every receipt carries three
  stamps — the ACCOUNT stamp (persistent pseudonymous profile → passport-linkable,
  the anti-sybil floor), the STATE stamp (compliance-toggle state at mint time),
  the LINEAGE stamp (checksum chain). No fully-anonymous receipts ever; KYC never
  on a public receipt (money identity ≠ public identity).

This is why the attribution problem "nobody else has solved" is one we already
did (DATA-WEALTH §2): the spine exists before the wealth layer that needs it.

## 3. The seed graph — pilot fleet + roster (how cold-start happens)

The graph starts seeded, not empty. Per PILOT-PROPOSAL, PILOT-TARGETS, ROADMAP:

- **The founding node — Gui's dogfood (ROADMAP D3-PILOT-PIPE-TEST):** Gui claims his
  own project (tierllama bench row already seeded) and self-funds $50-100 → gateway
  run → receipts public = the FIRST REAL receipts story. Pilot-Stage-0 proves the
  piping before any audience sees it (PILOT-PROPOSAL §0).
- **The pilot fleet (PILOT-PROPOSAL §3, $500 test-mode cap, 0% platform margin in
  pilot):** Pj Accetturo (AI-film creator, DM-responsive — warmest door),
  tarumainfo (Seedance ensemble, craft-grade, agent-native), Lino/AbMaxx (ads-creative
  compute lane). Roster rule: partners must have PROVEN demand (audience + active
  output) — the NFX red-ocean rule (NFX-ALIGNMENT #5).
- **The creator roster (PILOT-TARGETS Tier 1, modders who visibly burn tokens):
  Can It Code? (138K views ep.1), PixelArtistry (118K), Critical Creator (11K),
  Nick Saraev/LeftClick (164K), lustoykov (14K).** Contact law: public info only,
  one touch each, GO only after deploy + test-mode funding (PILOT-TARGETS
  preconditions 2-4).
- **The unclaimed claim-stubs (ROADMAP D2-CLAIM-FLOW):** research-imported projects
  loaded as UNCLAIMED — MiroFish / last30days / colibri / tierllama. Archive anchors
  (verified in link-archive/catalog_RECOVERED.json): `mirofish-swarm-simulation`,
  `last30days-social-listening-skill`, `colibri-moe-streaming-engine` (42,074 stars).
  The claim ladder verifies maintainers; their repos become the earliest lineage
  subroots.
- **The staged funnel (ROADMAP outreach additions):** link-archive contacts.json
  (82 entries) + the opus-authors harvest (~703 credited Opus-video prompt authors
  earning nothing, staged to `pilot-targets/opus-video-authors.json`) = the P2
  seed list, public-data only.
- **Cold-start economics:** supply-side P2 seeding IS the threshold-effect answer
  (DATA-WEALTH §20: "the cold-start risk = N-2 in the risk register: restrictive
  incumbents arrive with liquidity — supply-side P2 seeding = the answer, already
  the plan"). Spotlight scarcity makes it true and honest (OUTREACH-STAGE §0):
  few projects early → more eyes per project.

## 4. The open-data policy — the wealth stays custodian-honored, never concentrated

The HEPHAESTUS law extends to data (DATA-WEALTH §0; MISSION doctrine "who directs
the fire" → the commons):

1. **All platform-generated data is WEALTH — open and value-generating FOR THE
   PEOPLE** (custodians/maintainers/creators), never concentrated in one company's
   hands. The receipts make every use attributable: when any finding gets used,
   credit flows to exactly who made it (DATA-WEALTH §0).
2. **The receipts corpus = the commonwealth, never a product.** It is NOT sold as
   product, ever (DATA-WEALTH §3/§12); the aggregates the platform derives stay
   free to all users inside the loop (§8.3 suggestion, Gui's call pending).
3. **User data never leaves without consent** — the passport + selective-disclosure
   layer FIRST; anything user-sensitive is governed by the passport's
   selective-disclosure law (§3, §12). The graph records WORK, never humans
   (§12: behavioral/surveillance data cannot trade, ever).
4. **Exportable/inspectable by policy** (NFX-ALIGNMENT N-1 wording: "open-graph
   data policy = exportable/inspectable") — the graph is an asset to the people
   standing on it, not a walled moat over them.
5. **Attribution forever, ownership never grabbed:** the platform enforces
   attribution, not ownership terms; the CREATOR's chosen license owns the output
   (default-open nudge, §3 WE-CAN-PROMISE). Chain stamps carry only pseudonymous
   data — names never touch the chain (§15 Correction 1).

The contrast is the mission itself (MISSION.md): Sam's fire vs the commons' fire —
and the receipts are how the commons keeps proof of what its fire did.

## 5. What compounds — receipts → trust → creators → receipts

- **Receipts beget trust:** SPEC-V2 §2-R2 — TRUST = f(delivered outcomes, conduct);
  heals ONLY via delivered outcomes; NEVER purchasable. Standing's biggest term is
  verified-use (~0.5 blend) — verified USE of the graph's nodes is the graph's own
  yield. M7 doctrine: nobody inherits unearned trust (DATA-WEALTH §21).
- **Trust begets creators:** receipts-as-credentials = the portable CV (DATA-WEALTH
  §1 leg 2); the custodian credit layer = standing that persists (leg 3); the
  steward arc = a living, not a hobby (§12: people who take a project and make it
  their life's work, paid). MISSION's creator pitch: "keep the record — portable,
  yours, forever."
- **Creators beget receipts:** every funded claim mints the next receipt row; forks
  pay one-hop rent (5-20%, default 10%, frozen at fork time — v0 law, DATA-WEALTH
  §9); stitched-from reuse routes rent in-platform regardless of license (§18-19);
  the whole maneuver stack (spot buy / bulk fork-merge / personal patron-unlock)
  rides the same spine (§19 THREE RAILS, ONE SPINE).
- **The gradient engine (§20):** openness profits on our rails — discovery (closed
  = an island with no fork-tree), trust (open disclosure = the strongest standing
  signals), the rent economy (an open artifact gets used; a closed one idles).
  Threshold effect: once open projects' funded-share passes critical mass,
  switching becomes a wave — network-effect bootstrapping, the NFX law itself.
- The N-002 wedge (ROADMAP): modding communities = the non-utilizer lane — a
  transaction class that doesn't exist today, created on the same spine
  (NFX-ALIGNMENT #7 "create NEW transactions, don't replace TAM").

## 6. The metric to watch

- **PRIMARY — the funded-share of open vs closed licenses at the pilot** (DATA-WEALTH
  §20 watch-item: "a receipts question we can answer with our own data; add to pilot
  metrics"). This is the threshold-effect evidence: does the network core convert
  openness into funding in the wild.
- **Boundary layer from pilot one (NFX-ALIGNMENT #7, milestone N-6):** patron count
  × effective ASP — Wonderhill's law (50K × $4/day = business); the two-offer
  structure (donation long-tail + done-for-you tier) is the designed answer; the
  pilot produces the first real numbers.
- **Graph-compounding proxies (weekly receipts ritual, N-4 advisors read these):**
  receipts minted/week; verified-use events per project (the U term); fork/merge/
  stitch events created per delivered milestone; seed→organic claimer ratio
  (how fast the graph grows beyond its seeds).
- **Compounding shape, judged on the day-50 patience (LAUNCH-PLAYBOOK S15):
  "around day 50, it started working, then things went PARABOLIC" — network
  effects look flat, then absurd; judge curves at week 7, not week 2.**

## 7. What this naming forbids

- The unit of value stays THE RECEIPT, not a token (ROADMAP Phase 5: "'central bank
  of the agent economy' currency framing: defer").
- The MVP stays charter + claim + receipts + ledger ONLY (N-3 complexity firewall;
  SPEC-V2 §4 phase mapping) — the network core is named now so mechanisms do NOT
  get added by enthusiasm.
- Demo data always labeled (standing law 2); the seed graph's demo rows can never
  masquerade as the graph's real history.
