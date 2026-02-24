import { createServiceRoleClient } from "@/lib/supabase/server";
import { updateMetrics } from "./submission.service";

/**
 * AI Metrics Extraction Service
 *
 * Provider abstraction for extracting performance metrics from social posts.
 * Currently uses a stub/simulated extractor that generates realistic-looking
 * metrics. Replace the provider implementation to use real AI models or
 * social platform APIs in production.
 */

interface MetricsExtractionResult {
  views: number;
  likes: number;
  comments: number;
  confidence: number;
  raw_data: Record<string, unknown>;
}

interface MetricsProvider {
  name: string;
  extract(videoUrl: string, platform: string): Promise<MetricsExtractionResult>;
}

/**
 * Stub provider: generates simulated metrics for MVP testing.
 * Replace with real provider (e.g., social API scraper, AI vision model, etc.)
 */
const stubProvider: MetricsProvider = {
  name: "stub",
  async extract(videoUrl: string, platform: string): Promise<MetricsExtractionResult> {
    // Simulate extraction delay
    await new Promise((r) => setTimeout(r, 500));

    // Generate realistic-looking metrics based on platform
    const multipliers: Record<string, number> = {
      tiktok: 1.5,
      instagram: 1.0,
      youtube: 2.0,
    };
    const mult = multipliers[platform] ?? 1.0;

    const baseViews = Math.floor(Math.random() * 50000) + 1000;
    const views = Math.floor(baseViews * mult);
    const likes = Math.floor(views * (0.03 + Math.random() * 0.07));
    const comments = Math.floor(likes * (0.05 + Math.random() * 0.15));

    return {
      views,
      likes,
      comments,
      confidence: 0.65 + Math.random() * 0.3, // 65-95% confidence
      raw_data: {
        provider: "stub",
        video_url: videoUrl,
        platform,
        extracted_at: new Date().toISOString(),
      },
    };
  },
};

// Active provider - swap this to use a real provider
let activeProvider: MetricsProvider = stubProvider;

export function setMetricsProvider(provider: MetricsProvider) {
  activeProvider = provider;
}

export function getActiveProviderName(): string {
  return activeProvider.name;
}

/**
 * Process a submission through the AI metrics pipeline:
 * 1. Extract metrics using the active provider
 * 2. Store results in submission_metrics
 * 3. Mark submission as ai_processed (pending moderator approval)
 */
export async function processSubmissionMetrics(submissionId: string): Promise<MetricsExtractionResult> {
  const svc = await createServiceRoleClient();

  // Get submission details
  const { data, error: fetchError } = await svc
    .from("submissions")
    .select("*")
    .eq("id", submissionId)
    .single();

  if (fetchError || !data) throw new Error("Submission not found");
  const submission = data as unknown as { id: string; video_url: string; platform: string; status: string };
  if (submission.status !== "pending_review") {
    throw new Error("Submission already processed");
  }

  // Extract metrics
  const result = await activeProvider.extract(submission.video_url, submission.platform);

  // Store metrics
  await updateMetrics(
    submissionId,
    { views: result.views, likes: result.likes, comments: result.comments },
    "ai_extracted",
    result.confidence
  );

  // Store raw data
  await svc
    .from("submission_metrics")
    .update({ raw_data: result.raw_data })
    .eq("submission_id", submissionId);

  return result;
}

/**
 * Batch process all pending submissions
 */
export async function processPendingSubmissions(): Promise<number> {
  const svc = await createServiceRoleClient();

  const { data: pending } = await svc
    .from("submissions")
    .select("id")
    .eq("status", "pending_review");

  const items = (pending ?? []) as Array<{ id: string }>;
  if (items.length === 0) return 0;

  let processed = 0;
  for (const sub of items) {
    try {
      await processSubmissionMetrics(sub.id);
      processed++;
    } catch (e) {
      console.error(`Failed to process submission ${sub.id}:`, e);
    }
  }

  return processed;
}
