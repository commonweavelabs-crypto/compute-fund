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
  }
  return _db;
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
  return db.prepare("SELECT id, email, display_name, role, created_at FROM users WHERE id = ?").get(id);
}
export function createUser(email: string, pwHash: string, displayName: string) {
  const id = newId("usr");
  db.prepare("INSERT INTO users (id, email, pw_hash, display_name) VALUES (?, ?, ?, ?)")
    .run(id, email.toLowerCase(), pwHash, displayName);
  return findUserById(id);
}

// -- projects ----------------------------------------------------------------
export function insertProject(p: Record<string, unknown>) {
  db.prepare(`INSERT INTO projects
    (id, cfq_id, owner_id, slug, name, one_liner, question, data_inputs, method,
     deliverable, done_criteria, falsified_by, review_process, budget_credits,
     deadline, assumptions)
    VALUES (@id, @cfq_id, @owner_id, @slug, @name, @one_liner, @question, @data_inputs,
     @method, @deliverable, @done_criteria, @falsified_by, @review_process,
     @budget_credits, @deadline, @assumptions)`).run(p as never);
}
export function nextCfqId(): string {
  const year = new Date().getFullYear();
  const row = db.prepare("SELECT COUNT(*) AS n FROM projects").get() as { n: number };
  return `CFQ-${year}-${String(row.n + 1).padStart(3, "0")}`;
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