import { NextRequest, NextResponse } from "next/server";
import { getCampaignLeaderboard } from "@/server/services/leaderboard.service";

function json<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}
function error(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> }
) {
  try {
    const { campaignId } = await params;
    const entries = await getCampaignLeaderboard(campaignId);
    return json(entries);
  } catch (err) {
    return error(
      err instanceof Error ? err.message : "Failed to get leaderboard",
      500
    );
  }
}
