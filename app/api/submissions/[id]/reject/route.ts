import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/server/services/auth.service";
import { rejectSubmission } from "@/server/services/submission.service";

function json<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}
function error(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["admin", "moderator"]);
    const { id } = await params;
    await rejectSubmission(id);
    return json({ rejected: true });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.startsWith("Unauthorized")) return error(err.message, 401);
      if (err.message.startsWith("Forbidden")) return error(err.message, 403);
      if (err.message.startsWith("Account pending"))
        return error(err.message, 403);
    }
    return error(
      err instanceof Error ? err.message : "Failed to reject submission",
      500
    );
  }
}
