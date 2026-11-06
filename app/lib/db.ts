// SQLite access for Compute Fund.
// node:sqlite keeps this dependency-free; WAL keeps reads cheap while receipts append.
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const DB_PATH = process.env.CF_DB_PATH || join(process.cwd(), "compute-fund.db");
// Lazy init: route modules import this at build time; the database must not open
// (or create files) during prerender. First real query opens it.
let _db: DatabaseSync | null = null;
export function getDb(): DatabaseSync {
  if (!_db) {
    _db = new DatabaseSync(DB_PATH);
    _db.exec(readFileSync(join(process.cwd(), "lib", "schema.sql"), "utf8"));
    // Schema drift repair for databases created before the auth port: the
    // lazy initializer is the ONLY safe place for DDL (never at import time).
    const cols = _db.prepare("PRAGMA table_info(users)").all() as Array<{ name: string }>;
    if (!cols.some((c) => c.name === "supabase_user_id")) {
      _db.exec("ALTER TABLE users ADD COLUMN supabase_user_id TEXT");
    }
    // D3 create-flow schema drift: draft state, uploads, repo/links, orgs.
    // (schema.sql runs first above, so the `orgs` CREATE TABLE IF NOT EXISTS lands here.)
    const conn = _db;
    const addCol = (table: string, col: string, ddl: string) => {
      const c2 = conn.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>;
      if (!c2.some((c) => c.name === col)) conn.exec(`ALTER TABLE ${table} ADD COLUMN ${ddl}`);
    };
    addCol("projects", "status", "status TEXT DEFAULT 'active'"); // active | draft
    addCol("projects", "logo_path", "logo_path TEXT");
    addCol("projects", "repo_url", "repo_url TEXT");
    addCol("projects", "links", "links TEXT"); // JSON array [{label,url}]
    addCol("projects", "owner_org_id", "owner_org_id TEXT REFERENCES orgs(id)");
    addCol("projects", "story", "story TEXT"); // creator long-form: what/why
    addCol("projects", "roadmap", "roadmap TEXT"); // creator long-form: build plan milestones
    addCol("users", "avatar_path", "avatar_path TEXT");
    addCol("users", "bio", "bio TEXT");
    // D2 claim-flow: unclaimed research-imported stubs. Existing projects default
    // to claimed=1 (true — they were created by their owners); only seeded stubs
    // carry claimed=0 until a maintainer claims (claim moves REAL ownership).
    addCol("projects", "claimed", "claimed INTEGER NOT NULL DEFAULT 1");
    // orgs table: existing DBs opened before the D3 schema landed need the table
    // even when a schema.exec already ran in this process — CREATE IF NOT EXISTS
    // is idempotent and matches schema.sql verbatim.
    _db.exec(`CREATE TABLE IF NOT EXISTS orgs (
      id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
      owner_id TEXT NOT NULL REFERENCES users(id), avatar_path TEXT, bio TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')))`);
    // (schema.sql above now carries events/follows + their indexes — the
    // schema.exec line applied them to every existing DB on this first open.)
    // D5 discovery-engine schema drift: staff-pick flag (Gui-owned, see
    // setStaffPick below), category (powers affinity(); backfilled below by a
    // NAIVE keyword pass, commented v1 heuristic), and a created_at guard for
    // hypothetical projects whose row predates the column (schema.sql has
    // carried created_at since Sprint-001, so this is dead code in practice).
    addCol("projects", "staff_pick", "staff_pick INTEGER NOT NULL DEFAULT 0");
    addCol("projects", "category", "category TEXT");
    const projCols = conn.prepare("PRAGMA table_info(projects)").all() as Array<{ name: string }>;
    if (!projCols.some((c) => c.name === "created_at")) {
      // backfill = slug timestamp: created_at takes the slug itself as a stable,
      // sortable-from-the-row string (no invented dates). Ordering-only fidelity.
      conn.exec(`ALTER TABLE projects ADD COLUMN created_at TEXT NOT NULL DEFAULT ''`);
      conn.exec(`UPDATE projects SET created_at = 'slug:' || slug WHERE created_at = ''`);
    }
    backfillCategories(conn);
  }
  return _db;
}

// -- D5 categories (projects.category TEXT) -----------------------------------
// v1 HEURISTIC, deliberately naive and commented as such: classify a project
// into one of the cfqDomains (the homepage category strip in lib/data.ts:
// decision-models / research / video / infrastructure / wellness / tools) from
// keyword hits on the question + one_liner. Affinity joins on this column;
// when projects carry real category data someday, this pass retires.
const CATEGORY_KEYWORDS: Array<[string, string[]]> = [
  ["decision-models", ["decision", "router", "routing", "vote", "voting", "governance", "policy", "forecast", "jev", "classifier"]],
  ["research", ["research", "study", "benchmark", "analysis", "science", "falsif", "corpus", "evaluation", "dataset", "paper", "reproduc"]],
  ["video", ["video", "film", "documentary", "animation", "youtube", "thumbnail", "render", "caption"]],
  ["infrastructure", ["infrastructure", "infra", "agent", "gateway", "api", "library", "framework", "protocol", "compute", "llm", "open-source", "tooling"]],
  ["wellness", ["wellness", "health", "sleep", "fitness", "nutrition", "wellbeing"]],
  ["tools", ["tool ", "utility", "plugin", "extension", "editor", "app"]],
];
export function guessCategory(question: string | null, oneLiner: string | null): string | null {
  const hay = `${question ?? ""} ${oneLiner ?? ""}`.toLowerCase();
  for (const [cat, words] of CATEGORY_KEYWORDS) {
    if (words.some((w) => hay.includes(w))) return cat;
  }
  return null; // unclassified is honest: affinity just skips the category lift
}
function backfillCategories(conn: DatabaseSync) {
  const rows = conn.prepare(`SELECT id, question, one_liner FROM projects WHERE category IS NULL`).all() as
    Array<{ id: string; question: string; one_liner: string }>;
  for (const r of rows) {
    const cat = guessCategory(r.question, r.one_liner);
    if (cat) conn.prepare(`UPDATE projects SET category = ? WHERE id = ? AND category IS NULL`).run(cat, r.id);
  }
}

// Staff picks: the flag is Gui-owned (a human curation, never computed). Set it
// via plain SQL (UPDATE projects SET staff_pick = 1 WHERE slug = '…') or this
// helper; the flag is 0 everywhere until he names picks — no default picks.
export function setStaffPick(slug: string, pick: number) {
  db.prepare(`UPDATE projects SET staff_pick = ? WHERE slug = ?`).run(pick ? 1 : 0, slug);
}
// Convenience proxy so callers can keep using `db.prepare(...)`.
export const db = new Proxy({} as DatabaseSync, {
  get(_t, prop) {
    const d = getDb() as unknown as Record<string | symbol, unknown>;
    const v = d[prop];
    return typeof v === "function" ? (v as (...a: unknown[]) => unknown).bind(d) : v;
  },
});

export function newId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 20)}`;
}

// -- users -------------------------------------------------------------------
export function findUserByEmail(email: string) {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase());
}
export function findUserById(id: string) {
  return db.prepare("SELECT id, email, display_name, role, created_at, avatar_path, bio FROM users WHERE id = ?").get(id);
}
export function createUser(email: string, pwHash: string, displayName: string) {
  const id = newId("usr");
  db.prepare("INSERT INTO users (id, email, pw_hash, display_name) VALUES (?, ?, ?, ?)")
    .run(id, email.toLowerCase(), pwHash, displayName);
  return findUserById(id);
}


// -- supabase identity join (the auth port; SQLite stays the ledger) -----------
// The Supabase cloud profile is the front door; this row is the local ledger
// identity. pw_hash stays blank for OAuth-only users (not null: the column is
// NOT NULL — the sentinel means "no local password set").
export function ensureUserByEmail(email: string, displayName: string, supabaseUserId: string) {
  const em = email.toLowerCase();
  const existing = db.prepare("SELECT * FROM users WHERE email = ?").get(em) as
    { id: string; supabase_user_id?: string | null } | undefined;
  if (existing) {
    if (!existing.supabase_user_id) {
      db.prepare("UPDATE users SET supabase_user_id = ? WHERE id = ?").run(supabaseUserId, existing.id);
      return db.prepare("SELECT id, email, display_name FROM users WHERE id = ?").get(existing.id);
    }
    return existing;
  }
  const id = newId("usr");
  db.prepare("INSERT INTO users (id, email, pw_hash, display_name, supabase_user_id) VALUES (?, ?, ?, ?, ?)")
    .run(id, em, "oauth-no-local-password", displayName || "patron", supabaseUserId);
  return db.prepare("SELECT id, email, display_name FROM users WHERE id = ?").get(id);
}

// -- projects ----------------------------------------------------------------
export function insertProject(p: Record<string, unknown>) {
  db.prepare(`INSERT INTO projects
    (id, cfq_id, owner_id, slug, name, one_liner, question, data_inputs, method,
     deliverable, done_criteria, falsified_by, review_process, budget_credits,
     deadline, assumptions, status, logo_path, repo_url, links, owner_org_id,
      story, roadmap)
     VALUES (@id, @cfq_id, @owner_id, @slug, @name, @one_liner, @question, @data_inputs,
      @method, @deliverable, @done_criteria, @falsified_by, @review_process,
      @budget_credits, @deadline, @assumptions, @status, @logo_path, @repo_url,
      @links, @owner_org_id, @story, @roadmap)`).run({
     status: "active", logo_path: null, repo_url: null, links: null, owner_org_id: null,
     story: null, roadmap: null,
     ...p,
     } as never);
  // category: never left NULL when the naive heuristic can name it (affinity
  // joins on this column; an explicit override wins).
  if (!p.category) {
    db.prepare(`UPDATE projects SET category = ? WHERE id = ? AND category IS NULL`).run(
      guessCategory(p.question as string | null, p.one_liner as string | null),
      String(p.id ?? ""),
    );
  }
}
export function nextCfqId(): string {
  const year = new Date().getFullYear();
  const row = db.prepare("SELECT COUNT(*) AS n FROM projects").get() as { n: number };
  return `CFQ-${year}-${String(row.n + 1).padStart(3, "0")}`;
}

// -- orgs (MVP create-flow; TRANSFERABLE law: owner may move projects) ---------
export function insertOrg(o: Record<string, unknown>) {
  db.prepare("INSERT INTO orgs (id, slug, name, owner_id, avatar_path, bio) VALUES (@id, @slug, @name, @owner_id, @avatar_path, @bio)").run(o as never);
}
export function orgsOwnedBy(userId: string) {
  return db.prepare("SELECT id, slug, name, avatar_path, bio FROM orgs WHERE owner_id = ? ORDER BY created_at").all(userId);
}
export function orgBySlug(slug: string) {
  return db.prepare("SELECT id, slug, name, avatar_path, bio, owner_id FROM orgs WHERE slug = ?").get(slug);
}
export function orgProjects(orgId: string) {
  return db.prepare("SELECT id, cfq_id, slug, name, one_liner, status FROM projects WHERE owner_org_id = ? AND status != 'draft' ORDER BY created_at DESC").all(orgId);
}
export function userBySlugForOrg(userId: string) { return orgsOwnedBy(userId); }
export function setOrgFields(orgId: string, fields: Record<string, unknown>) {
  const allowed = ["name", "avatar_path", "bio"];
  const sets: string[] = [];
  const vals: Record<string, unknown> = { id: orgId };
  for (const k of allowed) if (k in fields) { sets.push(`${k} = @${k}`); vals[k] = fields[k]; }
  if (!sets.length) return;
  db.prepare(`UPDATE orgs SET ${sets.join(", ")} WHERE id = @id`).run(vals as never);
}

// -- projects extend (draft/publish/transfer) ---------------------------------
export function projectBySlug(slug: string) {
  return db.prepare("SELECT * FROM projects WHERE slug = ?").get(slug);
}
export function setProjectStatus(id: string, status: string) {
  db.prepare("UPDATE projects SET status = ? WHERE id = ?").run(status, id);
}
export function setProjectOrg(id: string, orgId: string | null) {
  db.prepare("UPDATE projects SET owner_org_id = ? WHERE id = ?").run(orgId, id);
}
export function setProjectFields(id: string, fields: Record<string, unknown>) {
  const allowed = ["logo_path", "repo_url", "links", "one_liner", "story", "roadmap"];
  const sets: string[] = [];
  const vals: Record<string, unknown> = { id };
  for (const k of allowed) if (k in fields) { sets.push(`${k} = @${k}`); vals[k] = fields[k]; }
  if (!sets.length) return;
  db.prepare(`UPDATE projects SET ${sets.join(", ")} WHERE id = @id`).run(vals as never);
}
export function updateProfile(userId: string, fields: Record<string, unknown>) {
  const allowed = ["display_name", "avatar_path", "bio"];
  const sets: string[] = [];
  const vals: Record<string, unknown> = { id: userId };
  for (const k of allowed) if (k in fields) { sets.push(`${k} = @${k}`); vals[k] = fields[k]; }
  if (!sets.length) return;
  db.prepare(`UPDATE users SET ${sets.join(", ")} WHERE id = @id`).run(vals as never);
}

// -- donations ---------------------------------------------------------------
export function insertDonation(d: Record<string, unknown>) {
  db.prepare(`INSERT INTO donations (id, user_id, project_id, amount_cents, tier, demo, stripe_ref)
    VALUES (@id, @user_id, @project_id, @amount_cents, @tier, @demo, @stripe_ref)`).run(d as never);
}
export function sumFundedCents(projectId: string): number {
  const row = db.prepare("SELECT COALESCE(SUM(amount_cents),0) AS total FROM donations WHERE project_id = ? AND demo != 2")
    .get(projectId) as { total: number };
  return row.total;
}

// -- receipts (append-only) ----------------------------------------------------
export function insertReceipt(r: Record<string, unknown>) {
  db.prepare(`INSERT INTO receipts
    (id, project_id, cfq_id, ts, model, kind, tokens_in, tokens_out, cost_usd, outcome, output_hash, api_key_id)
    VALUES (@id, @project_id, @cfq_id, @ts, @model, @kind, @tokens_in, @tokens_out, @cost_usd, @outcome, @output_hash, @api_key_id)`)
    .run(r as never);
}
export function receiptsForProject(projectId: string) {
  return db.prepare("SELECT * FROM receipts WHERE project_id = ? ORDER BY ts DESC LIMIT 100").all(projectId);
}

// -- virtual keys --------------------------------------------------------------
export function insertVirtualKey(vk: Record<string, unknown>) {
  db.prepare(`INSERT INTO virtual_keys
    (id, project_id, beneficiary_id, key_hash, cap_credits, model_allowlist)
    VALUES (@id, @project_id, @beneficiary_id, @key_hash, @cap_credits, @model_allowlist)`).run(vk as never);
}
export function virtualKeyByKeyHash(hash: string) {
  return db.prepare("SELECT * FROM virtual_keys WHERE key_hash = ? AND revoked = 0").get(hash);
}
export function addSpend(keyId: string, credits: number) {
  db.prepare("UPDATE virtual_keys SET spent_credits = spent_credits + ? WHERE id = ?").run(credits, keyId);
}

// -- D2 claim-flow: UNCLAIMED research-imported stubs + the claim move ----------
// Law: a claim moves REAL ownership. Unclaimed stubs are held by the system user
// ('cf_system', auth-impossible sentinel); claiming flips claimed 0 -> 1 and
// owner_id -> the claimant's user id (TRANSFERABLE law), receipted as kind='ops'.
export const SYSTEM_USER_EMAIL = "claims+noreply@commonweavelabs.com";
const SYSTEM_PW_SENTINEL = "oauth-no-local-password"; // no salt$hash pair => verifyPassword is impossible

export function ensureSystemUser(): { id: string } {
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(SYSTEM_USER_EMAIL) as
    { id: string } | undefined;
  if (existing) return existing;
  const id = newId("usr");
  db.prepare("INSERT INTO users (id, email, pw_hash, display_name, role) VALUES (?, ?, ?, ?, ?)")
    .run(id, SYSTEM_USER_EMAIL, SYSTEM_PW_SENTINEL, "CommonWeave Labs System", "system");
  return { id };
}

// Seed insert: same shape as insertProject plus the claim state (claimed=0,
// owner = the system user). Idempotency is enforced by the CALLER (skip if slug exists).
export function insertStubProject(p: Record<string, unknown>) {
  db.prepare(`INSERT INTO projects
    (id, cfq_id, owner_id, slug, name, one_liner, question, data_inputs, method,
     deliverable, done_criteria, falsified_by, review_process, budget_credits,
     deadline, assumptions, status, logo_path, repo_url, links, owner_org_id, claimed)
    VALUES (@id, @cfq_id, @owner_id, @slug, @name, @one_liner, @question, @data_inputs,
     @method, @deliverable, @done_criteria, @falsified_by, @review_process,
     @budget_credits, @deadline, @assumptions, @status, @logo_path, @repo_url,
     @links, @owner_org_id, @claimed)`).run({
    status: "active", logo_path: null, links: null, owner_org_id: null, claimed: 0,
    ...p,
  } as never);
  // Same category rule as insertProject (v1 heuristic, see guessCategory).
  if (!p.category) {
    db.prepare(`UPDATE projects SET category = ? WHERE id = ? AND category IS NULL`).run(
      guessCategory(p.question as string | null, p.one_liner as string | null),
      String(p.id ?? ""),
    );
  }
}

export function projectClaimState(slug: string) {
  return db.prepare("SELECT id, slug, name, one_liner, repo_url, claimed, status, cfq_id, owner_id FROM projects WHERE slug = ?").get(slug) as
    { id: string; slug: string; name: string; one_liner: string; repo_url: string | null; claimed: number; status: string; cfq_id: string; owner_id: string } | undefined;
}

// The claim move itself: atomic on the claimed=0 guard (duplicate claims race to
// the same UPDATE and only one wins), then the 'ops' receipt. If the receipt
// write fails, the ownership move is reverted (no receipt-less transfer).
export function claimProjectBySlug(slug: string, claimantId: string, proofHash: string):
  { ok: true; owner_id: string; receipt_id: string } | { ok: false; reason: "not-found" | "already-claimed" | "receipt-failed" } {
  const p = projectClaimState(slug);
  if (!p) return { ok: false, reason: "not-found" };
  if (p.claimed) return { ok: false, reason: "already-claimed" };
  const res = db.prepare("UPDATE projects SET claimed = 1, owner_id = ? WHERE id = ? AND claimed = 0")
    .run(claimantId, p.id) as { changes: number };
  if (res.changes === 0) return { ok: false, reason: "already-claimed" };
  const receiptId = newId("rcp");
  try {
    insertReceipt({
      id: receiptId, project_id: p.id, cfq_id: p.cfq_id, ts: new Date().toISOString(),
      model: "claim-flow", kind: "ops", tokens_in: 0, tokens_out: 0, cost_usd: 0,
      outcome: "success", output_hash: proofHash, api_key_id: null,
    });
  } catch {
    // revert: ownership without its receipt is not a valid move (audit law)
    db.prepare("UPDATE projects SET claimed = 0, owner_id = ? WHERE id = ?").run(p.owner_id, p.id);
    return { ok: false, reason: "receipt-failed" };
  }
  return { ok: true, owner_id: claimantId, receipt_id: receiptId };
}