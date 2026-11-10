// SPOT IMPORT: SupaCraft (attisvalentin/supacraft) - Gui velocity add 11/9.
// MIT, Go single binary: declarative supacraft.json -> REST API + MCP server
// (~16 tools) for coding agents. Category productivity / agent dashboards.
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(path.join(repoRoot, "app"));
const { ensureSystemUser, insertStubProject, nextCfqId, newId, getDb } = await import(pathToFileURL(path.join(repoRoot, "app/lib/db.ts")).href);
const db = getDb();
if (db.prepare("SELECT 1 FROM projects WHERE slug='supacraft'").get()) {
  console.log("already present"); process.exit(0);
}
const url = "https://github.com/attisvalentin/supacraft";
const oneLiner = "SupaCraft — an AI-native backend in one small Go binary: describe your tables, permissions, auth, endpoints, cron jobs, file uploads, emails and webhooks in a single supacraft.json, and it serves both a REST API and an MCP server (~16 tools) so a coding agent like Claude Code builds and edits the whole backend (MIT; self-hosted, runs on a $5 VPS; created Oct 29 2026, actively pushed).Gui's velocity add below the star floor - his call. Claim by the repo owner or request takedown within 48h.";
const projId = newId("prj");
insertStubProject({
  id: projId, cfq_id: nextCfqId(), owner_id: ensureSystemUser().id,
  slug: "supacraft", name: "SupaCraft",
  one_liner: oneLiner,
  question: "Adopt SupaCraft as its maintainer: what is the first milestone you will ship, and what artifact proves it's done?",
  data_inputs: "upstream repo attisvalentin/supacraft (MIT) + README/license facts + maintainer's own milestone plan",
  method: JSON.stringify(["github-repo-verification", "maintainer-claim"]),
  deliverable: "first claimed milestone with a verifiable artifact (repo-linked or uploaded, sha256-stamped receipt)",
  done_criteria: "maintainer claim verified (GitHub ownership check) + milestone receipt minted with a verifiable artifact",
  falsified_by: "silent claim without ownership proof; milestone closed without a verifiable artifact",
  review_process: "peer review on the milestone artifact per charter review_process defaults",
  budget_credits: 0, deadline: "",
  assumptions: "maintainer identity unverified until claim; takedown request honored within 48h (hide, never delete receipts)",
  status: "active", repo_url: url,
  links: JSON.stringify([{ label: "upstream repo", url }]),
  owner_org_id: null, claimed: 0,
});
db.prepare(`UPDATE projects SET category='productivity', subcategory='agent dashboards' WHERE slug='supacraft'`).run();
const all = db.prepare("SELECT count(*) AS n FROM projects").get() as { n: number };
console.log("supacraft imported | ENGINE:", all.n);
