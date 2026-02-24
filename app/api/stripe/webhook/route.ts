export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe/client";
import { createServiceRoleClient } from "@/lib/supabase/server";
import Stripe from "stripe";

function json<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}
function error(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function POST(request: NextRequest) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json(
        { success: true, message: "Stripe not configured" },
        { status: 200 }
      );
    }

    const rawBody = await request.text();
    const stripe = getStripe();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripe || !webhookSecret) {
      return NextResponse.json(
        { success: true, message: "Stripe not configured" },
        { status: 200 }
      );
    }

    let event: Stripe.Event;
    try {
      const signature = request.headers.get("stripe-signature");
      if (!signature) return error("Missing stripe-signature header", 400);
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Invalid signature";
      return error(msg, 400);
    }

    const supabase = await createServiceRoleClient();

    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const metadata = pi.metadata as { user_id?: string; campaign_id?: string };
        const userId = metadata?.user_id ?? "unknown";
        const campaignId = metadata?.campaign_id ?? null;

        await supabase.from("payments").insert({
          user_id: userId,
          campaign_id: campaignId,
          amount: pi.amount ?? 0,
          stripe_payment_intent_id: pi.id,
          status: "succeeded",
        });
        break;
      }
      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const metadata = pi.metadata as { user_id?: string; campaign_id?: string };
        const userId = metadata?.user_id ?? "unknown";
        const campaignId = metadata?.campaign_id ?? null;

        await supabase.from("payments").insert({
          user_id: userId,
          campaign_id: campaignId,
          amount: pi.amount ?? 0,
          stripe_payment_intent_id: pi.id,
          status: "failed",
        });
        break;
      }
      default:
        // Unhandled event type
        break;
    }

    return json({ received: true });
  } catch (err) {
    return error(
      err instanceof Error ? err.message : "Webhook handler failed",
      500
    );
  }
}
