import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/services/auth.service";

function json<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}
function error(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function GET() {
  try {
    const profile = await getCurrentUser();
    if (!profile) return error("Unauthorized", 401);
    return json(profile);
  } catch (err) {
    return error(err instanceof Error ? err.message : "Failed to get user", 500);
  }
}
