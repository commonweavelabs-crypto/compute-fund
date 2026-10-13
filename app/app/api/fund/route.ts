import { POST as checkoutPOST } from "../checkout/route";

// Demo-funding endpoint kept for the sprint's UI contract; with STRIPE_SECRET_KEY set it
// transparently becomes the Stripe hosted-checkout initializer (same writes, pending row).
export const POST = checkoutPOST;
