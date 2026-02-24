import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/server/services/auth.service";
import { joinCampaign } from "@/server/services/campaign.service";

function json<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}
function error(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireRole(["creator"]);
    const { id } = await params;
    await joinCampaign(id, user.id);
    return json({ message: "Successfully joined campaign" }, 201);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.startsWith("Unauthorized"))
        return error(err.message, 401);
      if (err.message.startsWith("Forbidden"))
        return error(err.message, 403);
      if (err.message.startsWith("Account pending"))
        return error(err.message, 403);
      if (err.message === "Campaign is not active")
        return error(err.message, 400);
      if (err.message === "Already joined this campaign")
        return error(err.message, 400);
      if (err.message === "Campaign is full")
        return error(err.message, 400);
      if (err.message === "Insufficient wallet balance for entry fee")
        return error(err.message, 400);
    }
    return error(
      err instanceof Error ? err.message : "Failed to join campaign",
      500
    );
  }
}
