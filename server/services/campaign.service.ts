import { createServerSupabaseClient, createServiceRoleClient } from "@/lib/supabase/server";
import type { Campaign, CampaignStatus } from "@/lib/types/database";
import type { CreateCampaignPayload } from "@/lib/types/api";

export async function listCampaigns(filters?: {
  status?: CampaignStatus;
  platform?: string;
  type?: string;
  page?: number;
  limit?: number;
}) {
  const supabase = await createServerSupabaseClient();
  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("campaigns")
    .select("*, profiles!campaigns_brand_id_fkey(id, full_name, avatar_url)", { count: "exact" });

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.platform) query = query.eq("platform", filters.platform);
  if (filters?.type) query = query.eq("type", filters.type);

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw new Error(`Failed to list campaigns: ${error.message}`);
  return { campaigns: data ?? [], total: count ?? 0, page, limit };
}

export async function getCampaign(id: string): Promise<Campaign> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select("*, profiles!campaigns_brand_id_fkey(id, full_name, avatar_url)")
    .eq("id", id)
    .single();

  if (error || !data) throw new Error("Campaign not found");
  return data as unknown as Campaign;
}

export async function createCampaign(brandId: string, payload: CreateCampaignPayload): Promise<Campaign> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("campaigns")
    .insert({
      brand_id: brandId,
      title: payload.title,
      description: payload.description,
      type: payload.type,
      status: "draft",
      prize_pool: payload.prize_pool,
      entry_fee: payload.entry_fee,
      target_views: payload.target_views,
      platform: payload.platform,
      hashtags: payload.hashtags,
      required_tag: payload.required_tag,
      rules: payload.rules ?? null,
      max_participants: payload.max_participants ?? null,
      deadline: payload.deadline,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create campaign: ${error.message}`);
  return data as unknown as Campaign;
}

export async function updateCampaignStatus(id: string, status: CampaignStatus): Promise<void> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("campaigns")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(`Failed to update campaign status: ${error.message}`);
}

export async function joinCampaign(campaignId: string, creatorId: string): Promise<void> {
  const supabase = await createServerSupabaseClient();

  // Check campaign exists and is active
  const campaign = await getCampaign(campaignId);
  if (campaign.status !== "active") throw new Error("Campaign is not active");

  // Check not already joined
  const { data: existing } = await supabase
    .from("campaign_participants")
    .select("id")
    .eq("campaign_id", campaignId)
    .eq("creator_id", creatorId)
    .single();

  if (existing) throw new Error("Already joined this campaign");

  // Check max participants
  if (campaign.max_participants) {
    const { count } = await supabase
      .from("campaign_participants")
      .select("id", { count: "exact", head: true })
      .eq("campaign_id", campaignId);

    if (count && count >= campaign.max_participants) {
      throw new Error("Campaign is full");
    }
  }

  const needsPayment = campaign.type !== "free" && campaign.entry_fee > 0;

  const { error } = await supabase
    .from("campaign_participants")
    .insert({
      campaign_id: campaignId,
      creator_id: creatorId,
      entry_fee_paid: !needsPayment,
      payment_id: null,
    });

  if (error) throw new Error(`Failed to join campaign: ${error.message}`);

  // If entry campaign, handle payment via wallet deduction
  if (needsPayment) {
    const svc = await createServiceRoleClient();

    // Get wallet
    const { data: wallet } = await svc
      .from("wallets")
      .select("*")
      .eq("user_id", creatorId)
      .single();

    if (!wallet || wallet.balance < campaign.entry_fee) {
      // Rollback join
      await supabase
        .from("campaign_participants")
        .delete()
        .eq("campaign_id", campaignId)
        .eq("creator_id", creatorId);
      throw new Error("Insufficient wallet balance for entry fee");
    }

    // Deduct
    await svc
      .from("wallets")
      .update({ balance: wallet.balance - campaign.entry_fee })
      .eq("id", wallet.id);

    await svc.from("wallet_transactions").insert({
      wallet_id: wallet.id,
      type: "entry_fee",
      amount: -campaign.entry_fee,
      description: `Entry fee for campaign: ${campaign.title}`,
      reference_id: campaignId,
    });

    // Mark as paid
    await supabase
      .from("campaign_participants")
      .update({ entry_fee_paid: true })
      .eq("campaign_id", campaignId)
      .eq("creator_id", creatorId);

    // Update campaign prize pool for entry/hybrid types
    if (campaign.type === "entry" || campaign.type === "hybrid") {
      await svc
        .from("campaigns")
        .update({ prize_pool: campaign.prize_pool + campaign.entry_fee })
        .eq("id", campaignId);
    }
  }
}

export async function getBrandCampaigns(brandId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("brand_id", brandId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to get brand campaigns: ${error.message}`);
  return data ?? [];
}
