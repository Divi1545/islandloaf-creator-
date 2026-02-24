-- IslandLoaf Creator Marketplace - Database Schema
-- Run this in Supabase SQL editor or via supabase db push

-- Enums
CREATE TYPE user_role AS ENUM ('creator', 'brand', 'admin', 'moderator');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE campaign_type AS ENUM ('free', 'entry', 'hybrid');
CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled');
CREATE TYPE platform AS ENUM ('tiktok', 'instagram', 'youtube');
CREATE TYPE submission_status AS ENUM ('pending_review', 'ai_processed', 'approved', 'rejected');
CREATE TYPE metric_source AS ENUM ('ai_extracted', 'manual', 'api');
CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'entry_fee', 'prize_payout', 'refund');
CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- ================================================================
-- PROFILES
-- ================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'creator',
  approval_status approval_status NOT NULL DEFAULT 'pending',
  bio TEXT,
  tiktok_handle TEXT,
  instagram_handle TEXT,
  youtube_handle TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_approval ON profiles(approval_status);

-- ================================================================
-- CAMPAIGNS
-- ================================================================
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  type campaign_type NOT NULL DEFAULT 'free',
  status campaign_status NOT NULL DEFAULT 'draft',
  prize_pool BIGINT NOT NULL DEFAULT 0,     -- stored in cents
  entry_fee BIGINT NOT NULL DEFAULT 0,      -- stored in cents
  target_views BIGINT NOT NULL DEFAULT 0,
  platform platform NOT NULL DEFAULT 'tiktok',
  hashtags TEXT[] NOT NULL DEFAULT '{}',
  required_tag TEXT NOT NULL DEFAULT '@IslandLoaf',
  rules TEXT,
  max_participants INT,
  deadline TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_campaigns_brand ON campaigns(brand_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_platform ON campaigns(platform);
CREATE INDEX idx_campaigns_deadline ON campaigns(deadline);

-- ================================================================
-- CAMPAIGN PARTICIPANTS
-- ================================================================
CREATE TABLE campaign_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  entry_fee_paid BOOLEAN NOT NULL DEFAULT FALSE,
  payment_id UUID,
  UNIQUE(campaign_id, creator_id)
);

CREATE INDEX idx_participants_campaign ON campaign_participants(campaign_id);
CREATE INDEX idx_participants_creator ON campaign_participants(creator_id);

-- ================================================================
-- SUBMISSIONS
-- ================================================================
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  video_url TEXT NOT NULL,
  platform platform NOT NULL,
  posted_at TIMESTAMPTZ NOT NULL,
  status submission_status NOT NULL DEFAULT 'pending_review',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(campaign_id, creator_id)
);

CREATE INDEX idx_submissions_campaign ON submissions(campaign_id);
CREATE INDEX idx_submissions_creator ON submissions(creator_id);
CREATE INDEX idx_submissions_status ON submissions(status);

-- ================================================================
-- SUBMISSION METRICS
-- ================================================================
CREATE TABLE submission_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL UNIQUE REFERENCES submissions(id) ON DELETE CASCADE,
  views BIGINT NOT NULL DEFAULT 0,
  likes BIGINT NOT NULL DEFAULT 0,
  comments BIGINT NOT NULL DEFAULT 0,
  score DOUBLE PRECISION NOT NULL DEFAULT 0,
  source metric_source NOT NULL DEFAULT 'ai_extracted',
  confidence DOUBLE PRECISION,
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  raw_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_metrics_submission ON submission_metrics(submission_id);
CREATE INDEX idx_metrics_score ON submission_metrics(score DESC);

-- ================================================================
-- WALLETS
-- ================================================================
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  balance BIGINT NOT NULL DEFAULT 0,  -- stored in cents
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- WALLET TRANSACTIONS
-- ================================================================
CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  type transaction_type NOT NULL,
  amount BIGINT NOT NULL,  -- positive for credit, negative for debit
  description TEXT NOT NULL DEFAULT '',
  reference_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_wallet ON wallet_transactions(wallet_id);
CREATE INDEX idx_transactions_created ON wallet_transactions(created_at DESC);

-- ================================================================
-- PAYOUT REQUESTS
-- ================================================================
CREATE TABLE payout_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount BIGINT NOT NULL,
  status payout_status NOT NULL DEFAULT 'pending',
  stripe_payout_id TEXT,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

CREATE INDEX idx_payouts_status ON payout_requests(status);
CREATE INDEX idx_payouts_user ON payout_requests(user_id);

-- ================================================================
-- PAYMENTS
-- ================================================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id),
  amount BIGINT NOT NULL,
  stripe_payment_intent_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_campaign ON payments(campaign_id);

-- ================================================================
-- AUDIT LOGS
-- ================================================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- ================================================================
-- SCORING FUNCTION
-- ================================================================
CREATE OR REPLACE FUNCTION calculate_score(p_views BIGINT, p_likes BIGINT, p_comments BIGINT)
RETURNS DOUBLE PRECISION AS $$
BEGIN
  RETURN (p_views * 0.7) + (p_likes * 0.2) + (p_comments * 0.1);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ================================================================
-- AUTO-UPDATE TIMESTAMPS
-- ================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_campaigns_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_submissions_updated_at BEFORE UPDATE ON submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_submission_metrics_updated_at BEFORE UPDATE ON submission_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_wallets_updated_at BEFORE UPDATE ON wallets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ================================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper: check user role
CREATE OR REPLACE FUNCTION auth_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- PROFILES
CREATE POLICY "Users can view all approved profiles"
  ON profiles FOR SELECT
  USING (approval_status = 'approved' OR id = auth.uid() OR auth_role() IN ('admin', 'moderator'));

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Service role can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (auth_role() = 'admin');

-- CAMPAIGNS
CREATE POLICY "Anyone can view active campaigns"
  ON campaigns FOR SELECT
  USING (status = 'active' OR brand_id = auth.uid() OR auth_role() IN ('admin', 'moderator'));

CREATE POLICY "Brands can create campaigns"
  ON campaigns FOR INSERT
  WITH CHECK (brand_id = auth.uid() AND auth_role() = 'brand');

CREATE POLICY "Brands can update own campaigns"
  ON campaigns FOR UPDATE
  USING (brand_id = auth.uid())
  WITH CHECK (brand_id = auth.uid());

CREATE POLICY "Admins can update any campaign"
  ON campaigns FOR UPDATE
  USING (auth_role() IN ('admin', 'moderator'));

-- CAMPAIGN PARTICIPANTS
CREATE POLICY "Participants visible to campaign members and brand"
  ON campaign_participants FOR SELECT
  USING (
    creator_id = auth.uid()
    OR EXISTS (SELECT 1 FROM campaigns WHERE campaigns.id = campaign_id AND campaigns.brand_id = auth.uid())
    OR auth_role() IN ('admin', 'moderator')
  );

CREATE POLICY "Creators can join campaigns"
  ON campaign_participants FOR INSERT
  WITH CHECK (creator_id = auth.uid() AND auth_role() = 'creator');

CREATE POLICY "Creators can leave (delete) campaigns"
  ON campaign_participants FOR DELETE
  USING (creator_id = auth.uid());

-- SUBMISSIONS
CREATE POLICY "Submissions visible to creator, brand, and staff"
  ON submissions FOR SELECT
  USING (
    creator_id = auth.uid()
    OR EXISTS (SELECT 1 FROM campaigns WHERE campaigns.id = campaign_id AND campaigns.brand_id = auth.uid())
    OR auth_role() IN ('admin', 'moderator')
  );

CREATE POLICY "Creators can create submissions"
  ON submissions FOR INSERT
  WITH CHECK (creator_id = auth.uid() AND auth_role() = 'creator');

CREATE POLICY "Staff can update submissions"
  ON submissions FOR UPDATE
  USING (auth_role() IN ('admin', 'moderator'));

-- SUBMISSION METRICS
CREATE POLICY "Metrics visible same as submissions"
  ON submission_metrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM submissions s
      WHERE s.id = submission_id
      AND (
        s.creator_id = auth.uid()
        OR EXISTS (SELECT 1 FROM campaigns c WHERE c.id = s.campaign_id AND c.brand_id = auth.uid())
        OR auth_role() IN ('admin', 'moderator')
      )
    )
  );

CREATE POLICY "Service can insert/update metrics"
  ON submission_metrics FOR INSERT WITH CHECK (true);

CREATE POLICY "Staff can update metrics"
  ON submission_metrics FOR UPDATE
  USING (auth_role() IN ('admin', 'moderator'));

-- WALLETS
CREATE POLICY "Users can view own wallet"
  ON wallets FOR SELECT USING (user_id = auth.uid() OR auth_role() = 'admin');

CREATE POLICY "Service can manage wallets"
  ON wallets FOR ALL USING (true);

-- WALLET TRANSACTIONS
CREATE POLICY "Users can view own transactions"
  ON wallet_transactions FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM wallets WHERE wallets.id = wallet_id AND wallets.user_id = auth.uid())
    OR auth_role() = 'admin'
  );

CREATE POLICY "Service can insert transactions"
  ON wallet_transactions FOR INSERT WITH CHECK (true);

-- PAYOUT REQUESTS
CREATE POLICY "Users can view own payouts"
  ON payout_requests FOR SELECT
  USING (user_id = auth.uid() OR auth_role() = 'admin');

CREATE POLICY "Users can request payouts"
  ON payout_requests FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update payouts"
  ON payout_requests FOR UPDATE
  USING (auth_role() = 'admin');

-- PAYMENTS
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (user_id = auth.uid() OR auth_role() = 'admin');

CREATE POLICY "Service can manage payments"
  ON payments FOR ALL USING (true);

-- AUDIT LOGS
CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT USING (auth_role() IN ('admin', 'moderator'));

CREATE POLICY "Service can insert audit logs"
  ON audit_logs FOR INSERT WITH CHECK (true);

-- ================================================================
-- REALTIME
-- ================================================================
-- Enable realtime for leaderboard-relevant tables
ALTER PUBLICATION supabase_realtime ADD TABLE submission_metrics;
ALTER PUBLICATION supabase_realtime ADD TABLE submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE campaign_participants;
