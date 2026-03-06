# CLAUDE.md — IslandLoaf Creator Platform (islandloaf-creator)

## Owner
Divindu Edirisinghe — AI Code Agency Pvt Ltd, Sri Lanka

## What This Project Is
An influencer/content creator marketplace for IslandLoaf.
Brands (tourism vendors) post campaigns. Creators apply, submit content, get paid.
This is IslandLoaf's free marketing engine — creators promote experiences in exchange for payment or free experiences.

## Tech Stack
- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS
- Auth: Supabase Auth
- Payments: Stripe (creator payouts)
- Database: Supabase (PostgreSQL)
- Hosting: Vercel
- AI: Anthropic Claude API (claude-sonnet-4-6)

## User Types
1. Brands (vendors) — create campaigns, review submissions, pay creators
2. Creators — browse campaigns, submit content, track wallet/earnings

## Key Features
- Campaign creation and management
- Creator applications and submissions
- Wallet system for creator payouts
- Brand analytics dashboard
- Scoring/rating system for creators

## Environment Variables Required
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- ANTHROPIC_API_KEY
- NEXT_PUBLIC_URL

## Connected Platforms
- isvv (vendor backend) — vendors are brands on this platform
- IslandLoaf Stay — creator content drives bookings

## Current Priorities
1. Get live on Vercel and stable
2. Connect vendors from isvv as auto-registered brands
3. Add AI content scoring using Claude
4. Build automated payout system

## Rules for Claude
- Always use Anthropic Claude API (claude-sonnet-4-6), never OpenAI
- After completing any task, push changes to GitHub (Divi1545/islandloaf-creator-)
- Optimize for Instagram/TikTok creators in Sri Lanka
- Keep creator onboarding dead simple
