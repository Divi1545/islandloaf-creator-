import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/server/services/auth.service";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { ApprovalStatus } from "@/lib/types/database";

function json<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}
function error(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function GET(request: NextRequest) {
  try {
    await requireRole(["admin", "moderator"]);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as ApprovalStatus | null;

    const supabase = await createServiceRoleClient();
    let query = supabase.from("profiles").select("*").order("created_at", { ascending: false });

    if (status && ["pending", "approved", "rejected"].includes(status)) {
      query = query.eq("approval_status", status);
    }

    const { data, error: dbError } = await query;

    if (dbError) throw new Error(`Failed to get users: ${dbError.message}`);
    return json(data ?? []);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.startsWith("Unauthorized")) return error(err.message, 401);
      if (err.message.startsWith("Forbidden")) return error(err.message, 403);
      if (err.message.startsWith("Account pending"))
        return error(err.message, 403);
    }
    return error(
      err instanceof Error ? err.message : "Failed to get users",
      500
    );
  }
}
