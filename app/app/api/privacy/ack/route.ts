import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { currentUser } from "../../../../lib/auth";

// D1.4 consent receipts: append-only; the LATEST row's version wins.
// GET    -> the current user's acked privacy version (or null)
// POST {version} -> record consent; the version must match the served one.
const PRIVACY_VERSION = "data-consent-2026-11-1";

function latest(userId: string): string | null {
  const row = db.prepare(
    "SELECT version FROM privacy_acks WHERE user_id = ? ORDER BY at DESC, id DESC LIMIT 1"
  ).get(userId) as { version: string } | undefined;
  return row?.version ?? null;
}

export async function GET() {
  const user = (await currentUser()) as { id: string } | null;
  if (!user) return NextResponse.json({ acked: null });
  return NextResponse.json({ acked: latest(user.id) });
}

export async function POST(req: Request) {
  const user = (await currentUser()) as { id: string } | null;
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as { version?: string };
  if (!body.version || body.version !== PRIVACY_VERSION) {
    return NextResponse.json({ error: "Version mismatch — refresh the page." }, { status: 400 });
  }
  const id = "prk_" + crypto.randomUUID().slice(0, 20);
  db.prepare("INSERT INTO privacy_acks (id, user_id, version) VALUES (?, ?, ?)").run(id, user.id, body.version);
  return NextResponse.json({ ok: true, version: body.version });
}
