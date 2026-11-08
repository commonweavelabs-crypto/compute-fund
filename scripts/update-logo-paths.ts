// Wait for art batch to complete, then update all logo_path values in the DB
// to the unique art files, generalizing the art map law.
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { readFileSync, existsSync } from "node:fs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(path.join(repoRoot, "app"));
const { getDb } = await import(pathToFileURL(path.join(repoRoot, "app/lib/db.ts")).href);
const db = getDb();

const ARTDIR = path.join(repoRoot, "app", "public", "project-art");
// 1) explicit specials keep their hand-made mapping names
const specials = { "comfyui-video-ui": "hero.png", "rea-video": "cf-rea-video.png", "tierllama": "cf-browser-use-jev-ultrafast.png", "colibri": "diffusers.png", "last30days": "scrapegraph-ai.png" };

const rows = db.prepare("SELECT id, slug FROM projects WHERE status = 'active'").all();
let set = 0, missing = [];
for (const r of rows) {
  const candidate = path.join(ARTDIR, `cf-${r.slug}.png`);
  const file = existsSync(candidate) ? `/project-art/cf-${r.slug}.png` : (specials[r.slug] ? `/project-art/${specials[r.slug]}` : null);
  if (file) {
    db.prepare("UPDATE projects SET logo_path = ? WHERE id = ?").run(file, r.id);
    set++;
  } else {
    missing.push(r.slug);
  }
}
console.log(`logo_path set: ${set}/${rows.length}`);
if (missing.length) console.log("missing art (kept fallback):", missing.join(", "));
const check = db.prepare("SELECT count(*) AS n FROM projects WHERE logo_path IS NOT NULL").get();
console.log("total with logo:", check.n);
