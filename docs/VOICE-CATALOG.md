# COMPUTE FUND — VOICE CATALOG
Approved narrator voices for Compute Fund videos. Each entry = cloned-from-reference
identity kept in `refs/` (16k mono wav), demo clips in `samples/`, render recipe below.
Render engine: VoxCPM2 (openbmb/VoxCPM2) via the ComfyUI venv
(`C:/Users/Guilherme/Documents/ComfyUI/.venv/Scripts/python.exe`), style-tag steering,
chunked manifests, `dynaudnorm` concat + libopus 64k delivery. Sample-rate law:
`model.tts_model.sample_rate` only.

## EMMA — the platform's digital avatar 🟢 STANDING CAST
- **persona:** "Emma" — digital avatar of Compute Fund; onboarding narrator (gaming first)
- **voice source:** LibriVox public-domain reader (solo read of *Emma* by Jane Austen,
  archive.org id `emma_mt_librivox`) — cloned via VoxCPM2, zero pitch manipulation
- **license:** public domain recording (LibriVox PD dedication)
- **measured:** F0 ≈ 184 Hz native · pace ≈ 2.85 w/s
- **style map used in v3 render:** intro `(bright, friendly)` → story `(contemplative)` →
  law `(low, controlled)` → creators `(resolved)` → keys `(warm)` → fork `(calm, confident)`
  → values `(animated)` → close `(resolved, warm)`
- **samples:** `samples/EMMA_intro.ogg` (self-intro), `samples/EMMA_upbeat1..3.ogg`
  (energy variants), `samples/EMMA_full-onboarding.ogg` (full 2:46 v3),
  `../video-gaming-v3-emma-onboarding.ogg` (repo copy)
- **ref:** `refs/EMMA_ref.wav` (45s @65s of `emma_mt_librivox` ch01)
- **status:** approved by Gui 2026-11-10 ("Great, save Emma")
- **gui's note:** plate-4 of the 10-plate audition; he picked it over 9 alternatives

## STANDING CAST (approved by Gui 2026-11-10)
| name | voice source (PD LibriVox solo) | F0 Hz | character | ref | sample |
|---|---|---|---|---|---|
| **EMMA** ✅ avatar | emma_mt_librivox | 184 | warm mid, the platform's digital avatar | refs/EMMA_ref.wav | samples/EMMA_intro.ogg |
| **PERSUA** | persuasion_0912_librivox (v5) | 208 | measured, composed | refs/PERSUA_ref.wav | samples/PERSUA_sample.ogg |
| **HEIDI** | heidi_solo_librivox | 198 | gentle, clear | refs/HEIDI_ref.wav | samples/HEIDI_sample.ogg |
| **NORTHANGER** | northangerabbeydramatic_1502_librivox | 203 | narrator energy, dramatic-trained | refs/NORTHANGER_ref.wav | samples/NORTHANGER_sample.ogg |
| **DAISY** | daisy_miller_0708_librivox | 178 | warm, low, intimate | refs/DAISY_ref.wav | samples/DAISY_sample.ogg |

Identification method (Gui re-shares = byte-exact): his 4 picked audio files matched
my sent oggs' exact byte sizes (plate_07/08/09/10 = 90160/84417/105819/109379 B) —
no fingerprinting needed. His voice note confirmed the four-re-share intent.

## AUDITION POOL (vetted 2026-11-10, public-domain LibriVox solos)
| # | source id | F0 Hz | wps | note |
|---|---|---|---|---|
| 1 | jane_eyre_ver03_0809_librivox | 200 | 2.55 | classic steady |
| 2 | jane_eyre_2208_librivox | 239 | 1.78 | youngest/brightest, modern rec |
| 3 | sense_sensibility_ver3_ek | 205 | 2.76 | Klett, crisp |
| 4 | **emma_mt_librivox → EMMA** ✅ | 184 | 2.85 | picked |
| 5 | emma_1903_librivox | 242 | 2.68 | bright brisk |
| 6 | wuthering_heights_0801_librivox | 235 | 2.21 | bright expressive |
| 7 | persuasion_0912_librivox | 208 | 1.88 | measured |
| 8 | heidi_solo_librivox | 198 | 2.52 | gentle |
| 9 | northangerabbeydramatic_1502_librivox | 203 | n/a | narrator energy |
| 10 | daisy_miller_0708_librivox | 178 | n/a | low warm |
Earlier rejected-by-Gui: karen (anne_of_green_gables, 164) "cartoon-adjacent", annie
(solo_pride, 242), klett narrator (paying_guest, 184 — same F0 class as Emma).

## ADD-A-VOICE RULE (Gui's Q, answered 2026-11-10)
ANY new sample (voice memo, mp3, wav — 20-45s of clean speech) can be added as a
reference ref and cloned by VoxCPM2. Consent/license is the standing gate: Gui's own
recordings + licensed/PD sources + any voice with a yes on record = instant add; a
named person's voice without consent = not clonable (platform line, recorded in
link-archive entry 29SyCndnMZs).

## RENDER RECIPE (canonical, from the proven runs)
1. ref: `ffmpeg -i <src> -t 45 -ac 1 -ar 16000 ref.wav` (skip spoken intros: -ss 65)
2. manifest: chunks ~40-90 words at beat boundaries, style tag + text (NO space)
3. driver: load model ONCE, loop chunks, skip-existing (idempotent), `HF_HUB_OFFLINE=1`
4. concat: `ffmpeg -f concat -safe 0 -i list.txt -ar 48000 -af dynaudnorm=f=250:g=7`
5. deliver: libopus 64k ogg · QA: faster_whisper base chunk0+last
