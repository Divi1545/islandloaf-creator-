"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { LeaderboardEntry } from "@/lib/types/database";

/**
 * React hook for real-time leaderboard updates via Supabase Realtime.
 * Subscribes to submission_metrics changes and refetches leaderboard
 * whenever scores change for the given campaign.
 */
export function useRealtimeLeaderboard(campaignId: string | null) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    if (!campaignId) return;
    try {
      const res = await fetch(`/api/leaderboard/${campaignId}`);
      const json = await res.json();
      if (json.success) {
        setEntries(json.data);
      } else {
        setError(json.error || "Failed to fetch leaderboard");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    if (!campaignId) return;

    // Initial fetch
    fetchLeaderboard();

    // Subscribe to realtime changes
    const supabase = createClient();
    const channel = supabase
      .channel(`leaderboard-${campaignId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "submission_metrics",
        },
        () => {
          // Refetch leaderboard on any metrics change
          fetchLeaderboard();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "submissions",
          filter: `campaign_id=eq.${campaignId}`,
        },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId, fetchLeaderboard]);

  return { entries, loading, error, refetch: fetchLeaderboard };
}
