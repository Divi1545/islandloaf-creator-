import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/services/auth.service";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { parseBody, updateProfileSchema } from "@/lib/utils/validation";

function json<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}
function error(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function GET() {
  try {
    const user = await requireUser();
    return json(user);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.startsWith("Unauthorized")) return error(err.message, 401);
    }
    return error(
      err instanceof Error ? err.message : "Failed to get profile",
      500
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const parsed = parseBody(updateProfileSchema, body);
    if (!parsed.success) return error(parsed.error, 400);

    const supabase = await createServerSupabaseClient();
    const { data, error: dbError } = await supabase
      .from("profiles")
      .update(parsed.data)
      .eq("id", user.id)
      .select()
      .single();

    if (dbError) throw new Error(`Failed to update profile: ${dbError.message}`);
    return json(data);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.startsWith("Unauthorized")) return error(err.message, 401);
    }
    return error(
      err instanceof Error ? err.message : "Failed to update profile",
      500
    );
  }
}
