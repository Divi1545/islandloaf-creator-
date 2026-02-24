import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/server/services/auth.service";
import {
  getCampaign,
  updateCampaignStatus,
} from "@/server/services/campaign.service";
import { parseBody, updateCampaignStatusSchema } from "@/lib/utils/validation";

function json<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}
function error(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const campaign = await getCampaign(id);
    return json(campaign);
  } catch (err) {
    if (err instanceof Error && err.message === "Campaign not found") {
      return error("Campaign not found", 404);
    }
    return error(
      err instanceof Error ? err.message : "Failed to get campaign",
      500
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await requireRole(["brand", "admin", "moderator"]);
    const { id } = await params;
    const body = await request.json();
    const parsed = parseBody(updateCampaignStatusSchema, body);
    if (!parsed.success) return error(parsed.error, 400);

    await updateCampaignStatus(id, parsed.data.status);
    const campaign = await getCampaign(id);
    return json(campaign);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.startsWith("Unauthorized"))
        return error(err.message, 401);
      if (err.message.startsWith("Forbidden"))
        return error(err.message, 403);
      if (err.message.startsWith("Account pending"))
        return error(err.message, 403);
      if (err.message === "Campaign not found")
        return error("Campaign not found", 404);
    }
    return error(
      err instanceof Error ? err.message : "Failed to update campaign",
      500
    );
  }
}
