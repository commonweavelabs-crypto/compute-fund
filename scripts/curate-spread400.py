"""PHASE C: curate the 896 sweep rows -> docs/spread400-final.json (all compatible,
per Gui: 'do the entire workflow, import all of them'). Screens: junk regex (2nd pass),
license allowlist assert, dedupe. Category+sub mapping per lane from topics."""
import json, os, re
REPO = r"C:\Users\Guilherme\AppData\Local\hermes\projects\compute-fund"
sweep = json.load(open(os.path.join(REPO, "docs", "sweep-spread400.json"), encoding="utf-8"))
LIC_OK = {"mit", "apache-2.0", "gpl-3.0", "gpl-2.0", "agpl-3.0", "bsd-3-clause", "bsd-2-clause",
          "mpl-2.0", "unlicense", "cc0-1.0", "isc", "zlib", "lgpl-3.0", "eupl-1.2"}
JUNK = re.compile(r"awesome-|awesome |curated list|tutorial|cheatsheet|roadmap|interview|"
                  r"collection of|learning-|course|list of|mirror|read-only|archive of", re.I)
def sub_for(lane, topics, desc, name):
    t = [x.lower() for x in topics]; blob = (desc or "").lower(); n = name.lower()
    if lane == "productivity":
        if any(k in t for k in ("claude", "agent", "mcp", "openai")) or "agent" in blob: return "agent dashboards"
        if any(k in " ".join(t) + blob + n for k in ("launcher", "widget", "dock", "menubar", "menu bar", "notch", "island")): return "launchers & widgets"
        if any(k in " ".join(t) + blob + n for k in ("note", "journal", "markdown", "docs", "knowledge", "obsidian")): return "notes & docs"
        return "desktop apps"
    if lane == "3d":
        if any(k in " ".join(t) + blob + n for k in ("photogrammetry", "scan", "sfm", "meshroom", "capture")): return "3d scanning & capture"
        if any(k in " ".join(t) + blob + n for k in ("animat", "rig", "motion", "character")): return "animation & rigging"
        return "modeling & sculpting"
    if lane == "robotics":
        if any(k in " ".join(t) + blob + n for k in ("drone", "uav", "rover", "boat", "sub")): return "drones & rovers"
        if any(k in " ".join(t) + blob + n for k in ("3d-print", "printer", "marlin", "klipper", "grbl", "cnc", "firmware", "embed")): return "3d printing & firmware"
        return "sim & control"
    if lane == "bigtech":
        if any(k in " ".join(t) + blob for k in ("llm", "language model", "ai model", "text-to", "speech", "vision", "diffusion", "transformer")): return "ai models"
        if any(k in " ".join(t) + blob for k in ("react", "angular", "runtime", "browser", "javascript", "frontend", "ui ")): return "frontend & runtimes"
        return "dev infrastructure"
    return None
rows, dedup = [], set()
for lane, list_ in sweep["lanes"].items():
    for r in list_:
        lic = (r.get("license") or "").lower()
        if lic not in LIC_OK: continue
        blob = (r.get("desc") or "")
        if JUNK.search(blob) or JUNK.search(r["full_name"]): continue
        k = r["full_name"].lower()
        if k in dedup: continue
        dedup.add(k)
        name = r["full_name"].split("/")[1]
        rows.append({**r, "name": name, "category": "bigtech" if lane == "bigtech" else lane,
                     "subcategory": sub_for(lane, r.get("topics", []), r.get("desc"), name),
                     "stars": r.get("stars", 0)})
rows.sort(key=lambda r: -r["stars"])
final = {"generated": "2026-11-08", "status": "Gui GO — importall (overnight run)",
         "note": "curated from 896 raw sweep rows; junk+license screens; spread400 lanes",
         "rows": rows}
json.dump(final, open(os.path.join(REPO, "docs", "spread400-final.json"), "w", encoding="utf-8"), indent=1)
from collections import Counter
print("curated:", len(rows), dict(Counter(r["category"] for r in rows)))
print("top:", [f'{r["name"]}({r["stars"]})' for r in rows[:8]])
floors = {"productivity": 300, "3d": 100, "robotics": 100, "bigtech": 0}
for lane, fl in floors.items():
    c = [r for r in rows if r["category"] == lane and r["stars"] >= fl]
    print(lane, ">= floor:", len(c))
