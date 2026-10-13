import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { verifyStripeSignature } from "../../../../lib/stripe";

// Stripe webhook: the ONLY place a pending donation (demo: 2) becomes real (demo: 0).
// Signature-verified against raw body; idempotent on session id; unknown/foreign events
// are 200-acknowledged without writes (Stripe retries failures we actually can't handle).
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook not configured." }, { status: 500 });
  const raw = await req.text();
  if (!verifyStripeSignature(raw, req.headers.get("Stripe-Signature"), secret)) {
    return NextResponse.json({ error: "Bad signature." }, { status: 400 });
  }
  const event = JSON.parse(raw) as {
    type: string;
    data: { object: { id: string; payment_status?: string } };
  };
  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true, ignored: event.type });
  }
  const session = event.data.object;
  const row = db.prepare("SELECT id, demo FROM donations WHERE stripe_ref = ?").get(session.id) as
    { id: string; demo: number } | undefined;
  if (!row) return NextResponse.json({ received: true, unknown_session: true });
  if (row.demo === 0) return NextResponse.json({ received: true, already_confirmed: true }); // idempotent
  if (session.payment_status && session.payment_status !== "paid") {
    return NextResponse.json({ received: true, awaiting_payment: session.payment_status });
  }
  db.prepare("UPDATE donations SET demo = 0 WHERE id = ?").run(row.id);
  return NextResponse.json({ received: true, confirmed: row.id });
}
