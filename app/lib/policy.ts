// The Compute Fund Content Policy — single source of truth (served at
// /policy/content, linked from the project-wizard agreement gate, Gui's
// legal/ethics document 2026-11-09). VERSION const = the gate's record field.
export const POLICY_VERSION = "content-policy-2026-11-1";

export const POLICY_MARKDOWN = `
COMPUTE FUND — CONTENT POLICY
=============================
version: ${POLICY_VERSION} · applies when you open a project · plain language, on purpose

THE ONE IDEA BEHIND THIS PAGE
-----------------------------
Compute Fund exists to fund work that can be owned, forked and receipted — not to
host rip-offs. You own what you make. You respect what you don't. Everything below
is that sentence, spelled out.

WHAT'S FAIR GAME
----------------
* **Functionality is not copyrighted.** Courts have held this for decades — look up
  *Sega v. Accolade* (1992) and *Sony Computer Entertainment v. Connectix* (2000):
  independent re-implementation and clean-room reverse engineering were legal in both.
  In 2026, *Two Minute Papers* put it plainly to 1.6M people: "the functionality of
  software isn't necessarily protected by copyright."
* **Recompilations, decompilations, ports, compat layers** — rebuilding how a program
  WORKS from scratch (or with tools) is lawful engineering. Our gaming categories
  (decomp & preservation, recomp ports) exist for exactly this.
* **AI-assisted rebuilds count as rebuilding.** The tool you use doesn't decide the
  law; what ends up in the artifact does. A model that studies behavior and writes
  new code is the Connectix playbook, sped up.
* **Your own code, your own assets, permissively-licensed code (MIT/Apache/BSD...),
  and anything genuinely public domain.** Fork first, copy never.

WHAT'S NOT OK — THE HARD LINES
------------------------------
* **Assets are copyrighted.** Textures, models, sprites, audio, music, fonts,
  characters, names-as-brands: if you didn't make them or license them, don't ship
  them here. "The functionality was rebuilt legally" does not launder someone else's
  art. A legal clean-room recomp with ripped textures is still a violation.
* **"Renamed" is still the same thing.** A recreation of a specific existing game
  — renamed, restyled, "inspired" — that reproduces its assets, maps, story,
  characters or trade dress is not a fork. Forks build ON an open base. Clones
  build AROUND a closed one. We accept the first; never the second.
* **No trademarks as identity.** Name your project its own name. Referencing a game
  to describe what you're building = fine (descriptive use). Baking a company's
  logo into your branding = not fine.
* **No DRM circumvention, no piracy tooling, no stolen paid content.** Reverse
  engineering for compatibility or research = lawful. Cracking = not ours.

HOW WE HANDLE A VIOLATION
-------------------------
* **Your clause, your word:** the "I agree" you check below says you own your rights
  and you've followed this page. If you didn't, that's on you — and the platform acts.
* **Takedown in 48 hours:** a verified report from a rights-holder pulls the project
  (hidden, receipts preserved, never deleted — provenance is history even when a
  project leaves).
* **Repeat or bad-faith = removal.** One honest miss = a warning and a fix window.
  Copying as a strategy, or stripping licenses, = your account goes with the project.
* **You can always appeal** — mistakes happen on both sides. The receipts make the
  appeal checkable.

FORKING — THE COMPUTE FUND WAY
------------------------------
Inside this platform you never copy someone's work bat-for-bat: you **fork** it.
A fork is public, credited and receipted — the original author's line stays visible
in the ledger. Fork when the base already solves 80% of your problem. Fork the
MECHANISM, not the identity: rebuilt behavior, new assets, your name.

THE LEGAL PAPER TRAIL WE POINTED AT
-----------------------------------
* 17 U.S.C. §102(b) — copyright protects expression, NOT ideas, procedures or
  functionality ("in no case does copyright protection extend to any idea,
  procedure, process, system, method of operation...").
* Sega v. Accolade — reverse engineering as legitimate fair use.
* Sony v. Connectix — clean-room behavior study produces a lawful product.
* Google v. Oracle — interfaces/ APIs: reuse of what's needed to interoperate.
* The 2026 behavior-reconstruction research wave (e.g. MirrorCode, arXiv 2606.30182)
  shows the capability is real — this page is how our community stays on the right
  side of it.

NOT LEGAL ADVICE
----------------
This page is education + platform rules, not legal advice. Big rights decision?
Ask a lawyer — funding one through the platform for your project is exactly what
it's for.
`.trim();

export const POLICY_SUMMARY = `Functionality is fair game — rebuild, recompile, decompile, port. Assets, characters and trademarks are not — make your own or license them. Fork instead of copying. Verified takedown honored in 48h; honest misses get a fix window; bad faith gets removed.`;
