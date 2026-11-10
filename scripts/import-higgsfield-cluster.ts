// HIGGSFIELD CLUSTER IMPORT (Gui 11/9: "import the entire cluster"): 4 lawful
// license-verified rows from the AI-studio wave (the unlicensed wide-trace/
// open-higgsfield stays OUT per import law). New mcp category receives the
// MCP-wrapper row as its first citizen.
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(path.join(repoRoot, "app"));
const { ensureSystemUser, insertStubProject, nextCfqId, newId, getDb } = await import(pathToFileURL(path.join(repoRoot, "app/lib/db.ts")).href);
const db = getDb();

const CL = JSON.parse((await import("node:fs")).readFileSync("C:/Users/Guilherme/AppData/Local/hermes/cache/scratch/higgsfield-cluster.json", "utf-8")) as Record<string, Record<string, any>>;
const ROWS: Array<{ key: string; slug: string; cat: string; sub: string; extra?: string }> = [
  { key: "openjutsu", slug: "openjutsu", cat: "video", sub: "editing" },
  { key: "hf-prompt-skill", slug: "higgsfield-ai-prompt-skill", cat: "tools", sub: "agent skills" },
  { key: "higgsfield-mcp", slug: "higgsfield-mcp-unified", cat: "mcp", sub: "servers" },
  { key: "oshiggsfield-lucataco", slug: "open-source-higgsfield", cat: "video", sub: "creation" },
  { key: "openstudio", slug: "openstudio", cat: "tools", sub: "design" },
];
const haveSlug = new Set((db.prepare("SELECT slug FROM projects").all() as { slug: string }[]).map(r => r.slug));
let n = 0;
for (const row of ROWS) {
  if (haveSlug.has(row.slug)) { console.log("skip", row.slug); continue; }
  const d = CL[row.key];
  const full = { "openjutsu": "D3voz/openjutsu", "hf-prompt-skill": "OSideMedia/higgsfield-ai-prompt-skill", "higgsfield-mcp": "Hikhakk/higgsfield-mcp-unified", "oshiggsfield-lucataco": "lucataco/open-source-higgsfield", "openstudio": "clawnify/OpenStudio" }[row.key]!;
  const url = `https://github.com/${full}`;
  const lic = String(d.license).toUpperCase();
  const stars = Number(d.stars);
  const desc = String(d.desc ?? "").replace(/["\\\n]/g, " ").slice(0, 170);
  const oneLiner = `${row.slug} — ${desc} (${lic}, ${stars.toLocaleString("en-US")} stars, ${d.lang ?? "multi"}, last push ${d.pushed}). From the Higgsfield-alternative cluster vetted from Gui's 2026-11-09 reel (the unlicensed 5.5K-star shell was excluded; these carry real licenses). Claim by the repo owner or request takedown within 48h.`;
  const projId = newId("prj");
  insertStubProject({
    id: projId, cfq_id: nextCfqId(), owner_id: ensureSystemUser().id,
    slug: row.slug, name: row.slug,
    one_liner: oneLiner,
    question: `Adopt ${row.slug} on Compute Fund as its maintainer: what is the first milestone you will ship, and what artifact proves it's done?`,
    data_inputs: `upstream repo ${full} (${lic}) + README/license facts + maintainer's own milestone plan`,
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
  db.prepare(`UPDATE projects SET category=?, subcategory=? WHERE slug=?`).run(row.cat, row.sub, row.slug);
  n++;
}
const all = db.prepare("SELECT count(*) AS n FROM projects").get() as { n: number };
console.log(`imported=${n} | ENGINE: ${all.n}`);
