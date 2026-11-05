import { NextResponse } from "next/server";
import { db, orgBySlug, orgProjects, sumFundedCents } from "../../../../lib/db";

// Public org profile: the org page + its published projects render from THIS.
export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const org = orgBySlug(slug) as
    { id: string; slug: string; name: string; avatar_path: string | null; bio: string | null } | undefined;
  if (!org) return NextResponse.json({ error: "Unknown profile." }, { status: 404 });
  const projects = (orgProjects(org.id) as Record<string, string>[]).map(p => ({
    slug: p.slug, name: p.name, cfq_id: p.cfq_id, one_liner: p.one_liner,
    funded_usd: sumFundedCents(p.id) / 100.0,
  }));
  return NextResponse.json({ org: { slug: org.slug, name: org.name, avatar_path: org.avatar_path, bio: org.bio }, projects });
}
