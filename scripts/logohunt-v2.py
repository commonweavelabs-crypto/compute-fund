"""PHASE D v2 (robust): rate-aware logo hunt for the spread-400 lanes.
- gh(): JSON API responses parsed; non-JSON API responses (rate-limit pages)= error
  object honouring Retry-After/x-ratelimit-reset (bounded wait); raw assets = bytes.
- 3 workers (~1.5 req/s sustained), state errors RETRY (only ok/nologo/nourl final).
- Each clean hit: PIL fill-card (bg = art's most common opaque color; AA ring snapped
  to transparent; art centered) -> cf-<slug>.png + logo copy to /u/logos + logo_path."""
import os, json, time, subprocess, urllib.request, urllib.error, threading, queue, re, io, sqlite3
REPO = r"C:\Users\Guilherme\AppData\Local\hermes\projects\compute-fund"
S = r"C:\Users\Guilherme\AppData\Local\hermes\cache\scratch"
STATE = os.path.join(S, "logohunt-state.json")
state = json.load(open(STATE, encoding="utf-8")) if os.path.exists(STATE) else {}
for k in [k for k, v in state.items() if isinstance(v, str) and v.startswith("err")]:
    del state[k]  # transient failures retry

fill = subprocess.run(["git", "credential", "fill"], input="protocol=https\nhost=github.com\n\n",
                      cwd=REPO, capture_output=True, text=True, timeout=60)
TOK = [l[9:] for l in fill.stdout.splitlines() if l.startswith("password=")][0]
UA = {"Authorization": f"Bearer {TOK}", "Accept": "application/vnd.github+json", "User-Agent": "compute-fund-logo-hunt"}
W, H = 1216, 832
ART = os.path.join(REPO, "app", "public", "project-art")
U = os.path.join(REPO, "app", "public", "u")
from PIL import Image
from collections import Counter

ratelock = threading.Lock()
until_ts = [0]

def gh(url):
    with ratelock:
        wait = until_ts[0] - time.time()
        if wait > 0: time.sleep(min(wait, 30))
    try:
        req = urllib.request.Request(url, headers=UA)
        with urllib.request.urlopen(req, timeout=30) as r:
            ct = r.headers.get("Content-Type", "")
            body = r.read()
    except urllib.error.HTTPError as e:
        h = e.headers or {}
        if e.code in (403, 429):
            ra = h.get("Retry-After"); reset = h.get("x-ratelimit-reset")
            with ratelock:
                if ra and ra.isdigit(): until_ts[0] = max(until_ts[0], time.time() + min(int(ra), 120))
                elif reset and reset.isdigit(): until_ts[0] = max(until_ts[0], min(int(reset), time.time() + 120))
        return {"__err__": f"http{e.code}"}
    except Exception as e:
        return {"__err__": str(e)[:60]}
    if ct.startswith(("image/", "binary/octet-stream")) or not ct.startswith(("application/json", "text/plain")):
        return body  # raw asset bytes
    try:
        return json.loads(body)
    except Exception:
        return {"__err__": "nonjson"}

NAME_OK = re.compile(r"(logo|icon|mark|banner|cover|art|hero|brand)", re.I)
NAME_NO = re.compile(r"(spons?or|partner|badge|shield|contributor|profile|avatar|favicon|screenshot|preview|demo|node_modules|third.?part)", re.I)

def logo_from_tree(slug, full_name):
    rep = gh(f"https://api.github.com/repos/{full_name}/git/trees/main?recursive=1")
    if isinstance(rep, dict) and (rep.get("__err__") or "tree" not in rep):
        rep = gh(f"https://api.github.com/repos/{full_name}/git/trees/master?recursive=1")
    if isinstance(rep, bytes) or not isinstance(rep, dict) or "tree" not in rep: return None
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
    cands.sort(key=lambda x: -(int(x[0].lower().count("logo") + x[0].lower().count("icon"))*1000000 + min(x[1], 3000000)))
    for p, size in cands[:4]:
        if not (2000 <= size <= 4_500_000): continue
        raw = gh(f"https://raw.githubusercontent.com/{full_name}/main/{urllib.request.quote(p)}")
        if isinstance(raw, dict) and raw.get("__err__"):
            raw = gh(f"https://raw.githubusercontent.com/{full_name}/master/{urllib.request.quote(p)}")
            if isinstance(raw, dict): continue
        try:
            im = Image.open(io.BytesIO(raw))
            if max(im.size) < 160: continue
            return p, im
        except Exception:
            continue
    return None

def fill_card(slug, im):
    im = im.convert("RGBA")
    try:
        data = list(im.getdata())
    except Exception:
        data = list(im.get_flattened_data()) if hasattr(im, "get_flattened_data") else []
    op = [q[:3] for q in data if q[3] > 250]
    bg = Counter(op).most_common(1)[0][0] if op else im.getpixel((2, 2))[:3]
    px = im.load(); n = 0
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if 0 < a < 255 and abs(r-bg[0]) < 50 and abs(g-bg[1]) < 50 and abs(b-bg[2]) < 50:
                px[x, y] = (r, g, b, 0); n += 1
    s = min((int(H * 0.88) if op else int(H * 0.94)) / im.height,
            (int(W * 0.86) if op else int(W * 0.94)) / im.width, 6.0)
    art2 = im.resize((int(im.width*s), int(im.height*s)), Image.LANCZOS)
    canvas = Image.new("RGBA", (W, H), bg + (255,))
    canvas.paste(art2, ((W - art2.width)//2, (H - art2.height)//2), art2)
    out = os.path.join(ART, f"cf-{slug}.png")
    canvas.convert("RGB").save(out, "PNG")
    return out

con = sqlite3.connect(f"file:{REPO}/app/compute-fund.db", uri=True)
rows = con.execute("SELECT slug, repo_url FROM projects WHERE category IN ('productivity','3d','robotics','bigtech')").fetchall()
q_ = queue.Queue()
for slug, repo_url in rows: q_.put((slug, (repo_url or "").rstrip("/").split("github.com/")[-1] if repo_url else None))

cnt = {"ok": 0, "nologo": 0, "err": 0}
def worker():
    while True:
        try:
            slug, full = q_.get_nowait()
        except queue.Empty:
            return
        if state.get(slug) in ("ok", "nologo", "nourl"):
            q_.task_done(); continue
        try:
            if not full:
                state[slug] = "nourl"
            else:
                hit = logo_from_tree(slug, full)
                if not hit:
                    state[slug] = "nologo"; cnt["nologo"] += 1
                else:
                    path, im = hit
                    fill_card(slug, im)
                    logo_dst = os.path.join(U, "logos", f"{slug}.png")
                    os.makedirs(os.path.dirname(logo_dst), exist_ok=True)
                    im.save(logo_dst, "PNG")
                    con2 = sqlite3.connect(f"file:{REPO}/app/compute-fund.db", uri=True)
                    con2.execute("UPDATE projects SET logo_path=? WHERE slug=?", ("/u/logos/" + f"{slug}.png", slug))
                    con2.commit(); con2.close()
                    state[slug] = "ok"; cnt["ok"] += 1
                    print(f"{slug} <- {path}", flush=True)
        except Exception as e:
            state[slug] = f"err:{str(e)[:40]}"; cnt["err"] += 1
        finally:
            q_.task_done()
            if (cnt["ok"] + cnt["nologo"] + cnt["err"]) % 50 == 0:
                json.dump(state, open(STATE, "w"))

threads = [threading.Thread(target=worker, daemon=True) for _ in range(3)]
for t in threads: t.start()
t_end = time.time() + 3300
while time.time() < t_end:
    if q_.unfinished_tasks == 0: break
    time.sleep(5)
for t in threads: t.join(timeout=180)
json.dump(state, open(STATE, "w"))
con.close()
print("LOGOHUNT v2 done:", dict(cnt), "| state size:", len(state))
