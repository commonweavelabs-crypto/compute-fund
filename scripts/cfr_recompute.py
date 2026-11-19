#!/usr/bin/env python3
"""CFR recompute (Compute Fund) — internal signals ONLY.

SEED-ONCE LAW (Gui 2026-11-19): external signals (GitHub stars/forks/pushes,
HF likes/downloads) are sampled exactly once at import time (they already live
frozen in project_github_meta) and are NEVER re-sampled. This script reads the
frozen seed and recomputes only the internal layers:

  cfr_seed      log-normalized frozen seed, per source (0-60)
  cfr_community follows + donations weighted (0-25)
  cfr_receipts  receipts count + outcome ratio (0-15)
  CFR total     sum, shown as a breakdown badge on the project page

Run any time (idempotent); typically after imports or on demand."""
import math
import sqlite3

DB = r"C:\Users\Guilherme\AppData\Local\hermes\projects\compute-fund\app\compute-fund.db"

MAX_SEED, MAX_COMMUNITY, MAX_RECEIPTS = 60.0, 25.0, 15.0


def seed_score(meta) -> float:
    """Frozen external seed -> 0-60. GitHub: stars+forks+push recency AT IMPORT.
    HF: likes+downloads. Log-normalized; small projects scale gently."""
    if not meta:
        return 0.0
    src, stars, forks, likes, downloads = (meta["source"] or "github"), meta["stars"] or 0, meta["forks"] or 0, meta["likes"] or 0, meta["downloads"] or 0
    days = 9999
    pushed = meta["pushed_at"] or ""
    try:
        import datetime as dt
        days = (dt.datetime.now(dt.timezone.utc) - dt.datetime.fromisoformat(pushed.replace("Z", "+00:00"))).days
    except Exception:
        pass
    if src == "huggingface":
        raw = 2.0 * math.log1p(likes) + 1.2 * math.log1p(downloads / 10.0)
        rec = 8.0 if days <= 30 else (5.0 if days <= 120 else 2.0)
    else:
        raw = 2.0 * math.log1p(stars) + 1.5 * math.log1p(forks)
        rec = 8.0 if days <= 30 else (5.0 if days <= 120 else (3.0 if days <= 365 else 1.5))
    return round(min(MAX_SEED, (raw / 10.0) * 20.0 * (1.0 + rec / 20.0)), 3)


def community_score(db, pid: str) -> float:
    """Internal only: follows + donations, weighted (funder=4x follower)."""
    fol = db.execute("SELECT COUNT(*) AS n FROM follows WHERE project_id = ?", (pid,)).fetchone()[0]
    don = db.execute("SELECT COUNT(*) AS n FROM donations WHERE project_id = ?", (pid,)).fetchone()[0]
    return round(min(MAX_COMMUNITY, fol * 2.0 + don * 4.0), 3)


def receipts_score(db, pid: str) -> float:
    """Internal only: funded-run trust (count + outcome ratio)."""
    n, good = db.execute("SELECT COUNT(*), COALESCE(SUM(outcome='success'),0) FROM receipts WHERE project_id = ?", (pid,)).fetchone()
    if not n:
        return 0.0
    ratio = good / n
    return round(min(MAX_RECEIPTS, 2.0 * math.log1p(n) * 4 * (0.6 + 0.4 * ratio)), 3)


def main() -> None:
    db = sqlite3.connect(DB, timeout=30)
    rows = db.execute("SELECT id FROM projects WHERE status != 'draft'").fetchall()
    ok = 0
    for (pid,) in rows:
        meta = db.execute("SELECT source, stars, forks, likes, downloads, pushed_at FROM project_github_meta WHERE slug = (SELECT slug FROM projects WHERE id = ?)", (pid,)).fetchone()
        meta = dict(zip(("source", "stars", "forks", "likes", "downloads", "pushed_at"), meta)) if meta else None
        s, c, r = seed_score(meta), community_score(db, pid), receipts_score(db, pid)
        db.execute("UPDATE projects SET cfr_seed=?, cfr_community=?, cfr_receipts=?, cfr_at=datetime('now') WHERE id=?", (s, c, r, pid))
        ok += 1
    db.commit()
    top = db.execute("SELECT slug, cfr_seed, cfr_community, cfr_receipts FROM projects ORDER BY (cfr_seed + cfr_community + cfr_receipts) DESC LIMIT 5").fetchall()
    print(f"CFR recomputed for {ok} projects (seed frozen, internal-only)")
    for t in top:
        print(" ", t[0], "→", round(t[1] + t[2] + t[3], 1), f"(seed {t[1]} + community {t[2]} + receipts {t[3]})")


if __name__ == "__main__":
    main()
