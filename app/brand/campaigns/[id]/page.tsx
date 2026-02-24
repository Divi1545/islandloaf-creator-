"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Trophy,
  Users,
  Eye,
  ThumbsUp,
  Pause,
  CheckCircle,
  ChevronLeft,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { formatCurrency, formatNumber } from "@/lib/utils/scoring";
import { cn } from "@/lib/utils/cn";

const mockUser = {
  id: "1",
  full_name: "Acme Brand",
  role: "brand" as const,
  avatar_url: null,
};

const MOCK_CAMPAIGNS: Record<
  string,
  {
    id: string;
    title: string;
    platform: string;
    status: "draft" | "active" | "paused" | "completed";
    prizePool: number;
    participants: number;
    totalViews: number;
    avgScore: number;
  }
> = {
  "1": {
    id: "1",
    title: "Summer Vibes Challenge",
    platform: "TikTok",
    status: "active",
    prizePool: 500000,
    participants: 127,
    totalViews: 245000,
    avgScore: 8920,
  },
  "2": {
    id: "2",
    title: "Fitness Transformation",
    platform: "Instagram",
    status: "active",
    prizePool: 1000000,
    participants: 89,
    totalViews: 189000,
    avgScore: 10200,
  },
  "3": {
    id: "3",
    title: "Tech Unboxing Showdown",
    platform: "YouTube",
    status: "draft",
    prizePool: 2500000,
    participants: 0,
    totalViews: 0,
    avgScore: 0,
  },
  "4": {
    id: "4",
    title: "Dance Battle 2025",
    platform: "TikTok",
    status: "completed",
    prizePool: 750000,
    participants: 203,
    totalViews: 512000,
    avgScore: 11500,
  },
  "5": {
    id: "5",
    title: "Foodie Adventures",
    platform: "Instagram",
    status: "active",
    prizePool: 300000,
    participants: 156,
    totalViews: 98000,
    avgScore: 7200,
  },
};

const MOCK_LEADERBOARD = [
  { rank: 1, creator: "CreatorPro", score: 12500, views: 15000, likes: 3200, comments: 450 },
  { rank: 2, creator: "SummerQueen", score: 11200, views: 13500, likes: 2800, comments: 380 },
  { rank: 3, creator: "VibeMaster", score: 9800, views: 11800, likes: 2400, comments: 310 },
  { rank: 4, creator: "BeachDays", score: 8700, views: 10200, likes: 2100, comments: 290 },
  { rank: 5, creator: "SunsetChaser", score: 7600, views: 9100, likes: 1900, comments: 250 },
];

const statusVariant = {
  draft: "warning" as const,
  active: "success" as const,
  paused: "electric" as const,
  completed: "electric" as const,
};

export default function BrandCampaignDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const campaign = id ? MOCK_CAMPAIGNS[id] : null;

  const handleActivate = () => {
    alert("Activate campaign (mock)");
  };
  const handlePause = () => {
    alert("Pause campaign (mock)");
  };
  const handleComplete = () => {
    alert("Complete campaign (mock)");
  };

  if (!campaign) {
    return (
      <DashboardLayout user={mockUser} currentPath="/brand/campaigns">
        <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
          <h2 className="text-xl font-semibold text-white">Campaign not found</h2>
          <Link href="/brand/campaigns" className="mt-4">
            <Button variant="secondary">Back to Campaigns</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={mockUser} currentPath="/brand/campaigns">
      <div className="space-y-8 animate-fade-in">
        {/* Back link */}
        <Link
          href="/brand/campaigns"
          className="inline-flex items-center gap-1 text-sm text-surface-400 hover:text-electric transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Campaigns
        </Link>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="electric">{campaign.platform}</Badge>
              <Badge variant={statusVariant[campaign.status]}>
                {campaign.status}
              </Badge>
            </div>
            <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
              {campaign.title}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {campaign.status === "draft" && (
              <Button variant="primary" size="sm" onClick={handleActivate}>
                Activate
              </Button>
            )}
            {campaign.status === "active" && (
              <>
                <Button variant="secondary" size="sm" onClick={handlePause}>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </Button>
                <Button variant="secondary" size="sm" onClick={handleComplete}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Complete
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="flex items-center gap-4 p-4 animate-slide-up">
            <div className="rounded-xl bg-electric/10 p-2.5">
              <Trophy className="h-6 w-6 text-electric" />
            </div>
            <div>
              <p className="text-xs text-surface-400">Prize Pool</p>
              <p className="text-lg font-bold text-white">
                {formatCurrency(campaign.prizePool)}
              </p>
            </div>
          </Card>
          <Card className="flex items-center gap-4 p-4 animate-slide-up" style={{ animationDelay: "50ms" }}>
            <div className="rounded-xl bg-electric/10 p-2.5">
              <Users className="h-6 w-6 text-electric" />
            </div>
            <div>
              <p className="text-xs text-surface-400">Participants</p>
              <p className="text-lg font-bold text-white">
                {campaign.participants}
              </p>
            </div>
          </Card>
          <Card className="flex items-center gap-4 p-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
            <div className="rounded-xl bg-electric/10 p-2.5">
              <Eye className="h-6 w-6 text-electric" />
            </div>
            <div>
              <p className="text-xs text-surface-400">Total Views</p>
              <p className="text-lg font-bold text-white">
                {formatNumber(campaign.totalViews)}
              </p>
            </div>
          </Card>
          <Card className="flex items-center gap-4 p-4 animate-slide-up" style={{ animationDelay: "150ms" }}>
            <div className="rounded-xl bg-electric/10 p-2.5">
              <ThumbsUp className="h-6 w-6 text-electric" />
            </div>
            <div>
              <p className="text-xs text-surface-400">Avg Score</p>
              <p className="text-lg font-bold text-white">
                {formatNumber(campaign.avgScore)}
              </p>
            </div>
          </Card>
        </div>

        {/* Leaderboard */}
        <Card className="overflow-hidden">
          <h2 className="mb-4 text-lg font-semibold text-white">Leaderboard</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Likes</TableHead>
                  <TableHead>Comments</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_LEADERBOARD.map((row) => (
                  <TableRow key={row.rank}>
                    <TableCell className="font-medium text-electric">
                      #{row.rank}
                    </TableCell>
                    <TableCell className="font-medium text-white">
                      {row.creator}
                    </TableCell>
                    <TableCell>{formatNumber(row.score)}</TableCell>
                    <TableCell>{formatNumber(row.views)}</TableCell>
                    <TableCell>{formatNumber(row.likes)}</TableCell>
                    <TableCell>{formatNumber(row.comments)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
