// PD REVIVAL IMPORT — 60 public-domain works (archive.org, ≤1930 US publication,
// downloads = community-interest metric; Gui GO 11/8). Campaign-shaped stubs:
// no repo_url (artifact-upload method), poster = downloaded archive.org item image
// served locally (public/u/pd-*.jpg), provenance + takedown law in assumptions.
// Run: node --experimental-strip-types scripts/import-pd-revival.ts
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(path.join(repoRoot, "app"));
const { ensureSystemUser, insertStubProject, nextCfqId, newId, getDb } = await import(pathToFileURL(path.join(repoRoot, "app/lib/db.ts")).href);
getDb();
const D = JSON.parse((await import("node:fs")).readFileSync("C:/Users/Guilherme/AppData/Local/hermes/cache/scratch/pd-rows.json", "utf-8")) as { rows: Array<Record<string, any>> };
const haveSlug = new Set((getDb().prepare("SELECT slug FROM projects").all() as { slug: string }[]).map(r => r.slug));

let imported = 0, skipped = 0;
ensureSystemUser();
for (const r of D.rows) {
  if (haveSlug.has(r.slug)) { console.log(`skip ${r.slug}`); skipped++; continue; }
  const projId = newId("prj");
  insertStubProject({
    id: projId, cfq_id: nextCfqId(), owner_id: ensureSystemUser().id,
    slug: r.slug, name: r.title,
    one_liner: r.one_liner,
    question: r.question,
    data_inputs: r.data_inputs,
    method: r.method,
    deliverable: r.deliverable,
    done_criteria: r.done_criteria,
    falsified_by: r.falsified_by,
    review_process: r.review_process,
    budget_credits: 0, deadline: "",
    assumptions: r.assumptions,
    status: "active", repo_url: null,
    links: r.links,
    owner_org_id: null, claimed: 0,
  });
  getDb().prepare(`UPDATE projects SET category='commons', subcategory='public-domain revival', logo_path=? WHERE slug=?`)
    .run(r.poster_local ?? null, r.slug);
  imported++;
}
const all = getDb().prepare("SELECT count(*) AS n, sum(claimed = 0) AS unclaimed FROM projects").get() as { n: number; unclaimed: number };
console.log(`ENGINE: total=${all.n} unclaimed=${all.unclaimed} | pd_imported=${imported} skipped=${skipped}`);
