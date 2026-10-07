// Compute Fund — v1 data layer (spec: demo receipts grounded in real measurements,
// ledger typed to the FUTURE DB schema so v2 migration is a data swap, zero personal data).

export type Receipt = {
  id: string;              // receipt id (future: real UUID)
  ts: string;              // ISO timestamp of the compute run
  project: string;         // project slug
  model: string;           // model that ran
  kind: "classify" | "generation" | "bench" | "ops";   // compute kind
  tokens_in: number;       // prompt tokens
  tokens_out: number;      // completion tokens
  cost_usd: number;        // cost of THIS run (4 decimals)
  outcome: "success" | "failure";
  output_ref?: string;     // future: hash / artifact link
};

export type Project = {
  slug: string;
  name: string;
  one: string;             // one-liner
  tags: string[];          // tags incl. "LIVE" marker
  raised_usd: number;
  goal_usd: number;
  tiers: number[];         // patron tiers, manifesto: $25/$100/$500
  receipts: Receipt[];     // most recent last
  org: string;             // org slug
  location: string;        // display location (city-level, no addresses)
  cfq_id: string;          // Question Standard id
  cfq_question: string;    // the one falsifiable sentence
  cfq_falsified_by: string;
  deadline: string;        // ISO date (days-left computed client-side)
  story: string;           // project page narrative
  roadmap: { title: string; state: "done" | "active" | "planned" }[];
};

// ---- grounded demo data -------------------------------------------------
// Tierllama counts measured from the real repo (logs/proxy.jsonl, bench data
// 2026-09; no personal data — counts and latencies only).
// - ~101 real routed requests in the dogfood window
// - classifier warm ~3.2-5.5s, gen ~7s, bench medians from logs/bench.jsonl
// - cloud-equiv cost modeled from published token pricing, labeled demo.
const T = (ts: string, model: string, kind: Receipt["kind"], tin: number, tout: number, cost: number, outcome: Receipt["outcome"] = "success"): Receipt =>
  ({ id: "rcpt-demo", ts, project: "tierllama", model, kind, tokens_in: tin, tokens_out: tout, cost_usd: cost, outcome, output_ref: "sha:demo" });

const tierllamaReceipts: Receipt[] = [
  T("2026-10-06T20:16:05", "qwen3-vl:8b", "classify", 812, 46, 0.0011),
  T("2026-10-06T20:16:44", "gemma3:12b", "generation", 1540, 388, 0.0032),
  T("2026-10-06T20:27:56", "qwen3:4b", "classify", 704, 38, 0.0004),
  T("2026-10-06T20:28:12", "qwen3:4b", "classify", 690, 41, 0.0004),
  T("2026-10-06T20:28:46", "qwen3:4b", "classify", 755, 36, 0.0004),
  T("2026-10-06T20:29:15", "qwen3:4b", "classify", 711, 39, 0.0004),
].map((r, i) => ({ ...r, id: `rcpt-demo-t${i}` }));

// ---- orgs (creator entities; transferable, v1: CommonWeave only) ----
export type Org = {
  slug: string;
  name: string;
  bio: string;
  location: string;
  joined: string;          // ISO date
  avatar: string;          // emoji sig (real logo later)
  links: { x?: string; youtube?: string; github?: string };
};

export const orgs: Record<string, Org> = {
  "commonweave-labs": {
    slug: "commonweave-labs",
    name: "CommonWeave Labs",
    bio: "We scope open niches in AI and open-source everything we build — patronage-funded, receipt-backed. Home of Tierllama, Compute Fund, jev-triage and the ComfyUI Video UI.",
    location: "Florida, USA",
    joined: "2026-07-01",
    avatar: "▚",
    links: {
      x: "https://x.com/Commonweavelabs",
      youtube: "https://www.youtube.com/@CommonweaveLabs",
      github: "https://github.com/commonweavelabs-crypto",
    },
  },
};

// ---- CFQ domains (category strip) ----
export const cfqDomains = [
  "decision-models", "research", "video", "infrastructure", "wellness", "tools",
];

export const projects: Project[] = [
  {
    slug: "tierllama",
    name: "Tierllama",
    one: "Transparent decision-model router: routes your whole fleet locally — the decision log records every probability, theirs is a black box.",
    tags: ["LIVE", "router", "decision-models"],
    raised_usd: 7420, goal_usd: 12000, tiers: [25, 100, 500],
    receipts: tierllamaReceipts,
    org: "commonweave-labs",
    location: "Florida, USA",
    cfq_id: "CFQ-2026-001",
    cfq_question: "Given the tierllama bench corpus (seed-table + live dogfood logs), does a Jev-class classifier with per-difficulty routing produce ≥95% correct lane decisions on the golden set v2 within 2,000 compute credits by 2026-12-31?",
    cfq_falsified_by: "golden-set accuracy < 95%, or per-action confidence gates fire on >10% of clear-cut routing cases",
    deadline: "2026-12-31",
    story: "Tierllama routes every message through a transparent decision tree: a classifier scores difficulty and timing; the dispatch layer reserves fleet nodes with failover; every decision lands in an open log with probabilities. Patronage funds the bench corpus that keeps the oracle honest — cloud-equivalent savings are measured, not promised.",
    roadmap: [
      { title: "Decision tree + classifier (J1-J6)", state: "done" },
      { title: "Web dashboard + oracle seeds (J7-J12)", state: "done" },
      { title: "Fleet discovery + dispatch integration (J26 consolidation)", state: "done" },
      { title: "Clef benchmark (J26-CLEF)", state: "planned" },
      { title: "Secure fleet pairing (J24)", state: "planned" },
    ],
  },
  {
    slug: "compute-fund",
    name: "Compute Fund",
    one: "This platform, funding itself: patronage in, compute out, every batch receipted. The dogfood project.",
    tags: ["PLATFORM", "QOTM"],
    raised_usd: 1850, goal_usd: 5000, tiers: [25, 100, 500],
    org: "commonweave-labs",
    location: "Florida, USA",
    cfq_id: "CFQ-2026-000",
    cfq_question: "Given the platform's own ledger schema, does a patron-funded compute loop (donation -> virtual key -> metered run -> receipt) post 100% of runs as public receipts within the donated cap by 2026-12-31?",
    cfq_falsified_by: "any run missing a receipt, or cap overrun on any virtual key",
    deadline: "2026-12-31",
    story: "Compute Fund funds itself on Compute Fund — the receipts you see on this card are generated by the platform's own build/test compute. Patronage here pays for the gateway hardening, the ledger backend, and the Question Standard lint. The receipts page IS the pitch.",
    roadmap: [{"title": "v1 static page", "state": "done"}, {"title": "Project pages + profiles", "state": "active"}, {"title": "LiteLLM gateway (real compute out)", "state": "planned"}, {"title": "Stripe rails", "state": "planned"}],
    receipts: [
      { ...T("2026-10-06T21:02:11", "glm-5.3-flash:cloud", "ops", 2100, 640, 0.0041), id: "rcpt-demo-c0", project: "compute-fund" },
      { ...T("2026-10-06T21:04:53", "qwen3:4b", "ops", 900, 52, 0.0004), id: "rcpt-demo-c1", project: "compute-fund" },
    ],
  },
  {
    slug: "jev-triage",
    name: "jev-triage",
    one: "Jev-powered submission triage: typed decisions over incoming work, host-agnostic, built once reused everywhere.",
    tags: ["PLANNED", "decision-models"],
    raised_usd: 320, goal_usd: 2000, tiers: [25, 100, 500],
    org: "commonweave-labs",
    location: "Florida, USA",
    cfq_id: "CFQ-2026-002",
    cfq_question: "Given 200 labeled submission cases, does a Jev-class triage router reach ≥90% correct lane assignment with zero user-content leakage by 2027-02-01?",
    cfq_falsified_by: "accuracy < 90% or any personal content in shipped decision logs",
    deadline: "2027-02-01",
    story: "Every submission (bug report, feature ask, Jev benchmark case) gets typed decisions: relevance, severity, lane. Built once, reused across CommonWeave projects. Patronage funds the labeling corpus and the benchmark harness.",
    roadmap: [{"title": "Skeleton + manifesto", "state": "done"}, {"title": "JT-1 labeler", "state": "planned"}, {"title": "JT-2 router", "state": "planned"}],
    receipts: [
      { ...T("2026-10-05T18:22:40", "qwen3:4b", "bench", 480, 28, 0.0003), id: "rcpt-demo-j0", project: "jev-triage" },
    ],
  },
  {
    slug: "video-ui",
    name: "ComfyUI Video UI",
    one: "Ship the ComfyUI video workflow as a product: React+Vite+FastAPI, built in the open.",
    tags: ["IN-BUILD", "video"],
    raised_usd: 2640, goal_usd: 8000, tiers: [25, 100, 500],
    org: "commonweave-labs",
    location: "Florida, USA",
    cfq_id: "CFQ-2026-003",
    cfq_question: "Given the ComfyUI workflow corpus, does the video UI complete a fresh-user onboarding to first rendered clip in under 10 minutes with zero local setup by 2027-01-15?",
    cfq_falsified_by: "median onboarding time > 10 minutes across 20 test users, or any workflow needing manual node installs",
    deadline: "2027-01-15",
    story: "The ComfyUI video workflow as a product: onboarding, presets, render queue, all open source. Patronage funds GPU-hours for the render test matrix and fresh-install UX passes.",
    roadmap: [{"title": "Workflow engine", "state": "done"}, {"title": "Fresh-install UX pass", "state": "active"}, {"title": "Product polish", "state": "planned"}],
    receipts: [
      { ...T("2026-10-04T23:41:07", "qwen3-vl:8b", "generation", 1750, 210, 0.0026), id: "rcpt-demo-v0", project: "video-ui" },
    ],
  },
];

export const ledgerSummary = (p: Project) => {
  const ok = p.receipts.filter(r => r.outcome === "success");
  return {
    runs: p.receipts.length,
    tokens_in: p.receipts.reduce((a, r) => a + r.tokens_in, 0),
    tokens_out: p.receipts.reduce((a, r) => a + r.tokens_out, 0),
    cost_usd: +p.receipts.reduce((a, r) => a + r.cost_usd, 0).toFixed(4),
  };
};