// D2-CLAIM-FLOW stub data — research-imported pilot-target projects, UNCLAIMED.
// Provenance: the CommonWeave link-archive pilot targets (docs/ROADMAP.md,
// D2-CLAIM-FLOW: tierllama / colibri / last30days / MiroFish). Each one_liner +
// repo_url is the REAL project from the archive record; the CFQ fields are
// stub-shaped placeholders the real maintainer rewrites at claim time.
//
// Ownership law: stubs are held by the system user (cf_system,
// claims+noreply@commonweavelabs.com) and carry claimed = 0. Claiming moves REAL
// ownership (owner_id -> the claimant) and is receipted ('ops' kind).

export type ClaimStub = {
  slug: string;
  name: string;
  one_liner: string;
  repo_url: string;
  question: string;
  data_inputs: string;
  method: string; // JSON array string — the gateway's model allowlist
  deliverable: string;
  done_criteria: string;
  falsified_by: string;
  review_process: string;
  budget_credits: number;
  deadline: string;
  assumptions: string;
  links: string | null; // JSON array string [{label,url}]
};

export const PILOT_TARGET_STUBS: ClaimStub[] = [
  {
    slug: "tierllama",
    name: "Tierllama",
    one_liner: "Local LLM router: Jev-class typed decisions route every agent action to the cheapest capable model on a consumer GPU (proxy + dashboard, dogfood row).",
    repo_url: "https://github.com/commonweavelabs-crypto/tierllama",
    question: "Given the tierllama router running against the local Ollama fleet, does classifier-gated routing hold >=80% exact-match on the n=211 bench while cutting average cost per routed action versus always-frontier routing?",
    data_inputs: "tierllama repo (bench scripts + routing logs, public) + local Ollama on 127.0.0.1:11434, MIT",
    method: "[\"qwen3:8b\",\"qwen3:4b\",\"gemma3:12b\"]",
    deliverable: "public bench JSON + routed-action receipts appended on this page",
    done_criteria: "rerun bench at >=80% exact match AND measured cost per routed action below the always-frontier baseline",
    falsified_by: "exact-match below 75% on a rerun bench, or router cost at or above the always-frontier cost",
    review_process: "anyone reruns the repo bench and compares the public receipts on this page",
    budget_credits: 100,
    deadline: "2027-02-02",
    assumptions: "local Ollama serves qwen3:8b with think=True and num_predict>=1500; bench seeds pinned. Research-imported UNCLAIMED stub: the maintainer rewrites the CFQ fields at claim time.",
    links: null,
  },
  {
    slug: "comfyui-video-ui",
    name: "ComfyUI Video UI",
    one_liner: "Visual UI for the LTX video production pipeline — timeline of scene cards, script formatting, project canvas. First hosted project of the Compute Fund (pre-beta, own repo).",
    repo_url: "https://github.com/commonweavelabs-crypto/comfyui-video-ui",
    question: "Given the pre-beta comfyui-video-ui build plus the blueprint pipeline draft (docs/VIDEO-BLUEPRINT-PIPELINE.md), can one video be taken from source through a machine blueprint to an AI-director task list inside the UI without manual glue?",
    data_inputs: "comfyui-video-ui repo (public, backend+frontend) + the rea-video fork (Apache-2.0) + local ComfyUI/LTX",
    method: "[\"gemma3:12b\",\"qwen3-vl-32k\"]",
    deliverable: "the first blueprint-driven director task list rendered as scene cards in the UI, with receipts on this page",
    done_criteria: "one source video produces a director-consumable blueprint (breakdown.json v1) and the UI displays its task list end to end",
    falsified_by: "any step requiring manual file shuffling between extractor and UI, or the blueprint fields the director needs missing from breakdown.json",
    review_process: "anyone reruns the flow per docs/VIDEO-BLUEPRINT-PIPELINE.md and checks the receipts on this page",
    budget_credits: 100,
    deadline: "2027-02-02",
    assumptions: "local ComfyUI + Ollama serve the pipeline; repo is Apache-2.0/MIT-clean after the 2026-11-06 privacy sweep. UNCLAIMED stub maintained by CommonWeave.",
    links: "[{\"label\":\"Blueprint pipeline draft\",\"url\":\"https://github.com/commonweavelabs-crypto/comfyui-video-ui/blob/master/docs/VIDEO-BLUEPRINT-PIPELINE.md\"}]",
  },
  {
    slug: "rea-video",
    name: "rea-video (CommonWeave fork)",
    one_liner: "Reverse-engineer any video shot by shot (Apache-2.0, ~2.9k stars) — forked under the Compute Fund account to become the blueprint/template extractor feeding the AI director.",
    repo_url: "https://github.com/commonweavelabs-crypto/rea-video",
    question: "Given the forked rea-video with the local-VLM profile fixed (fusion rebalance honoring unanimous VLM+human review), does a viral video in the compute-fund niche yield a remake plan a director can act on, verified against the archived manual anatomy baselines?",
    data_inputs: "rea-video fork (Apache-2.0) + manual anatomy baselines + bench outputs archived 2026-11-06 (bench_getripping*, bench_maddalone)",
    method: "[\"qwen3-vl-32k\",\"gemma3:12b\"]",
    deliverable: "fusion-fix PR + two verified blueprint reports with receipts on this page",
    done_criteria: "both bench videos produce verdict lines matching the archived manual ground truth after the fusion fix",
    falsified_by: "the verdict line still contradicts unanimous human+VLM review on either bench video after the fix",
    review_process: "rerun the bench per the archived recipe (REA_VLM_MEDIA=frames + qwen3-vl-32k) and compare against the archived baselines",
    budget_credits: 100,
    deadline: "2027-02-02",
    assumptions: "qwen3-vl-32k serves locally with num_ctx 32768 (validated recipe); bench baselines archived and public. UNCLAIMED stub maintained by CommonWeave.",
    links: "[{\"label\":\"Upstream\",\"url\":\"https://github.com/JuneYaooo/rea-video\"}]",
  },
  {
    slug: "colibri",
    name: "colibri",
    one_liner: "Pure-C MoE expert-streaming engine: 744B-class GLM streamed from disk on ~10 GB resident; MCP server + OpenAI/Anthropic-style APIs (42K stars).",
    repo_url: "https://github.com/JustVugg/colibri",
    question: "Given the colibri expert-streaming engine on a 16 GB consumer box, does a 744B-class MoE run streamed-from-disk within 10 GB resident RAM at usable tok/s on decision-class prompts?",
    data_inputs: "colibri repo + public engine docs (github.com/JustVugg/colibri); license verified at repo",
    method: "[\"glm-5.3-flash\"]",
    deliverable: "streamed-inference receipts on this page (tok/s + resident RAM per run)",
    done_criteria: "100 receipts from 744B-class MoE runs, each with resident RAM <= 10 GB recorded",
    falsified_by: "resident RAM exceeds 10 GB on standard decision prompts, or tok/s unusable (<1 tok/s single stream)",
    review_process: "any local install can reproduce; receipts are public on this page",
    budget_credits: 100,
    deadline: "2027-02-02",
    assumptions: "engine fits the consumer box class it targets; verified on the Gui box probe. Research-imported UNCLAIMED stub: the maintainer rewrites the CFQ fields at claim time.",
    links: null,
  },
  {
    slug: "last30days",
    name: "last30days",
    one_liner: "Agent skill: search Reddit/X/YouTube/TikTok/Hacker News/Polymarket over the last 30 days, scored by attention + money (64K stars, MIT, keyless).",
    repo_url: "https://github.com/mvanhorn/last30days-skill",
    question: "Given the last30days skill with its default keyless source seeds, does one run return at least 3 scored mentions per named query across Reddit/X/HN with per-source attribution?",
    data_inputs: "last30days-skill repo (skill definition + source adapters, public), MIT",
    method: "[\"last30days-skill\"]",
    deliverable: "scored mention tables with per-source attribution, receipts on this page",
    done_criteria: "at least 3 scored, attributed mentions per probe query across Reddit/X/HN in one run",
    falsified_by: "a probe query returns fewer than 3 scored attributed mentions after retries",
    review_process: "anyone with the skill installed reruns the same probe query",
    budget_credits: 50,
    deadline: "2027-02-02",
    assumptions: "keyless source seeds stay available; no account keys required. Research-imported UNCLAIMED stub: the maintainer rewrites the CFQ fields at claim time.",
    links: null,
  },
  {
    slug: "mirofish",
    name: "MiroFish",
    one_liner: "Swarm-simulation social engine for launch/policy pre-testing (79.5K stars, AGPL-3.0; offline fork = local).",
    repo_url: "https://github.com/666ghj/MiroFish",
    question: "Given MiroFish swarm simulations with pinned seeds, does a launch/policy pre-test batch produce per-scenario outcome distributions that reproduce within a fixed tolerance on rerun?",
    data_inputs: "MiroFish repo (simulation engine + scenario definitions, public), AGPL-3.0",
    method: "[\"mirofish\"]",
    deliverable: "per-scenario outcome distributions from pre-test batches, receipts on this page",
    done_criteria: "2 reruns of the same pinned-seed batch agree within tolerance on every scenario's distribution",
    falsified_by: "pinned-seed reruns diverge beyond tolerance on any scenario",
    review_process: "anyone reruns the same pinned batch and compares distributions",
    budget_credits: 50,
    deadline: "2027-02-02",
    assumptions: "AGPL-3.0: source sharing required for any productized fork. Research-imported UNCLAIMED stub: the maintainer rewrites the CFQ fields at claim time.",
    links: null,
  },
];
