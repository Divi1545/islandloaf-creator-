// Standard API response envelope
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth
export interface OtpRequestPayload {
  email: string;
}

export interface OtpVerifyPayload {
  email: string;
  token: string;
}

export interface RoleSelectPayload {
  role: "creator" | "brand";
}

// Campaign
export interface CreateCampaignPayload {
  title: string;
  description: string;
  type: "free" | "entry" | "hybrid";
  prize_pool: number;
  entry_fee: number;
  target_views: number;
  platform: "tiktok" | "instagram" | "youtube";
  hashtags: string[];
  required_tag: string;
  rules?: string;
  max_participants?: number;
  deadline: string;
}

export interface JoinCampaignPayload {
  campaign_id: string;
}

// Submission
export interface CreateSubmissionPayload {
  campaign_id: string;
  video_url: string;
  platform: "tiktok" | "instagram" | "youtube";
  posted_at: string;
}

// Metrics moderation
export interface ApproveMetricsPayload {
  submission_id: string;
  views?: number;
  likes?: number;
  comments?: number;
}

// Wallet
export interface PayoutRequestPayload {
  amount: number;
}
