import { createServerSupabaseClient, createServiceRoleClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/lib/types/database";

export async function getCurrentUser(): Promise<Profile | null> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}

export async function requireUser(): Promise<Profile> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function requireRole(roles: UserRole[]): Promise<Profile> {
  const user = await requireUser();
  if (!roles.includes(user.role)) {
    throw new Error(`Forbidden: requires role ${roles.join(" or ")}`);
  }
  if (user.approval_status !== "approved" && user.role !== "admin") {
    throw new Error("Account pending approval");
  }
  return user;
}

export async function provisionProfile(
  userId: string,
  email: string,
  role: UserRole
): Promise<Profile> {
  const supabase = await createServiceRoleClient();

  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      email,
      full_name: email.split("@")[0],
      role,
      approval_status: role === "admin" ? "approved" : "pending",
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to provision profile: ${error.message}`);

  // Auto-create wallet
  await supabase
    .from("wallets")
    .upsert({ user_id: userId, balance: 0 })
    .select()
    .single();

  return data;
}

export async function approveUser(userId: string): Promise<void> {
  const supabase = await createServiceRoleClient();
  const { error } = await supabase
    .from("profiles")
    .update({ approval_status: "approved" })
    .eq("id", userId);

  if (error) throw new Error(`Failed to approve user: ${error.message}`);
}

export async function rejectUser(userId: string): Promise<void> {
  const supabase = await createServiceRoleClient();
  const { error } = await supabase
    .from("profiles")
    .update({ approval_status: "rejected" })
    .eq("id", userId);

  if (error) throw new Error(`Failed to reject user: ${error.message}`);
}
