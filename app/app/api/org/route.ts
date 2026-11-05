import { NextResponse } from "next/server";
import { newId, insertOrg, orgsOwnedBy, orgBySlug, setOrgFields } from "../../../lib/db";
import { currentUser } from "../../../lib/auth";

// Org/business account: created UNDER a user, TRANSFERABLE per standing law.
// MVP = the owner IS the org admin (members/roles = later phase).
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const uid = (user as { id: string }).id;
  const body = await req.json();
  const name: string = body.name?.trim();
  if (!name || name.length < 2) return NextResponse.json({ error: "Org name required." }, { status: 400 });
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 48) + "-" + Date.now().toString(36).slice(-4);
  const dup = orgBySlug(slug);
  if (dup) return NextResponse.json({ error: "Try again — slug collision." }, { status: 409 });
  const id = newId("org");
  insertOrg({ id, slug, name, owner_id: uid, avatar_path: body.avatar_path ?? null, bio: body.bio ?? null });
  return NextResponse.json({ ok: true, slug, id });
}

export async function PATCH(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const uid = (user as { id: string }).id;
  const body = await req.json();
  const org = orgBySlug(String(body.slug)) as { id: string; owner_id: string } | undefined;
  if (!org) return NextResponse.json({ error: "Unknown organization." }, { status: 404 });
  if (org.owner_id !== uid) return NextResponse.json({ error: "Not your organization." }, { status: 403 });
  setOrgFields(org.id, body.fields ?? {});
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ orgs: [] });
  return NextResponse.json({ orgs: orgsOwnedBy((user as { id: string }).id) });
}
