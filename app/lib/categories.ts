// Layered category rail (header pass v2, Gui-approved): the taxonomy is DATA,
// not literals scattered through JSX — the rail in components/chrome.tsx, the
// /api/categories rollup and the /discover?cat=&sub= filters all read this one
// table. Two normalizers live here because every consumer must compare the
// SAME way (a sub named "recomp ports" may arrive from a link as
// "recomp-ports", from the DB as "recomp ports"; "decision models" is stored
// by the v1 keyword fill as "decision-models").

export type CategoryTaxonomy = { top: string; subs: string[] };

export const CATEGORY_TAXONOMY: CategoryTaxonomy[] = [
  { top: "gaming", subs: ["decomp & preservation", "recomp ports", "mod loaders", "retro tooling"] },
  { top: "modding", subs: ["trainers & overlays", "asset extractors", "scripting/patching", "community maps"] },
  { top: "video", subs: ["creation", "editing & tooling", "captions & transcription", "upscaling & restoration"] },
  { top: "infrastructure", subs: ["inference serving", "GPU scheduling", "storage & caching", "network proxies"] },
  { top: "decision models", subs: ["routers", "evaluation harnesses", "guardrails"] },
  { top: "research", subs: ["benchmarks", "corpora & datasets", "replication", "papers-to-code"] },
  { top: "wellness", subs: ["focus & habits", "tracking", "sound & sleep"] },
  { top: "tools", subs: ["agent skills", "CLIs & automation", "scrapers", "design"] },
];

// slugify: lowercase, every non-alphanumeric run becomes one dash
// ("recomp ports" -> "recomp-ports", "decision models" -> "decision-models").
// This is the URL form (?cat=…&sub=…); it is never used to compare with the DB.
export function slugify(raw: string): string {
  return raw.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// normCat = the tolerant comparator ("dashes <-> spaces", and & / / likewise):
// category and subcategory values may carry &, spaces, slashes or dashes — the
// link params and the DB rows meet only through this normalizer.
export function normCat(raw: string | null | undefined): string {
  return String(raw ?? "").toLowerCase().trim().replace(/[^a-z0-9]+/g, " ").trim();
}

// Display form for headings ("gaming" -> "Gaming", "decision models" ->
// "Decision Models"): every word capitalized, exactly.
export function prettyLabel(raw: string): string {
  return raw.replace(/[a-z][a-z']*/g, (w) => w[0].toUpperCase() + w.slice(1));
}
