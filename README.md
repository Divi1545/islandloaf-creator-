# IslandLoaf Creator Marketplace

A full-stack web application where brands launch campaigns with prize pools and creators compete by posting content on TikTok, Instagram, or YouTube. Winners are selected based on performance metrics.

## Tech Stack

- **Frontend**: Next.js 15 (React 19, App Router, TypeScript)
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Auth**: Supabase Auth (Email + OTP)
- **Realtime**: Supabase Realtime (live leaderboard updates)
- **Payments**: Stripe (structure ready, no keys required to run)
- **Styling**: Tailwind CSS (dark theme, electric blue accents)
- **Validation**: Zod
- **Testing**: Jest + ts-jest

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (free tier works)
- (Optional) Stripe account for payment features

### Setup

1. **Install dependencies**

```bash
npm install
```

2. **Configure environment**

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

3. **Run database migrations**

Open the Supabase SQL Editor and run `supabase/migrations/001_init.sql`.
Optionally run `supabase/seed.sql` for demo data.

4. **Start development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Run Tests

```bash
npm test
```

## Project Structure

```
├── app/                        # Next.js App Router
│   ├── page.tsx                # Landing page
│   ├── layout.tsx              # Root layout
│   ├── globals.css             # Global styles + design system
│   ├── auth/                   # Login, callback
│   ├── campaigns/              # Public campaign explore + detail
│   ├── creator/                # Creator dashboard pages
│   ├── brand/                  # Brand dashboard pages
│   ├── admin/                  # Admin dashboard pages
│   └── api/                    # API route handlers
│       ├── auth/               # OTP, verify, role, me
│       ├── campaigns/          # CRUD, join
│       ├── submissions/        # Create, metrics, approve/reject
│       ├── leaderboard/        # Campaign rankings
│       ├── wallet/             # Balance, transactions, payout
│       ├── admin/              # User mgmt, payouts, metrics processing
│       ├── profile/            # Profile CRUD
│       └── stripe/             # Payment intent, webhook skeleton
├── components/
│   ├── ui/                     # Reusable UI primitives
│   └── layout/                 # Navbar, Sidebar, DashboardLayout, Footer
├── lib/
│   ├── supabase/               # Supabase client/server/middleware
│   ├── stripe/                 # Stripe client abstraction
│   ├── hooks/                  # React hooks (useRealtimeLeaderboard)
│   ├── types/                  # TypeScript types (database, api)
│   └── utils/                  # Scoring, validation, cn utility
├── server/
│   └── services/               # Business logic layer
│       ├── auth.service.ts
│       ├── campaign.service.ts
│       ├── submission.service.ts
│       ├── wallet.service.ts
│       ├── leaderboard.service.ts
│       └── ai-metrics.service.ts
├── supabase/
│   ├── migrations/001_init.sql # Full database schema + RLS
│   └── seed.sql                # Demo seed data (commented)
└── __tests__/                  # Unit tests
```

## User Roles

| Role | Capabilities |
|------|-------------|
| **Creator** | Browse campaigns, join, submit videos, track performance, manage wallet |
| **Brand** | Create campaigns, set prize pools, track leaderboard, select winners |
| **Admin** | Approve users, manage campaigns, handle payouts, process metrics |
| **Moderator** | Moderate submissions, approve AI-extracted metrics |

## Campaign Types

- **Free**: Brand funds the prize pool. Creators join for free.
- **Entry**: Creators pay an entry fee. Prize pool builds dynamically.
- **Hybrid**: Both brand and creators contribute to the prize pool.

## Scoring Formula

```
score = (views * 0.7) + (likes * 0.2) + (comments * 0.1)
```

## AI Metrics Review Queue

Submissions go through an AI-assisted pipeline:

1. Creator submits a video link
2. AI agent extracts performance metrics (views, likes, comments)
3. Moderator reviews and approves/rejects/edits metrics
4. Approved metrics update the score and leaderboard in real-time

The AI provider is abstracted and swappable. The current MVP uses a stub provider for testing.

## Key Features

- Email + OTP authentication
- Role-based access control with Row Level Security
- Real-time leaderboard via Supabase Realtime
- Wallet system with transaction history
- Stripe payment structure (ready for integration)
- Mobile-first responsive design
- Dark theme with electric blue accents
