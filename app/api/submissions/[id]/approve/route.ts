import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/server/services/auth.service";
import { approveSubmissionMetrics } from "@/server/services/submission.service";
import { parseBody, approveMetricsSchema } from "@/lib/utils/validation";

function json<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}
function error(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

const approveOverridesSchema = approveMetricsSchema.omit({ submission_id: true });

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole(["admin", "moderator"]);
    const { id } = await params;

    let overrides: { views?: number; likes?: number; comments?: number } | undefined;
    try {
      const body = await request.json();
      const parsed = parseBody(approveOverridesSchema, body);
      if (parsed.success && (parsed.data.views !== undefined || parsed.data.likes !== undefined || parsed.data.comments !== undefined)) {
        overrides = parsed.data as { views?: number; likes?: number; comments?: number };
      }
    } catch {
      // No body or invalid JSON - proceed without overrides
    }

    await approveSubmissionMetrics(id, user.id, overrides);
    return json({ approved: true });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.startsWith("Unauthorized")) return error(err.message, 401);
      if (err.message.startsWith("Forbidden")) return error(err.message, 403);
      if (err.message.startsWith("Account pending"))
        return error(err.message, 403);
    }
    return error(
      err instanceof Error ? err.message : "Failed to approve submission",
      500
    );
  }
}
