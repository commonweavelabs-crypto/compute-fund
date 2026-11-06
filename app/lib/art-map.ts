// C-8 art map — slug → v0 project-art filename (compute-fund-v0/public/project-art).
// ILLUSTRATIVE PLACEHOLDERS: each mapping is themed dark-tech art picked by
// project name/theme from the v0 archive batch (the no-logo law means no real
// logos anywhere); the real maintainer swaps in their own art at claim time.
// All current DB slugs (app/lib/seeds.ts pilot stubs + live board rows) are
// covered below via PREFIX matching — DB slugs carry random suffixes
// (gate-validation-corpus-pass-4y1h), so keys are matched with startsWith in
// the order listed (longest/most-specific prefix first).
export const ART_DEFAULT = "sandcastle.png";

const ART_MAP: ReadonlyArray<readonly [string, string]> = [
  // gate-validation-corpus-* (funds the CFQ gate rerun) → security-corpus art
  ["chunked-analysis-of-the-receipts-corpus-", "cf-vitali87-code-graph-rag.png"],
  ["gate-validation-corpus-pass-", "cf-elder-plinius-cl4r1t4s.png"],
  // pilot-target mirror stubs (seeds.ts)
  ["tierllama", "cf-browser-use-jev-ultrafast.png"],
  ["colibri", "diffusers.png"],
  ["last30days", "scrapegraph-ai.png"],
  ["mirofish", "cf-foundationvision-var.png"],
  // live board rows (test-funded + create-flow projects)
  ["full-loop-", "cf-genmoai-mochi.png"],
  ["big-tok-", "sandcastle.png"],
  ["cap-drain-", "cf-nvlabs-longlive.png"],
  ["loop-verify-s2-", "cf-microsoft-skill-recorder.png"],
  ["dbg-run-", "cf-leo-lilinxiao-codex-autoresear.png"],
  ["d3-test-flow-", "opensandbox.png"],
];

// Returns a web path under /project-art/ for any slug; never throws, falls
// back to ART_DEFAULT so an unknown future project still shows sane art.
export function artFor(slug: string): string {
  for (const [prefix, file] of ART_MAP) {
    if (slug.startsWith(prefix)) return `/project-art/${file}`;
  }
  return `/project-art/${ART_DEFAULT}`;
}
