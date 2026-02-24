export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/services/auth.service";
import { getStripe, isStripeConfigured } from "@/lib/stripe/client";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { z } from "zod";

function json<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}
function error(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

const createPaymentIntentSchema = z.object({
  amount: z.number().int().min(100, "Minimum amount is $1.00 (100 cents)"),
  campaign_id: z.string().uuid().optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const result = createPaymentIntentSchema.safeParse(body);
    if (!result.success) {
      const message = result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(", ");
      return error(message, 400);
    }

    const { amount, campaign_id } = result.data;
    const supabase = await createServiceRoleClient();

    if (isStripeConfigured()) {
      const stripe = getStripe();
      if (!stripe) return error("Stripe not available", 500);

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        metadata: {
          user_id: user.id,
          campaign_id: campaign_id ?? "",
        },
      });

      await supabase.from("payments").insert({
        user_id: user.id,
        campaign_id: campaign_id ?? null,
        amount,
        stripe_payment_intent_id: paymentIntent.id,
        status: "pending",
      });

      return json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    }

    // Mock payment intent when Stripe not configured
    const mockId = "pi_mock_xxx";
    await supabase.from("payments").insert({
      user_id: user.id,
      campaign_id: campaign_id ?? null,
      amount,
      stripe_payment_intent_id: mockId,
      status: "pending",
    });

    return json({
      clientSecret: null,
      paymentIntentId: mockId,
      message: "Mock payment intent (Stripe not configured)",
    });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.startsWith("Unauthorized")) return error(err.message, 401);
    }
    return error(
      err instanceof Error ? err.message : "Failed to create payment intent",
      500
    );
  }
}
