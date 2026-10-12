import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
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
    "SELECT id, cfq_id, slug, name FROM projects WHERE owner_id = ? ORDER BY created_at DESC").all(u.id);
  return NextResponse.json({ user, donations, projects });
}
