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
  ["big-tok-", "cf-big-tok-qb5n.png"],
  ["cap-drain-", "cf-nvlabs-longlive.png"],
  ["loop-verify-s2-", "cf-microsoft-skill-recorder.png"],
  ["dbg-run-", "cf-leo-lilinxiao-codex-autoresear.png"],
  ["d3-test-flow-", "opensandbox.png"],
  // import batch 1 + 1b + claim-era rows — per-slug cf-<slug>.png plates map
  // (Gui 11/8: "are the images completed?" — completing the map for every slug
  // whose plate exists in public/project-art; unlisted slugs keep the default).
  ["anyscene", "cf-anyscene.png"],
  ["awesome-gamedev-agent-skills", "cf-awesome-gamedev-agent-skills.png"],
  ["awesome-opus5-5-videos", "cf-awesome-opus5-5-videos.png"],
  ["burrow", "cf-burrow.png"],
  ["claude-code-game-studios", "cf-claude-code-game-studios.png"],
  ["claude-mem", "cf-claude-mem.png"],
  ["concat", "cf-concat.png"],
  ["deepinfer", "cf-deepinfer.png"],
  ["design-md-chrome", "cf-design-md-chrome.png"],
  ["domain-digger", "cf-domain-digger.png"],
  ["donkey", "cf-donkey.png"],
  ["floorplan", "cf-floorplan.png"],
  ["freevideo", "cf-freevideo.png"],
  ["gleaner", "cf-gleaner.png"],
  ["hallmark", "cf-hallmark.png"],
  ["hindsight", "cf-hindsight.png"],
  ["idol-sdk", "cf-idol-sdk.png"],
  ["img2threejs", "cf-img2threejs.png"],
  ["jantt", "cf-jantt.png"],
  ["jev-ultrafast", "cf-jev-ultrafast.png"],
  ["kinocut", "cf-kinocut.png"],
  ["lemo-opuscar", "cf-lemo-opuscar.png"],
  ["lightswind-ui-library", "cf-lightswind-ui-library.png"],
  ["mg-styles-15", "cf-mg-styles-15.png"],
  ["minutes", "cf-minutes.png"],
  ["on-page-seo", "cf-on-page-seo.png"],
  ["opencompany", "cf-opencompany.png"],
  ["openfilm", "cf-openfilm.png"],
  ["openmontage", "cf-openmontage.png"],
  ["opensandbox", "cf-opensandbox.png"],
  ["pixelfx", "cf-pixelfx.png"],
  ["rag-anything", "cf-rag-anything.png"],
  ["raven", "cf-raven.png"],
  ["reanimate", "cf-reanimate.png"],
  ["recomplauncher", "cf-recomplauncher.png"],
  ["shisei", "cf-shisei.png"],
  ["simple-jev", "cf-simple-jev.png"],
  ["stickman-video-director", "cf-stickman-video-director.png"],
  ["terminal-mac", "cf-terminal-mac.png"],
  ["twindesk", "cf-twindesk.png"],
  ["voicestudio", "cf-voicestudio.png"],
  // batch 1b + claim-era rows generated 2026-11-08 (Z-Image-Turbo, dark-tech
  // themed per project; QA-passed, no text/logos per the no-logo law)
  ["latentsync", "cf-latentsync.png"],
  ["warlock-studio", "cf-warlock-studio.png"],
  ["rea-video", "cf-rea-video.png"],
  ["comfyui-video-ui", "cf-comfyui-video-ui.png"],
];

// Returns a web path under /project-art/ for any slug; never throws, falls
// back to ART_DEFAULT so an unknown future project still shows sane art.
export function artFor(slug: string): string {
  for (const [prefix, file] of ART_MAP) {
    if (slug.startsWith(prefix)) return `/project-art/${file}`;
  }
  return `/project-art/${ART_DEFAULT}`;
}

// Thumb helper: any art web path (/project-art/<file>.png) → its prebuilt lazy
// thumb (/project-art/thumb/<file>.jpg — 800px wide, ~30-75KB vs ~1.2MB png).
// Accepts the artFor() web path so callers never touch file names directly;
// the hero thumb (800x363) carries its own dedicated constant below.
export function artThumb(webPath?: string | null): string {
  const file = (webPath ?? "").split("/").pop() || ART_DEFAULT;
  const stem = file.replace(/\.[a-z0-9]+$/i, "");
  return `/project-art/thumb/${stem}.jpg`;
}

// Intrinsic thumb dimensions for the img width/height attributes (CLS law):
// every project-art thumb renders at 800x547; hero.jpg is the 800x363 crop.
export const THUMB_W = 800;
export const THUMB_H = 547;
export const HERO_THUMB = {
  src: "/project-art/thumb/hero.jpg",
  w: 800,
  h: 363,
} as const;
