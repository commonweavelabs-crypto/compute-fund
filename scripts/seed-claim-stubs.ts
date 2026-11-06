// D2-CLAIM-FLOW seed runner: insert the UNCLAIMED pilot-target project stubs.
// Idempotent: a stub whose slug already exists is skipped (re-run safe).
// Run: node --experimental-strip-types scripts/seed-claim-stubs.ts
// cwd is set to app/ inside (db.ts resolves the DB + schema.sql from process.cwd()).
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(path.join(repoRoot, "app"));

const { ensureSystemUser, insertStubProject, projectBySlug, nextCfqId, newId, getDb } = await import(pathToFileURL(path.join(repoRoot, "app/lib/db.ts")).href);
const { PILOT_TARGET_STUBS } = await import(pathToFileURL(path.join(repoRoot, "app/lib/seeds.ts")).href);

const sys = ensureSystemUser();
console.log(`system user: ${sys.id} (cf_system)`);

// The claimed column lands via the lazy getDb()/schema-drift repair; make sure it runs.
getDb();
const claimedCol = getDb().prepare("SELECT COUNT(*) AS n FROM pragma_table_info('projects') WHERE name = 'claimed'").get() as { n: number };
if (claimedCol.n === 0) {
  console.error("FATAL: claimed column missing after drift repair.");
  process.exit(1);
}

let inserted = 0;
for (const stub of PILOT_TARGET_STUBS) {
  if (projectBySlug(stub.slug)) {
    console.log(`skip  ${stub.slug}  (slug exists — idempotent)`);
    continue;
  }
  insertStubProject({
    id: newId("prj"), cfq_id: nextCfqId(), owner_id: sys.id,
    slug: stub.slug, name: stub.name, one_liner: stub.one_liner,
    question: stub.question, data_inputs: stub.data_inputs, method: stub.method,
    deliverable: stub.deliverable, done_criteria: stub.done_criteria,
    falsified_by: stub.falsified_by, review_process: stub.review_process,
    budget_credits: stub.budget_credits, deadline: stub.deadline,
    assumptions: stub.assumptions, status: "active", repo_url: stub.repo_url, links: stub.links,
    owner_org_id: null, claimed: 0,
  });
  console.log(`seed  ${stub.slug}  -> ${stub.repo_url} (claimed=0)`);
  inserted++;
}

// Final state readback from the DB itself (ground truth, not console hopes).
const rows = getDb().prepare("SELECT slug, name, claimed, status, repo_url FROM projects WHERE slug IN ('tierllama','colibri','last30days','mirofish') ORDER BY slug").all();
console.log("\nREADBACK");
for (const r of rows) console.log(`  ${r.slug}  claimed=${r.claimed} status=${r.status} repo=${r.repo_url}`);
const missing = PILOT_TARGET_STUBS.filter(s => !rows.find(r => r.slug === s.slug));
if (missing.length) { console.error("MISSING:", missing.map(m => m.slug)); process.exit(1); }
console.log(`\ndone: inserted=${inserted}, stubs present=${rows.length}, unclaimed=${rows.filter((r: { claimed: number }) => r.claimed === 0).length}`);
