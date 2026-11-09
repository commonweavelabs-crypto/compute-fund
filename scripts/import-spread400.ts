// SPREAD-400 IMPORT — 887 curated rows (Gui "import ALL of them" overnight run).
// Categories mapped per lane (productivity/3d/robotics/bigtech) with sub heuristics.
// Same stub mechanics as every sprint import; meta backfill runs after.
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(path.join(repoRoot, "app"));
const { ensureSystemUser, insertStubProject, nextCfqId, newId, getDb } = await import(pathToFileURL(path.join(repoRoot, "app/lib/db.ts")).href);
getDb();
const D = JSON.parse((await import("node:fs")).readFileSync("C:/Users/Guilherme/AppData/Local/hermes/projects/compute-fund/docs/spread400-final.json", "utf-8")) as { rows: Array<Record<string, any>> };
const haveSlug = new Set((getDb().prepare("SELECT slug FROM projects").all() as { slug: string }[]).map(r => r.slug));
const kebab = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
let imported = 0, skipped = 0;
ensureSystemUser();
for (const r of D.rows) {
  let slug = kebab(r.name);
  const url = r.url as string;
  if (haveSlug.has(slug)) {
    // collision (two repos with the same base name): owner-prefixed unique slug
    const alt = kebab(`${r.full_name.split("/")[0]}-${r.name}`);
    if (haveSlug.has(alt)) { skipped++; continue; }
    slug = alt;
  }
  haveSlug.add(slug);
  const lic = r.license as string;
  const stars = r.stars as number;
  const desc = String(r.desc ?? "").replace(/["\\\n]/g, " ").slice(0, 180);
  const pushed = r.pushed as string ?? "unknown";
  const lang = r.language ?? "";
  const oneLiner = `${slug} — ${desc} (${lic.toUpperCase()}, ${stars.toLocaleString("en-US")} stars, ${lang || "multi-language"}, last push ${pushed}). Imported from GitHub per the platform import law; claim by the repo owner or request takedown within 48h.`;
  const projId = newId("prj");
  insertStubProject({
    id: projId, cfq_id: nextCfqId(), owner_id: ensureSystemUser().id,
    slug, name: slug,
    one_liner: oneLiner,
    question: `Adopt ${slug} on Compute Fund as its maintainer: what is the first milestone you will ship, and what artifact proves it's done?`,
    data_inputs: `upstream repo ${r.full_name} (${lic}) + README/license facts + maintainer's own milestone plan`,
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
  getDb().prepare(`UPDATE projects SET category=?, subcategory=? WHERE slug=?`)
    .run(r.category ?? null, r.subcategory ?? null, slug);
  imported++;
}
const all = getDb().prepare("SELECT count(*) AS n FROM projects").get() as { n: number };
console.log(`ENGINE: ${all.n} | imported=${imported} skipped=${skipped}`);
