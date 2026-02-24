import { NextResponse } from "next/server";
import { requireUser } from "@/server/services/auth.service";
import { getWallet, getTransactions } from "@/server/services/wallet.service";

function json<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}
function error(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function GET() {
  try {
    const user = await requireUser();
    const [wallet, transactions] = await Promise.all([
      getWallet(user.id),
      getTransactions(user.id),
    ]);
    return json({ wallet, transactions });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.startsWith("Unauthorized")) return error(err.message, 401);
    }
    return error(
      err instanceof Error ? err.message : "Failed to get wallet",
      500
    );
  }
}
