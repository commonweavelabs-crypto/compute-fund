// SHOWCASE IMPORT: the ArtCraft suite (storytold org) — Gui-approved front-page
// shelf. Apache-2.0 throughout; per-app logo_path = the suite's own dual-licensed
// icons (assets/app-icons, Apache/MIT — saved to public/u/artcraft-*.png with the
// LICENSE files parked in docs/). Every row ships staff_pick=1 (the front-page
// Staff picks row = Gui's shelf) + category artcraft.
// Run: node --experimental-strip-types scripts/import-artcraft.ts
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(path.join(repoRoot, "app"));
const { ensureSystemUser, insertStubProject, nextCfqId, newId, getDb } = await import(pathToFileURL(path.join(repoRoot, "app/lib/db.ts")).href);
getDb();
const D = JSON.parse(readFileSync(path.join(repoRoot, "docs", "sprint-artcraft-final.json"), "utf-8")) as { rows: Array<Record<string, any>> };
const dbRows = getDb().prepare("SELECT slug, repo_url FROM projects").all() as { slug: string; repo_url: string | null }[];
const haveSlug = new Set(dbRows.map(r => r.slug));
const haveRepo = new Set(dbRows.map(r => (r.repo_url ?? "").replace(/\/$/, "").toLowerCase()));
const kebab = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
let imported = 0, skipped = 0;
ensureSystemUser();
for (const r of D.rows) {
  const repoSlug = r.full_name as string;
  const name = repoSlug.split("/")[1];
  const slug = kebab(name);
  const url = `https://github.com/${repoSlug}`;
  if (haveSlug.has(slug) || haveRepo.has(url.toLowerCase())) { console.log(`skip ${slug}`); skipped++; continue; }
  const lic = (r.license as string) ?? "unverified";
  const stars = (r.stars as number) ?? 0;
  const desc = String(r.desc ?? "").replace(/["\\\n]/g, " ").slice(0, 200);
  const pushed = (r.pushed as string) ?? "unknown";
  const oneLiner = `${name} — ${desc} (Apache-2.0, ${stars.toLocaleString("en-US")} stars, last push ${pushed}). ArtCraft suite flagship — clean-room creative app from the storytold org; claim by the repo owner or request takedown per platform law.`;
  const projId = newId("prj");
  insertStubProject({
    id: projId, cfq_id: nextCfqId(), owner_id: ensureSystemUser().id,
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
    links: JSON.stringify([{ label: "upstream repo", url }, { label: "suite", url: "https://getartcraft.com" }]),
    owner_org_id: null, claimed: 0,
  });
  getDb().prepare(`UPDATE projects SET category=?, subcategory=?, staff_pick=1, logo_path=? WHERE slug=?`)
    .run(r.category ?? "artcraft", r.subcategory ?? null, r.logo ?? null, slug);
  imported++;
}
const all = getDb().prepare("SELECT count(*) AS n, sum(claimed = 0) AS unclaimed FROM projects").get() as { n: number; unclaimed: number };
console.log(`ENGINE: total=${all.n} unclaimed=${all.unclaimed} | artcraft_imported=${imported} skipped=${skipped}`);
