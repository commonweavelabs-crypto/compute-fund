"""PHASE A: fetch 1024px icons for every artcraft app repo; fallback hicolor 512."""
import urllib.request, json, os, re, time
S = r"C:\Users\Guilherme\AppData\Local\hermes\cache\scratch"
ICON_DIR = os.path.join(S, "icons1024")
os.makedirs(ICON_DIR, exist_ok=True)
APPS = ["photocraft", "artcraft", "craft-anything", "pdfcraft", "wordcraft", "filmcraft",
        "lightcraft", "vectorcraft", "effectcraft", "cadcraft", "gridcraft", "designcraft",
        "deckcraft", "soundcraft", "figcraft", "texturecraft", "materialcraft", "anicraft"]
def exists(url):
    try:
        r = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "icon-hunt"}), timeout=20)
        return r.read()
    except Exception:
        return None
ok = 0
for app in APPS:
    dst = os.path.join(ICON_DIR, f"{app}-1024.png")
    if os.path.exists(dst) and os.path.getsize(dst) > 20000:
        ok += 1; continue
    got = None
    for variant in (f"https://raw.githubusercontent.com/storytold/{app}/main/assets/app-icon/{app}-1024.png",
                    f"https://raw.githubusercontent.com/storytold/{app}/main/assets/app-icon/hicolor/512x512/apps/ai.storyteller.{app}.png",
                    f"https://raw.githubusercontent.com/storytold/{app}/main/assets/app-icon/{app}-512.png",
                    f"https://raw.githubusercontent.com/storytold/{app}/main/assets/app-icon/hicolor/scalable/apps/ai.storyteller.{app}.svg"):
        data = exists(variant)
        if data:
            if variant.endswith(".svg"):
                print(app, "SVG only — needs rasterizer, saving"); dst_svg = dst + ".svg"
                open(dst_svg, "wb").write(data)
                got = dst_svg
            else:
                open(dst, "wb").write(data); got = dst
            break
    if got and not got.endswith(".svg"):
        from PIL import Image
        im = Image.open(got); print(app, "->", im.size); ok += 1
    elif got:
        print(app, "svg saved (rasterize later)")
    else:
        print(app, "-> NOT FOUND")
json.dump({"status": "phaseA-icons"}, open(os.path.join(S, "phaseA-done.json"), "w"))
print("high-res icons ready:", ok, "of", len(APPS))
