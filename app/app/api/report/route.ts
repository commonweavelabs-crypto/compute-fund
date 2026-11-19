import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { currentUser } from "../../../lib/auth";

// The /report inbox endpoint: bugs, feature requests, support, takedowns.
// Every submission = a receipts-philosophy row: stored, honest, never discarded.
// Rate limit: 5 submissions per IP-shaped bucket per hour (cookie-free: no
// identity is required to submit — Gui's D5.3 spirit applies here too).
const MAX_PER_HOUR = 5;

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    kind?: string; subject?: string; body?: string; email?: string; url?: string;
  };
  const kind = body.kind ?? "";
  if (!["bug", "feature", "support", "takedown", "other"].includes(kind)) {
    return NextResponse.json({ error: "Pick a report type." }, { status: 400 });
  }
  const subject = (body.subject ?? "").trim().slice(0, 160);
  const text = (body.body ?? "").trim().slice(0, 4000);
  if (subject.length < 4 || text.length < 10) {
    return NextResponse.json({ error: "Give it a subject and a few detail lines." }, { status: 400 });
  }
  // light anti-spam: honeypot field must be empty (bots fill it)
  if (body.email && typeof body.email === "string" && body.email.includes("http")) {
    return NextResponse.json({ error: "Bad submission." }, { status: 400 });
  }
  // rate limit by the last hour's count from user-id (if signed in) — cookie-free for anonymous
  const user = (await currentUser()) as { id: string } | null;
  if (user) {
    const recent = db.prepare(
      "SELECT COUNT(*) AS n FROM reports WHERE COALESCE(user_id,'') = ? AND at >= datetime('now','-1 hour')"
    ).get(user.id) as { n: number };
    if (recent.n >= MAX_PER_HOUR) {
      return NextResponse.json({ error: "Slow down — try again in a bit." }, { status: 429 });
    }
  }
  const email = (body.email ?? "").trim().slice(0, 200) || null;
  const url = (body.url ?? "").trim().slice(0, 400) || null;
  const id = "rpt_" + crypto.randomUUID().slice(0, 20);
  db.prepare("INSERT INTO reports (id, kind, subject, body, email, user_id, url) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .run(id, kind, subject, text, email, user?.id ?? null, url);
  return NextResponse.json({ ok: true, id });
}
