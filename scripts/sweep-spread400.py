"""SPREAD-400 sourcing sweep (Gui GO 11/8): 4 new lanes + thin-category fills.
Lanes: productivity / 3d / robotics / bigtech. Output: docs/sweep-spread400.json.
Same laws as sprint-200: license allowlist, junk/mirror screens, dedupe vs DB."""
import json, os, re, time, urllib.request, sqlite3, urllib.parse, subprocess
REPO = r"C:\Users\Guilherme\AppData\Local\hermes\projects\compute-fund"
fill = subprocess.run(["git", "credential", "fill"], input="protocol=https\nhost=github.com\n\n",
                      cwd=REPO, capture_output=True, text=True, timeout=60)
tok = [l[9:] for l in fill.stdout.splitlines() if l.startswith("password=")][0]
con = sqlite3.connect(f"file:{REPO}\\app\\compute-fund.db?mode=ro", uri=True)
have = {(r[0] or "").rstrip("/").lower() for r in con.execute("SELECT repo_url FROM projects") if r[0]}
have_names = {r[0].lower() for r in con.execute("SELECT name FROM projects")}
con.close()

LIC_OK = {"mit", "apache-2.0", "gpl-3.0", "gpl-2.0", "agpl-3.0", "bsd-3-clause", "bsd-2-clause",
          "mpl-2.0", "unlicense", "cc0-1.0", "isc", "zlib", "lgpl-3.0", "eupl-1.2"}
JUNK = re.compile(r"awesome-|awesome |curated list|tutorial|cheatsheet|roadmap|interview|"
                  r"notes|collection of|learning-|course|list of|mirrors? |read-only|archive of", re.I)

def q(query, n=60, tries=3):
    url = f"https://api.github.com/search/repositories?q={urllib.parse.quote(query)}&sort=stars&order=desc&per_page={n}"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {tok}", "Accept": "application/vnd.github+json", "User-Agent": "compute-fund-sweep"})
    for a in range(tries):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.loads(r.read()).get("items", [])
        except Exception:
            time.sleep(5 * (a + 1))
    return []

def shape(it, lane):
    return {"lane": lane, "full_name": it["full_name"], "stars": it["stargazers_count"],
            "forks": it["forks_count"], "language": it.get("language"),
            "topics": it.get("topics", [])[:12],
            "license": ((it.get("license") or {}).get("spdx_id") or "").lower(),
            "desc": (it.get("description") or "")[:220], "homepage": it.get("homepage") or "",
            "created": it.get("created_at", "")[:10], "pushed": it.get("pushed_at", "")[:10],
            "owner": it["owner"]["login"], "owner_type": it["owner"]["type"],
            "avatar": it["owner"]["avatar_url"], "url": it["html_url"]}

lanes = {
    "productivity": [("topic:productivity", "stars:>300"),
                     ("topic:desktop-app", "stars:>400"),
                     ("topic:launcher", "stars:>200"),
                     ("topic:note-taking", "stars:>400"),
                     ("topic:electron", "stars:>1500"),
                     ("topic:tauri", "stars:>600"),
                     ("topic:macos", "stars:>2000")],
    "3d": [("topic:3d", "stars:>300"), ("topic:3d-graphics", "stars:>200"),
           ("topic:blender", "stars:>300"), ("topic:3d-modeling", "stars:>100"),
           ("topic:photogrammetry", "stars:>80"), ("topic:3d-scanning", "stars:>40"),
           ("topic:animation", "stars:>400"), ("topic:rigging", "stars:>50")],
    "robotics": [("topic:robotics", "stars:>150"), ("topic:ros", "stars:>100"),
                 ("topic:drone", "stars:>200"), ("topic:3d-printing", "stars:>200"),
                 ("topic:firmware", "stars:>300"), ("topic:cnc", "stars:>80")],
    "bigtech": [("org:facebook", ""), ("org:microsoft", "stars:>1000"),
                ("org:google", "stars:>2000"), ("org:deepseek-ai", ""),
                ("org:pytorch", ""), ("org:apache", "stars:>2000"),
                ("org:apple", "stars:>500"), ("org:amazon", "stars:>500")],
}
merged = {}
for lane, queries in lanes.items():
    for query, floor in queries:
        full = f"{query} {floor} archived:false fork:false".strip()
        for it in q(full, 60):
            lic = ((it.get("license") or {}).get("spdx_id") or "").lower()
            if lic not in LIC_OK: continue
            k = it["full_name"].lower()
            url = ("https://github.com/" + k).lower()
            if url in have or k in have_names: continue
            if JUNK.search(it.get("description") or ""): continue
            if k in merged: continue
            merged[k] = shape(it, lane)
        time.sleep(6)
by_lane = {}
for row in merged.values():
    by_lane.setdefault(row["lane"], []).append(row)
for lane, rows in by_lane.items():
    rows.sort(key=lambda r: -r["stars"])
out = {"generated": "2026-11-08", "status": "raw sweep — pre-curation", "lanes": by_lane}
json.dump(out, open(os.path.join(REPO, "docs", "sweep-spread400.json"), "w", encoding="utf-8"), indent=1)
print({lane: len(rows) for lane, rows in by_lane.items()}, "| total:", len(merged))
