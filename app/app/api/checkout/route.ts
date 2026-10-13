import { NextResponse } from "next/server";
import { db, newId, insertDonation } from "../../../lib/db";
import { currentUser } from "../../../lib/auth";
import { stripeMode, createCheckoutSession } from "../../../lib/stripe";

// Funding entry: STRIPE_SECRET_KEY set = hosted Stripe Checkout (test or live mode by key
// prefix); unset = demo write exactly as before (demo: 1). A pending donation row (demo: 2)
// is written IMMEDIATELY with the session id so the webhook can confirm without trusting
// the success_url alone. sumFundedCents ignores demo=2 rows.
const TIERS: Record<string, number> = { "25": 2500, "100": 10000, "500": 50000 };

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { projectId, tier } = await req.json();
  const cents = TIERS[tier as keyof typeof TIERS];
  if (!cents) return NextResponse.json({ error: "Tier must be 25, 100, or 500." }, { status: 400 });
  const project = db.prepare("SELECT * FROM projects WHERE id = ? OR slug = ?").get(projectId, projectId) as
    { id: string; slug: string; name: string; cfq_id?: string; cfqId?: string } | undefined;
  if (!project) return NextResponse.json({ error: "Unknown project." }, { status: 404 });

  if (stripeMode() === "off") {
    const id = newId("don");
    insertDonation({ id, user_id: (user as { id: string }).id, project_id: project.id, amount_cents: cents, tier, demo: 1, stripe_ref: `demo_${Date.now()}` });
    return NextResponse.json({ ok: true, demo: true, donationId: id });
  }

  const publicUrl = (process.env.CF_PUBLIC_URL || "").replace(/\/$/, "");
  if (!publicUrl) return NextResponse.json({ error: "Server misconfigured: CF_PUBLIC_URL missing." }, { status: 500 });
  const cfqId = project.cfq_id ?? project.cfqId ?? "";
  const session = await createCheckoutSession({
    amountCents: cents,
    projectName: project.name,
    cfqId,
    userId: (user as { id: string }).id,
    projectId: project.id,
    publicUrl,
    successPath: `/p/${project.slug}`,
  });
  const id = newId("don");
  insertDonation({ id, user_id: (user as { id: string }).id, project_id: project.id, amount_cents: cents, tier, demo: 2, stripe_ref: session.id });
  return NextResponse.json({ ok: true, url: session.url, pending: true });
}
