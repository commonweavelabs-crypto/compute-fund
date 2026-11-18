// D5.2 — PROJECT TAGS (Gui 11/18, the multi-tag decision): a project carries ONE
// primary category (the rail — unchanged) plus a machine-inferred tag set
// (projects.tags = JSON array, capped at 5, re-runnable whenever the project
// changes). Design (GitHub-topics analogy, eBay guard):
//   - tags = INFERRED from question/one-liner/category keywords by the same
//     keyword machinery that already classifies categories (never user-invented
//     strings at import; the creator may override at claim/edit later),
//   - the PRIMARY category is always tag #1 → the rail stays focused, no
//     "shows up on every category" spam,
//   - discoverability wiring: search hay() includes tags; /discover?tag= filters.
// Modular: TAG_SYNONYMS_EXT extends per-topic vocabulary without touching pages.
import { db, ensureSystemUser, insertStubProject, nextCfqId, newId, getDb } from "./db";
import { CATEGORY_TAXONOMY } from "./categories";

// extra vocabulary per tag-topic (beyond the category keyword lists)
const TAG_SYNONYMS_EXT: Record<string, string[]> = {
  hardware: ["verilog", "fpga", "hdl", "schematic", "pcb", "silicon", "firmware", "embedded", "chip"],
  marketing: ["marketing", "outreach", "social", "scheduler", "crm", "lead", "brand"],
  gaming: ["game", "gaming", "emu", "recomp", "decomp", "sprite", "console", "retro"],
  "3d": ["3d", "mesh", "blender", "sculpt", "scan", "render", "glb"],
  artcraft: ["photo", "photoshop", "illustrator", "paint", "psd", "vector", "editor"],
  audio: ["audio", "music", "synth", "daw", "sound"],
  home: ["home", "automation", "smart", "iot", "hue"],
  education: ["education", "learn", "study", "flashcard", "classroom"],
  finance: ["finance", "budget", "invoice", "erp", "expense"],
  video: ["video", "film", "premiere", "editing", "upscal"],
  productivity: ["productivity", "launcher", "notes", "todo", "dashboard"],
  research: ["research", "benchmark", "paper", "dataset", "eval"],
  security: ["security", "pentest", "malware", "reverse"],
  jev: ["jev", "routing", "agent", "router"],
  mcp: ["mcp", "server", "registry"],
};

// topic → keyword list (merge db.ts CATEGORY_KEYWORDS-ish topics + ext table).
// Keep here (not db.ts) so tags extend independently of category classification.
const TAG_VOCAB: Record<string, string[]> = (() => {
  const base: Record<string, string[]> = {
    "decision-models": ["decision", "router", "routing", "vote", "voting", "governance", "policy", "forecast", "jev", "classifier"],
    research: ["research", "study", "benchmark", "analysis", "science", "falsif", "corpus", "evaluation", "dataset", "paper", "reproduc"],
    video: ["video", "film", "documentary", "animation", "youtube", "thumbnail", "render", "caption", "premiere", "editing"],
    infrastructure: ["infrastructure", "infra", "gateway", "api", "library", "framework", "protocol", "compute", "llm"],
    wellness: ["wellness", "health", "sleep", "fitness", "nutrition"],
    tools: ["tool", "utility", "plugin", "extension", "editor", "app"],
    hardware: ["verilog", "fpga", "hdl", "schematic", "pcb", "silicon", "firmware", "embedded", "chip", "kicad", "yosys"],
    marketing: ["marketing", "outreach", "social", "scheduler", "crm", "email", "mail", "lead", "brand"],
    gaming: ["game", "gaming", "emu", "emulator", "recomp", "decomp", "sprite", "console", "retro", "port"],
    modding: ["mod", "trainer", "overlay", "patch", "map pack"],
    "3d": ["3d", "mesh", "blender", "sculpt", "photogram", "scan", "glb", "gltf"],
    robotics: ["robot", "drone", "printer", "ros", "servo"],
    commons: ["public domain", "preservation", "archive", "fonts", "commons"],
    artcraft: ["photo", "photoshop", "illustrator", "paint", "psd", "vector", "editor", "lightroom"],
    audio: ["audio", "music", "synth", "daw", "sound", "midi"],
    home: ["home", "automation", "smart", "iot", "hue"],
    education: ["education", "learn", "study", "flashcard", "classroom", "lms"],
    finance: ["finance", "budget", "invoice", "erp", "expense"],
    security: ["security", "pentest", "malware", "reverse", "decompile", "static analysis"],
    jev: ["jev", "routing", "router", "agent"],
    mcp: ["mcp", "registry", "plugin"],
    productivity: ["productivity", "launcher", "notes", "todo", "dashboard", "task"],
    bigtech: ["meta", "google", "microsoft", "openai", "model"],
  };
  for (const [k, extra] of Object.entries(TAG_SYNONYMS_EXT)) {
    const set = new Set([...(base[k] ?? []), ...extra]); base[k] = [...set];
  }
  return base;
})();

// inferTags: score topics by keyword hits (question + one-liner + the row's own
// category is anchor #1). Primary category first, then by hit count, cap 5.
export function inferTags(opts: { question?: string | null; oneLiner?: string | null; category?: string | null; subcategory?: string | null }): string[] {
  const hay = `${opts.question ?? ""} ${opts.oneLiner ?? ""} ${opts.subcategory ?? ""}`.toLowerCase()
    .replace(/-/g, " ");
  const scored: Array<[string, number]> = [];
  for (const [topic, words] of Object.entries(TAG_VOCAB)) {
    let n = 0;
    for (const w of words) {
      if (w.includes(" ")) { if (hay.includes(w)) n += 2; }
      else if (new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(hay)) n += 1.2;
    }
    if (n > 0) scored.push([topic, n]);
  }
  // anchor: the row's own category first (its topic tag always leads)
  const anchor = opts.category ? opts.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") : null;
  scored.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const rest = scored.map((s) => s[0]).filter((t) => t !== anchor).slice(0, 4);
  return anchor ? [anchor, ...rest] : rest.slice(0, 5);
}

// refreshTags(slug): re-run inference on the CURRENT fields (project changes
// over time → tags drift with it; the engine re-runs, the creator may override).
export function refreshTags(slug: string): string[] | null {
  try {
    const r = db.prepare(`SELECT question, one_liner, category, subcategory FROM projects WHERE slug = ?`).get(slug) as
      | { question: string | null; one_liner: string | null; category: string | null; subcategory: string | null }
      | undefined;
    if (!r) return null;
    const tags = inferTags(r);
    db.prepare(`UPDATE projects SET tags = ? WHERE slug = ?`).run(JSON.stringify(tags), slug);
    return tags;
  } catch { return null; }
}

// one-shot backfill over the whole engine (idempotent)
export function backfillTags(): number {
  ensureSystemUser(); getDb();
  const rows = db.prepare(`SELECT slug FROM projects WHERE tags IS NULL OR tags = ''`).all() as Array<{ slug: string }>;
  let n = 0;
  for (const r of rows) { if (refreshTags(r.slug)) n++; }
  return n;
}

// -- schema wiring ------------------------------------------------------------
export function ensureTagsColumn(): void {
  getDb();
  const col = db.prepare(`SELECT name FROM pragma_table_info('projects') WHERE name = 'tags'`).get();
  if (!col) db.exec(`ALTER TABLE projects ADD COLUMN tags TEXT`);
  const ix = db.prepare(`SELECT name FROM pragma_table_info('projects') WHERE name = 'id'`).get(); // sentinel
  void ix;
}
