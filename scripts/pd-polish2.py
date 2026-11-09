"""Final PD polish: nosferatu-dvd-quality (melted faces) + thegeneral (film-strip
frame artifact) -> clean frames at fresh offsets, one regen each."""
import os, json, time, subprocess, urllib.request, re, hashlib
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
          "poses exactly recognizable; render faces with clear, sharp, fully-detailed features (no smearing); the "
          "scene shows its characters in action with NO title cards and NO written words visible; frame the shot as "
          "a clean photograph of the scene itself - no film strip edges, no sprocket holes, no projector artifacts; "
          "repaint with rich modern color grading - deep teal shadows, warm amber key light, soft film grain; "
          "full-bleed edge to edge, no borders; no writing anywhere")
JOBS = [("nosferatu-dvd-quality", 0.62), ("thegeneral", 0.23)]
con = __import__("sqlite3").connect(f"file:{REPO}/app/compute-fund.db?mode=ro", uri=True)
links = dict(con.execute("SELECT slug, links FROM projects WHERE subcategory='public-domain revival'").fetchall())
con.close()
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
for slug, frac in JOBS:
    ident = json.loads(links[slug])[0]["url"].rsplit("/", 1)[-1]
    meta = json.loads(urllib.request.urlopen(urllib.request.Request(f"https://archive.org/metadata/{ident}", headers=UA), timeout=25).read())
    vids = [f for f in meta.get("files", []) if "h.264" in (f.get("format", "") or "") or f.get("name", "").endswith(".mp4")]
    vids.sort(key=lambda f: int(f.get("size", 0) or 0), reverse=True)
    f0 = vids[0]
    L = str(f0.get("length", "600")); 
    if ":" in L:
        parts = [float(x) for x in L.split(":")]; dur = parts[0]*3600 + parts[1]*60 + (parts[2] if len(parts) > 2 else 0)
    else: dur = float(L)
    url = f"https://archive.org/download/{ident}/{urllib.request.quote(f0['name'])}"
    out = os.path.join(S, f"polish_still_{slug}.jpg")
    subprocess.run([FF, "-y", "-ss", str(int(dur*frac)), "-i", url, "-frames:v", "1", "-q:v", "2", out],
                   capture_output=True, timeout=200)
    from PIL import Image, ImageFilter
    src = Image.open(out).convert("RGB")
    w0, h0 = src.size; nh = int(w0 / (W / H))
    if nh <= h0:
        top = (h0-nh)//2; crop = src.crop((0, top, w0, top+nh))
    else:
        nw = int(h0*(W/H)); left = (w0-nw)//2; crop = src.crop((left, 0, left+nw, h0))
    up = crop.resize((W, H), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=2, percent=80, threshold=2))
    upname = f"polish_in_{slug}.png"; up.save(os.path.join(S, upname), "PNG")
    subprocess.run([COMFY, "upload", os.path.join(S, upname), "--overwrite", *HOST], capture_output=True, text=True, timeout=120)
    pre = max_suffix(f"qpd-pol-{slug}")
    seed = int(hashlib.sha1(("pol" + slug).encode()).hexdigest()[:8], 16) % 10**7
    subprocess.run([COMFY, "workflow", "set-slot", WFFILE, *HOST,
                    f"78.image={upname}", f"433.prompt={PROMPT}", f"433.seed_1={seed}",
                    f"469.filename_prefix=qpd-pol-{slug}"], capture_output=True, text=True, timeout=120)
    subprocess.run([COMFY, "run", "--workflow", WFFILE, *HOST], capture_output=True, text=True, timeout=900)
    fn = None; deadline = time.time() + 280
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
                    if f_.startswith(f"qpd-pol-{slug}") and st == "success" and f_.endswith(".png"):
                        m = re.search(r"_(\d+)\.png$", f_)
                        if int(m.group(1)) > pre: fn = f_
        if fn: break
    if fn:
        data = urllib.request.urlopen(f"http://127.0.0.1:8000/view?filename={urllib.request.quote(fn)}&subfolder=&type=output", timeout=60).read()
        open(os.path.join(ART, f"cf-{slug}.png"), "wb").write(data)
        print(slug, "POLISHED")
    else:
        print(slug, "FETCH FAIL")
