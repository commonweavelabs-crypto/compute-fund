import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { followStateFor, toggleFollow } from "../../../lib/discover";
import { currentUser } from "../../../lib/auth";

// D5 follows: POST /api/follow {slug} = toggle one follows row + (on a NEW row
// only) one 'follow' event. Unauth = 401; unknown slug = 404. Un-following never
// writes an event (velocity credits follows, not un-follows), and re-following
// is idempotent (INSERT OR IGNORE → one row, one event).
// GET returns the public follow count + (for the signed-in user) their state, so
// the project page button paints truth instead of guessing.
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in to follow." }, { status: 401 });
  const uid = (user as { id: string }).id;
  const body = await req.json().catch(() => ({}));
  const slug = String(body.slug ?? "");
  if (!slug) return NextResponse.json({ error: "slug required." }, { status: 400 });
  const exists = db.prepare(`SELECT id FROM projects WHERE slug = ?`).get(slug);
  if (!exists) return NextResponse.json({ error: "Unknown project." }, { status: 404 });
  const res = toggleFollow(uid, slug);
  if (!res.ok) return NextResponse.json({ error: "Follow could not be recorded." }, { status: 500 });
  const now = followStateFor(uid, slug);
  return NextResponse.json({ ok: true, following: res.following, count: now.count });
}

export async function GET(req: Request) {
  const user = await currentUser();
  const uid = user ? (user as { id: string }).id : null;
  const slug = new URL(req.url).searchParams.get("slug") ?? "";
  if (!slug) return NextResponse.json({ error: "slug required." }, { status: 400 });
  const state = followStateFor(uid, slug);
  return NextResponse.json({ following: state.following, count: state.count }, {
    headers: { "Cache-Control": "no-store" },
  });
}
