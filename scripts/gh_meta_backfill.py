#!/usr/bin/env python3
"""Backfill project_github_meta for EVERY repo-backed project (Gui 11/8 order:
all projects carry the GitHub-sourced data the new imports get — from SOURCE,
never invented). Meta table is additive (no app code touches it yet; the seed
rating / provenance features read it from now on). Live GET /repos per row.
Run: python scripts/gh_meta_backfill.py
"""
import json, os, sqlite3, subprocess, time, urllib.request, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) if "__file__" in globals() else r"C:\Users\Guilherme\AppData\Local\hermes\projects\compute-fund"
DB = os.path.join(REPO, "app", "compute-fund.db")

fill = subprocess.run(["git", "credential", "fill"], input="protocol=https\nhost=github.com\n\n",
                      cwd=REPO, capture_output=True, text=True, timeout=60)
TOKEN = [l[9:] for l in fill.stdout.splitlines() if l.startswith("password=")][0]

con = sqlite3.connect(DB)
cur = con.cursor()
cur.execute("""CREATE TABLE IF NOT EXISTS project_github_meta (
  slug TEXT PRIMARY KEY,
  full_name TEXT, stars INTEGER, forks INTEGER, open_issues INTEGER,
  license TEXT, language TEXT, topics TEXT, handle TEXT, owner_type TEXT,
  homepage TEXT, pushed_at TEXT, fetched_at TEXT
)""")
con.commit()

rows = [r[0] for r in cur.execute(
    "SELECT repo_url FROM projects WHERE status='active' AND repo_url LIKE 'https://github.com/%'").fetchall()]
repos = sorted({u.rstrip("/").replace("https://github.com/", "") for u in rows if u})
print(f"{len(rows)} project rows -> {len(repos)} unique repos to fetch")

ok = fail = skip = 0
for i, full in enumerate(repos):
    slug = full.split("/")[-1].lower()
    have = cur.execute("SELECT 1 FROM project_github_meta WHERE slug=?", (slug,)).fetchone()
    if have:
        skip += 1
        continue
    try:
        req = urllib.request.Request(f"https://api.github.com/repos/{full}",
            headers={"Authorization": f"Bearer {TOKEN}", "Accept": "application/vnd.github+json",
                     "User-Agent": "compute-fund-import"})
        with urllib.request.urlopen(req, timeout=25) as r:
            it = json.loads(r.read())
        cur.execute("""INSERT OR REPLACE INTO project_github_meta
          (slug, full_name, stars, forks, open_issues, license, language, topics,
           handle, owner_type, homepage, pushed_at, fetched_at)
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)""",
          (slug, it["full_name"], it["stargazers_count"], it["forks_count"], it.get("open_issues_count"),
           ((it.get("license") or {}).get("spdx_id") or "").lower(), it.get("language"),
           json.dumps(it.get("topics", [])), it["owner"]["login"], it["owner"]["type"],
           it.get("homepage") or "", it.get("pushed_at", "")[:10],
           time.strftime("%Y-%m-%d %H:%M:%S")))
        ok += 1
    except Exception as e:
        fail += 1
        print(f"  FAIL {full}: {type(e).__name__} {str(e)[:70]}")
    if (i + 1) % 4 == 0:
        con.commit()
        time.sleep(0.35)
con.commit()
n = cur.execute("SELECT COUNT(*) FROM project_github_meta").fetchone()[0]
print(f"done: fetched={ok} failed={fail} skipped(already)={skip} | meta rows now: {n}")
proj_n = cur.execute("SELECT COUNT(*) FROM projects WHERE status='active'").fetchone()[0]
covered = cur.execute("""SELECT COUNT(*) FROM projects p
  WHERE p.status='active' AND p.slug IN (SELECT slug FROM project_github_meta)""").fetchone()[0]
print(f"coverage: {covered}/{proj_n} active projects have GitHub meta")
con.close()
