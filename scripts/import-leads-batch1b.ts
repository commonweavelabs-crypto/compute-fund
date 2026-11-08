// BATCH IMPORT 1b 2026-11-08: the 2 INACTIVE grade-A leads batch-1 skipped
// (6-month activity filter). Same shape law as batch-1; dedupe by slug+repo_url
// makes every already-imported row a skip, so this imports exactly the missing 2:
//   bytedance/LatentSync (⭐6255, Apache-2.0, pushed 2025-06-20)
//   Ivan-Ayub97/Warlock-Studio (⭐258, MIT, pushed 2026-03-17)
// Gui 11/8: "if not all imported, let's make them go live there."
// Run from repo root: node --experimental-strip-types scripts/import-leads-batch1b.ts
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(path.join(repoRoot, "app"));

const { ensureSystemUser, insertStubProject, projectBySlug, nextCfqId, newId, getDb } = await import(pathToFileURL(path.join(repoRoot, "app/lib/db.ts")).href);
getDb(); // run schema drift repair before any queries

const leadsRaw = JSON.parse(readFileSync(path.join(repoRoot, "docs", "leads-2026-11-06.json"), "utf-8"));
const meta = JSON.parse(readFileSync(path.join(repoRoot, "scripts", "leads-github-meta.json"), "utf-8")) as Record<string, { stars?: number; license?: string; pushed?: string; desc?: string; archived?: boolean }>;

const dbRows = getDb().prepare("SELECT slug, repo_url FROM projects").all() as { slug: string; repo_url: string | null }[];
const haveSlug = new Set(dbRows.map(r => r.slug));
const haveRepo = new Set(dbRows.map(r => (r.repo_url ?? "").replace(/\/$/, "").toLowerCase()));

const kebab = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

// relaxed: no pushed>=2026-05-01 — the whole point of batch 1b is the inactive-but-real rows
const active = leadsRaw.leads.filter(l => l.grade === "A" && !l.archived && l.repo);
console.log(`grade-A leads (any recency): ${active.length}`);

let imported = 0, skipped = 0;
ensureSystemUser();
for (const l of active) {
  const repoSlug = l.repo as string;
  const name = repoSlug.split("/")[1];
  const slug = kebab(name);
  const url = `https://github.com/${repoSlug}`;
  if (haveSlug.has(slug) || haveRepo.has(url.toLowerCase())) {
    console.log(`skip  ${slug}  (already in engine)`);
    skipped++;
    continue;
  }
  const m = meta[repoSlug] ?? {};
  const lic = m.license ?? "unverified";
  const stars = m.stars ?? 0;
  const desc = (m.desc ?? l.title).replace(/["\\\n]/g, " ").slice(0, 220);
  const oneLiner = `${name} — ${desc} (${lic}, ${stars.toLocaleString("en-US")} stars, last push ${m.pushed ?? "unknown"}). Imported UNCLAIMED from upstream — discoverable, fundable, forkable; claim by the repo owner or request takedown per platform law.`;
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
    owner_org_id: null, claimed: 0,
  });
  console.log(`import ${slug.padEnd(30)} CFQ ${String(28 + imported).padStart(3, "0")}-ish  <- ${repoSlug} (${stars}★, ${lic})`);
  haveSlug.add(slug); haveRepo.add(url.toLowerCase());
  imported++;
}

const all = getDb().prepare("SELECT count(*) AS n, sum(claimed = 0) AS unclaimed FROM projects").get() as { n: number; unclaimed: number };
console.log(`\nENGINE: total=${all.n} unclaimed=${all.unclaimed} | batch1b_imported=${imported} skipped=${skipped}`);
