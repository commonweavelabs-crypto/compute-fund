# Compute Fund — Question Standard v0 (CFQ)

*Every project on Compute Fund answers a Question. The Question is the product.
Synthesized 2026-10-07 from: OSF Preregistration / Registered Reports (review-then-fund),
DARPA milestone statements (quantified done-criteria + go/no-go), Popper falsifiability
(name the refutation in advance). NIH Specific Aims + OKR-do-d informed field granularity.*

A project is fundable only when its Question passes this standard. Ambiguous text = reject at intake.

## Required fields (all 10)

| # | Field | Rule |
|---|-------|------|
| 1 | **Question ID** | `CFQ-YYYY-NNN` — immutable once published |
| 2 | **The Question** | ONE falsifiable sentence: *"Given <named dataset/input>, does applying <named method/pipeline> produce <specific measurable output>?"* |
| 3 | **Data Inputs** | Enumerable, versioned, accessible (URL/hash/named corpus + license). "We'll gather some data" = reject |
| 4 | **Method** | Exact procedure incl. models/tools — reproducible by a stranger with fields 3+4 only |
| 5 | **Deliverable** | Concrete artifact (dataset, notebook, benchmark scores) in a named, inspectable format |
| 6 | **Done-Criteria** | Quantified thresholds: "≥N findings with source citations, ≥M agreement on a K-sample, completed within B budget units" |
| 7 | **Falsified-By** | The observation that counts as refutation. Cannot name it → not fundable. Negative results are legitimate deliverables |
| 8 | **Review Process** | Who checks Done-Criteria and how (named reviewers or weighted rubric; open/async preferred) |
| 9 | **Budget & Duration** | Compute-credit cap + deadline. **Unspent credits return to the fund, never the beneficiary** |
| 10 | **Assumptions & Risks** | Premises + pipeline breakage modes (explore vs confirm separated) |

## Anti-cure-cancer rule (Gui, 2026-10-07)
"Cure cancer" may be the TITLE. The Question underneath must be deterministic — e.g.
*"Given datasets A+B+C (named, hashed), does an LLM-assisted chunked-analysis pipeline
produce ≥12 candidate findings with cited evidence, at 85% reviewer agreement on a
100-pair sample, within 2,000 credits, by 2027-03-01?"* Funders always know what
specifically could be delivered and what failure looks like.

## LLM format interpreter (the assist path)
Fields 2–7 are machine-checkable. Creators paste a rough idea into any LLM with our
interpreter prompt (published in this repo) and get: linted falsifiability (is falsified-by
specific?), done-criteria numbers check, and a rendered JSON/YAML project card for the
platform. The standard is enforced as a schema, not a vibe.

## Receipt linkage (with v1 receipts law)
Compute spent against a Question logs under its CFQ id. Receipts must capture:
- the **rejection trail** (candidate findings rejected and why), not just winners
- **overclaiming resistance**: receipt format separates "finding is checkable" from
  "search is not reproducible" (stochastic search ≠ reproducible claim)
Every batch posts: model, tokens in/out, cost, CFQ id, output hash.