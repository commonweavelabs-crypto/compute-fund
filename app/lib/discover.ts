// Discovery engine v1 (D5). One real-signal event stream in, mechanisms out.
//
// LAW: nothing here invents signal. `events` rows exist only because an actual
// page was rendered, an actual checkout was confirmed, an actual claim moved
// ownership, or an actual user toggled follow. Rows that lack ≥2 qualifying
// projects auto-hide upstream (the homepage's "honest empty" law) — a cold
// mechanism is hidden, never faked.
//
// Weight law: fund×10 + follow×3 + view×1, hardcoded AT QUERY TIME (the CASE
// expressions below) and never stored per row, so the scale can be revised
// without rewriting history.
//
// Time law: events.at is stored as new Date().toISOString() (ISO-8601 UTC), so
// every window comparison on events uses strftime('%Y-%m-%dT%H:%M:%fZ','now',…)
// — same format on both sides makes lexicographic = chronological. Columns that
// hold SQLite datetime('now') strings (donations.created_at, projects.created_at)
// compare against datetime('now','…') instead. Never cross the formats.
//
// v1 personalization limitation (honest): true affinity wants top-categories-by-
// user's-events joined to real project categories. Projects carry only a NAIVE
// keyword-derived category (lib/db.ts guessCategory, backfilled at schema init —
// v1 heuristic by design), so affinity() is: the user's OWN interactions first
// (follows + funded), then same-category fill (velocity-ranked), then overall
// velocity fill. It deepens automatically when category data gets real.
//
// Every rollup is a single SQL statement degrade-wrapped: an unreadable DB
// yields an empty mechanism (rows auto-hide), never a throw in a page render.

import { db } from "./db";
import { createHash } from "node:crypto";

export type EventKind = "view" | "fund" | "follow" | "claim";
export type FollowPick = { slug: string; follows: number };
export type Funded30d = { slug: string; funded30d: number };

// -- recorders -----------------------------------------------------------------
// One INSERT (plus, for views, one lookup), fire-and-forget: a broken or busy
// ledger must never break the page/action that produced the moment. Returns
// true when a row landed (tests assert on this; call sites ignore it).

export function recordEvent(kind: EventKind, projectId?: string | null, userId?: string | null): boolean {
  try {
    db.prepare(`INSERT INTO events (id, at, kind, project_id, user_id) VALUES (?, ?, ?, ?, ?)`).run(
      crypto.randomUUID(),
      new Date().toISOString(),
      kind,
      projectId ?? null,
      userId ?? null,
    );
    return true;
  } catch {
    return false;
  }
}

// view: /p/[slug] render. Resolves the slug first (FK law) and skips drafts —
// a private draft being opened by its owner is not board signal.
//
// dev-vs-truth law: React StrictMode (and the PPR shell pass) render every RSC
// about twice per request in dev, and a naive INSERT would log that one page
// open as two views. So a view is keyed, not random: id = sha256(slug |
// request fingerprint | user) truncated, with a one-minute bucket inside the
// fingerprint — identical re-renders of the SAME request collapse on the
// events PRIMARY KEY (INSERT OR IGNORE), and distinct real loads keep their
// own rows. Resolution = distinct request-fingerprints per minute per project
// (never overcounts, never invents; a same-second reload by the identical
// fingerprint merges — an undercount-only tradeoff, documented here). The
// recent-ids memory guard below also absorbs re-renders that straddle the
// bucket boundary.
const viewSeen = new Map<string, number>();
let viewSeenSwept = 0;
function sweepViewSeen(now: number) {
  if (now - viewSeenSwept < 5000 && viewSeen.size < 2048) return;
  viewSeenSwept = now;
  for (const [k, t] of viewSeen) if (now - t > 5000) viewSeen.delete(k);
}

export function recordView(slug: string, fingerprint: string, userId?: string | null): boolean {
  try {
    const p = db.prepare(`SELECT id, status FROM projects WHERE slug = ?`).get(slug) as
      { id: string; status: string } | undefined;
    if (!p || p.status === "draft") return false;
    const bucket = Math.floor(Date.now() / 60_000);
    const id = `evt_view_${createHash("sha256")
      .update(`${slug}|${fingerprint}|${userId ?? ""}|${bucket}`)
      .digest("hex")
      .slice(0, 24)}`;
    const now = Date.now();
    // guard key is bucket-INDEPENDENT: dev re-renders that straddle the minute
    // boundary still resolve to the same page request here.
    const guardKey = `v:${p.id}:${fingerprint}:${userId ?? ""}`;
    if (now - (viewSeen.get(guardKey) ?? 0) < 2000) return true; // same page request re-rendered
    db.prepare(`INSERT OR IGNORE INTO events (id, at, kind, project_id, user_id) VALUES (?, ?, ?, ?, ?)`)
      .run(id, new Date().toISOString(), "view", p.id, userId ?? null);
    sweepViewSeen(now);
    viewSeen.set(guardKey, now);
    return true;
  } catch {
    return false;
  }
}

export function viewFingerprint(parts: Array<string | null | undefined>): string {
  return parts.join("~");
}

// fund: called when a donation becomes REAL — the demo path at write time, and
// the Stripe webhook at demo 2→0 confirmation. A pending (demo=2) row alone is
// NOT a fund: money that failed to complete must not tick the board.
export function recordFund(projectId: string, userId?: string | null): boolean {
  return recordEvent("fund", projectId, userId ?? null);
}

// claim: the claim move success (claim route, after claimProjectBySlug returns ok).
export function recordClaim(projectId: string, userId?: string | null): boolean {
  return recordEvent("claim", projectId, userId ?? null);
}

// -- follows --------------------------------------------------------------------
export function followStateFor(userId: string | null | undefined, slug: string): { following: boolean; count: number } {
  const p = db.prepare(`SELECT id FROM projects WHERE slug = ?`).get(slug) as { id: string } | undefined;
  if (!p) return { following: false, count: 0 };
  const c = (db.prepare(`SELECT COUNT(*) AS n FROM follows WHERE project_id = ?`).get(p.id) as { n: number }).n;
  const following = userId
    ? !!db.prepare(`SELECT 1 FROM follows WHERE user_id = ? AND project_id = ?`).get(userId, p.id)
    : false;
  return { following, count: c };
}

// Toggle: insert on, delete off. The 'follow' EVENT fires only when a follows
// row is actually CREATED — re-following is idempotent (one row, one event),
// and un-following writes no event (a follow event means "someone followed at
// this moment"; crediting un-follows would corrupt velocity).
export function toggleFollow(userId: string, slug: string): { ok: boolean; following: boolean } {
  try {
    const p = db.prepare(`SELECT id FROM projects WHERE slug = ?`).get(slug) as
      { id: string } | undefined;
    if (!p) return { ok: false, following: false };
    const ins = db.prepare(`INSERT OR IGNORE INTO follows (user_id, project_id, at) VALUES (?, ?, ?)`)
      .run(userId, p.id, new Date().toISOString()) as { changes: number };
    if (ins.changes > 0) {
      recordEvent("follow", p.id, userId);
      return { ok: true, following: true };
    }
    db.prepare(`DELETE FROM follows WHERE user_id = ? AND project_id = ?`).run(userId, p.id);
    return { ok: true, following: false };
  } catch {
    return { ok: false, following: false };
  }
}

// -- rollups (SQL-only) -----------------------------------------------------------

// velocity7d(): per project, SUM over the last 7 days of fund*10 + follow*3 + view*1.
export function velocity7d(): Record<string, number> {
  try {
    const rows = db
      .prepare(
        `SELECT e.project_id AS pid,
                SUM(CASE e.kind WHEN 'fund' THEN 10 WHEN 'follow' THEN 3 WHEN 'view' THEN 1 ELSE 0 END) AS v
         FROM events e
         WHERE e.project_id IS NOT NULL
           AND e.at >= strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-7 days')
         GROUP BY e.project_id`
      )
      .all() as Array<{ pid: string; v: number }>;
    const out: Record<string, number> = {};
    for (const r of rows) out[r.pid] = Number(r.v) || 0;
    return out;
  } catch {
    return {};
  }
}

// velocityBySlug(): same rollup keyed by slug (what the card sorters consume).
export function velocityBySlug(): Record<string, number> {
  try {
    const rows = db
      .prepare(
        `SELECT p.slug AS slug,
                SUM(CASE e.kind WHEN 'fund' THEN 10 WHEN 'follow' THEN 3 WHEN 'view' THEN 1 ELSE 0 END) AS v
         FROM events e
         JOIN projects p ON p.id = e.project_id
         WHERE e.at >= strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-7 days')
         GROUP BY p.slug`
      )
      .all() as Array<{ slug: string; v: number }>;
    const out: Record<string, number> = {};
    for (const r of rows) out[r.slug] = Number(r.v) || 0;
    return out;
  } catch {
    return {};
  }
}

// buzzing(): ACTIVE projects with velocity > 0, velocity desc. Zero velocity is
// not buzzing — excluded, not ranked last (the row auto-hides when this is <2).
export function buzzing(): string[] {
  try {
    return (
      db
        .prepare(
          `SELECT p.slug AS slug,
                  SUM(CASE e.kind WHEN 'fund' THEN 10 WHEN 'follow' THEN 3 WHEN 'view' THEN 1 ELSE 0 END) AS v
           FROM events e
           JOIN projects p ON p.id = e.project_id
           WHERE e.at >= strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-7 days')
             AND p.status = 'active'
           GROUP BY p.slug
           HAVING v > 0
           ORDER BY v DESC, MIN(e.at) DESC, p.slug ASC`
        )
        .all() as Array<{ slug: string }>
    ).map((r) => r.slug);
  } catch {
    return [];
  }
}

// forkingReady(): the abandonment law, one statement. A project qualifies iff:
//   - unclaimed (claimed = 0 — the authoritative claim state; claimed stubs are
//     held by real maintainers and are NOT forking fodder),
//   - AND it was wanted: (real patronage > 0 [demo != 2 = the project page's
//     funded number] OR ≥10 events total),
//   - AND the compute went quiet in exactly one of the two honest ways:
//       (a) it HAS receipts but none in the last 14 days (a claimed runner
//           going silent), or
//       (b) it has ZERO receipts ever AND is older than 21 days (tokens parked,
//           never started — a brand-new stub does not make the row on day one).
//   fresh unclaimed stubs (age ≤ 21d, zero receipts) do NOT qualify.
export function forkingReady(): string[] {
  try {
    return (
      db
        .prepare(
          `SELECT p.slug AS slug
           FROM projects p
           WHERE p.status = 'active'
             AND p.claimed = 0
             AND ( (SELECT COALESCE(SUM(d.amount_cents), 0) FROM donations d
                     WHERE d.project_id = p.id AND d.demo != 2) > 0
                   OR (SELECT COUNT(*) FROM events e WHERE e.project_id = p.id) >= 10 )
             AND ( ( (SELECT COUNT(*) FROM receipts r WHERE r.project_id = p.id) > 0
                     AND (SELECT COUNT(*) FROM receipts r
                           WHERE r.project_id = p.id
                             AND r.ts >= strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-14 days')) = 0 )
                   OR ( (SELECT COUNT(*) FROM receipts r WHERE r.project_id = p.id) = 0
                        AND p.created_at <= datetime('now', '-21 days') ) )
           ORDER BY p.created_at DESC, p.slug ASC`
        )
        .all() as Array<{ slug: string }>
    ).map((r) => r.slug);
  } catch {
    return [];
  }
}

// communityPicks(): ACTIVE projects ranked by distinct followers (≥1 follow).
// Returns the counts; the board read supplies pct/funded for display.
export function communityPicks(): FollowPick[] {
  try {
    return db
      .prepare(
        `SELECT p.slug AS slug, COUNT(*) AS follows
         FROM follows f
         JOIN projects p ON p.id = f.project_id
         WHERE p.status = 'active'
         GROUP BY p.slug
         HAVING COUNT(*) >= 1
         ORDER BY follows DESC, p.slug ASC`
      )
      .all() as Array<{ slug: string; follows: number }>;
  } catch {
    return [];
  }
}

// followsBySlug(): every ACTIVE project's follow count (0 = absent), backing the
// 'community priority' tab sort (follows desc, velocity tiebreak).
export function followsBySlug(): Record<string, number> {
  try {
    const rows = db
      .prepare(
        `SELECT p.slug AS slug, COUNT(*) AS n
         FROM follows f
         JOIN projects p ON p.id = f.project_id
         WHERE p.status = 'active'
         GROUP BY p.slug`
      )
      .all() as Array<{ slug: string; n: number }>;
    const out: Record<string, number> = {};
    for (const r of rows) out[r.slug] = Number(r.n) || 0;
    return out;
  } catch {
    return {};
  }
}

// mostFunded30d(): ACTIVE projects with ≥1 donation row in the last 30 days,
// SUM(amount_cents)/100 desc. Mirrors the board's donation math (no demo filter)
// so homepage, /api/home and this rollup can never disagree.
export function mostFunded30d(): Funded30d[] {
  try {
    return db
      .prepare(
        `SELECT p.slug AS slug, SUM(d.amount_cents) / 100.0 AS funded30d
         FROM donations d
         JOIN projects p ON p.id = d.project_id
         WHERE p.status = 'active'
           AND d.created_at >= datetime('now', '-30 days')
         GROUP BY p.slug
         HAVING COUNT(*) >= 1
         ORDER BY funded30d DESC, p.slug ASC`
      )
      .all() as Array<{ slug: string; funded30d: number }>;
  } catch {
    return [];
  }
}

// staffPicks(): ONLY the Gui-owned flag (set via SQL / setStaffPick in lib/db.ts).
// Never computed, never defaulted: the flag is 0 everywhere until he names picks,
// and the homepage row auto-hides while that list is empty.
export function staffPicks(): string[] {
  try {
    return (
      db
        .prepare(
          `SELECT p.slug AS slug
           FROM projects p
           WHERE p.staff_pick = 1 AND p.status = 'active'
           ORDER BY p.created_at DESC, p.slug ASC`
        )
        .all() as Array<{ slug: string }>
    ).map((r) => r.slug);
  } catch {
    return [];
  }
}

// affinity(userId): signed-in personalization, v1. Composed of real SQL steps +
// a tiny dedupe merge (order IS the value; no scoring magic):
//   1. own interactions first — followed slugs (most recent follow first)
//   2. …then owned money (funded by this user, biggest first, then freshest)
//   3. category fill — the user's event-weighted top categories (the
//      guessCategory backfill), ACTIVE projects in those categories by velocity
//   4. velocity fill — remaining ACTIVE projects by velocity desc
// Anonymous: just the velocity fill (the board's own momentum).
// The category step is the seam that improves when category data becomes real.
export function affinity(userId?: string | null): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const push = (slug: string | null | undefined) => {
    if (!slug || seen.has(slug)) return;
    seen.add(slug);
    out.push(slug);
  };

  if (userId) {
    try {
      for (const r of db
        .prepare(
          `SELECT p.slug AS slug
           FROM follows f
           JOIN projects p ON p.id = f.project_id
           WHERE f.user_id = ? AND p.status = 'active'
           ORDER BY f.at DESC, p.slug ASC`
        )
        .all(userId) as Array<{ slug: string }>) push(r.slug);
      for (const r of db
        .prepare(
          `SELECT p.slug AS slug
           FROM donations d
           JOIN projects p ON p.id = d.project_id
           WHERE d.user_id = ? AND p.status = 'active'
           GROUP BY p.slug
           ORDER BY SUM(d.amount_cents) DESC, MAX(d.created_at) DESC, p.slug ASC`
        )
        .all(userId) as Array<{ slug: string }>) push(r.slug);
      // category fill: the user's most-interacted categories (events joined to
      // the naive category backfill), then ACTIVE projects in those categories
      // by 7-day velocity. SQL-only per step.
      const catRows = db
        .prepare(
          `SELECT p.category AS cat
           FROM events e
           JOIN projects p ON p.id = e.project_id
           WHERE e.user_id = ? AND p.category IS NOT NULL
           GROUP BY p.category
           ORDER BY COUNT(*) DESC, p.category ASC
           LIMIT 3`
        )
        .all(userId) as Array<{ cat: string }>;
      const cats = catRows.map((r) => r.cat);
      if (cats.length) {
        const vel = velocityBySlug(); // slug-keyed (the category fill sorts by slug)
        const inCat = db
          .prepare(
            `SELECT p.slug AS slug, p.category AS cat
             FROM projects p
             WHERE p.status = 'active' AND p.category IN (${cats.map(() => "?").join(",")})`
          )
          .all(...cats) as Array<{ slug: string; cat: string }>;
        inCat
          .sort(
            (a, b) =>
              (vel[b.slug] ?? 0) - (vel[a.slug] ?? 0) ||
              cats.indexOf(a.cat) - cats.indexOf(b.cat) ||
              a.slug.localeCompare(b.slug)
          )
          .forEach((r) => push(r.slug));
      }
    } catch {
      // fall through to the velocity fill below; personalization that cannot
      // read its tables still degrades to momentum, never errors.
    }
  }

  for (const slug of buzzing()) push(slug);
  return out;
}

// GUI'S LAW (2026-11-06 walkthrough): engineering-probe projects (the scripted
// D3/D5/dbg/loop/full-loop test rows) are ledger history, not front-page
// content. Curation surfaces on the HOMEPAGE exclude them; /discover keeps the
// honest full board. The seeded pilot projects (CFQ corpus, claim stubs) stay.
export const DEMO_SLUG_PREFIXES = [
  "d3-test", "d5", "dbg-run", "loop-verify", "full-loop",
];
export const DEMO_NAME_PREFIXES = [
  "D3 Test", "D5 ", "DBG ", "Loop Verify", "Full Loop",
];
export function isDemoProject(p: { slug?: string | null; name?: string | null }): boolean {
  const slug = (p.slug ?? "").toLowerCase();
  const name = p.name ?? "";
  return (
    DEMO_SLUG_PREFIXES.some((d) => slug.startsWith(d)) ||
    DEMO_NAME_PREFIXES.some((d) => name.startsWith(d))
  );
}
