import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { provisionProfile } from "@/server/services/auth.service";
import { parseBody, roleSelectSchema } from "@/lib/utils/validation";

function json<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}
function error(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = parseBody(roleSelectSchema, body);
    if (!parsed.success) return error(parsed.error, 400);

    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return error("Unauthorized", 401);
    if (!user.email) return error("Email required", 400);

    const profile = await provisionProfile(user.id, user.email, parsed.data.role);
    return json(profile);
  } catch (err) {
    return error(err instanceof Error ? err.message : "Failed to set role", 500);
  }
}
