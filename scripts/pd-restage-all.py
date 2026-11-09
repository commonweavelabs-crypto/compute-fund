"""PHASE B: all 60 PD revival rows -> real film frame -> Qwen-Edit-2509 restage.
Checkpointed (scratch/pd-restage-state.json); idempotent re-runs skip done rows.
Pipeline per row (Gui-approved standard):
  1. real item id from DB links[0] (case-variant!); item metadata -> biggest mp4/h.264
  2. ffmpeg remote-seek a frame at 35% (or 55% if 1st fails) -> 640x480-class (best the item has)
  3. center-crop to card ratio 1216:832 -> upscale to 1216x832 + unsharp
  4. upload -> Qwen-Edit restage (PROMPT below — no 'poster' word, hard no-text)
  5. download output as cf-<slug>.png (renamed standard)
Rows already having a REAL restage keep it (state file idempotence); the bland
pass-2 bedroom/window plates are OVERWRITTEN for every row processed."""
import os, json, time, subprocess, urllib.request, re, hashlib, shutil
S = r"C:\Users\Guilherme\AppData\Local\hermes\cache\scratch"
WFFILE = r"C:\Users\Guilherme\AppData\Local\hermes\cache\scratch\qwen_edit2509.json"
COMFY = r"C:/Users/Guilherme/AppData/Local/hermes/bin/comfy.exe"
HOST = ["--host", "127.0.0.1", "--port", "8000"]
ART = r"C:\Users\Guilherme\AppData\Local\hermes\projects\compute-fund\app\public\project-art"
REPO = r"C:\Users\Guilherme\AppData\Local\hermes\projects\compute-fund"
UA = {"User-Agent": "compute-fund"}
FF = r"C:\Users\Guilherme\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.2-full_build\bin\ffmpeg.exe"
W, H = 1216, 832
PROMPT = ("Restage this silent-film still as a cinematic art card: keep the scene layout, characters, costumes and "
          "poses exactly recognizable; repaint the whole frame with rich modern color grading - deep teal shadows, "
          "warm amber key light, soft film grain; full-bleed edge to edge, no borders, no frame, no bars; the image "
          "is completely blank of writing - no captions, no titles, no labels, no letters, no typography anywhere")
STATE = os.path.join(S, "pd-restage-state.json")
state = json.load(open(STATE, encoding="utf-8")) if os.path.exists(STATE) else {}

def item_of(links_json):
    return json.loads(links_json)[0]["url"].rsplit("/", 1)[-1]

def best_video(ident):
    try:
        meta = json.loads(urllib.request.urlopen(urllib.request.Request(f"https://archive.org/metadata/{ident}", headers=UA), timeout=25).read())
    except Exception:
        return None, 0
    vids = [f for f in meta.get("files", []) if "h.264" in (f.get("format", "") or "") or f.get("name", "").endswith(".mp4")]
    if not vids: return None, 0
    vids.sort(key=lambda f: int(f.get("size", 0) or 0), reverse=True)
    f0 = vids[0]
    L = str(f0.get("length", "600"))
    if ":" in L:
        parts = [float(x) for x in L.split(":")]
        dur = parts[0]*3600 + parts[1]*60 + (parts[2] if len(parts) > 2 else 0)
    else:
        dur = float(L)
    return f0["name"], dur

def fetch_frame(ident, slug, dur):
    for frac in (0.35, 0.55, 0.18, 0.7):
        t = int(dur * frac)
        url = f"https://archive.org/download/{ident}/{urllib.request.quote(best_video(ident)[0])}"
        out = os.path.join(S, f"hq_still_{slug}.jpg")
        try:
            subprocess.run([FF, "-y", "-ss", str(t), "-i", url, "-frames:v", "1", "-q:v", "2", out],
                           capture_output=True, timeout=200)
            if os.path.exists(out) and os.path.getsize(out) > 8000:
                return out
        except Exception:
            continue
    return None

def max_suffix(prefix):
    try:
        with urllib.request.urlopen(f"http://127.0.0.1:8000/history?max_items=50", timeout=20) as r:
            hist = json.loads(r.read())
    except Exception:
        return 0
    best = 0
    for pid, h in hist.items():
        for nid, o in (h.get("outputs") or {}).items():
            for img in (o.get("images") or []):
                f = img.get("filename", "")
                if f.startswith(prefix):
                    m = re.search(r"_(\d+)\.png$", f)
                    if m: best = max(best, int(m.group(1)))
    return best

def qedit(slug, image_name, seed):
    r = subprocess.run([COMFY, "workflow", "set-slot", WFFILE, *HOST,
                        f"78.image={image_name}", f"433.prompt={PROMPT}", f"433.seed_1={seed}",
                        f"469.filename_prefix=qpd-{slug}"], capture_output=True, text=True, timeout=120)
    if r.returncode != 0: return None
    pre = max_suffix(f"qpd-{slug}")
    subprocess.run([COMFY, "run", "--workflow", WFFILE, *HOST], capture_output=True, text=True, timeout=900)
    deadline = time.time() + 300
    while time.time() < deadline:
        time.sleep(3)
        try:
            with urllib.request.urlopen("http://127.0.0.1:8000/history?max_items=50", timeout=20) as r:
                hist = json.loads(r.read())
        except Exception: continue
        for pid, h in hist.items():
            st = (h.get("status") or {}).get("status_str")
            for nid, o in (h.get("outputs") or {}).items():
                for img in (o.get("images") or []):
                    f = img.get("filename", "")
                    if f.startswith(f"qpd-{slug}") and st == "success" and f.endswith(".png"):
                        m = re.search(r"_(\d+)\.png$", f)
                        if int(m.group(1)) > pre:
                            data = urllib.request.urlopen(f"http://127.0.0.1:8000/view?filename={urllib.request.quote(f)}&subfolder=&type=output", timeout=60).read()
                            dst = os.path.join(ART, f"cf-{slug}.png")
                            open(dst, "wb").write(data)
                            return dst
    return None

import sqlite3
con = sqlite3.connect(f"file:{REPO}/app/compute-fund.db?mode=ro", uri=True)
rows = con.execute("SELECT slug, links FROM projects WHERE subcategory='public-domain revival'").fetchall()
con.close()
done = fail = 0
for i, (slug, links) in enumerate(rows):
    if state.get(slug) == "ok" and os.path.exists(os.path.join(ART, f"cf-{slug}.png")):
        done += 1; continue
    ident = item_of(links)
    vname, dur = best_video(ident)
    if not vname:
        state[slug] = "novideo"; print(slug, "NO VIDEO", ident); continue
    still = fetch_frame(ident, slug, dur) if os.path.exists(os.path.join(S, f"hq_still_{slug}.jpg")) is False or os.path.getsize(os.path.join(S, f"hq_still_{slug}.jpg")) <= 8000 else os.path.join(S, f"hq_still_{slug}.jpg")
    if not still:
        state[slug] = "noframe"; print(slug, "NO FRAME"); continue
    from PIL import Image, ImageFilter
    src = Image.open(still).convert("RGB")
    ratio = W / H
    w0, h0 = src.size
    nh = int(w0 / ratio)
    if nh <= h0:
        top = (h0 - nh) // 2; crop = src.crop((0, top, w0, top + nh))
    else:
        nw = int(h0 * ratio); left = (w0 - nw) // 2; crop = src.crop((left, 0, left + nw, h0))
    up = crop.resize((W, H), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=2, percent=80, threshold=2))
    upname = f"restage_in_{slug}.png"
    up.save(os.path.join(S, upname), "PNG")
    ur = subprocess.run([COMFY, "upload", os.path.join(S, upname), "--overwrite", *HOST],
                        capture_output=True, text=True, timeout=120)
    if ur.returncode != 0:
        state[slug] = "uploadfail"; print(slug, "UPLOAD FAIL"); continue
    seed = int(hashlib.sha1(("pdrestage" + slug).encode()).hexdigest()[:8], 16) % 10**7
    dst = qedit(slug, upname, seed)
    if dst:
        state[slug] = "ok"; done += 1
        print(f"[{i+1}/{len(rows)}] {slug} OK")
    else:
        state[slug] = "renderfail"; fail += 1
        print(f"[{i+1}/{len(rows)}] {slug} RENDER FAIL")
    json.dump(state, open(STATE, "w"))
print("DONE ok:", done, "fail:", fail, "| state:", {k: v for k, v in state.items() if v != "ok"})
