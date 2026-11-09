"""Sprint-400 regen round: 12 QA-failed plates, hand anchors with no text surfaces."""
import os, importlib.util, hashlib
_spec = importlib.util.spec_from_file_location("rsart", os.path.join(os.path.dirname(os.path.abspath(__file__)), "render-sprint-art.py"))
R = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(R)

TAIL = ", no text of any kind, no labels, no lettering, no signage, all screens show only soft defocused light, no people"
jobs = {
 "anthropic-cybersecurity-skills": ("A dark security shield silhouette rendered in soft green light floating above a desk", 0),
 "opendataloader-pdf": ("Neat stacks of clean paper sheets with softly glowing edges on a wooden desk", 0),
 "smsforwarder": ("A classic paper envelope resting on a dark desk with a single soft glow behind it", 0),
 "readest": ("An open hardcover book with softly glowing page edges on a wooden reading stand", 0),
 "swe-agent": ("An abstract network of glowing connected nodes floating in dark space", 0),
 "fluent-reader": ("A stack of clean paper sheets bound by a glowing bookmark ribbon on a dark desk", 0),
 "nasuno-song-humanizer": ("A professional studio microphone with glowing audio waveform light threads around it in a dark booth", 0),
 "meetingbar": ("A tidy wall of neat glowing calendar grid squares arranged in rows, fully defocused, dark room", 0),
 "lovelace-mushroom": ("A neat grid of small glowing rounded cards floating above a dark desk, gently defocused", 0),
 "deepcamera": ("A vintage film camera with glowing soft edges resting on dark velvet, moody still life", 0),
 "opendaw": ("A studio mixing desk with rows of glowing soft knobs and faders, fully defocused", 0),
 "tinysoundfont": ("Glowing sound bars rising softly from a dark studio floor, gentle teal glow, abstract", 0),
}
for slug, (prompt, salt) in jobs.items():
    p = os.path.join(R.ART, f"cf-{slug}.png")
    if os.path.exists(p): os.remove(p)
    R.api_set([f"57.text={prompt}{TAIL}", "57.width=1216", "57.height=832",
               f"57.seed={int(hashlib.sha1((slug+'r3').encode()).hexdigest()[:8],16)%10**7}",
               f"9.filename_prefix=cf-{slug}"])
    R.api_run()
    fn = R.fetch_output(f"cf-{slug}_", wait_s=90)
    if not fn: print(slug, "FETCH FAIL"); continue
    n = R.download(fn, p); print(slug, "ok", n//1024, "KB")
