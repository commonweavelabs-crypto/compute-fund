import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { currentUser } from "../../../lib/auth";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ owner: false });
  const { slug } = await req.json();
  const p = db.prepare("SELECT owner_id FROM projects WHERE slug = ?").get(slug) as { owner_id: string } | undefined;
  return NextResponse.json({ owner: !!p && p.owner_id === (user as { id: string }).id });
}
