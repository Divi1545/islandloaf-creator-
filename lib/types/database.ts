export type UserRole = "creator" | "brand" | "admin" | "moderator";
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type CampaignType = "free" | "entry" | "hybrid";
export type CampaignStatus = "draft" | "active" | "paused" | "completed" | "cancelled";
export type Platform = "tiktok" | "instagram" | "youtube";
export type SubmissionStatus = "pending_review" | "ai_processed" | "approved" | "rejected";
export type MetricSource = "ai_extracted" | "manual" | "api";
export type TransactionType = "deposit" | "withdrawal" | "entry_fee" | "prize_payout" | "refund";
export type PayoutStatus = "pending" | "processing" | "completed" | "failed";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  approval_status: ApprovalStatus;
  bio: string | null;
  tiktok_handle: string | null;
  instagram_handle: string | null;
  youtube_handle: string | null;
  website_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  brand_id: string;
  title: string;
  description: string;
  type: CampaignType;
  status: CampaignStatus;
  prize_pool: number;
  entry_fee: number;
  target_views: number;
  platform: Platform;
  hashtags: string[];
  required_tag: string;
  rules: string | null;
  max_participants: number | null;
  deadline: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  brand?: Profile;
  participant_count?: number;
}

export interface CampaignParticipant {
  id: string;
  campaign_id: string;
  creator_id: string;
  joined_at: string;
  entry_fee_paid: boolean;
  payment_id: string | null;
}

export interface Submission {
  id: string;
  campaign_id: string;
  creator_id: string;
  video_url: string;
  platform: Platform;
  posted_at: string;
  status: SubmissionStatus;
  created_at: string;
  updated_at: string;
  // Joined
  metrics?: SubmissionMetrics;
  creator?: Profile;
}

export interface SubmissionMetrics {
  id: string;
  submission_id: string;
  views: number;
  likes: number;
  comments: number;
  score: number;
  source: MetricSource;
  confidence: number | null;
  approved_by: string | null;
  approved_at: string | null;
  raw_data: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface LeaderboardEntry {
  campaign_id: string;
  submission_id: string;
  creator_id: string;
  creator_name: string;
  creator_avatar: string | null;
  views: number;
  likes: number;
  comments: number;
  score: number;
  rank: number;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  type: TransactionType;
  amount: number;
  description: string;
  reference_id: string | null;
  created_at: string;
}

export interface PayoutRequest {
  id: string;
  wallet_id: string;
  user_id: string;
  amount: number;
  status: PayoutStatus;
  stripe_payout_id: string | null;
  requested_at: string;
  processed_at: string | null;
}

export interface Payment {
  id: string;
  user_id: string;
  campaign_id: string | null;
  amount: number;
  stripe_payment_intent_id: string | null;
  status: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

// =====================================================
// Supabase Database type mapping
// All Insert/Update types are explicit to avoid Omit<> resolution failures
// =====================================================
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          email: string;
          full_name?: string;
          avatar_url?: string | null;
          role?: UserRole;
          approval_status?: ApprovalStatus;
          bio?: string | null;
          tiktok_handle?: string | null;
          instagram_handle?: string | null;
          youtube_handle?: string | null;
          website_url?: string | null;
        };
        Update: {
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          role?: UserRole;
          approval_status?: ApprovalStatus;
          bio?: string | null;
          tiktok_handle?: string | null;
          instagram_handle?: string | null;
          youtube_handle?: string | null;
          website_url?: string | null;
          updated_at?: string;
        };
      };
      campaigns: {
        Row: Campaign;
        Insert: {
          brand_id: string;
          title: string;
          description?: string;
          type?: CampaignType;
          status?: CampaignStatus;
          prize_pool?: number;
          entry_fee?: number;
          target_views?: number;
          platform?: Platform;
          hashtags?: string[];
          required_tag?: string;
          rules?: string | null;
          max_participants?: number | null;
          deadline: string;
        };
        Update: {
          title?: string;
          description?: string;
          type?: CampaignType;
          status?: CampaignStatus;
          prize_pool?: number;
          entry_fee?: number;
          target_views?: number;
          platform?: Platform;
          hashtags?: string[];
          required_tag?: string;
          rules?: string | null;
          max_participants?: number | null;
          deadline?: string;
          updated_at?: string;
        };
      };
      campaign_participants: {
        Row: CampaignParticipant;
        Insert: {
          campaign_id: string;
          creator_id: string;
          entry_fee_paid?: boolean;
          payment_id?: string | null;
        };
        Update: {
          entry_fee_paid?: boolean;
          payment_id?: string | null;
        };
      };
      submissions: {
        Row: {
          id: string;
          campaign_id: string;
          creator_id: string;
          video_url: string;
          platform: Platform;
          posted_at: string;
          status: SubmissionStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          campaign_id: string;
          creator_id: string;
          video_url: string;
          platform: Platform;
          posted_at: string;
          status?: SubmissionStatus;
        };
        Update: {
          video_url?: string;
          platform?: Platform;
          posted_at?: string;
          status?: SubmissionStatus;
          updated_at?: string;
        };
      };
      submission_metrics: {
        Row: SubmissionMetrics;
        Insert: {
          submission_id: string;
          views?: number;
          likes?: number;
          comments?: number;
          score?: number;
          source?: MetricSource;
          confidence?: number | null;
          approved_by?: string | null;
          approved_at?: string | null;
          raw_data?: Record<string, unknown> | null;
        };
        Update: {
          views?: number;
          likes?: number;
          comments?: number;
          score?: number;
          source?: MetricSource;
          confidence?: number | null;
          approved_by?: string | null;
          approved_at?: string | null;
          raw_data?: Record<string, unknown> | null;
          updated_at?: string;
        };
      };
      wallets: {
        Row: Wallet;
        Insert: {
          user_id: string;
          balance?: number;
        };
        Update: {
          balance?: number;
          updated_at?: string;
        };
      };
      wallet_transactions: {
        Row: WalletTransaction;
        Insert: {
          wallet_id: string;
          type: TransactionType;
          amount: number;
          description?: string;
          reference_id?: string | null;
        };
        Update: Record<string, never>;
      };
      payout_requests: {
        Row: PayoutRequest;
        Insert: {
          wallet_id: string;
          user_id: string;
          amount: number;
          status?: PayoutStatus;
          stripe_payout_id?: string | null;
        };
        Update: {
          amount?: number;
          status?: PayoutStatus;
          stripe_payout_id?: string | null;
          processed_at?: string | null;
        };
      };
      payments: {
        Row: Payment;
        Insert: {
          user_id: string;
          campaign_id?: string | null;
          amount: number;
          stripe_payment_intent_id?: string | null;
          status?: string;
        };
        Update: {
          campaign_id?: string | null;
          amount?: number;
          stripe_payment_intent_id?: string | null;
          status?: string;
        };
      };
      audit_logs: {
        Row: AuditLog;
        Insert: {
          user_id?: string | null;
          action: string;
          entity_type: string;
          entity_id: string;
          metadata?: Record<string, unknown> | null;
        };
        Update: Record<string, never>;
      };
    };
    Views: {
      leaderboard_view: {
        Row: LeaderboardEntry;
      };
    };
    Functions: {
      calculate_score: {
        Args: { p_views: number; p_likes: number; p_comments: number };
        Returns: number;
      };
    };
    Enums: {
      user_role: UserRole;
      approval_status: ApprovalStatus;
      campaign_type: CampaignType;
      campaign_status: CampaignStatus;
      platform: Platform;
      submission_status: SubmissionStatus;
      metric_source: MetricSource;
      transaction_type: TransactionType;
      payout_status: PayoutStatus;
    };
  };
}
