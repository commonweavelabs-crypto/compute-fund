"""Final regen round 3 for 4 stubborn plates — hand anchors with zero text surfaces."""
import os, sys, time, hashlib, importlib.util
_spec = importlib.util.spec_from_file_location("rsart", os.path.join(os.path.dirname(os.path.abspath(__file__)), "render-sprint-art.py"))
R = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(R)

ART = R.ART
jobs = {
 "hevy-mcp": ("Photo of a neat row of brand-new smooth glossy kettlebells in navy blue yellow and red, completely blank smooth faces with zero markings, warm soft studio light, dark seamless background, no people", 0),
 "kkmanager": ("Flat vector illustration of a neat stack of colorful blank game cartridges and two plain controllers, clean geometric shapes, vibrant palette, generous negative space, no text anywhere no logos no labels", 1),
 "fireaxe": ("Photo of a dark retro game cartridge on a velvet pad, its top surface a smooth unmarked matte finish, a single soft amber glow behind it, moody dark still life, no text no labels", 2),
 "th06": ("Photo of a dark vintage handheld console lying face down on charcoal felt, smooth unmarked back shell, a soft golden rim light tracing its edge, moody still life, no text anywhere", 3),
}
for slug, (prompt, salt) in jobs.items():
    p = os.path.join(ART, f"cf-{slug}.png")
    if os.path.exists(p): os.remove(p)
    R.api_set([f"57.text={prompt}", "57.width=1216", "57.height=832",
               f"57.seed={int(hashlib.sha1((slug+'r2').encode()).hexdigest()[:8],16)%10**7}",
               f"9.filename_prefix=cf-{slug}"])
    R.api_run()
    fn = R.fetch_output(f"cf-{slug}_", wait_s=90)
    if not fn:
        print(slug, "FETCH FAIL"); continue
    n = R.download(fn, p)
    print(slug, "ok", n//1024, "KB")
