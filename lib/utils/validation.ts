import { z } from "zod";

// Auth
export const otpRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const otpVerifySchema = z.object({
  email: z.string().email(),
  token: z.string().min(6).max(6, "OTP must be 6 digits"),
});

export const roleSelectSchema = z.object({
  role: z.enum(["creator", "brand"]),
});

// Profile
export const updateProfileSchema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  bio: z.string().max(500).optional(),
  tiktok_handle: z.string().max(100).optional().nullable(),
  instagram_handle: z.string().max(100).optional().nullable(),
  youtube_handle: z.string().max(100).optional().nullable(),
  website_url: z.string().url().optional().nullable(),
  avatar_url: z.string().url().optional().nullable(),
});

// Campaign
export const createCampaignSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  type: z.enum(["free", "entry", "hybrid"]),
  prize_pool: z.number().min(0),
  entry_fee: z.number().min(0),
  target_views: z.number().min(0),
  platform: z.enum(["tiktok", "instagram", "youtube"]),
  hashtags: z.array(z.string()).min(1).max(10),
  required_tag: z.string().min(1).default("@IslandLoaf") as z.ZodType<string>,
  rules: z.string().max(5000).optional(),
  max_participants: z.number().int().min(1).optional(),
  deadline: z.string().refine((d) => new Date(d) > new Date(), {
    message: "Deadline must be in the future",
  }),
});

export const updateCampaignSchema = createCampaignSchema.partial();

export const updateCampaignStatusSchema = z.object({
  status: z.enum(["draft", "active", "paused", "completed", "cancelled"]),
});

// Submission
export const createSubmissionSchema = z.object({
  campaign_id: z.string().uuid(),
  video_url: z.string().url("Must be a valid URL"),
  platform: z.enum(["tiktok", "instagram", "youtube"]),
  posted_at: z.string(),
});

// Metrics
export const approveMetricsSchema = z.object({
  submission_id: z.string().uuid(),
  views: z.number().int().min(0).optional(),
  likes: z.number().int().min(0).optional(),
  comments: z.number().int().min(0).optional(),
});

// Payout
export const payoutRequestSchema = z.object({
  amount: z.number().int().min(100, "Minimum payout is $1.00"),
});

// Utility
export function parseBody<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (!result.success) {
    const message = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
    return { success: false, error: message };
  }
  return { success: true, data: result.data };
}
