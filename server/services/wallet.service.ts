import { createServerSupabaseClient, createServiceRoleClient } from "@/lib/supabase/server";
import type { Wallet, WalletTransaction, PayoutRequest } from "@/lib/types/database";

export async function getWallet(userId: string): Promise<Wallet> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) throw new Error("Wallet not found");
  return data;
}

export async function getTransactions(userId: string): Promise<WalletTransaction[]> {
  const supabase = await createServerSupabaseClient();
  const { data: wallet } = await supabase
    .from("wallets")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (!wallet) return [];

  const { data, error } = await supabase
    .from("wallet_transactions")
    .select("*")
    .eq("wallet_id", wallet.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to get transactions: ${error.message}`);
  return data ?? [];
}

export async function requestPayout(userId: string, amount: number): Promise<PayoutRequest> {
  const svc = await createServiceRoleClient();

  const { data: wallet } = await svc
    .from("wallets")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!wallet) throw new Error("Wallet not found");
  if (wallet.balance < amount) throw new Error("Insufficient balance");

  // Deduct from wallet
  await svc
    .from("wallets")
    .update({ balance: wallet.balance - amount })
    .eq("id", wallet.id);

  // Record transaction
  await svc.from("wallet_transactions").insert({
    wallet_id: wallet.id,
    type: "withdrawal",
    amount: -amount,
    description: "Payout request",
    reference_id: null,
  });

  // Create payout request
  const { data: payout, error } = await svc
    .from("payout_requests")
    .insert({
      wallet_id: wallet.id,
      user_id: userId,
      amount,
      status: "pending",
      stripe_payout_id: null,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create payout request: ${error.message}`);
  return payout;
}

export async function creditWallet(
  userId: string,
  amount: number,
  type: "deposit" | "prize_payout" | "refund",
  description: string,
  referenceId?: string
): Promise<void> {
  const svc = await createServiceRoleClient();

  const { data: wallet } = await svc
    .from("wallets")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!wallet) throw new Error("Wallet not found");

  await svc
    .from("wallets")
    .update({ balance: wallet.balance + amount })
    .eq("id", wallet.id);

  await svc.from("wallet_transactions").insert({
    wallet_id: wallet.id,
    type,
    amount,
    description,
    reference_id: referenceId ?? null,
  });
}

export async function getPendingPayouts(): Promise<PayoutRequest[]> {
  const svc = await createServiceRoleClient();
  const { data, error } = await svc
    .from("payout_requests")
    .select("*")
    .eq("status", "pending")
    .order("requested_at", { ascending: true });

  if (error) throw new Error(`Failed to get payouts: ${error.message}`);
  return data ?? [];
}

export async function processPayoutRequest(
  payoutId: string,
  status: "completed" | "failed"
): Promise<void> {
  const svc = await createServiceRoleClient();

  const { data: payout } = await svc
    .from("payout_requests")
    .select("*")
    .eq("id", payoutId)
    .single();

  if (!payout) throw new Error("Payout not found");

  await svc
    .from("payout_requests")
    .update({
      status,
      processed_at: new Date().toISOString(),
    })
    .eq("id", payoutId);

  // If failed, refund wallet
  if (status === "failed") {
    await creditWallet(payout.user_id, payout.amount, "refund", "Payout failed - refund");
  }
}
