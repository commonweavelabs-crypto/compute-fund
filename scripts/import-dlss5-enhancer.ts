// TWO SPOT IMPORTS (Gui's order 2026-11-18: "if it is, import it to compute fund too" —
// the DLSS 5 Visual Enhancer he uses for video post-processing + its ComfyUI node pack).
// License-verified: app LICENSE = MIT (c) 2026 Merserk (read from this machine's install);
// node = MIT per its repo docs. App = 1940 stars (above the 400 floor); node = 329 stars
// (below the 400 floor — Gui's standing spot-import exception, his call, noted in the row).
// Provenance: local install verified working (runtime flat layout, dlssnr NVIDIA-signed
// 6EB209E7, Sept 2026 batch history on this machine) + GitHub API 2026-11-18.
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(path.join(repoRoot, "app"));
const { ensureSystemUser, insertStubProject, nextCfqId, newId, getDb } = await import(pathToFileURL(path.join(repoRoot, "app/lib/db.ts")).href);
getDb();

const haveSlug = new Set((getDb().prepare("SELECT slug FROM projects").all() as { slug: string }[]).map(r => r.slug));
const rows = [
  {
    slug: "dlss5-visual-enhancer", name: "DLSS 5 Visual Enhancer",
    repo: "https://github.com/Merserk/dlss5-visual-enhancer",
    stars: "1940", pushed: "2026-11-16",
    one: "DLSS 5 Visual Enhancer — a portable, drag-and-drop Windows app that applies NVIDIA's native NGX neural renderer (DLSS 5 Neural Rendering, feature 18) offline to image and video files: upscaling, RTX Video Super Resolution, HDR and frame generation with batch export (MIT, 1940 stars, pushed Nov 2026; runs on RTX 30/40/50 on-device, no cloud). Independent, not affiliated, creator has not endorsed this. Verified working on this platform's workstation before import (runtime layout validated, NVIDIA-signed runtime, real Sept 2026 enhancement batches in its logs). Claim by the repo owner or request takedown per platform law.",
    q: "Adopt DLSS 5 Visual Enhancer as its maintainer: what is the first milestone you will ship, and what artifact proves it's done?",
    data: "upstream repo Merserk/dlss5-visual-enhancer (MIT) + LICENSE read + GitHub API facts 2026-11-18 (1940 stars, pushed Nov 16 2026)",
    del: "first claimed milestone with a verifiable artifact (repo-linked or uploaded, sha256-stamped receipt)",
    done: "maintainer claim verified (GitHub ownership check) + milestone receipt minted with a verifiable artifact",
    fals: "silent claim without ownership proof; milestone closed without a verifiable artifact",
    cat: "video", sub: "upscaling & restoration",
  },
  {
    slug: "comfyui-dlss5-enhancer", name: "ComfyUI DLSS 5 Enhancer",
    repo: "https://github.com/Blueforcer/ComfyUI-DLSS5-Enhancer",
    stars: "329", pushed: "2026-09-02",
    one: "ComfyUI DLSS 5 Enhancer — ComfyUI nodes that drive NVIDIA's native NGX feature-18 renderer through a self-hosted D3D12 worker so AI-video renders get DLSS 5 enhancement as an opt-in post-process on RTX 30/40/50 (MIT; 329 stars, SPOT IMPORT below the 400-star floor by Gui's order 2026-11-18 — the exact node pair used to route Compute Fund video batches through DLSS 5 offline). Independent, not affiliated, creator has not endorsed this. Claim by the repo owner or request takedown per platform law.",
    q: "Adopt ComfyUI DLSS 5 Enhancer as its maintainer: what is the first milestone you will ship, and what artifact proves it's done?",
    data: "upstream repo Blueforcer/ComfyUI-DLSS5-Enhancer (MIT) + GitHub API facts 2026-11-18 (329 stars, pushed Sep 2 2026) + local selftest history",
    del: "first claimed milestone with a verifiable artifact (repo-linked or uploaded, sha256-stamped receipt)",
    done: "maintainer claim verified (GitHub ownership check) + milestone receipt minted with a verifiable artifact",
    fals: "silent claim without ownership proof; milestone closed without a verifiable artifact",
    cat: "video", sub: "editing & tooling",
  },
];
let n = 0;
for (const r of rows) {
  if (haveSlug.has(r.slug)) { console.log("skip", r.slug); continue; }
  const projId = newId("prj");
  insertStubProject({
    id: projId, cfq_id: nextCfqId(), owner_id: ensureSystemUser().id,
    slug: r.slug, name: r.name,
    one_liner: r.one,
    question: r.q,
    data_inputs: r.data,
    method: JSON.stringify(["github-repo-verification", "maintainer-claim"]),
    deliverable: r.del,
    done_criteria: r.done,
    falsified_by: r.fals,
    review_process: "peer review on the milestone artifact per charter review_process defaults",
    budget_credits: 0, deadline: "",
    assumptions: "maintainer identity unverified until claim; takedown request honored within 48h (hide, never delete receipts)",
    status: "active", repo_url: r.repo,
    links: JSON.stringify([{ label: "upstream repo", url: r.repo }]),
    owner_org_id: null, claimed: 0,
  });
  getDb().prepare("UPDATE projects SET category=?, subcategory=? WHERE slug=?").run(r.cat, r.sub, r.slug);
  n++;
  console.log("imported", r.slug, projId);
}
console.log("done:", n, "imported");
const readback = getDb().prepare("SELECT slug, cfq_id, category, subcategory, repo_url FROM projects WHERE slug LIKE 'dlss5-visual-enhancer' OR slug = 'comfyui-dlss5-enhancer'").all();
console.log(JSON.stringify(readback, null, 1));
