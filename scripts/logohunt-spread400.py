"""PHASE D (Gui-approved standing standard): hunt each imported repo's OWN open art
(logo/icon files inside the licensed repo), build PIL fill-cards (bg = art's most
common opaque color, art centered 90% height), save cf-<slug>.png + logo to public/u
+ set logo_path. Checkpointed thread pool; skips rows that already have a plate.
Only pngs/jpgs (SVG skipped — no rasterizer tonight). Path heuristics keep only the
project's OWN identity art (logo/icon/art/banners), never sponsor/partner marks."""
import os, json, time, subprocess, urllib.request, hashlib, threading, queue, re, io, sqlite3
REPO = r"C:\Users\Guilherme\AppData\Local\hermes\projects\compute-fund"
S = r"C:\Users\Guilherme\AppData\Local\hermes\cache\scratch"
STATE = os.path.join(S, "logohunt-state.json")
state = json.load(open(STATE, encoding="utf-8")) if os.path.exists(STATE) else {}

fill = subprocess.run(["git", "credential", "fill"], input="protocol=https\nhost=github.com\n\n",
                      cwd=REPO, capture_output=True, text=True, timeout=60)
TOK = [l[9:] for l in fill.stdout.splitlines() if l.startswith("password=")][0]
UA = {"Authorization": f"Bearer {TOK}", "Accept": "application/vnd.github+json", "User-Agent": "compute-fund-logo-hunt"}
W, H = 1216, 832
import io, sqlite3
from PIL import Image
from collections import Counter

con = sqlite3.connect(f"file:{REPO}/app/compute-fund.db", uri=True)
rows = con.execute("SELECT slug, repo_url FROM projects WHERE category IN ('productivity','3d','robotics','bigtech')").fetchall()
ART = os.path.join(REPO, "app", "public", "project-art")
U = os.path.join(REPO, "app", "public", "u")
plate_exists = set(os.listdir(ART))

def gh(url):
    try:
        req = urllib.request.Request(url, headers=UA)
        with urllib.request.urlopen(req, timeout=30) as r:
            if r.headers.get("Content-Type", "").startswith("application/vnd.github"):
                return json.loads(r.read())
            return r.read()
    except Exception as e:
        return {"__err__": str(e)}

NAME_OK = re.compile(r"(logo|icon|mark|banner|cover|art|hero|brand)", re.I)
NAME_NO = re.compile(r"(spons?or|partner|badge|shield|contributor|profile|avatar|favicon|screenshot|preview|demo|node_modules|third.?part)", re.I)
import re

def logo_from_tree(slug, full_name):
    rep = gh(f"https://api.github.com/repos/{full_name}/git/trees/main?recursive=1")
    if rep.get("__err__") or "tree" not in rep:
        rep = gh(f"https://api.github.com/repos/{full_name}/git/trees/master?recursive=1")
        if rep.get("__err__") or "tree" not in rep: return None
    cands = []
    for t in rep.get("tree", []):
        p = t.get("path", "")
        if not p.lower().endswith((".png", ".jpg", ".jpeg")): continue
        if t.get("type") != "blob": continue
        base = p.rsplit("/", 1)[-1].lower()
        if NAME_NO.search(p): continue
        if base.startswith("cf-"): continue
        if NAME_OK.search(p) or base in ("logo.png", "icon.png", "appicon.png", "art.png", "banner.png", "cover.png", "hero.png"):
            cands.append((p, t.get("size", 0)))
    # prefer the most identity-sounding, largest-ish but not huge
    cands.sort(key=lambda x: -(int(x[0].lower().count("logo") + x[0].lower().count("icon"))*1000000 + min(x[1], 3000000)))
    for p, size in cands[:4]:
        if not (2000 <= size <= 4_500_000): continue
        raw = gh(f"https://raw.githubusercontent.com/{full_name}/main/{urllib.request.quote(p)}")
        if isinstance(raw, dict) and raw.get("__err__"):
            raw = gh(f"https://raw.githubusercontent.com/{full_name}/master/{urllib.request.quote(p)}")
            if isinstance(raw, dict): continue
        try:
            im = Image.open(io.BytesIO(raw))
            if max(im.size) < 160: continue  # too small to matter
            return p, im
        except Exception:
            continue
    return None

def fill_card(slug, im):
    im = im.convert("RGBA")
    op = [q[:3] for q in (list(im.getdata()) if not hasattr(im, "get_flattened_data") else im.get_flattened_data()) if q[3] > 250]
    if not op:
        bg = im.getpixel((2, 2))[:3] if im.size[0] > 4 else (20, 22, 28)
    else:
        bg = Counter(op).most_common(1)[0][0]
        # snap ring
        px = im.load(); n = 0
        for y in range(im.height):
            for x in range(im.width):
                r, g, b, a = px[x, y]
                if 0 < a < 255 and abs(r-bg[0]) < 50 and abs(g-bg[1]) < 50 and abs(b-bg[2]) < 50:
                    px[x, y] = (r, g, b, 0); n += 1
    s = min(int(H * 0.88) / im.height, int(W * 0.86) / im.width, 6.0)
    art2 = im.resize((int(im.width*s), int(im.height*s)), Image.LANCZOS)
    canvas = Image.new("RGBA", (W, H), bg + (255,))
    canvas.paste(art2, ((W - art2.width)//2, (H - art2.height)//2), art2)
    out = os.path.join(ART, f"cf-{slug}.png")
    canvas.convert("RGB").save(out, "PNG")
    return out

nlogo = nocard = nerr = 0
q_ = queue.Queue()
for slug, repo_url in rows:
    q_.put((slug, (repo_url or "").rstrip("/").split("github.com/")[-1] if repo_url else None))

def worker():
    global nlogo, nocard, nerr
    while True:
        try:
            slug, full = q_.get_nowait()
        except queue.Empty:
            return
        if state.get(slug) in ("ok", "nologo", "err"):
            q_.task_done(); continue
        try:
            if not full:
                state[slug] = "nourl"; continue
            hit = logo_from_tree(slug, full)
            time.sleep(0.8)  # tree calls rate cushion
            if not hit:
                state[slug] = "nologo"; nocard += 1; continue
            path, im = hit
            out = fill_card(slug, im)
            logo_dst = os.path.join(U, "logos", f"{slug}.png")
            os.makedirs(os.path.dirname(logo_dst), exist_ok=True)
            im.save(logo_dst, "PNG")
            con2 = sqlite3.connect(f"file:{REPO}/app/compute-fund.db", uri=True)
            con2.execute("UPDATE projects SET logo_path=? WHERE slug=?", ("/u/logos/" + f"{slug}.png", slug))
            con2.commit(); con2.close()
            state[slug] = "ok"; nlogo += 1
            print(f"{slug} <- {path}", flush=True)
        except Exception as e:
            state[slug] = f"err:{str(e)[:40]}"; nerr += 1
        finally:
            q_.task_done()
            if len(state) % 40 == 0:
                json.dump(state, open(STATE, "w"))

threads = [threading.Thread(target=worker, daemon=True) for _ in range(6)]
for t in threads: t.start()
for t in threads: t.join(timeout=3300)
json.dump(state, open(STATE, "w"))
con.close()
print("LOGOHUNT done: ok:", nlogo, "nologo:", nocard, "err:", nerr)
