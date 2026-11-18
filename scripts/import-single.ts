// PER-LINK AUTO-IMPORT (the vetting-skill automatic lane, Gui 2026-11-17):
// vet a single OSS project link for Compute Fund compatibility and import if it
// passes the strict gate:
//   1) LICENSE in the allowlist (GitHub license.spdx_id); NOASSERTION/unlicensed = never
//   2) repo pushed within 365 days (active)
//   3) honest description present (no SEO-spam gut repos)
//   4) grade: A >= 500 stars+B? (A >= 400, B >= 100, C < 100) - C = flag-only, not imported
// Idempotent: slug/repo collisions skip. Art (plates) = deferred to the batch queue
// (docs/pending-plates.json) — data imports immediately, art renders in batches.
// Run: node --experimental-strip-types scripts/import-single.ts --repo OWNER/NAME --category tools [--subcategory x]
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(path.join(repoRoot, "app"));
const { ensureSystemUser, insertStubProject, nextCfqId, newId, getDb } = await import(pathToFileURL(path.join(repoRoot, "app/lib/db.ts")).href);
getDb();

const argv = process.argv.slice(2);
const getArg = (k: string) => { const i = argv.indexOf(`--${k}`); return i >= 0 ? argv[i + 1] : undefined; };
const fullName = getArg("repo");
const category = getArg("category") ?? "tools";
const subcategory = getArg("subcategory") ?? null;
const ALLOW = new Set(["MIT", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause", "GPL-2.0", "GPL-3.0", "AGPL-3.0", "MPL-2.0", "CC0-1.0", "Unlicense", "ISC", "Zlib", "LGPL-2.1", "LGPL-3.0", "EUPL-1.2", "GPL-2.0-or-later", "GPL-3.0-or-later", "Apache-2.0-or-later"]);

if (!fullName || !fullName.includes("/")) { console.error("usage: --repo OWNER/NAME [--category c] [--subcategory s]"); process.exit(2); }
const gh = await (await fetch(`https://api.github.com/repos/${fullName}`, { headers: { "User-Agent": "compute-fund-import" } })).json() as Record<string, any>;
if (!gh.full_name) { console.error(`FAIL: GitHub API returned no repo (${fullName})`); process.exit(1); }
const lic: string = gh.license?.spdx_id ?? "unlicensed";
const stars: number = gh.stargazers_count ?? 0;
const pushed: string = (gh.pushed_at ?? "").slice(0, 10);
const desc = String(gh.description ?? "").replace(/["\\\n]/g, " ").trim();
const daysIdle = Math.round((Date.now() - Date.parse(gh.pushed_at ?? new Date().toISOString())) / 86400000);
const grade = stars >= 400 ? "A" : stars >= 100 ? "B" : "C";

const gateFail: string[] = [];
if (!ALLOW.has(lic)) gateFail.push(`license ${lic} not in allowlist`);
if (daysIdle > 365) gateFail.push(`inactive (idle ${daysIdle}d)`);
if (!desc) gateFail.push("no honest description");
if (grade === "C") gateFail.push("grade C (thin project) — flag-only under the strict law");
if (gateFail.length) {
  console.log(`NOT IMPORTED ${fullName}: ${gateFail.join("; ")} — flagged as candidate only (catalog row notes it).`);
  process.exit(0);
}

const name = fullName.split("/")[1];
const kebab = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
const slug = kebab(name);
const url = `https://github.com/${fullName}`;
const db = getDb();
const haveSlug = (db.prepare("SELECT slug FROM projects WHERE slug=?").get(slug) ?? null) !== null;
const haveRepo = (db.prepare("SELECT 1 FROM projects WHERE lower(replace(repo_url, '/', ''))=?").get(url.toLowerCase().replace(/\//g, "")) ?? null) !== null;
if (haveSlug || haveRepo) { console.log(`skip ${slug} (already on the platform)`); process.exit(0); }

ensureSystemUser();
const oneLiner = `${name} — ${desc} (${lic}, ${stars.toLocaleString("en-US")} stars, last push ${pushed}). Vetted import (grade ${grade}) from the link-vetting pipeline; claim by the repo owner or request takedown per platform law.`;
const projId = newId("prj");
insertStubProject({
  id: projId, cfq_id: nextCfqId(), owner_id: ensureSystemUser().id,
  slug, name,
  one_liner: oneLiner,
  question: `Adopt ${name} on Compute Fund as its maintainer: what is the first milestone you will ship, and what artifact proves it's done?`,
  data_inputs: `upstream repo ${fullName} (${lic}) + README/license facts + maintainer's own milestone plan`,
  method: JSON.stringify(["github-repo-verification", "maintainer-claim"]),
  deliverable: "first claimed milestone with a verifiable artifact (repo-linked or uploaded, sha256-stamped receipt)",
  done_criteria: "maintainer claim verified (GitHub ownership check) + milestone receipt minted with a verifiable artifact",
  falsified_by: "silent claim without ownership proof; milestone closed without a verifiable artifact",
  review_process: "peer review on the milestone artifact per charter review_process defaults",
  budget_credits: 0, deadline: "",
  assumptions: "maintainer identity unverified until claim; takedown request honored within 48h (hide, never delete receipts)",
  status: "active", repo_url: url,
  links: JSON.stringify([{ label: "upstream repo", url }, ...(gh.homepage ? [{ label: "site", url: gh.homepage }] : [])]),
  owner_org_id: null, claimed: 0,
});
db.prepare(`UPDATE projects SET category=?, subcategory=? WHERE slug=?`).run(category, subcategory, slug);

// queue art for the batch pass (rendered when batch fills or on next art run)
const queuePath = path.join(repoRoot, "docs", "pending-plates.json");
const fsx = await import("node:fs");
let q: any = { pending: [] };
try { q = JSON.parse(fsx.readFileSync(queuePath, "utf-8")); } catch {}
if (!Array.isArray(q.pending)) q.pending = [];
if (!q.pending.includes(slug)) q.pending.push(slug);
fsx.writeFileSync(queuePath, JSON.stringify(q, null, 1));

const all = db.prepare("SELECT count(*) AS n, sum(claimed = 0) AS unclaimed FROM projects").get() as { n: number; unclaimed: number };
console.log(`IMPORTED ${fullName} -> ${slug} (grade ${grade}, ${lic}, ${stars} stars) | ENGINE: total=${all.n} unclaimed=${all.unclaimed} | pending-plates=${q.pending.length}`);
