-- Compute Fund schema (SQLite, WAL). MVP sprint: module db.
-- One file, zero external deps. Receipts = append-only. Money rows record demo vs live.

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,             -- uuid
  email         TEXT NOT NULL UNIQUE,
  pw_hash       TEXT NOT NULL,                -- scrypt: salt$hash
  display_name  TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'user', -- user only in MVP
  supabase_user_id TEXT
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS projects (
  id            TEXT PRIMARY KEY,
  cfq_id        TEXT NOT NULL UNIQUE,         -- CFQ-YYYY-NNN
  owner_id      TEXT NOT NULL REFERENCES users(id),
  slug          TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  one_liner     TEXT NOT NULL,
  question      TEXT NOT NULL,                -- CFQ field 2
  data_inputs   TEXT NOT NULL,                -- field 3
  method        TEXT NOT NULL,                -- field 4 (JSON array of model names = gateway allowlist)
  deliverable   TEXT NOT NULL,                -- field 5
  done_criteria TEXT NOT NULL,                -- field 6
  falsified_by  TEXT NOT NULL,                -- field 7
  review_process TEXT NOT NULL,               -- field 8
  budget_credits REAL NOT NULL,               -- field 9
  deadline      TEXT NOT NULL,                -- field 9
  assumptions   TEXT NOT NULL,                -- field 10
  status        TEXT NOT NULL DEFAULT 'active',  -- active | funded | complete | revoked
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS donations (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id),
  project_id    TEXT NOT NULL REFERENCES projects(id),
  amount_cents  INTEGER NOT NULL,
  tier          TEXT NOT NULL,                -- 25 | 100 | 500
  demo          INTEGER NOT NULL DEFAULT 1,   -- 1 = demo-mode payment
  stripe_ref    TEXT,                         -- session id (demo) or payment intent (live)
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS receipts (
  id            TEXT PRIMARY KEY,
  project_id    TEXT NOT NULL REFERENCES projects(id),
  cfq_id        TEXT NOT NULL,
  ts            TEXT NOT NULL,
  model         TEXT NOT NULL,
  kind          TEXT NOT NULL,                -- classify | generation | bench | ops
  tokens_in     INTEGER NOT NULL,
  tokens_out    INTEGER NOT NULL,
  cost_usd      REAL NOT NULL,
  outcome       TEXT NOT NULL,                -- success | failure
  output_hash   TEXT,                         -- sha256 of output artifact when any
  api_key_id    TEXT                          -- virtual key id (gateway)
);

CREATE TABLE IF NOT EXISTS virtual_keys (
  id            TEXT PRIMARY KEY,
  project_id    TEXT NOT NULL REFERENCES projects(id),
  beneficiary_id TEXT NOT NULL REFERENCES users(id),
  key_hash      TEXT NOT NULL,                -- sha256; raw key shown once at issue
  cap_credits   REAL NOT NULL,                -- hard cap = funded amount
  spent_credits REAL NOT NULL DEFAULT 0,
  model_allowlist TEXT NOT NULL,              -- JSON array from CFQ field 4
  revoked       INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orgs (
  id            TEXT PRIMARY KEY,
  slug          TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  owner_id      TEXT NOT NULL REFERENCES users(id),
  avatar_path   TEXT,
  bio           TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Projects may live under the creator's personal profile OR under an org
-- (org default-recommended; orgs are TRANSFERABLE per standing law). owner_id
-- stays the human who created it; owner_org_id = the public holder when set.
CREATE INDEX IF NOT EXISTS idx_receipts_project ON receipts(project_id, ts);
CREATE INDEX IF NOT EXISTS idx_donations_project ON donations(project_id);

-- D5 discovery engine v1: one real-signal event stream + follows ledger.
-- events = view / fund / follow / claim facts ONLY, all written by the app path
-- that caused them (page render, confirmed checkout, claim move, follow toggle).
-- Weights (fund*10 + follow*3 + view*1) are hardcoded AT QUERY TIME in
-- lib/discover.ts and are never stored. No event is ever synthesized.
CREATE TABLE IF NOT EXISTS events (
  id            TEXT PRIMARY KEY,             -- crypto.randomUUID (request-local)
  at            TEXT NOT NULL,                -- ISO-8601 UTC (new Date().toISOString())
  kind          TEXT NOT NULL CHECK(kind IN ('view','fund','follow','claim')),
  project_id    TEXT REFERENCES projects(id), -- null-able (e.g. view of unknown slug skipped, never stored without one)
  user_id       TEXT                          -- session user when the moment has one (anon views = null)
);
CREATE INDEX IF NOT EXISTS idx_events_project ON events(project_id, at);
CREATE INDEX IF NOT EXISTS idx_events_user ON events(user_id, at);

-- follows: ONE row per (user, project) — a toggle deletes it, never negates.
CREATE TABLE IF NOT EXISTS follows (
  user_id       TEXT NOT NULL,
  project_id    TEXT NOT NULL REFERENCES projects(id),
  at            TEXT NOT NULL,
  PRIMARY KEY(user_id, project_id)
);
CREATE INDEX IF NOT EXISTS idx_follows_project ON follows(project_id);
