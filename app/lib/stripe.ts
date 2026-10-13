import { createHmac, timingSafeEqual } from "node:crypto";

// Stripe REST integration, no SDK. Test-mode first: keys arrive via env, nothing is
// committed. STRIPE_SECRET_KEY present = live Stripe test checkout; absent = demo path.
// Webhook signature per Stripe docs: signed payload = `${t}.${rawBody}`, HMAC-SHA256,
// v1 tags compared timing-safe.

const API = "https://api.stripe.com/v1";

export function stripeMode(): "test" | "live" | "off" {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return "off";
  return key.startsWith("sk_test_") ? "test" : "live";
}

export interface CheckoutSession {
  id: string;
  url: string | null;
}

export async function createCheckoutSession(opts: {
  amountCents: number;
  projectName: string;
  cfqId: string;
  userId: string;
  projectId: string;
  publicUrl: string;
  successPath: string;
}): Promise<CheckoutSession> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not set");
  const body = new URLSearchParams();
  body.set("mode", "payment");
  body.set("success_url", `${opts.publicUrl}${opts.successPath}?funded=1&session_id={CHECKOUT_SESSION_ID}`);
  body.set("cancel_url", `${opts.publicUrl}${opts.successPath}?funded=0`);
  body.set("client_reference_id", `${opts.userId}:${opts.projectId}`);
  body.set("line_items[0][quantity]", "1");
  body.set("line_items[0][price_data][currency]", "usd");
  body.set("line_items[0][price_data][unit_amount]", String(opts.amountCents));
  body.set("line_items[0][price_data][product_data][name]", "Compute Fund patronage");
  body.set("line_items[0][price_data][product_data][description]", `${opts.projectName} (${opts.cfqId})`);
  const res = await fetch(`${API}/checkout/sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const data = (await res.json()) as CheckoutSession & { error?: { message: string } };
  if (!res.ok) throw new Error(data.error?.message || `Stripe ${res.status}`);
  return data;
}

// Verify Stripe-Signature header against the raw body.
export function verifyStripeSignature(rawBody: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(
    header.split(",").map((kv) => {
      const [k, v] = kv.split("=", 2);
      return [k.trim(), v];
    }),
  ) as { t?: string; v1?: string };
  if (!parts.t || !parts.v1) return false;
  // replay guard: reject stamps older than 5 minutes
  if (Math.abs(Date.now() / 1000 - Number(parts.t)) > 300) return false;
  const mac = createHmac("sha256", secret).update(`${parts.t}.${rawBody}`).digest("hex");
  const a = Buffer.from(mac, "utf-8");
  const b = Buffer.from(parts.v1, "utf-8");
  return a.length === b.length && timingSafeEqual(a, b);
}
