# SERVICES MAP — who does what, in plain English (Gui's accounts document)

*Created 2026-11-06 per Gui's order: "document everything so we can keep track of
what accounts we have and what services we're managing with each platform."
Detailed ledger lives in OPS-MANAGER.md; this file = the simple map. Updates go
here every time we add/remove a service.*

## The one-sentence version
Your computer runs the website; **Supabase checks people in at the door; Cloudflare
owns the street address (computefund.dev) and the road to your computer; Vercel is
the retired rehearsal stage; Stripe is the card machine; Gmail is the mail slot;
Hermes manages all of it.**

## THE ACTUAL ROLES (updated 2026-11-06)

| Service | What it does for Compute Fund | Status | Where the keys live |
|---|---|---|---|
| **Your Windows box** | Runs the actual app: Next.js on port 8872, the SQLite ledger (app/compute-fund.db), uploads, backgrounds + tunnel daemon | **THE HOST of record** | everything lives on the box |
| **Supabase** (project csujyjibtxpccfvlaujm, org commonweavelabs) | **Logins** (GitHub OAuth, email pass), live-mode cloud DB (users/orgs). NOT site hosting. | ✅ ACTIVE — site_url = computefund.dev (fixed 2026-11-06; old vercel origin removed = old site can't mint logins) | PAT: `~/.config/supabase/pat.txt` (redact before sharing) |
| **Cloudflare** (account commonweavelabs) | **The domain computefund.dev** ($8.20 first yr / $12.20 renew, expires 2027-11-06), DNS, the named tunnel `compute-fund` routing the domain to the box, SSL. Phase-3 option: real hosting on Workers/Pages | ✅ ACTIVE | OAuth via Cloudflare MCP (browser-authorized); tunnel cert: `~/.cloudflared` |
| **Vercel** (project compute-fund-site, Hobby tier) | Retired: it hosted the OLD v0 prototype site — the design rehearsal, never the platform | 🗄️ ARCHIVED — frozen: Git disconnected, login permanently blocked (Supabase site_url fix), zero cost, kept as design archive | none held |
| **Stripe** (CommonWeave Labs sandbox) | Card payments (test mode) | ✅ ACTIVE (test) | app/.env.local (git-ignored) |
| **Gmail** commonweavelabs@gmail.com | The mail slot (outreach, magic links, weekly sweep cron) | ✅ ACTIVE | himalaya config (app password) |
| **GitHub** commonweavelabs-crypto | Source code of record (compute-fund + compute-fund-site archive) | ✅ ACTIVE | GCM OAuth device flow |
| **Hermes** | The manager: builds, deploys, watches, renews | — | this box |

## THE FLOW (how a stranger reaches the site)
Internet stranger → **computefund.dev** (Cloudflare DNS) → **named tunnel** (Cloudflare,
secretly a private road) → **your Windows box, port 8872** → the app answers; for
login it asks **Supabase** to verify; for payments it asks **Stripe**; receipts land
in the box's SQLite ledger and public receipt pages.

## THE PLAN (why you might think Vercel/Supabase = "the host")
- Phase 1 (now): box = host, Cloudflare = road/address, Supabase = door identity.
- Phase 2 (outreach): same, plus the discovery engine feeds real visitors.
- Phase 3 (go-live): the app gets deployed to a proper 24/7 host (Cloudflare
  Pages/Workers is the front-runner) so closing your laptop doesn't matter; at that
  point "the box" becomes optional. Roadmap tracks this as the deploy block.
