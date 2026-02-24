-- IslandLoaf Creator Marketplace - Seed Data
-- Run AFTER migrations. Useful for local development/demo.

-- Note: These inserts assume you have created auth users first via Supabase Auth.
-- For local dev, you can create users via the Supabase dashboard or CLI,
-- then use their UUIDs here.

-- Example: Create profiles (replace UUIDs with real auth.users IDs)
-- INSERT INTO profiles (id, email, full_name, role, approval_status) VALUES
--   ('11111111-1111-1111-1111-111111111111', 'admin@islandloaf.com', 'Admin User', 'admin', 'approved'),
--   ('22222222-2222-2222-2222-222222222222', 'brand@demo.com', 'Demo Brand', 'brand', 'approved'),
--   ('33333333-3333-3333-3333-333333333333', 'creator1@demo.com', 'Alex Creator', 'creator', 'approved'),
--   ('44444444-4444-4444-4444-444444444444', 'creator2@demo.com', 'Sam Creator', 'creator', 'approved'),
--   ('55555555-5555-5555-5555-555555555555', 'mod@islandloaf.com', 'Moderator', 'moderator', 'approved');

-- Example: Create wallets
-- INSERT INTO wallets (user_id, balance) VALUES
--   ('22222222-2222-2222-2222-222222222222', 50000),    -- $500
--   ('33333333-3333-3333-3333-333333333333', 24500),    -- $245
--   ('44444444-4444-4444-4444-444444444444', 0);

-- Example: Create campaigns
-- INSERT INTO campaigns (brand_id, title, description, type, status, prize_pool, entry_fee, target_views, platform, hashtags, required_tag, deadline) VALUES
--   ('22222222-2222-2222-2222-222222222222', 'Summer Beach Challenge', 'Show us your best beach content!', 'free', 'active', 100000, 0, 50000, 'tiktok', ARRAY['#SummerVibes', '#BeachLife'], '@IslandLoaf', NOW() + INTERVAL '30 days'),
--   ('22222222-2222-2222-2222-222222222222', 'Urban Style Wars', 'Street fashion competition', 'entry', 'active', 25000, 500, 100000, 'instagram', ARRAY['#UrbanStyle', '#FashionWars'], '@IslandLoaf', NOW() + INTERVAL '14 days'),
--   ('22222222-2222-2222-2222-222222222222', 'Cook-Off Challenge', 'Share your best recipe video', 'hybrid', 'active', 50000, 1000, 25000, 'youtube', ARRAY['#CookOff', '#RecipeChallenge'], '@IslandLoaf', NOW() + INTERVAL '21 days');

-- Example: Join campaigns
-- INSERT INTO campaign_participants (campaign_id, creator_id, entry_fee_paid) VALUES
--   ((SELECT id FROM campaigns WHERE title = 'Summer Beach Challenge'), '33333333-3333-3333-3333-333333333333', true),
--   ((SELECT id FROM campaigns WHERE title = 'Summer Beach Challenge'), '44444444-4444-4444-4444-444444444444', true);

-- Example: Create submissions
-- INSERT INTO submissions (campaign_id, creator_id, video_url, platform, posted_at, status) VALUES
--   ((SELECT id FROM campaigns WHERE title = 'Summer Beach Challenge'), '33333333-3333-3333-3333-333333333333', 'https://www.tiktok.com/@alexcreator/video/123456789', 'tiktok', NOW() - INTERVAL '2 days', 'approved');

-- Example: Create metrics
-- INSERT INTO submission_metrics (submission_id, views, likes, comments, score, source, approved_by, approved_at) VALUES
--   ((SELECT id FROM submissions WHERE creator_id = '33333333-3333-3333-3333-333333333333' LIMIT 1), 45000, 3200, 450, (45000 * 0.7) + (3200 * 0.2) + (450 * 0.1), 'ai_extracted', '11111111-1111-1111-1111-111111111111', NOW());

SELECT 'Seed file loaded - uncomment INSERT statements and replace UUIDs with your auth.users IDs' AS status;
