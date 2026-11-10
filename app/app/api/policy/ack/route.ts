// Content-policy acceptance audit log (append-only). The wizard's agreement gate
// calls this on "Agree": one row per acceptance (user, version, timestamp).
// Anonymous visitors = 200 without a row (the wizard still requires the checkbox).
import { NextResponse } from "next/server";
import { db, newId } from "../../../../lib/db";
import { currentUser } from "../../../../lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const version = String(body.version ?? "");
  if (!version.startsWith("content-policy-")) return NextResponse.json({ error: "Unknown policy version." }, { status: 400 });
  const user = await currentUser();
  if (!user) return NextResponse.json({ ok: true, logged: false });
  const uid = (user as { id: string }).id;
  db.prepare(`INSERT INTO policy_acks (id, user_id, version, at) VALUES (?, ?, ?, datetime('now'))`)
    .run(newId("pak"), uid, version);
  return NextResponse.json({ ok: true, logged: true });
}
