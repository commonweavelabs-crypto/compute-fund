"""PHASE A part 2: standard fill-cards for every 1024 icon (Gui-approved standard).
bg color = the icon file's own most-common opaque color (the tile blue IS the bg);
partial-alpha blue-ish ring pixels snapped to transparent; art centered at 90% height.
Output: app/public/project-art/cf-<app>.png (overwrites ref-run staged versions)."""
import os, json
from PIL import Image
from collections import Counter
S = r"C:\Users\Guilherme\AppData\Local\hermes\cache\scratch"
ART = r"C:\Users\Guilherme\AppData\Local\hermes\projects\compute-fund\app\public\project-art"
W, H = 1216, 832
apps = ["photocraft", "craft-anything", "pdfcraft", "wordcraft", "filmcraft", "lightcraft",
        "vectorcraft", "effectcraft", "cadcraft", "gridcraft", "designcraft", "deckcraft",
        "soundcraft", "figcraft", "texturecraft", "materialcraft"]
built = []
for app in apps:
    p = os.path.join(S, "icons1024", f"{app}-1024.png")
    if not os.path.exists(p):
        # hicolor 512 fallback name
        p = os.path.join(S, "icons1024", f"{app}-1024.png")
        continue
    art = Image.open(p).convert("RGBA")
    c = Counter(q[:3] for q in art.get_flattened_data() if q[3] > 250) if hasattr(art, "get_flattened_data") else Counter(q[:3] for q in list(art.getdata()) if q[3] > 250)
    if not c: continue
    bg = c.most_common(1)[0][0]
    # snap partial-alpha bg-colored px (the AA ring) to transparent
    px = art.load(); w, h = art.size; n = 0
    tol = 50
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if 0 < a < 255 and abs(r-bg[0]) < tol and abs(g-bg[1]) < tol and abs(b-bg[2]) < tol:
                px[x, y] = (r, g, b, 0); n += 1
    s = int(H * 0.9) / h
    art2 = art.resize((int(w*s), int(h*s)), Image.LANCZOS)
    canvas = Image.new("RGBA", (W, H), bg + (255,))
    canvas.paste(art2, ((W - art2.width)//2, (H - art2.height)//2), art2)
    out = os.path.join(ART, f"cf-{app}.png")
    canvas.convert("RGB").save(out, "PNG")
    built.append((app, bg, n))
    # also refresh the public/u logo with the 1024 (detail-page logos go crisp!)
    logo = os.path.join(ART, "..", "u", f"artcraft-{app}.png")
    import shutil; shutil.copy(p, logo)
print("built:", len(built))
for b in built: print("  ", b)
