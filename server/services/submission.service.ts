import { createServerSupabaseClient, createServiceRoleClient } from "@/lib/supabase/server";
import type { CreateSubmissionPayload } from "@/lib/types/api";
import type { Submission } from "@/lib/types/database";
import { calculateScore } from "@/lib/utils/scoring";

export async function createSubmission(
  creatorId: string,
  payload: CreateSubmissionPayload
): Promise<Submission> {
  const supabase = await createServerSupabaseClient();

  // Verify creator is a participant
  const { data: participant } = await supabase
    .from("campaign_participants")
    .select("id, entry_fee_paid")
    .eq("campaign_id", payload.campaign_id)
    .eq("creator_id", creatorId)
    .single();

  if (!participant) throw new Error("You must join the campaign first");
  if (!participant.entry_fee_paid) throw new Error("Entry fee not paid");

  // Check campaign is active
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("status, deadline")
    .eq("id", payload.campaign_id)
    .single();

  if (!campaign || campaign.status !== "active") throw new Error("Campaign is not active");
  if (new Date(campaign.deadline) < new Date()) throw new Error("Campaign deadline has passed");

  // Check for existing submission
  const { data: existingSub } = await supabase
    .from("submissions")
    .select("id")
    .eq("campaign_id", payload.campaign_id)
    .eq("creator_id", creatorId)
    .single();

  if (existingSub) throw new Error("You already submitted to this campaign");

  const { data, error } = await supabase
    .from("submissions")
    .insert({
      campaign_id: payload.campaign_id,
      creator_id: creatorId,
      video_url: payload.video_url,
      platform: payload.platform,
      posted_at: payload.posted_at,
      status: "pending_review",
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create submission: ${error.message}`);

  // Initialize metrics record with zeros
  const svc = await createServiceRoleClient();
  await svc.from("submission_metrics").insert({
    submission_id: data.id,
    views: 0,
    likes: 0,
    comments: 0,
    score: 0,
    source: "ai_extracted",
    confidence: null,
    approved_by: null,
    approved_at: null,
    raw_data: null,
  });

  return data as unknown as Submission;
}

export async function getSubmissionsForCampaign(campaignId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("submissions")
    .select("*, submission_metrics(*), profiles!submissions_creator_id_fkey(id, full_name, avatar_url)")
    .eq("campaign_id", campaignId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to get submissions: ${error.message}`);
  return data ?? [];
}

export async function getCreatorSubmissions(creatorId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("submissions")
    .select("*, submission_metrics(*), campaigns(id, title, platform, deadline)")
    .eq("creator_id", creatorId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to get creator submissions: ${error.message}`);
  return data ?? [];
}

export async function updateMetrics(
  submissionId: string,
  metrics: { views: number; likes: number; comments: number },
  source: "ai_extracted" | "manual",
  confidence?: number
) {
  const svc = await createServiceRoleClient();
  const score = calculateScore(metrics.views, metrics.likes, metrics.comments);

  const { error } = await svc
    .from("submission_metrics")
    .update({
      views: metrics.views,
      likes: metrics.likes,
      comments: metrics.comments,
      score,
      source,
      confidence: confidence ?? null,
    })
    .eq("submission_id", submissionId);

  if (error) throw new Error(`Failed to update metrics: ${error.message}`);

  // Mark submission as ai_processed
  await svc
    .from("submissions")
    .update({ status: "ai_processed" })
    .eq("id", submissionId);
}

export async function approveSubmissionMetrics(
  submissionId: string,
  moderatorId: string,
  overrides?: { views?: number; likes?: number; comments?: number }
) {
  const svc = await createServiceRoleClient();

  // If overrides provided, recalculate
  if (overrides && (overrides.views !== undefined || overrides.likes !== undefined || overrides.comments !== undefined)) {
    const { data: current } = await svc
      .from("submission_metrics")
      .select("*")
      .eq("submission_id", submissionId)
      .single();

    if (current) {
      const views = overrides.views ?? current.views;
      const likes = overrides.likes ?? current.likes;
      const comments = overrides.comments ?? current.comments;
      const score = calculateScore(views, likes, comments);

      await svc
        .from("submission_metrics")
        .update({
          views,
          likes,
          comments,
          score,
          approved_by: moderatorId,
          approved_at: new Date().toISOString(),
        })
        .eq("submission_id", submissionId);
    }
  } else {
    await svc
      .from("submission_metrics")
      .update({
        approved_by: moderatorId,
        approved_at: new Date().toISOString(),
      })
      .eq("submission_id", submissionId);
  }

  // Mark submission as approved
  await svc
    .from("submissions")
    .update({ status: "approved" })
    .eq("id", submissionId);
}

export async function rejectSubmission(submissionId: string) {
  const svc = await createServiceRoleClient();
  await svc
    .from("submissions")
    .update({ status: "rejected" })
    .eq("id", submissionId);
}
