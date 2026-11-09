"""PD restage regen: 14 QA-flagged films -> different frame offsets (intertitle/
dark-frame dodge) + no-text-in-scene prompt clause. Overwrites cf-<slug>.png."""
import os, json, time, subprocess, urllib.request, re, hashlib, io, sqlite3
S = r"C:\Users\Guilherme\AppData\Local\hermes\cache\scratch"
WFFILE = os.path.join(S, "qwen_edit2509.json")
COMFY = r"C:/Users/Guilherme/AppData/Local/hermes/bin/comfy.exe"
HOST = ["--host", "127.0.0.1", "--port", "8000"]
ART = r"C:\Users\Guilherme\AppData\Local\hermes\projects\compute-fund\app\public\project-art"
REPO = r"C:\Users\Guilherme\AppData\Local\hermes\projects\compute-fund"
UA = {"User-Agent": "compute-fund"}
FF = r"C:\Users\Guilherme\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.2-full_build\bin\ffmpeg.exe"
W, H = 1216, 832
PROMPT = ("Restage this silent-film still as a cinematic art card: keep the scene layout, characters, costumes and "
          "poses exactly recognizable; the scene shows its characters in action with NO title cards, NO intertitles "
          "and NO written words visible anywhere in the scene; repaint the whole frame with rich modern color "
          "grading - deep teal shadows, warm amber key light, soft film grain; full-bleed edge to edge, no borders; "
          "completely blank of any writing anywhere")
FLAGGED = ["tarzanoftheapes1918andydivx", "aliceinwonderland1915-503", "silent-cockeyed-gems-from-the-memory-of-a-nutty-cameraman",
           "cc-1918-xx-xx-tripletrouble", "arizonadays", "the-four-horsemen-of-the-apocalypse"]

con = sqlite3.connect(f"file:{REPO}/app/compute-fund.db?mode=ro", uri=True)
links = dict(con.execute("SELECT slug, links FROM projects WHERE subcategory='public-domain revival'").fetchall())
con.close()

def item_of(lj): return json.loads(lj)[0]["url"].rsplit("/", 1)[-1]

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
    else: dur = float(L)
    return f0["name"], dur

def max_suffix(prefix):
    try:
        with urllib.request.urlopen("http://127.0.0.1:8000/history?max_items=50", timeout=20) as r:
            hist = json.loads(r.read())
    except Exception: return 0
    best = 0
    for pid, h in hist.items():
        for nid, o in (h.get("outputs") or {}).items():
            for img in (o.get("images") or []):
                f = img.get("filename", "")
                if f.startswith(prefix):
                    m = re.search(r"_(\d+)\.png$", f)
                    if m: best = max(best, int(m.group(1)))
    return best

def fetch_new(prefix, wait_s=280, min_suffix=0):
    deadline = time.time() + wait_s
    while time.time() < deadline:
        time.sleep(3)
        try:
            with urllib.request.urlopen("http://127.0.0.1:8000/history?max_items=50", timeout=20) as r:
                hist = json.loads(r.read())
        except Exception: continue
        best = None
        for pid, h in hist.items():
            st = (h.get("status") or {}).get("status_str")
            for nid, o in (h.get("outputs") or {}).items():
                for img in (o.get("images") or []):
                    f = img.get("filename", "")
                    if f.startswith(prefix) and st == "success" and f.endswith(".png"):
                        m = re.search(r"_(\d+)\.png$", f)
                        num = int(m.group(1)) if m else 0
                        if num > min_suffix and (best is None or num > best[0]): best = (num, f)
        if best: return best[1]
    return None

def quality_ok(path):
    from PIL import Image, ImageStat
    im = Image.open(path).convert("L")
    return ImageStat.Stat(im).mean[0] > 28  # reject near-black frames

ok = 0
for slug in FLAGGED:
    ident = item_of(links[slug])
    vname, dur = best_video(ident)
    if not vname: print(slug, "NO VIDEO"); continue
    url = f"https://archive.org/download/{ident}/{urllib.request.quote(vname)}"
    from PIL import Image, ImageFilter
    done = False
    for frac in (0.55, 0.75, 0.15, 0.45):
        t = int(dur * frac)
        out = os.path.join(S, f"regen_still_{slug}.jpg")
        subprocess.run([FF, "-y", "-ss", str(t), "-i", url, "-frames:v", "1", "-q:v", "2", out],
                       capture_output=True, timeout=200)
        if not os.path.exists(out) or os.path.getsize(out) <= 8000: continue
        if not quality_ok(out): continue
        src = Image.open(out).convert("RGB")
        w0, h0 = src.size
        nh = int(w0 / (W / H))
        if nh <= h0:
            top = (h0 - nh)//2; crop = src.crop((0, top, w0, top+nh))
        else:
            nw = int(h0 * (W/H)); left = (w0-nw)//2; crop = src.crop((left, 0, left+nw, h0))
        up = crop.resize((W, H), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=2, percent=80, threshold=2))
        upname = f"regen_in_{slug}.png"
        up.save(os.path.join(S, upname), "PNG")
        ur = subprocess.run([COMFY, "upload", os.path.join(S, upname), "--overwrite", *HOST],
                            capture_output=True, text=True, timeout=120)
        if ur.returncode != 0: continue
        pre = max_suffix(f"qpd-regen-{slug}")
        seed = int(hashlib.sha1(("pdregen" + slug).encode()).hexdigest()[:8], 16) % 10**7
        r = subprocess.run([COMFY, "workflow", "set-slot", WFFILE, *HOST,
                            f"78.image={upname}", f"433.prompt={PROMPT}", f"433.seed_1={seed}",
                            f"469.filename_prefix=qpd-regen-{slug}"], capture_output=True, text=True, timeout=120)
        subprocess.run([COMFY, "run", "--workflow", WFFILE, *HOST], capture_output=True, text=True, timeout=900)
        fn = None
        deadline = time.time() + 300
        while time.time() < deadline:
            time.sleep(3)
            try:
                with urllib.request.urlopen("http://127.0.0.1:8000/history?max_items=50", timeout=20) as r2:
                    hist = json.loads(r2.read())
            except Exception: continue
            for pid, h in hist.items():
                st = (h.get("status") or {}).get("status_str")
                for nid, o in (h.get("outputs") or {}).items():
                    for img in (o.get("images") or []):
                        f_ = img.get("filename", "")
                        if f_.startswith(f"qpd-regen-{slug}") and st == "success" and f_.endswith(".png"):
                            m = re.search(r"_(\d+)\.png$", f_)
                            if int(m.group(1)) > pre: fn = f_
            if fn: break
        if fn:
            data = urllib.request.urlopen(f"http://127.0.0.1:8000/view?filename={urllib.request.quote(fn)}&subfolder=&type=output", timeout=60).read()
            open(os.path.join(ART, f"cf-{slug}.png"), "wb").write(data)
            done = True; break
    print(slug, "->", "REGEN OK" if done else "ALL OFFS FAILED")
    json.dump({"regen": FLAGGED, "done": ok}, open(os.path.join(S, "pd-regen-state.json"), "w"))
