import Stripe from "stripe";

// Stripe client - will return null if no key is configured
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key === "sk_test_placeholder") {
    return null;
  }

  if (!stripeInstance) {
    stripeInstance = new Stripe(key, {
      // @ts-expect-error Stripe API version may differ from installed types
      apiVersion: "2024-12-18.acacia",
      typescript: true,
    });
  }

  return stripeInstance;
}

/**
 * Check if Stripe is configured with real keys
 */
export function isStripeConfigured(): boolean {
  const key = process.env.STRIPE_SECRET_KEY;
  return !!key && key !== "sk_test_placeholder";
}
