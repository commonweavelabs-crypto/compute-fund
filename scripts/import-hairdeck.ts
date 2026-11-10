// SPOT IMPORT: HairDeck (hyz317/HairDeck) - Apache-2.0, 1037 stars, over the
// 3d-lane floor; category 3d / animation & rigging. (Gui standing import law.)
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(path.join(repoRoot, "app"));
const { ensureSystemUser, insertStubProject, nextCfqId, newId, getDb } = await import(pathToFileURL(path.join(repoRoot, "app/lib/db.ts")).href);
const db = getDb();
if (db.prepare("SELECT 1 FROM projects WHERE slug='hairdeck'").get()) {
  console.log("already present"); process.exit(0);
}
const url = "https://github.com/hyz317/HairDeck";
const oneLiner = "HairDeck — animation-ready stylized 3D hair cards generated from a single image, with automatic spring-bone rigging and GLB/VRM export for Blender, Unity and VRM avatars (Apache-2.0, 1,037 stars, Windows + Apple-silicon builds shipped the week of Nov 2026; released Oct 30 2026; online demo on HuggingFace). Imported per the platform import law; claim by the repo owner or request takedown within 48h.";
const projId = newId("prj");
insertStubProject({
  id: projId, cfq_id: nextCfqId(), owner_id: ensureSystemUser().id,
  slug: "hairdeck", name: "HairDeck",
  one_liner: oneLiner,
  question: "Adopt HairDeck as its maintainer: what is the first milestone you will ship, and what artifact proves it's done?",
  data_inputs: "upstream repo hyz317/HairDeck (Apache-2.0) + README/license facts + maintainer's own milestone plan",
  method: JSON.stringify(["github-repo-verification", "maintainer-claim"]),
  deliverable: "first claimed milestone with a verifiable artifact (repo-linked or uploaded, sha256-stamped receipt)",
  done_criteria: "maintainer claim verified (GitHub ownership check) + milestone receipt minted with a verifiable artifact",
  falsified_by: "silent claim without ownership proof; milestone closed without a verifiable artifact",
  review_process: "peer review on the milestone artifact per charter review_process defaults",
  budget_credits: 0, deadline: "",
  assumptions: "maintainer identity unverified until claim; takedown request honored within 48h (hide, never delete receipts)",
  status: "active", repo_url: url,
  links: JSON.stringify([{ label: "upstream repo", url }, { label: "online demo", url: "https://huggingface.co/spaces/hyz317/HairDeck" }]),
  owner_org_id: null, claimed: 0,
});
db.prepare(`UPDATE projects SET category='3d', subcategory='animation & rigging' WHERE slug='hairdeck'`).run();
const all = db.prepare("SELECT count(*) AS n FROM projects").get() as { n: number };
console.log("hairdeck imported | ENGINE:", all.n);
