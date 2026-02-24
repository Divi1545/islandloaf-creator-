import { NextRequest, NextResponse } from "next/server";
import { requireUser, requireRole } from "@/server/services/auth.service";
import {
  createSubmission,
  getSubmissionsForCampaign,
  getCreatorSubmissions,
} from "@/server/services/submission.service";
import { parseBody, createSubmissionSchema } from "@/lib/utils/validation";

function json<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}
function error(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(request.url);
    const campaign_id = searchParams.get("campaign_id");

    if (campaign_id) {
      const submissions = await getSubmissionsForCampaign(campaign_id);
      return json(submissions);
    }
    const submissions = await getCreatorSubmissions(user.id);
    return json(submissions);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.startsWith("Unauthorized")) return error(err.message, 401);
    }
    return error(
      err instanceof Error ? err.message : "Failed to get submissions",
      500
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(["creator"]);
    const body = await request.json();
    const parsed = parseBody(createSubmissionSchema, body);
    if (!parsed.success) return error(parsed.error, 400);

    const submission = await createSubmission(user.id, parsed.data);
    return json(submission, 201);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.startsWith("Unauthorized")) return error(err.message, 401);
      if (err.message.startsWith("Forbidden")) return error(err.message, 403);
      if (err.message.startsWith("Account pending"))
        return error(err.message, 403);
    }
    return error(
      err instanceof Error ? err.message : "Failed to create submission",
      500
    );
  }
}
