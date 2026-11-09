"""Populate projects.platforms from project_github_meta (CONSERVATIVE: only
derivable claims — topics/tech hints; the rest stays NULL = honest unspecified)."""
import sqlite3, json, os, re
REPO = r"C:\Users\Guilherme\AppData\Local\hermes\projects\compute-fund"
con = sqlite3.connect(os.path.join(REPO, "app", "compute-fund.db"))
con.execute("ALTER TABLE projects ADD COLUMN platforms TEXT") if not con.execute(
    "SELECT COUNT(*) FROM pragma_table_info('projects') WHERE name='platforms'").fetchone()[0] else None
con.commit()
rows = con.execute("""SELECT p.slug, m.topics, m.language, p.name FROM projects p
    LEFT JOIN project_github_meta m ON m.slug = p.slug WHERE p.status='active'""").fetchall()
n = 0
for slug, topics, lang, name in rows:
    t = (topics or "").lower()
    l = (lang or "").lower()
    blob = t + " " + l + " " + (name or "").lower()
    plats = set()
    # explicit platform topics win
    for kw, p in (("macos", "mac"), ("osx", "mac"), ("darwin", "mac"),
                  ("windows", "windows"), ("win32", "windows"), ("uwp", "windows"),
                  ("linux", "linux"), ("appimage", "linux"), ("flatpak", "linux"),
                  ("android", "android"), ("kotlin", "android"),
                  ("ios", "ios"), ("iphone", "ios"), ("swift", "ios")):
        if kw in blob: plats.add(p)
    # tech-shape hints
    if any(k in blob for k in ("tauri", "electron", "desktop", "qt", "gtk", "wpf", "avalonia", "wpf")):
        plats.update(("windows", "mac", "linux"))
    if l == "swift" or "objective-c" in l:
        plats.update(("mac", "ios"))
    if l == "kotlin" and "android" not in plats: plats.add("android")
    if "flutter" in blob or l == "dart":
        plats.update(("windows", "mac", "linux", "android", "ios"))
    if l in ("python", "rust", "go", "c", "zig", "crystal") and any(k in blob for k in ("cli", "terminal", "command", "tool", "server", "daemon")):
        plats.update(("windows", "mac", "linux"))
    if "browser extension" in blob or "chrome extension" in blob or "webextension" in blob:
        plats.add("web")
    if plats:
        con.execute("UPDATE projects SET platforms=? WHERE slug=?", (",".join(sorted(plats)), slug))
        n += 1
con.commit()
print("platforms set on", n, "of", len(rows), "rows")
con.close()
