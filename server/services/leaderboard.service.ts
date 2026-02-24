import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { LeaderboardEntry } from "@/lib/types/database";

export async function getCampaignLeaderboard(campaignId: string): Promise<LeaderboardEntry[]> {
  const supabase = await createServerSupabaseClient();

  // Query submissions with approved metrics, join with profiles, order by score
  const { data, error } = await supabase
    .from("submissions")
    .select(`
      id,
      campaign_id,
      creator_id,
      profiles!submissions_creator_id_fkey(full_name, avatar_url),
      submission_metrics!inner(views, likes, comments, score, approved_at)
    `)
    .eq("campaign_id", campaignId)
    .eq("status", "approved")
    .not("submission_metrics.approved_at", "is", null)
    .order("submission_metrics(score)", { ascending: false });

  if (error) throw new Error(`Failed to get leaderboard: ${error.message}`);

  // Transform to leaderboard entries with rank
  const entries: LeaderboardEntry[] = (data ?? []).map((row: Record<string, unknown>, index: number) => {
    const profile = row.profiles as Record<string, unknown> | null;
    const metrics = Array.isArray(row.submission_metrics)
      ? (row.submission_metrics[0] as Record<string, unknown>)
      : (row.submission_metrics as Record<string, unknown>);

    return {
      campaign_id: row.campaign_id as string,
      submission_id: row.id as string,
      creator_id: row.creator_id as string,
      creator_name: (profile?.full_name as string) ?? "Unknown",
      creator_avatar: (profile?.avatar_url as string) ?? null,
      views: (metrics?.views as number) ?? 0,
      likes: (metrics?.likes as number) ?? 0,
      comments: (metrics?.comments as number) ?? 0,
      score: (metrics?.score as number) ?? 0,
      rank: index + 1,
    };
  });

  return entries;
}
