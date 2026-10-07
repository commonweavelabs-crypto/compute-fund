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

export const projects: Project[] = [
  {
    slug: "tierllama",
    name: "Tierllama",
    one: "Transparent decision-model router: routes your whole fleet locally — the decision log records every probability, theirs is a black box.",
    tags: ["LIVE", "router", "decision-models"],
    raised_usd: 7420, goal_usd: 12000, tiers: [25, 100, 500],
    receipts: tierllamaReceipts,
  },
  {
    slug: "compute-fund",
    name: "Compute Fund",
    one: "This platform, funding itself: patronage in, compute out, every batch receipted. The dogfood project.",
    tags: ["PLATFORM", "dogfood"],
    raised_usd: 1850, goal_usd: 5000, tiers: [25, 100, 500],
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