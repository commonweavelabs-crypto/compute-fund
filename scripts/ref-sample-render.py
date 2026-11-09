"""Qwen-Edit-2509 reference-sample runner (6 samples: 3 icons + 3 PD stills)."""
import os, json, time, subprocess, urllib.request, re, hashlib
WF = r"C:\Users\Guilherme\AppData\Local\hermes\cache\scratch\qwen_edit2509.json"
COMFY = r"C:/Users/Guilherme/AppData/Local/hermes/bin/comfy.exe"
HOST = ["--host", "127.0.0.1", "--port", "8000"]
ART = r"C:\Users\Guilherme\AppData\Local\hermes\projects\compute-fund\app\public\project-art"
scratch = r"C:\Users\Guilherme\AppData\Local\hermes\cache\scratch"

ICON_P = ("Extend the flat side panels: continue the dark navy studio backdrop seamlessly to fill the entire "
          "wide canvas, add a soft teal and amber rim light around the central icon character and a gentle floor "
          "reflection beneath it, premium product-shot finish, generous negative space, keep the central icon "
          "character exactly as it is, sharp and recognizable, no text of any kind anywhere")
STILL_P = ("Restage this framed public-domain film still as a wide cinematic poster: keep the central scene, "
           "its characters and their poses and composition exactly recognizable, extend the dark navy backdrop "
           "panels seamlessly to fill the sides, repaint the whole card with premium modern color grading — deep "
           "shadows, teal and amber accent lighting, subtle film grain, rich cinematic mood — no text or titles anywhere")

JOBS = [
    ("cfref-photocraft", "ref_photocraft.png", ICON_P),
    ("cfref-wordcraft",  "ref_wordcraft.png",  ICON_P),
    ("cfref-effectcraft","ref_effectcraft.png",ICON_P),
    ("cfref-pawnshop",   "ref_pawnshop.png",   STILL_P),
    ("cfref-potemkin",   "ref_potemkin.png",   STILL_P),
    ("cfref-ironmask",   "ref_ironmask.png",   STILL_P),
]

def max_suffix(prefix):
    with urllib.request.urlopen("http://127.0.0.1:8000/history?max_items=50", timeout=30) as r:
        hist = json.loads(r.read())
    best = 0
    for pid, h in hist.items():
        for nid, o in (h.get("outputs") or {}).items():
            for img in (o.get("images") or []):
                f = img.get("filename", "")
                if f.startswith(prefix):
                    m = re.search(r"_(\d+)_", f)
                    if m: best = max(best, int(m.group(1)))
    return best

def fetch_new(prefix, wait_s=240, min_suffix=0):
    deadline = time.time() + wait_s
    while time.time() < deadline:
        time.sleep(3)
        try:
            with urllib.request.urlopen("http://127.0.0.1:8000/history?max_items=50", timeout=30) as r:
                hist = json.loads(r.read())
        except Exception:
            continue
        best = None
        for pid, h in hist.items():
            st = (h.get("status") or {}).get("status_str")
            for nid, o in (h.get("outputs") or {}).items():
                for img in (o.get("images") or []):
                    f = img.get("filename", "")
                    if f.startswith(prefix) and st == "success":
                        m = re.search(r"_(\d+)_", f)
                        num = int(m.group(1)) if m else 0
                        if num > min_suffix and (best is None or num > best[0]):
                            best = (num, f)
        if best: return best[1]
    return None

results = {}
for slug, ref, prompt in JOBS:
    pre = max_suffix(slug)
    seed = int(hashlib.sha1(slug.encode()).hexdigest()[:8], 16) % 10**7
    r = subprocess.run([COMFY, "workflow", "set-slot", WF, *HOST,
                        f"78.image={ref}", f"433.prompt={prompt}", f"433.seed_1={seed}",
                        f"469.filename_prefix={slug}"], capture_output=True, text=True, timeout=120)
    if r.returncode != 0:
        results[slug] = "SET FAIL " + (r.stderr or r.stdout)[-140:]
        print(slug, results[slug]); continue
    r2 = subprocess.run([COMFY, "run", "--workflow", WF, *HOST], capture_output=True, text=True, timeout=600)
    fn = fetch_new(slug, min_suffix=pre)
    if not fn:
        results[slug] = "FETCH FAIL"
        print(slug, "FETCH FAIL"); continue
    data = urllib.request.urlopen(f"http://127.0.0.1:8000/view?filename={urllib.request.quote(fn)}&subfolder=&type=output", timeout=60).read()
    open(os.path.join(ART, f"{slug}.png"), "wb").write(data)
    results[slug] = f"ok {len(data)//1024}KB"
    print(slug, "->", fn, len(data)//1024, "KB")
import sys; sys.exit(0) if not results else print(json.dumps(results))
