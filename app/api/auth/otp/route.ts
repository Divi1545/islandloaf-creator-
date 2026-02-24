import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { parseBody, otpRequestSchema } from "@/lib/utils/validation";

function json<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}
function error(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = parseBody(otpRequestSchema, body);
    if (!parsed.success) return error(parsed.error, 400);

    const supabase = await createServerSupabaseClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: parsed.data.email,
      options: { shouldCreateUser: true },
    });

    if (authError) return error(authError.message, 400);

    return json({ message: "OTP sent to email" });
  } catch (err) {
    return error(err instanceof Error ? err.message : "Failed to send OTP", 500);
  }
}
