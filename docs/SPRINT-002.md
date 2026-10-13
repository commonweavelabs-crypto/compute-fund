# MVP Sprint 002 — deploy + Stripe test mode (2026-10-13)
*Goal (from Gui): a public URL a stranger can open + real Stripe test-mode funding. Unlocks
the pilot firing chain steps 2-3. This sprint does NOT message creators.*

## Shipped
1. **Stripe integration, no SDK** (`app/lib/stripe.ts`): REST-only. `STRIPE_SECRET_KEY`
   absent = demo path unchanged (demo: 1); `sk_test_`/`sk_live_` = hosted Checkout Session,
   `CF_PUBLIC_URL` builds success/cancel URLs.
2. **Pending-donation law:** a row is written IMMEDIATELY on session creation (`demo: 2`,
   `stripe_ref = session.id`); `sumFundedCents` EXCLUDES `demo: 2` — pending money is not
   budget. The webhook is the only thing that flips `demo: 2 → 0`.
3. **Webhook** (`app/api/webhook/stripe/route.ts`): HMAC-SHA256 signature verify
   (timing-safe, 5-min replay guard), session-id idempotency, `checkout.session.completed`
   only; unknown events 200-acked without writes.
4. **`/api/fund` = `/api/checkout`** (UI contract preserved; same writes).
5. **UI redirect:** LiveProjectPanel opens the hosted checkout when the response carries a
   URL; demo note shown otherwise.
6. **Deploy = box + cloudflared quick tunnel** (public HTTPS → localhost:8872). Vercel
   deferred: serverless has no persistent FS for SQLite; Phase 2 does the Postgres/Turso
   migration instead of pretending SQLite survives serverless. Tunnel URL is ephemeral —
   a named tunnel/domain is a later drop-in.

## Verified
- `npm run build` exit 0 (Next 16.4.0, cache components)
- Stranger loop re-run green on the final build: signup 200 → CFQ project 200 → fund 200 →
  key 200 → wrong-model 403 → completion 200 → receipt visible via /api/pubproj →
  over-cap 402 ("no rollover, no recharge")
- Tunnel live: home + pubproj 200 through the public URL

## What Gui must drop in (test keys)
- `STRIPE_SECRET_KEY=sk_test_...`, `STRIPE_WEBHOOK_SECRET=whsec_...` (webhook endpoint
  `POST {publicUrl}/api/webhook/stripe`, event: checkout.session.completed), restart server.
- Cards: Stripe test card 4242 4242 4242 4242 at hosted checkout = full loop without real money.

## Out of scope (Sprint 003+): named domain, live keys, OFAC/ID checks, $5 tier

## Sprint 002b — browse-first (Kickstarter law, per Gui 2026-10-13)
Gui's finding: /start rendered as a signup wall = wrong shape. Law adopted: **browsing is
free; the sign-in prompt appears exactly at the interaction and returns the user to it.**
- `/start` = chooser door (Open a project / Fund a question); no signup form; quiet
  "Log in" line for members. Account creation moves into the interaction moment.
- `/login?next=` — post-login redirect back to the exact place the user left
  (`next` must start with "/", no external redirects).
- LiveProjectPanel: fund/key-issuance 401s render an inline "sign in and come right
  back" prompt instead of a dead error string.
- `/start/project` remains browsable (full form visible logged-out); on 401 at submit
  it renders a dedicated sign-in door ("your answers are still here").
- Shell (AppHeader+AppFooter) now mounts on ALL routes from the root layout (home keeps
  its own header rhythm); quiet corner `Log in` on every page like Kickstarter.
- Verified: 10-route sweep all 200; stranger loop re-run green on the final build
  (CFQ-2026-009; 403→200→receipt→controlled-drain 402 verified separately); home/start/
  login screenshots clean (one header, one footer, no walls).
