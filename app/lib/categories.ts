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
  { top: "decision models", subs: ["routers", "evaluation harnesses", "guardrails", "gateways"] },
  { top: "research", subs: ["benchmarks", "corpora & datasets", "replication", "papers-to-code"] },
  { top: "wellness", subs: ["focus & habits", "tracking", "sound & sleep"] },
  { top: "tools", subs: ["agent skills", "CLIs & automation", "scrapers", "design"] },
  { top: "security", subs: ["reverse engineering", "decompilation", "static analysis"] },
  { top: "audio", subs: ["production & daw", "instruments & synths"] },
  { top: "home", subs: ["hubs & automation", "cameras & detection"] },
  { top: "education", subs: ["study & flashcards", "classroom & lms"] },
  { top: "finance", subs: ["personal finance", "business & erp"] },
  { top: "commons", subs: ["open knowledge", "preservation", "fonts & design"] },
  { top: "artcraft", subs: ["photo & light", "vector & design", "film & motion", "documents & grid", "materials & 3d"] },
  { top: "jev", subs: ["routed agents", "brains & routers", "jev tools"] },
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

// One-line copy for the /discover category template header (?cat=…). Honest,
// patronage tone — never investor language. Keyed by normCat(top) so the DB's
// dash-forms ("decision-models") and link slugs resolve the same entry; the
// fallback covers an unknown ?cat= so the header still speaks honestly.
export const CATEGORY_BLURBS: Record<string, string> = {
  gaming: "Games preserved, rebuilt and ported by the people who play them — every claim verified, every run receipted.",
  modding: "Players extending the games they own — trainers, extractors and patching tools built in the open, funded in machine-time.",
  video: "For people who make and repair video: editing, captions, transcription and restoration, patron-funded and receipted.",
  infrastructure: "The shared machinery — inference serving, GPU scheduling, caching and proxies — public receipts for every run.",
  "decision models": "Routers, evaluation harnesses and guardrails that decide which model answers — open to verify, not to trust.",
  research: "Benchmarks, corpora and replications, so results can be checked rather than claimed.",
  wellness: "Small tools for focus and rest, funded directly by the people who use them.",
  tools: "Agent skills, CLIs, scrapers and design utilities — everyday automation on the public record.",
  security: "Decompilers, disassemblers and reverse-engineering work in the open — preservation and analysis on the public record.",
  audio: "Synths, DAWs and sound engines built in the open — make and repair sound with receipts.",
  home: "The self-hosted smart home: hubs, automations and cameras that answer only to you.",
  education: "Study tools and classrooms in the open — learning that stays yours.",
  finance: "Ledgers, budgets and open business books — your money, on the record.",
  commons: "Open knowledge and preservation — fonts, archives and public-domain culture, kept alive by the community.",
  artcraft: "The ArtCraft suite: clean-room creative apps written from scratch in pure Rust — every Adobe-class tool, open, with receipts.",
  jev: "The Jev ecosystem: routed agents, Jev-class brains and the tools they run — decision models in production.",
};
export const FALLBACK_BLURB =
  "One slice of the live catalog at the sort of the tabs below — fund the work, and every run posts a public receipt.";

// The blurb for a category top ("" -> the catalog fallback line).
export function categoryBlurb(top: string): string {
  if (!top) return FALLBACK_BLURB;
  return CATEGORY_BLURBS[normCat(top)] ?? FALLBACK_BLURB;
}
