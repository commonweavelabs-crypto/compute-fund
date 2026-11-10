// SPOT IMPORT: MirrorCode (epoch-research/MirrorCode) - MIT, from the arXiv
// paper "AI can rebuild entire programs from behavior alone" (2606.30182) -
// the behavior-reconstruction benchmark suite covered by Two Minute Papers
// ("Is Software Over?"). Category research / benchmarks.
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(path.join(repoRoot, "app"));
const { ensureSystemUser, insertStubProject, nextCfqId, newId, getDb } = await import(pathToFileURL(path.join(repoRoot, "app/lib/db.ts")).href);
const db = getDb();
if (db.prepare("SELECT 1 FROM projects WHERE slug='mirrorcode'").get()) {
  console.log("already present"); process.exit(0);
}
const url = "https://github.com/epoch-research/MirrorCode";
const oneLiner = "MirrorCode — a standardized benchmark for AI rebuilding ENTIRE programs from behavior alone: no source code, run-and-test against the original, pass-rate scoring (arXiv 2606.30182, MIT, 81 stars). The paper that measured AI behavior-reconstruction jumping from 15% to nearly 100% test-pass in nine months. Imported per the platform import law; claim by the repo owner or request takedown within 48h.";
const projId = newId("prj");
insertStubProject({
  id: projId, cfq_id: nextCfqId(), owner_id: ensureSystemUser().id,
  slug: "mirrorcode", name: "MirrorCode",
  one_liner: oneLiner,
  question: "Adopt MirrorCode on Compute Fund as its maintainer: what is the first milestone you will ship, and what artifact proves it's done?",
  data_inputs: "upstream repo epoch-research/MirrorCode (MIT) + arXiv 2606.30182 + benchmark run methodology",
  method: JSON.stringify(["github-repo-verification", "maintainer-claim"]),
  deliverable: "first claimed milestone with a verifiable artifact (repo-linked or uploaded, sha256-stamped receipt)",
  done_criteria: "maintainer claim verified (GitHub ownership check) + milestone receipt minted with a verifiable artifact",
  falsified_by: "silent claim without ownership proof; milestone closed without a verifiable artifact",
  review_process: "peer review on the milestone artifact per charter review_process defaults",
  budget_credits: 0, deadline: "",
  assumptions: "maintainer identity unverified until claim; takedown request honored within 48h (hide, never delete receipts)",
  status: "active", repo_url: url,
  links: JSON.stringify([{ label: "upstream repo", url }, { label: "arXiv 2606.30182", url: "https://arxiv.org/abs/2606.30182" }]),
  owner_org_id: null, claimed: 0,
});
db.prepare(`UPDATE projects SET category='research', subcategory='benchmarks' WHERE slug='mirrorcode'`).run();
const all = db.prepare("SELECT count(*) AS n FROM projects").get() as { n: number };
console.log("mirrorcode imported | ENGINE:", all.n);
