// TWO SPOT IMPORTS (Gui 11/8): Crest (the reel he shared — velocity add despite
// being under the star floor, HIS call) + Openbar (the agent-dashboard sibling
// he asked about). Both GPL-3.0. Category: productivity (new top category).
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(path.join(repoRoot, "app"));
const { ensureSystemUser, insertStubProject, nextCfqId, newId, getDb } = await import(pathToFileURL(path.join(repoRoot, "app/lib/db.ts")).href);
getDb();

const haveSlug = new Set((getDb().prepare("SELECT slug FROM projects").all() as { slug: string }[]).map(r => r.slug));
const rows = [
  {
    slug: "crest", name: "Crest",
    repo: "https://github.com/andrealo20/crest",
    stars: "97", pushed: "2026-11-07",
    one: "Crest — a dynamic island/notch for Windows & macOS that opens on hover, click or Ctrl+Alt+Space and holds ~30 toggled widgets: music controls, live lyrics, screen capture, terminal, system monitor, plugins (Tauri: Rust+React, GPL-3.0, free, no account; 97 stars and pushing daily since Nov 1 2026). Shared by Gui as a velocity add below the star floor — his call. Claim by the repo owner or request takedown per platform law.",
    q: "Adopt Crest as its maintainer: what is the first milestone you will ship, and what artifact proves it's done?",
    data: "upstream repo andrealo20/crest (GPL-3.0) + README/license facts + maintainer's own milestone plan",
    del: "first claimed milestone with a verifiable artifact (repo-linked or uploaded, sha256-stamped receipt)",
    done: "maintainer claim verified (GitHub ownership check) + milestone receipt minted with a verifiable artifact",
    fals: "silent claim without ownership proof; milestone closed without a verifiable artifact",
    cat: "productivity", sub: "desktop apps",
  },
  {
    slug: "openbar", name: "Openbar",
    repo: "https://github.com/MF-DEEV/Openbar",
    stars: "17", pushed: "unknown",
    one: "Openbar — a dynamic-island bar for your AI agents: Claude Code, Codex and more pinned in a screen-edge notch so agent status and actions stay one glance away (GPL-3.0; early, 17 stars). The agent-dashboard edge of the dynamic-island trend cluster. Claim by the repo owner or request takedown per platform law.",
    q: "Adopt Openbar as its maintainer: what is the first milestone you will ship, and what artifact proves it's done?",
    data: "upstream repo MF-DEEV/Openbar (GPL-3.0) + README/license facts + maintainer's own milestone plan",
    del: "first claimed milestone with a verifiable artifact (repo-linked or uploaded, sha256-stamped receipt)",
    done: "maintainer claim verified (GitHub ownership check) + milestone receipt minted with a verifiable artifact",
    fals: "silent claim without ownership proof; milestone closed without a verifiable artifact",
    cat: "productivity", sub: "agent dashboards",
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
  getDb().prepare(`UPDATE projects SET category=?, subcategory=? WHERE slug=?`).run(r.cat, r.sub, r.slug);
  n++;
}
const all = getDb().prepare("SELECT count(*) AS n FROM projects").get() as { n: number };
console.log(`ENGINE: ${all.n} rows | imported: ${n}`);
