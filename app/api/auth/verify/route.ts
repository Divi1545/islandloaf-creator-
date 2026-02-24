import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { parseBody, otpVerifySchema } from "@/lib/utils/validation";

function json<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}
function error(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = parseBody(otpVerifySchema, body);
    if (!parsed.success) return error(parsed.error, 400);

    const supabase = await createServerSupabaseClient();
    const { data, error: authError } = await supabase.auth.verifyOtp({
      email: parsed.data.email,
      token: parsed.data.token,
      type: "email",
    });

    if (authError) return error(authError.message, 400);
    if (!data.session) return error("Verification failed", 400);

    return json({ session: data.session });
  } catch (err) {
    return error(err instanceof Error ? err.message : "Verification failed", 500);
  }
}
