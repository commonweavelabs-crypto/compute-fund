#!/usr/bin/env python3
"""Sprint art render pipeline — Compute Fund plates via local Z-Image-Turbo.

Renders cf-<slug>.png for every sprint project missing a plate, themed PER
PROJECT from its real desc/topics (recipe: compute-fund-platform skill
references/art-recipes.md). Idempotent: skips slugs with existing files.

Run: python scripts/render-sprint-art.py [--only slug1,slug2] [--sheet N]
"""
import hashlib, json, math, os, sqlite3, sys, time, urllib.request
from PIL import Image, ImageDraw

REPO = r"C:\Users\Guilherme\AppData\Local\hermes\projects\compute-fund"
DB = os.path.join(REPO, "app", "compute-fund.db")
WFILE = r"C:\Users\Guilherme\AppData\Local\hermes\cache\scratch\z_image_turbo.json"
ART = os.path.join(REPO, "app", "public", "project-art")
SERVER = "http://127.0.0.1:8000"
SIZE = (1216, 832)

STYLES = [
 "vibrant warm photo, golden natural light, rich saturated colors",
 "dark tech photo, charcoal surfaces, teal-green accent glow, moody cinematic",
 "neon retro photo, magenta and cyan glow, playful energy",
 "flat vector illustration, clean geometric shapes, generous negative space, vibrant two-tone palette",
 "moody retro photo, warm tungsten light with vivid accents",
]

# keyword -> concrete visual anchor (the lexicon; extend per future sprints)
LEX = [
 (("sleep","insomnia","bedtime"),"a cozy dim bedroom with a glowing crescent moon on the wall"),
 (("meditat","yoga","breath"),"a serene meditation cushion with softly glowing incense smoke"),
 (("pomodoro","timer","timebox"),"a bright analog kitchen timer on a tidy desk"),
 (("habit","streak"),"a wall of small colorful checkboxes glowing in a neat grid"),
 (("todo","task","productiv"),"a tidy minimal desk with neatly stacked colorful cards"),
 (("gym","fitness","workout"),"barbells with colorful rubber weight plates in a studio"),
 (("nutrition","calorie","diet","food"),"a wooden table with neat bowls of vibrant vegetables"),
 (("water","hydrat"),"a tall glass of water with droplets catching the light"),
 (("watch","wearable","smartwatch"),"a smartwatch with softly glowing activity rings"),
 (("health","heart"),"a glowing pulse line rendered as light in the dark"),
 (("gam","retro"),"a vintage game console with glowing cartridge and controller"),
 (("minecraft","voxel"),"a world of glowing little cubes stacked into hills"),
 (("mod","skin","loader"),"a desk with a row of colorful game figurines in front of a glowing screen"),
 (("rom","cartridge"), "a glowing game cartridge with a soft halo on dark velvet"),
 (("decomp","disassembl"), "an abstract wall of soft glowing hex shapes dissolving into particles"),
 (("network","proxy","api"),"glowing data streams weaving through abstract circuitry"),
 (("cloud","server","infra"),"neat glowing server racks in soft teal light"),
 (("db","database","sqlite"),"glowing translucent cubes neatly arranged in stacks"),
 (("keyboard","cli","terminal"),"a backlit mechanical keyboard with soft green glow"),
 (("focus","concen"),"a single warm desk lamp lighting a quiet workspace"),
 (("sleep"),"moonlight through a half-open window over a calm bed"),
 (("mood","ambient","sound"),"over-ear headphones floating among glowing sound arcs"),
 (("track","metric","stat"),"a clean dashboard of glowing minimal bar charts, defocused"),
 (("photo","image","pixel"),"a vintage camera glowing softly on layered colored papers"),
 ("default","an elegant desk scene with soft ambient light and subtle glowing accents"),
]

def lex_anchor(desc_topics):
    b = (desc_topics or "").lower()
    for keys, anchor in LEX:
        if any(k in b for k in keys):
            return anchor
    return "an elegant desk scene with soft ambient light and subtle glowing accents"

ILLO = {"moodist", "uhabits"}
def build_prompts():
    con = sqlite3.connect(DB)
    cur = con.cursor()
    rows = cur.execute("""SELECT slug, name, one_liner, category, subcategory FROM projects
        WHERE status='active' AND claimed=0 AND category IN ('wellness','modding','security')""").fetchall()
    con.close()
    out = []
    for slug, name, one_liner, cat, sub in rows:
        if os.path.exists(os.path.join(ART, f"cf-{slug}.png")):
            continue  # idempotent
        cat = (cat or "").replace("-"," ")
        sub = sub or ""
        style = STYLES[hash(slug) % len(STYLES)]
        anchor = lex_anchor(one_liner)
        if "illustration" in style:
            # RECIPE LAW v2 (2026-11-08 sprint learn): NEVER put the project NAME in
            # the prompt — the model letterizes it and misspells/brands devices
            # (22%+ garble rate with names). Name-plates are opt-in with mandatory QA.
            prompt = (f"Flat vector illustration of {anchor}, clean modern shapes, "
                      f"generous negative space, vibrant harmonious palette, no text anywhere, "
                      f"no logos, no labels, no lettering of any kind, balanced composition")
        else:
            prompt = (f"{anchor}, {style}, every surface smooth and completely unmarked, "
                      f"no text of any kind, no labels, no logos, no lettering, no signage, "
                      f"all screens show only soft defocused light, no people")
        out.append({"slug": slug, "name": name, "prompt": prompt,
                    "seed": int(hashlib.sha1(slug.encode()).hexdigest()[:8], 16) % 10**7})
    return out

def api_set(overrides):
    import subprocess
    args = ["C:/Users/Guilherme/AppData/Local/hermes/bin/comfy.exe", "workflow", "set-slot", WFILE,
            "--host", "127.0.0.1", "--port", "8000"] + overrides
    r = subprocess.run(args, capture_output=True, text=True, timeout=120)
    if r.returncode != 0:
        raise RuntimeError(r.stdout[-200:] + r.stderr[-200:])

def api_run():
    import subprocess
    r = subprocess.run(["C:/Users/Guilherme/AppData/Local/hermes/bin/comfy.exe", "run",
                        "--workflow", WFILE, "--host", "127.0.0.1", "--port", "8000"],
                       capture_output=True, text=True, timeout=600)
    # per recipe: don't trust exit; verify via jobs dir + history
    return r.returncode

def fetch_output(prefix, wait_s=90):
    deadline = time.time() + wait_s
    last = None
    while time.time() < deadline:
        time.sleep(3)
        try:
            with urllib.request.urlopen(f"{SERVER}/history?max_items=10", timeout=30) as r:
                hist = json.loads(r.read())
        except Exception as e:
            last = str(e)[:60]; continue
        for pid, h in hist.items():
            outs = (h.get("outputs") or {})
            for nid, o in outs.items():
                for img in (o.get("images") or []):
                    if img.get("filename", "").startswith(prefix):
                        return img["filename"]
    print(f"  fetch timed out for {prefix} (last: {last})")
    return None

def download(filename, dst):
    data = urllib.request.urlopen(f"{SERVER}/view?filename={filename}&subfolder=&type=output", timeout=30).read()
    open(dst, "wb").write(data)
    return len(data)

def render_one(slug, prompt, seed):
    import subprocess
    esc = prompt.replace('"', "'")
    api_set([f"57.text={esc}", f"57.width={SIZE[0]}", f"57.height={SIZE[1]}",
             f"57.seed={seed}", f"9.filename_prefix=cf-{slug}"])
    rc = api_run()
    fn = fetch_output(f"cf-{slug}_")
    if not fn:
        raise RuntimeError(f"no output for {slug} (rc={rc})")
    dst = os.path.join(ART, f"cf-{slug}.png")
    n = download(fn, dst)
    return n

def contact_sheet(slugs, out_path):
    TH_W = 400; thumb_h = int(TH_W * SIZE[1] / SIZE[0]); cols = 2
    rows_n = math.ceil(len(slugs) / cols); pad, label_h = 12, 26
    W = cols * TH_W + (cols + 1) * pad
    H = rows_n * (thumb_h + label_h) + (rows_n + 1) * pad
    sheet = Image.new("RGB", (W, H), (18, 26, 31))
    d = ImageDraw.Draw(sheet)
    for i, s in enumerate(slugs):
        im = Image.open(os.path.join(ART, f"cf-{s}.png")).resize((TH_W, thumb_h), Image.LANCZOS)
        x = pad + (i % cols) * (TH_W + pad); y = pad + (i // cols) * (thumb_h + label_h + pad)
        sheet.paste(im, (x, y))
        d.text((x + 2, y + thumb_h + 6), f"[{i}] {s[:38]}", fill=(235, 235, 235))
    sheet.save(out_path)

def main():
    only = None
    if "--only" in sys.argv:
        only = sys.argv[sys.argv.index("--only") + 1].split(",")
    batch_sheet = 10
    if "--sheet" in sys.argv:
        batch_sheet = int(sys.argv[sys.argv.index("--sheet") + 1])
    jobs = build_prompts()
    if only:
        jobs = [j for j in jobs if j["slug"] in set(only)]
    print(f"{len(jobs)} plates to render")
    for i, j in enumerate(jobs):
        t0 = time.time()
        try:
            n = render_one(j["slug"], j["prompt"], j["seed"])
            print(f"[{i+1}/{len(jobs)}] {j['slug']} ok {n//1024}KB in {time.time()-t0:.0f}s")
        except Exception as e:
            print(f"[{i+1}/{len(jobs)}] {j['slug']} FAIL {type(e).__name__}: {str(e)[:80]}")
        time.sleep(0.5)

if __name__ == "__main__":
    main()
