import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/server/services/auth.service";
import {
  getPendingPayouts,
  processPayoutRequest,
} from "@/server/services/wallet.service";
import { z } from "zod";

function json<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}
function error(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

const processPayoutSchema = z.object({
  payout_id: z.string().uuid(),
  status: z.enum(["completed", "failed"]),
});

export async function GET() {
  try {
    await requireRole(["admin"]);
    const payouts = await getPendingPayouts();
    return json(payouts);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.startsWith("Unauthorized")) return error(err.message, 401);
      if (err.message.startsWith("Forbidden")) return error(err.message, 403);
      if (err.message.startsWith("Account pending"))
        return error(err.message, 403);
    }
    return error(
      err instanceof Error ? err.message : "Failed to get payouts",
      500
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(["admin"]);
    const body = await request.json();
    const result = processPayoutSchema.safeParse(body);
    if (!result.success) {
      const message = result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(", ");
      return error(message, 400);
    }

    const { payout_id, status } = result.data;
    await processPayoutRequest(payout_id, status);
    return json({ processed: true });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.startsWith("Unauthorized")) return error(err.message, 401);
      if (err.message.startsWith("Forbidden")) return error(err.message, 403);
      if (err.message.startsWith("Account pending"))
        return error(err.message, 403);
    }
    return error(
      err instanceof Error ? err.message : "Failed to process payout",
      500
    );
  }
}
