// SPRINT IMPORT 200 (2026-11-08): 50 wellness + 50 modding + 5 security.
// Gui-approved ("in poor[ort]" = import) via Telegram. Same shape law as batch-1:
// charter-shaped adopt-first-milestone stubs, claimed=0, sys owner, takedown law.
// Categories are HAND-ASSIGNED per project function (wellness subs from
// focus&habits/tracking/sound&sleep; modding subs where confident; security top NEW
// per Gui's create-category-not-drop law). Reads docs/sprint200-final-2026-11-08.json.
// Run from repo root: node --experimental-strip-types scripts/import-sprint-200.ts
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(path.join(repoRoot, "app"));

const { ensureSystemUser, insertStubProject, nextCfqId, newId, getDb } = await import(pathToFileURL(path.join(repoRoot, "app/lib/db.ts")).href);
getDb();

const D = JSON.parse(readFileSync(path.join(repoRoot, "docs", "sprint200-final-2026-11-08.json"), "utf-8")) as { rows: Array<Record<string, any>> };

const dbRows = getDb().prepare("SELECT slug, repo_url FROM projects").all() as { slug: string; repo_url: string | null }[];
const haveSlug = new Set(dbRows.map(r => r.slug));
const haveRepo = new Set(dbRows.map(r => (r.repo_url ?? "").replace(/\/$/, "").toLowerCase()));

const kebab = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

let imported = 0, skipped = 0, failed = 0;
ensureSystemUser();
for (const r of D.rows) {
  const repoSlug = r.full_name as string;
  const name = repoSlug.split("/")[1];
  const slug = kebab(name);
  const url = `https://github.com/${repoSlug}`;
  if (haveSlug.has(slug) || haveRepo.has(url.toLowerCase())) {
    console.log(`skip  ${slug}`);
    skipped++;
    continue;
  }
  const lic = (r.license as string) ?? "unverified";
  const stars = (r.stars as number) ?? 0;
  const desc = String(r.desc ?? "").replace(/["\\\n]/g, " ").slice(0, 200);
  const pushed = (r.pushed as string) ?? "unknown";
  const oneLiner = `${name} — ${desc} (${lic.toUpperCase()}, ${stars.toLocaleString("en-US")} stars, last push ${pushed}). Imported UNCLAIMED from upstream — discoverable, fundable, forkable; claim by the repo owner or request takedown per platform law.`;
  try {
    const { category, subcategory, ...insertRow } = r as Record<string, any>;
    // insertStubProject's INSERT column list has no category/subcategory — a
    // stray named param breaks the bind (proven 11/8). Insert bare, then set
    // the HAND-assigned categories explicitly (overriding the naive guess).
    const projId = String((r as any).slug);
    insertStubProject({
      id: newId("prj"), cfq_id: nextCfqId(), owner_id: ensureSystemUser().id,
      slug, name,
      one_liner: oneLiner,
      question: `Adopt ${name} on Compute Fund as its maintainer: what is the first milestone you will ship, and what artifact proves it's done?`,
      data_inputs: `upstream repo ${repoSlug} (${lic}) + README/license facts + maintainer's own milestone plan`,
      method: JSON.stringify(["github-repo-verification", "maintainer-claim"]),
      deliverable: "first claimed milestone with a verifiable artifact (repo-linked or uploaded, sha256-stamped receipt)",
      done_criteria: "maintainer claim verified (GitHub ownership check) + milestone receipt minted with a verifiable artifact",
      falsified_by: "silent claim without ownership proof; milestone closed without a verifiable artifact",
      review_process: "peer review on the milestone artifact per charter review_process defaults",
      budget_credits: 0, deadline: "",
      assumptions: "maintainer identity unverified until claim; takedown request honored within 48h (hide, never delete receipts)",
      status: "active", repo_url: url,
      links: JSON.stringify([{ label: "upstream repo", url }]),
      // (category + subcategory are set by the explicit UPDATE below — the
      // hand-assigned values override the naive guess; see import notes.)
      owner_org_id: null, claimed: 0,
    });
    getDb().prepare(`UPDATE projects SET category=?, subcategory=? WHERE slug=?`)
      .run(category ?? null, subcategory ?? null, slug);
    imported++;
  } catch (e) {
    console.log(`FAIL  ${slug}: ${(e as Error).message.slice(0, 100)}`);
    failed++;
  }
}

const all = getDb().prepare("SELECT count(*) AS n, sum(claimed = 0) AS unclaimed FROM projects").get() as { n: number; unclaimed: number };
const cats = getDb().prepare("SELECT category AS c, COUNT(*) AS n FROM projects WHERE status='active' GROUP BY category ORDER BY n DESC").all();
console.log(`\nENGINE: total=${all.n} unclaimed=${all.unclaimed} | sprint_imported=${imported} skipped=${skipped} failed=${failed}`);
console.log("categories:", cats.map((c: any) => `${c.c}:${c.n}`).join("  "));
