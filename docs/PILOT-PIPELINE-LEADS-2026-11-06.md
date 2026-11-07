# PILOT PIPELINE — LEADS & COMPATIBILITY REPORT (2026-11-06)

DRAFT for Gui's read. Source: the Hermes link archive — 848 vetted entries,
216 contacts on file. Question Gui asked: of everything vetted, how many
are REAL, compatible, importable projects with reachable creators?

## Headline numbers (honest)

- **Entries vetted:** 848 (all lanes: reels, posts, repos, launches, signals)
- **Tool/repo-shaped candidates after filtering out funnels/scams/skips/aggregator noise:** 129 with a concrete repo + 147 idea-only
- **Verified live via GitHub API today (129 unique repos checked, 0 errors):**
  - **Import-ready TODAY (grade A: public repo + license + reachable creator lane): 44** — of which **42 active in the last 6 months** and none archived.
  - **Grade B (repo real but needs a license/identity check or is stale): 85** — active subset 66.
  - **Grade C idea-signals (no importable artifact; product/market intelligence):** 147
- **Emails:** we hold ZERO scraped private emails (law: never scrape private data).
  Contact = PUBLIC lanes only: GitHub handle (issue/PR), IG/X DM, email IF the
  creator published it themselves (currently 6 public email(s) on file:
  alex.vislosky@gmail.com, commonweavelabs@gmail.com, hello@medialabs-co.com, kristian@retribalize.ai, ohhhhhmya@gmail.com, wesroth@smoothmedia.co).
- **Engine today:** 27 project rows in compute-fund.db — statuses: {'active': 26, 'draft': 1}.
  Import of the grade-A list is the growth path (takedown law covers unclaimed imports).

## Grades

- **A** = open-source repo, license on record, active, creator reachable (handle known).
  Import-eligible today as UNCLAIMED stubs (charter-shaped, awaiting claim by owner).
- **B** = real repo, missing a hard fact (license unclear, identity unconfirmed, stale).
  Import after one verification pass (mostly automatic — license + owner check).
- **C-idea** = signal/intel (no project to import), feeds product/market docs.

## Contact lanes law (for the import-and-notify flow)

1. GitHub issue on the repo: "your project is imported on Compute.Fund — claim it or
   request removal" (public, transparent, license-respectful).
2. IG/X DM for reel-sourced entries (handles in contacts.json).
3. NO email harvesting. Ever.

## Grade A — IMPORT-READY (44, active first, stars desc)

| # | Project | Repo | Stars | License | Last push | Contact lane |
|---|---------|------|-------|---------|-----------|--------------|
| 1 | claude-mem (thedotmack) — persistent agent memory, 106K stars, Apache-2.0 (the biggest rep | thedotmack/claude-mem | 114316 | Apache-2.0 | 2026-11-07 | thedotmack |
| 2 | VoiceStudio: local all-in-one voice suite — clone, design, dub, transcribe, dictation, aud | debpalash/VoiceStudio | 103550 | AGPL-3.0 | 2026-11-07 | debpalash |
| 3 | OpenMontage - Agentic Video Production System | calesthio/OpenMontage | 78089 | AGPL-3.0 | 2026-11-03 | @fork.cast_ |
| 4 | Hindsight: agent memory with retain/recall + REFLECT layer (49,561★ MIT, pushed today) | vectorize-io/hindsight | 59663 | MIT | 2026-11-07 | vectorize-io |
| 5 | Hallmark (Nutlope) - design skill for Claude Code/Codex/Cursor/OpenCode | Nutlope/hallmark | 50037 | MIT | 2026-11-05 | @github_unpacked |
| 6 | Claude Code Game Studios — 49-agent studio hierarchy (Directors/Leads/Specialists) + 72-74 | Donchitos/Claude-Code-Game-Studios | 36407 | MIT | 2026-10-19 | Donchitos |
| 7 | bycloud: DeepSeek's DeepInfer — 3x GPU value (inference economics) | deepseek-ai/DeepInfer | 25588 | Apache-2.0 | 2026-11-03 | deepseek-ai |
| 8 | RAG-Anything (HKUDS) — graph-powered all-in-one multimodal document RAG on LightRAG | HKUDS/RAG-Anything | 24453 | MIT | 2026-11-02 | HKUDS |
| 9 | Jev Ultrafast - browser agent on TypeSafe typed decisions (Jev) | browser-use/jev-ultrafast | 24250 | MIT | 2026-11-03 | browser-use |
| 10 | img2threejs — photo -> code-only procedural Three.js model, 19,937 stars, Apache-2.0 (gith | img2threejs/img2threejs | 20533 | Apache-2.0 | 2026-11-05 | img2threejs |
| 11 | OpenSandbox — Sandbox runtime for AI agents | opensandbox-group/OpenSandbox | 16494 | Apache-2.0 | 2026-11-07 | @marc.kaz |
| 12 | Concat (jub0t) — local-first Rust+React CapCut replacement, 12,835 stars, AGPL-3.0, JSON-R | jub0t/Concat | 15143 | AGPL-3.0 | 2026-11-07 | jub0t |
| 13 | awesome-opus5-5-videos - 703 Claude video prompts, 418 live remakes (9.6K stars) | yihui-dev/awesome-opus5-5-videos | 14005 | MIT | 2026-10-13 | @gittrend.io |
| 14 | Lemo-Opuscar (6.6K stars MIT): Claude film-style toolbox - films entirely in code | lemomo-ai/lemo-opuscar | 13284 | MIT | 2026-11-07 | @gittrend.io |
| 15 | awesome-gamedev-agent-skills: 74 portable SKILL.md game-dev skills (4.8K stars in 4 months | gamedev-skills/awesome-gamedev-agent-skills | 7498 | Apache-2.0 | 2026-10-28 | gamedev-skills |
| 16 | LatentSync (ByteDance) - open-source lip-sync/dubbing (baroi.ai reel) | bytedance/LatentSync | 6255 | Apache-2.0 | 2025-06-20 | @baroi.ai |
| 17 | Jantt - AI-native JSON Gantt/DAG engine (MIT, 3.7K stars) | AhmadHassan-BTed/Jantt | 6221 | MIT | 2026-11-06 | AhmadHassan-BTed |
| 18 | pixelfx (patch-gg) - 244 code-based pixel art effects, MIT | patch-gg/pixelfx | 5773 | MIT | 2026-10-31 | @gittrend.io |
| 19 | OpenFilm (baroi.ai reel) — open-source AI video agent: coding agent -> video agent + brows | openfilm/openfilm | 5186 | MIT | 2026-11-07 | @baroi.ai |
| 20 | kaomei/stickman-video-director — open-source stickman video generator for faceless channel | kaomei/stickman-video-director | 4858 | MIT | 2026-11-04 | @howtowebdev_ |
| 21 | TwinDesk: the one-desk tool (mouse/keyboard/clipboard/calls/phone, no cloud no account) -  | InukaAsith/TwinDesk | 3688 | GPL-3.0 | 2026-11-06 | InukaAsith |
| 22 | rea-video (JuneYaooo) - shot-by-shot video reverse-engineering agent skill (marc.kaz reel) | JuneYaooo/rea-video | 3538 | Apache-2.0 | 2026-11-07 | JuneYaooo |
| 23 | mg-styles-15 — 15 ten-second motion-design films made by Claude Opus 5.5 writing pure code | Vincentwei1021/mg-styles-15 | 3221 | MIT | 2026-10-05 | Vincentwei1021 |
| 24 | TypeUI DESIGN.md Extractor — Chrome extension cloning any site's design system into DESIGN | bergside/design-md-chrome | 3150 | MIT | 2026-05-25 | @@opensourcedaily |
| 25 | floorplan (haydenschmitty) — plain-English codebase map via Claude/Codex | haydenschmitty/floorplan | 3134 | MIT | 2026-11-02 | @gittrend.io |
| 26 | FreeVideo — MiniMax H3 video generation locally on 8 GB VRAM (FlashML-org) | FlashML-org/FreeVideo | 2830 | Apache-2.0 | 2026-11-07 | FlashML-org |
| 27 | terminal-mac (govijr) - macOS guest VM inside a terminal for agents | govijr/terminal-mac | 2217 | MIT | 2026-11-07 | @girsta |
| 28 | Raven (Oscar Soirey) — C + Vulkan GUI library, glass aesthetic, 1,506 stars at 3 weeks old | oscar-soirey/Raven | 2059 | Apache-2.0 | 2026-11-07 | oscar-soirey |
| 29 | Burrow (caezium) — free native Mac cleaner/app-manager with MCP server for agents, 1,631 s | caezium/Burrow | 1713 | MIT | 2026-11-07 | caezium |
| 30 | minutes - local meeting memory + MCP-queryable transcripts (1.5K stars, Rust, MIT) | silverstein/minutes | 1593 | MIT | 2026-11-06 | @gittrend.io |
| 31 | Domain Digger (wotschofsky) — open-source DNS/WHOIS/TLS domain intelligence toolkit | wotschofsky/domain-digger | 1539 | AGPL-3.0 | 2026-11-06 | wotschofsky |
| 32 | Reanimate — Claude Code skill: reverse-engineers any animation frame-by-frame, proves the  | NiazMorshed2007/reanimate | 1352 | MIT | 2026-10-31 | NiazMorshed2007 |
| 33 | Lightswind UI (1,228 stars, MIT): the AI-native CLI-first React library - 160+ animated ac | codewithMUHILAN/Lightswind-UI-Library | 1269 | MIT | 2026-10-30 | codewithMUHILAN |
| 34 | OpenCompany: Your Own AI Workforce | zeenie-ai/opencompany | 1075 | MIT | 2026-11-05 | @"@githubsignals" |
| 35 | Idol SDK (speridlabs) — one photo -> 3D Gaussian splat model, brand-new repo (308 stars in | speridlabs/idol-sdk | 882 | Apache-2.0 | 2026-10-29 | speridlabs |
| 36 | Simple Jev (featherless-ai) — logits-based classifier endpoint over any open model, no tra | featherless-ai/simple-jev | 647 | Apache-2.0 | 2026-10-07 | featherless-ai |
| 37 | githubsignals reel: Shisei (wquguru) — CC0 mannequin pose reference library for AI image t | wquguru/shisei | 460 | Apache-2.0 | 2026-11-02 | @githubsignals |
| 38 | Donkey Cut: Open source CapCut alternative (browser video editor) | DonkeyCut/Donkey | 336 | Apache-2.0 | 2026-11-06 | @"@gittrend.io" |
| 39 | AnyScene (apekshik) — one-paragraph brief -> photoreal Blender scene via AI agents (image- | apekshik/anyscene | 325 | MIT | 2026-11-04 | apekshik |
| 40 | github_dev reel: on-page-seo (agricidaniel) — self-hosted bulk on-page SEO analyzer | agricidaniel/on-page-seo | 278 | MIT | 2026-06-06 | @github_dev |
| 41 | RecompLauncher (elripalda) — launcher for PC recomp ports | elripalda/RecompLauncher | 264 | GPL-3.0 | 2026-11-07 | elripalda |
| 42 | Warlock Studio — local video/image upscale + restore suite for Windows (v6, MIT) | Ivan-Ayub97/Warlock-Studio | 258 | MIT | 2026-03-17 | Ivan-Ayub97 |
| 43 | kinocut (KyaniteLabs) — local MCP video-editing server: long video -> captioned vertical s | KyaniteLabs/kinocut | 253 | Apache-2.0 | 2026-11-04 | @julian.goldie_ |
| 44 | Gleaner (shisui) - local-first media collector extension (MIT, MV3) | ssssssanjiu/gleaner | 120 | MIT | 2026-09-30 | @gittrend.io |

## Grade B — VERIFY-THEN-IMPORT (85, active first)

| # | Project | Repo | Stars | License | Last push | Contact lane |
|---|---------|------|-------|---------|-----------|--------------|
| 1 | Awesome DESIGN.md | VoltAgent/awesome-design-md | 125992 | MIT | 2026-10-28 | @fork.cast_ |
| 2 | Crawl4AI - Open-source LLM-Friendly Web Crawler and Scraper | unclecode/crawl4ai | 87042 | Apache-2.0 | 2026-11-04 | unclecode |
| 3 | diagram-design — 29 editorial diagram types for Claude Code (brand-matched) | cathrynlavery/diagram-design | 65628 | MIT | 2026-11-06 | @gittrend.io |
| 4 | God's Eye View (Bilawal Sidhu) — 61,560★ open-source personal OSINT globe, built with AI a | bilawalsidhu/gods-eye-view | 63339 | NOASSERTION | 2026-11-07 | bilawalsidhu |
| 5 | Plane — open-source Jira/Linear alternative | makeplane/plane | 62120 | AGPL-3.0 | 2026-11-07 | @gittrend.io |
| 6 | Motrix — full-featured open-source download manager | agalwood/Motrix | 57927 | NOASSERTION | 2026-11-07 | @gittrend.io |
| 7 | elder-plinius/CL4R1T4S | elder-plinius/CL4R1T4S | 51814 | AGPL-3.0 | 2026-09-22 | elder-plinius |
| 8 | AirLLM | lyogavin/airllm | 41908 | Apache-2.0 | 2026-11-07 | lyogavin |
| 9 | Postiz repo velocity (37,909 stars +146/day) - the agentic scheduler OSS (DUP-TOPIC cross- | gitroomhq/postiz-app | 41068 | AGPL-3.0 | 2026-11-06 | gitroomhq |
| 10 | croc — secure file transfer between any two computers via code phrase | schollz/croc | 40877 | MIT | 2026-11-04 | @gittrend.io |
| 11 | llmfit: Right-size LLMs to your hardware | AlexsJones/llmfit | 38735 | MIT | 2026-11-05 | @gittrend.io |
| 12 | Keycloak — Open Source Identity and Access Management | keycloak/keycloak | 37744 | Apache-2.0 | 2026-11-07 | @gittrend.io |
| 13 | Anthropic Cybersecurity Skills — 817 structured cybersecurity skills for AI agents | mukul975/Anthropic-Cybersecurity-Skills | 35740 | Apache-2.0 | 2026-08-31 | @gittrend.io |
| 14 | huggingface/diffusers | huggingface/diffusers | 34883 | Apache-2.0 | 2026-11-07 | huggingface |
| 15 | Cognee — open-source AI memory platform for agents (30k★) | topoteretes/cognee | 33122 | Apache-2.0 | 2026-11-07 | @gittrend.io |
| 16 | Anil-matcha/Open-Generative-AI | Anil-matcha/Open-Generative-AI | 32918 | MIT | 2026-11-06 | Anil-matcha |
| 17 | TencentDB-Agent-Memory | TencentCloud/TencentDB-Agent-Memory | 30613 | NOASSERTION | 2026-11-04 | TencentCloud |
| 18 | Plausible Analytics — privacy-first web analytics | plausible/analytics | 29789 | AGPL-3.0 | 2026-11-07 | @gittrend.io |
| 19 | Hypit: clone a video's FORMAT recipe (shots/captions/B-roll/effects/timing/tone) — reusabl | hypit-ai/hypit | 28409 | NOASSERTION | 2026-11-05 | hypit-ai |
| 20 | authentik | goauthentik/authentik | 26266 | NOASSERTION | 2026-11-07 | @gittrend.io |
| 21 | brag — one-command launch video from your project (Claude Code skill / Hyperframes) | latent-spaces/brag | 20640 | MIT | 2026-10-23 | latent-spaces |
| 22 | LingBot-Map: Streaming 3D scene reconstruction from video | Robbyant/lingbot-map | 18568 | Apache-2.0 | 2026-10-14 | @simplifyinai |
| 23 | Outlines: Structured Outputs for LLMs | dottxt-ai/outlines | 16005 | Apache-2.0 | 2026-09-21 | @gittrend.io |
| 24 | Tencent-Hunyuan/HunyuanVideo | Tencent-Hunyuan/HunyuanVideo | 12738 | NOASSERTION | 2026-10-08 | Tencent-Hunyuan |
| 25 | unslop (heydamir) — Claude skill: find AI-UI slop, direction from product, fix pass-by-pas | heydamir/unslop | 11167 | CC-BY-4.0 | 2026-11-01 | heydamir |
| 26 | FoundationVision/VAR | FoundationVision/VAR | 8765 | MIT | 2025-11-10 | FoundationVision |
| 27 | The Strange Economics of LLM Inference-as-a-Service (bycloud) | deepseek-ai/open-infra-index | 8133 | CC0-1.0 | 2025-05-15 | deepseek-ai |
| 28 | PixiEditor — Universal 2D Editor | PixiEditor/PixiEditor | 8128 | LGPL-3.0 | 2026-11-06 | @InspirationTuts |
| 29 | open-mmlab/mmagic | open-mmlab/mmagic | 7479 | Apache-2.0 | 2024-08-06 | open-mmlab |
| 30 | DramaClaw — AIGC video engine: script to finished film in one pipeline | dramaclaw/dramaclaw | 7374 | NOASSERTION | 2026-11-06 | @devilco.nitin |
| 31 | Box3D — 3D Physics Engine | erincatto/box3d | 6748 | MIT | 2026-11-07 | @InspirationTuts |
| 32 | AutoHedge — autonomous AI agent hedge fund (swarm intelligence) | The-Swarm-Corporation/AutoHedge | 6641 | MIT | 2026-05-11 | @gittrend.io |
| 33 | Material Maker — Procedural Textures | RodZill4/material-maker | 6233 | MIT | 2026-10-25 | @InspirationTuts |
| 34 | shuohao-skills — AI short-drama production skills (novel → assets) | eternityspring/shuohao-skills | 6207 | Apache-2.0 | 2026-10-26 | @gittrend.io |
| 35 | showlab/Awesome-Video-Diffusion | showlab/Awesome-Video-Diffusion | 5831 | — | 2026-10-27 | showlab |
| 36 | Microsoft Skill Recorder | microsoft/skill-recorder | 5707 | MIT | 2026-11-04 | @gittrend.io |
| 37 | wigolo — local-first web intelligence for AI agents (MCP) | KnockOutEZ/wigolo | 5531 | NOASSERTION | 2026-11-07 | @gittrend.io |
| 38 | Praxist (Sapient, 5.6K stars + an arXiv paper): the autonomous research engine | sapientinc/praxist | 5527 | NOASSERTION | 2026-09-23 | sapientinc |
| 39 | Code-Graph-RAG — query/edit monorepos in plain English via knowledge graphs | vitali87/code-graph-rag | 5341 | MIT | 2026-11-07 | @gittrend.io |
| 40 | ZOZO PPF Contact Solver | st-tech/ppf-contact-solver | 4595 | Apache-2.0 | 2026-11-05 | @InspirationTuts |
| 41 | Tencent-Hunyuan/HunyuanVideo-1.5 | Tencent-Hunyuan/HunyuanVideo-1.5 | 4592 | NOASSERTION | 2026-04-10 | Tencent-Hunyuan |
| 42 | word-atlas (1,717 stars CREATED YESTERDAY): every IELTS word gets its own original illustr | designfuchen/word-atlas | 4383 | NOASSERTION | 2026-10-31 | designfuchen |
| 43 | showlab/Tune-A-Video | showlab/Tune-A-Video | 4359 | Apache-2.0 | 2023-10-25 | showlab |
| 44 | earshot (3K stars/week, MIT): ears for coding agents - hear, judge, generate sound in code | Leonxlnx/earshot | 4139 | MIT | 2026-11-06 | Leonxlnx |
| 45 | QwenLM/Qwen2.5-Omni | QwenLM/Qwen2.5-Omni | 4095 | Apache-2.0 | 2025-06-12 | QwenLM |
| 46 | genmoai/mochi | genmoai/mochi | 3764 | Apache-2.0 | 2026-10-22 | genmoai |
| 47 | SysMocap — real-time webcam motion capture for 3D avatars | xianfei/SysMocap | 3250 | MPL-2.0 | 2026-06-10 | @safesynt |
| 48 | ali-vilab/VGen | ali-vilab/VGen | 3153 | — | 2025-01-10 | ali-vilab |
| 49 | leo-lilinxiao/codex-autoresearch | leo-lilinxiao/codex-autoresearch | 3144 | MIT | 2026-09-12 | leo-lilinxiao |
| 50 | shadergradient | ruucm/shadergradient | 3093 | — | 2026-09-23 | ruucm |
| 51 | nvlabs/longlive | nvlabs/longlive | 2873 | Apache-2.0 | 2026-11-06 | nvlabs |
| 52 | 3D Model Anything (wesbos) - iPhone LiDAR -> editable Three.js rooms | wesbos/3d-model-anything | 2834 | NOASSERTION | 2026-10-27 | wesbos |
| 53 | PKU-YuanGroup/Helios | PKU-YuanGroup/Helios | 2255 | Apache-2.0 | 2026-11-01 | PKU-YuanGroup |
| 54 | amirhossein-kz/Awesome-Diffusion-Models-in-Medical-Imaging | amirhossein-kz/Awesome-Diffusion-Models-in-Medical-Imaging | 2116 | MIT | 2025-11-17 | amirhossein-kz |
| 55 | FoundationVision/LlamaGen | FoundationVision/LlamaGen | 1972 | MIT | 2024-08-15 | FoundationVision |
| 56 | Doop — Open-source multiplayer design canvas for humans and AI agents | kgoedecke/doop | 1826 | AGPL-3.0 | 2026-11-07 | @githubsignals |
| 57 | liquid-glass-js | dashersw/liquid-glass-js | 1708 | MIT | 2025-06-12 | dashersw |
| 58 | GNM — Parametric Human Models | google/GNM | 1627 | Apache-2.0 | 2026-11-06 | @InspirationTuts |
| 59 | AuK (Tencent Hunyuan) - 1.5B instruction-driven audio foundation model | Tencent-Hunyuan/AuK | 1585 | NOASSERTION | 2026-10-27 | Tencent-Hunyuan |
| 60 | liquid-logo | paper-design/liquid-logo | 1420 | NOASSERTION | 2026-04-20 | paper-design |
| 61 | VideoSOS 2 (timoncool) — browser AI video workspace over 100+ models (Veo 3.1/FLUX/Imagen  | timoncool/videosos | 1395 | NOASSERTION | 2026-11-07 | timoncool |
| 62 | lucidrains/video-diffusion-pytorch | lucidrains/video-diffusion-pytorch | 1392 | MIT | 2024-05-03 | lucidrains |
| 63 | HALO (Hierarchal Agent Loop Optimizer) | context-labs/HALO | 1208 | — | 2026-10-26 | context-labs |
| 64 | showlab/Show-1 | showlab/Show-1 | 1148 | NOASSERTION | 2025-09-13 | showlab |
| 65 | PRIV-Creation/Awesome-Controllable-T2I-Diffusion-Models | PRIV-Creation/Awesome-Controllable-T2I-Diffusion-Models | 1111 | MIT | 2026-11-02 | PRIV-Creation |
| 66 | codedthemes/mantis-free-react-admin-template | codedthemes/mantis-free-react-admin-template | 968 | MIT | 2026-09-29 | codedthemes |
| 67 | Vchitect/LaVie | Vchitect/LaVie | 949 | Apache-2.0 | 2024-11-13 | Vchitect |
| 68 | MotionBricks (NVIDIA NVlabs, SIGGRAPH 2026) — real-time character/robot animation from key | NVlabs/motionbricks | 943 | NOASSERTION | 2026-10-26 | NVlabs |
| 69 | Beamer (529 stars GPL-3.0): software KVM across Mac/Windows/Linux - the fleet-desk candida | kalkman-code/beamer | 937 | GPL-3.0 | 2026-11-03 | kalkman-code |
| 70 | kandinskylab/kandinsky-5 | kandinskylab/kandinsky-5 | 844 | MIT | 2026-08-07 | kandinskylab |
| 71 | Figranium — self-hosted browser automation API (Apify alternative) | figranium/figranium | 784 | GPL-3.0 | 2026-11-07 | @githubsignals |
| 72 | sharonzhou/long_stable_diffusion | sharonzhou/long_stable_diffusion | 688 | — | 2022-10-30 | sharonzhou |
| 73 | Tencent-Hunyuan/HunyuanImage-2.1 | Tencent-Hunyuan/HunyuanImage-2.1 | 676 | NOASSERTION | 2025-10-14 | Tencent-Hunyuan |
| 74 | only-cli/oc — web-browsing CLI for AI agents | only-cli/oc | 551 | MIT | 2026-11-03 | @githubsignals |
| 75 | NVIDIA Audio2Face-3D (517 stars, STALE: Sept 2025 repo): speech -> 3D facial animation w/  | NVIDIA/Audio2Face-3D | 549 | — | 2025-09-24 | NVIDIA |
| 76 | Lazy Skills (328 stars MIT) - mission control for agent skills across assistants | alvinunreal/lazyskills | 336 | MIT | 2026-09-26 | alvinunreal |
| 77 | whiteboard-animation-vi (227 stars, CC0 public-domain): illustrations -> whiteboard animat | letuandat131/whiteboard-animation-vi | 303 | CC0-1.0 | 2026-10-13 | letuandat131 |
| 78 | mx-icons — lightweight React SVG icon library | ig-imanish/mx-icons | 185 | MIT | 2026-10-03 | @gittrend.io |
| 79 | ComfyUI-FlashVSR - real-time 2x/4x upscale node (STALE: 1y-old repo dressed as new) | 1038lab/comfyui-flashvsr | 168 | GPL-3.0 | 2025-11-17 | 1038lab |
| 80 | MiniMax H3 Director Cut Studio - local Premiere-style director workbench (147 stars) | karuvanan/minimax-h3-director-cut-studio | 153 | NOASSERTION | 2026-10-19 | karuvanan |
| 81 | webdog | context-dot-dev/webdog | 113 | MIT | 2026-10-19 | context-dot-dev |
| 82 | minimax-music-ui — Suno-style web UI for self-hosted MiniMax-Music3 | adambenhassen/minimax-music-ui | 96 | MIT | 2026-10-25 | @githubsignals |
| 83 | Hexapod Robot Simulator — vibe-coded inverse kinematics demo | dilums/hexapod-robot-simulator | 52 | — | 2025-11-06 | @marc.kaz |
| 84 | MoviEdit-Bench (Adobe Research) - long-form multi-shot AI video-editing benchmark | adobe-research/MoviEdit-Bench | 18 | NOASSERTION | 2026-11-03 | @gitfinds.si |
| 85 | Facet — Copy-paste 3D components for React (30 R3F components) | elberacasa/facet | 2 | MIT | 2026-07-22 | @gittrend.io |

## Import mechanics (next step after Gui's read)

Batch-import as UNCLAIMED CFQ stubs: slug, name, one_liner (from repo description),
repo_url, license, method placeholder, `import_status: import-ready`, provenance
`imported-from: archive entry <id>` + takedown affordance (ROADMAP D-TAKEDOWN).
Order: A_active (42) first — one PR per repo under commonweavelabs-crypto
(one-repo-per-project law), no code pushed, platform record only.

### Repo-provenance caveat (honesty flag)

leads JSON carries `repo_provenance`: **url** = the archived link WAS the GitHub repo
(solid). **narration-extracted** = repo parsed from caption/narration — including some
star counts naming a REFERENCED repo rather than the shared one (e.g. reels citing a
big upstream); verify slug + owner at import time, before any creator notify.

---
*Ratings reflect archive vetting + one-day GitHub API verification (stars/license/push).
Activity = pushed within 6 months. No private data was collected for this report.*
