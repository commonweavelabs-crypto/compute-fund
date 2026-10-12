import { NextResponse } from "next/server";
import { db, newId, insertDonation, addSpend } from "../../../lib/db";
import { currentUser } from "../../../lib/auth";

// Demo-mode checkout: no live Stripe key in the repo. The route performs exactly what the
// live webhook will do (write donation, top up project budget), marked demo=1. Swapping in
// live mode = verify Stripe signature here and read the tier from the completed session.
const TIERS = { "25": 2500, "100": 10000, "500": 50000 } as const;

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { projectId, tier } = await req.json();
  const cents = TIERS[tier as keyof typeof TIERS];
  if (!cents) return NextResponse.json({ error: "Tier must be 25, 100, or 500." }, { status: 400 });
  const project = db.prepare("SELECT id FROM projects WHERE id = ? OR slug = ?").get(projectId, projectId) as { id: string } | undefined;
  if (!project) return NextResponse.json({ error: "Unknown project." }, { status: 404 });

  const id = newId("don");
  insertDonation({ id, user_id: (user as { id: string }).id, project_id: project.id, amount_cents: cents, tier, demo: 1, stripe_ref: `demo_${Date.now()}` });
  return NextResponse.json({ ok: true, donationId: id, demo: true });
}
