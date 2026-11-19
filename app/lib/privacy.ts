// D1.4 DATA CONSENT (Gui 11/19): one honest screen at sign-up; version-stamped
// re-consent whenever this file changes. Single source like lib/policy.
// The law this encodes: search logs are anonymized at write time (D5.3);
// personalization is private per account; platform aggregates are open data.
export const PRIVACY_VERSION = "data-consent-2026-11-1";

export const PRIVACY_MARKDOWN = `COMPUTE FUND — DATA & YOU (CONSENT)
version: data-consent-2026-11-1

YOUR DATA, YOUR RULES.

1. YOUR CLICKS POWER YOUR SUGGESTIONS.
* When you are signed in, what you view, follow, and fund shapes your suggestions.
* This is per-account and PRIVATE: only you experience the effect on your feed.
* Never sold, never shared, never an ad.

2. SEARCHES ARE LOGGED ANONYMIZED.
* We record what the community searches, but never who searched it.
* Search rows carry ONLY: the query, the timestamp, and the result count.
* No user id, no IP, no fingerprint, no session id. Ever.

3. AGGREGATES BELONG TO EVERYONE.
* Platform-level aggregates (hot searches, zero-result queries) are published as open data (CC0).
* They are identity-free by design: we cannot un-anonymize what we never store.

4. RECEIPTS ARE PUBLIC BY DESIGN.
* What the fund pays for, what runs, what it costs: public receipts on every project.
* Your donations show on public records; your bio and profile stay yours.

5. THIS CAN'T CHANGE SILENTLY.
* If this consent text changes meaningfully, the version changes and you are
  greeted with the update and asked to agree again.
* Opt out of personalization at any time and everything still works — you get
  the generic, top-rated feed.

QUESTIONS OR TAKEDOWNS: commonweavelabs@gmail.com
`;
export const PRIVACY_TEXT = PRIVACY_MARKDOWN;
