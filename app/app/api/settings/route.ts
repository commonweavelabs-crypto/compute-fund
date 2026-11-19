import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { currentUser } from "../../../lib/auth";

// D1.4 user settings: the toggles live in users.prefs (JSON), the consent
// receipts in privacy_acks (append-only). Personalization opt-in is
// DEFAULT-ON by law (Gui's own spec) — this screen records the OFF switch.
function prefsOf(userId: string): Record<string, unknown> {
  const row = db.prepare("SELECT prefs FROM users WHERE id = ?").get(userId) as { prefs: string | null } | undefined;
  try { return row?.prefs ? JSON.parse(row.prefs) : {}; } catch { return {}; }
}

export async function GET() {
  const user = (await currentUser()) as { id: string } | null;
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const acks = db.prepare("SELECT version, at FROM privacy_acks WHERE user_id = ? ORDER BY at DESC LIMIT 10")
    .all(user.id) as Array<{ version: string; at: string }>;
  return NextResponse.json({ prefs: prefsOf(user.id), consentReceipts: acks });
}

export async function PATCH(req: Request) {
  const user = (await currentUser()) as { id: string } | null;
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as { prefs?: Record<string, unknown> };
  if (!body.prefs || typeof body.prefs !== "object") {
    return NextResponse.json({ error: "prefs object required." }, { status: 400 });
  }
  // merge, never replace: existing keys survive a partial save.
  const merged = { ...prefsOf(user.id), ...body.prefs };
  db.prepare("UPDATE users SET prefs = ? WHERE id = ?").run(JSON.stringify(merged), user.id);
  return NextResponse.json({ ok: true, prefs: merged });
}
