import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/server/services/auth.service";
import {
  listCampaigns,
  createCampaign,
} from "@/server/services/campaign.service";
import { parseBody, createCampaignSchema } from "@/lib/utils/validation";
import type { CampaignStatus } from "@/lib/types/database";

function json<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}
function error(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as CampaignStatus | null;
    const platform = searchParams.get("platform");
    const type = searchParams.get("type");
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");

    const filters: Parameters<typeof listCampaigns>[0] = {};
    if (status) filters.status = status;
    if (platform) filters.platform = platform;
    if (type) filters.type = type;
    if (page) filters.page = parseInt(page, 10);
    if (limit) filters.limit = parseInt(limit, 10);

    const result = await listCampaigns(filters);
    return json(result);
  } catch (err) {
    return error(
      err instanceof Error ? err.message : "Failed to list campaigns",
      500
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(["brand"]);
    const body = await request.json();
    const parsed = parseBody(createCampaignSchema, body);
    if (!parsed.success) return error(parsed.error, 400);

    const campaign = await createCampaign(user.id, parsed.data);
    return json(campaign, 201);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.startsWith("Unauthorized"))
        return error(err.message, 401);
      if (err.message.startsWith("Forbidden"))
        return error(err.message, 403);
      if (err.message.startsWith("Account pending"))
        return error(err.message, 403);
    }
    return error(
      err instanceof Error ? err.message : "Failed to create campaign",
      500
    );
  }
}
