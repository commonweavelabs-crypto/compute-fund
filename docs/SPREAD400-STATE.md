# SPREAD-400 OVERNIGHT STATE (updated as phases land — read me first on any compaction)

Gui-approved 2026-11-08 late: ALL of it runs overnight (computer stays on).

## Standing laws approved this session
- **OPEN-ART STD (STANDING):** a project's own open-licensed artwork (logo/images) gets
  imported and used — logo with a bg color => FILL-CARD: bg fills the whole card,
  art centered (pure PIL, no AI). This is the standard for any project with clean art.
- FILM/PD cards: real frames from the film file (ffmpeg remote seek) → Qwen-Image-Edit
  2509 restage (denoise 1.0 → fresh pixels, grain covers upscale; input = pre-scaled
  1216x832 unsharp canvas; prompt = restage/cinematic, NO "poster" word (letterizes
  captions!), no-text clause hard, full-bleed clause). PROVEN on The Pawnshop v3 SHIP.
- Platforms = FILTER not category (Gui confirmed). Search = star-weighted FTS w/ filters.
- Gui QC: first ~10 renders + final sampled reviews; Gui reviews all later.

## Phases (checkbox as they land)
- [x] PHASE 0: sweep done (896 raw) docs/sweep-spread400.json
- [in-progress] PHASE A: 17 artcraft 1024 icons → fill-cards (PIL) → cf-<slug>.png
  (rename standard, overwrite any cfref-* predecessors) → art-map + thumbs
- [ ] PHASE B: 60 PD films → real frame → Qwen-Edit restage (cf-<slug>.png) — frames
  cached in scratch/hq_still_<>.jpg; items only stream 320x240 → feed pre-upscaled canvas
- [ ] PHASE C: curation of 896 → import (~700-900): license law + junk screens + dedupe
  + star floors per lane; bigtech extra-strict (MIT/Apache/BSD, trademarks out)
- [ ] PHASE D: logo hunt per imported row (tree scan assets/app-icon|logo|icon paths) →
  PIL fill-cards for clean-logo rows
- [ ] PHASE E: Z-Image-Turbo batch for logo-less rows (per-project hand anchors,
  anchor-dedupe law, no-name law)
- [ ] PHASE F: code — platforms column + populate (topics/lang heuristics), discover
  filter chips, /api/search + header search (star-weighted), bigtech homepage carousel
- [ ] PHASE G: build + deploy + purge + verify + QA sheets + sampled regens + commits + TTS

## Key file paths
- Repo: C:\Users\Guilherme\AppData\Local\hermes\projects\compute-fund
- Qwen-Edit workflow file: C:\Users\Guilherme\AppData\Local\hermes\cache\scratch\qwen_edit2509.json
  (slots: 78.image / 433.prompt / 433.seed_1 / 469.filename_prefix — CLI set-slot; the
  433 pack = uuid subgraph, prompt NOT in widgets_values)
- comfy.exe = C:\Users\GUILHERME\AppData\Local\hermes\bin\comfy.exe + HOST flags REQUIRED
  (--host 127.0.0.1 --port 8000; upload defaults to 8188 and 10061s without them)
- ffmpeg = C:\Users\Guilherme\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_...
  \ffmpeg-8.1.2-full_build\bin\ffmpeg.exe (search "which ffmpeg" again if needed)
- SaveImageAdvanced filenames = <prefix>_00001.png (NO trailing underscore — the regex
  law differs from Z-Image's _000NN_!) fetch via /view?filename=...&type=output
- archive items: real ids CASE-VARIANT vs slugs (DB links carry the real ids — always
  parse ident from the row's links[0].url); .thumbs/ = tiny 160x110 — USELESS; use the
  video frame via ffmpeg (item file format h.264/mp4, biggest size, length = "mm:ss" or s)
- fill-card bg law: sample tile blue from the 1024 art itself (most-common opaque color),
  NOT the 128px icon; snap partial-alpha blue-ish ring px to a=0; art = transparent-bg
  1024 file per app repo assets/app-icon/<name>-1024.png (hicolor/512x512 fallback)

## Gotchas burned
- background launch BEFORE the script exists = rc2 instantly (launch AFTER writing)
- sweep script needed `import subprocess` (git credential fill)
- vision QA of a 6-pair sheet = too lenient; individual full-bleed checks caught the
  floating-island + caption-band failures
