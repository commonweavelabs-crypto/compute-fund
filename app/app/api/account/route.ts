import { NextResponse } from "next/server";
import { db, updateProfile } from "../../../lib/db";
import { currentUser } from "../../../lib/auth";

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ user: null });
  const u = user as { id: string };
  const donations = db.prepare(`
    SELECT d.id, d.amount_cents, d.created_at, d.demo, p.name, p.slug
    FROM donations d JOIN projects p ON p.id = d.project_id
    WHERE d.user_id = ? ORDER BY d.created_at DESC`).all(u.id);
  const projects = db.prepare(
    "SELECT id, cfq_id, slug, name, status FROM projects WHERE owner_id = ? ORDER BY created_at DESC").all(u.id);
  const orgs = db.prepare(
    "SELECT id, slug, name FROM orgs WHERE owner_id = ? ORDER BY created_at").all(u.id);
  return NextResponse.json({ user, donations, projects, orgs });
}

// Profile editor: display_name, bio, avatar_path (the avatar lands via /api/upload).
export async function PATCH(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const body = await req.json();
  updateProfile((user as { id: string }).id, body.fields ?? {});
  const u = db.prepare("SELECT id, display_name, avatar_path, bio FROM users WHERE id = ?").get((user as { id: string }).id);
  return NextResponse.json({ ok: true, user: u });
}
