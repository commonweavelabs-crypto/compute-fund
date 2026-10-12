import { NextResponse } from "next/server";
import { db, newId, insertDonation } from "../../../lib/db";
import { currentUser } from "../../../lib/auth";

// Demo funding: same writes the live Stripe webhook will do, marked demo: 1.
// 1 credit = $1 of platform compute. Tiers locked at $25/$100/$500 (Ruling 3).
const TIERS: Record<string, { dollars: number; cents: number }> = {
  "25": { dollars: 25, cents: 2500 },
  "100": { dollars: 100, cents: 10000 },
  "500": { dollars: 500, cents: 50000 },
};

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { projectId, tier } = await req.json();
  const t = TIERS[tier];
  if (!t) return NextResponse.json({ error: "Tier must be 25, 100, or 500." }, { status: 400 });
  const project = db.prepare("SELECT id FROM projects WHERE id = ? OR slug = ?").get(projectId, projectId) as
    { id: string } | undefined;
  if (!project) return NextResponse.json({ error: "Unknown project." }, { status: 404 });

  insertDonation({
    id: newId("don"),
    user_id: (user as { id: string }).id,
    project_id: project.id,
    amount_cents: t.cents,
    tier,
    demo: 1,
    stripe_ref: `demo_${Date.now()}`,
  });
  return NextResponse.json({ ok: true, credits: t.dollars, demo: true });
}
