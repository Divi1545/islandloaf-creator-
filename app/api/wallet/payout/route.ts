import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/services/auth.service";
import { requestPayout } from "@/server/services/wallet.service";
import { parseBody, payoutRequestSchema } from "@/lib/utils/validation";

function json<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}
function error(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const parsed = parseBody(payoutRequestSchema, body);
    if (!parsed.success) return error(parsed.error, 400);

    const payout = await requestPayout(user.id, parsed.data.amount);
    return json(payout, 201);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.startsWith("Unauthorized")) return error(err.message, 401);
    }
    return error(
      err instanceof Error ? err.message : "Failed to request payout",
      500
    );
  }
}
