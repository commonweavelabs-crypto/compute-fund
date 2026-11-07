# ACCOUNTS CHARTER — the identity model, set in stone (Gui 2026-11-07)

*The naming law: the account types are **Personal** and **Organization** (short:
org — GitHub's own word; we do not say business/corporate/company anywhere in
the UI). This document = the standard; the build details live in ROADMAP as
M-AUTH-REFINE.*

## 1. The identity graph (mirrors GitHub = intuitive for our audience)

- **A Personal account is the root of everything.** It is created automatically
  on the first GitHub login — zero forms, zero questions beyond one optional
  click ("Are you funding as yourself, or do you manage an organization?").
  Nothing is ever forced.
- **An Organization is created INSIDE a personal account** (one click on the
  account page). It is owned by its creator — and ownership is TRANSFERABLE
  per the standing charter law, so succession never dead-ends.
- **An org cannot exist without a personal host** (same as GitHub: someone
  must be able to answer "who stewards this?"). A personal account can stay
  personal-only forever — orgs are optional, never nagged.

## 2. Privacy law (answer to "do people have to expose themselves?")

- The **GitHub handle is the immutable public identity** — it comes from the
  OAuth login, cannot be typed, chosen, or edited on the platform. Set in stone.
- **Real/legal names are always optional.** The display name defaults to the
  handle and is editable — Instagram-style: put your name, your nickname, or
  nothing personal at all. The email is private by default and never shown.
- An Organization is equally privacy-friendly: its display name is public (it
  acts publicly anyway) but no personal/legal names are ever required.
- A person can be fully pseudonymous on Compute Fund and still hold, claim,
  and fund projects — the trust is the GitHub identity + the receipts, not
  personal data.

## 3. The claim flow, word for word (the friendly Meta-vibe)

When a visitor who is not logged in presses **Claim this project**:

- A friendly card pops in the project panel:
  - **"Before you claim — connect your GitHub."**
  - *"Claims here are bound to real maintainers, so builders trust them.
    One click and you're back on this page."*
  - Button: **Connect GitHub ↗** (returns them to the exact project via the
    ?next= law — already implemented).
- The fine print, same card, smaller: *"You'll need to be signed in with the
  GitHub account that owns this project's repository — your handle has to
  match the maintainer's. It's how we keep claims honest."*
- If the project is already claimed the card never appears; the panel shows
  the owner proudly instead.

## 4. The signup question (M-AUTH-REFINE spec, recorded)

After the FIRST GitHub login (once, optional, skippable in one click):

- **"Are you funding as yourself — or do you manage an organization?"**
  - *Myself* → done, nothing more (personal-only).
  - *An organization* → 1-field wizard: org display name (+ optional about).
    The org is created owned by the person, transferable forever after.
- The question never blocks browsing, funding, or claiming; revisit any time
  from the account page ("Create an organization").

## 5. What was already set in stone before today (carried forward, unchanged)

- Ownership & claims are TRANSFERABLE (the standing charter law) — this
  charter adds the friendly onboarding on top, it does not change it.
- Claims are proof-bound to the maintainer's GitHub identity (handled
  server-side; the handle comes from the login, never from user input) and
  misdirected attempts are refused with the real maintainer named.
- The public ledger is append-only: history is corrected with correction
  receipts, never erased.

*Signed into the charter: handles immutable, personal = root, org = optional
and transferable, names optional, claims friendly + honest.*
