"use client";

import {
  Megaphone,
  TrendingUp,
  BarChart3,
  DollarSign,
  Sparkles,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatNumber } from "@/lib/utils/scoring";

const mockUser = {
  id: "1",
  full_name: "Acme Brand",
  role: "brand" as const,
  avatar_url: null,
};

const mockStats = {
  totalCampaigns: 8,
  totalReach: 1245000,
  avgEngagementRate: 4.2,
  roi: 245,
};

const topCampaigns = [
  {
    id: "1",
    title: "Summer Vibes Challenge",
    platform: "TikTok",
    engagement: 5.8,
    reach: 245000,
    participants: 127,
  },
  {
    id: "2",
    title: "Dance Battle 2025",
    platform: "TikTok",
    engagement: 5.2,
    reach: 512000,
    participants: 203,
  },
  {
    id: "3",
    title: "Fitness Transformation",
    platform: "Instagram",
    engagement: 4.1,
    reach: 189000,
    participants: 89,
  },
];

export default function BrandAnalyticsPage() {
  return (
    <DashboardLayout user={mockUser} currentPath="/brand/analytics">
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Brand Analytics
          </h1>
          <p className="mt-1 text-surface-400">
            Track performance across all your campaigns.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="animate-slide-up" style={{ animationDelay: "0ms" }}>
            <StatCard
              icon={Megaphone}
              label="Total Campaigns"
              value={mockStats.totalCampaigns}
              change={{ value: 2, trend: "up" }}
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "50ms" }}>
            <StatCard
              icon={TrendingUp}
              label="Total Reach"
              value={formatNumber(mockStats.totalReach)}
              change={{ value: 22, trend: "up" }}
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
            <StatCard
              icon={BarChart3}
              label="Avg Engagement Rate"
              value={`${mockStats.avgEngagementRate}%`}
              change={{ value: 0.8, trend: "up" }}
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "150ms" }}>
            <StatCard
              icon={DollarSign}
              label="ROI"
              value={`${mockStats.roi}%`}
              change={{ value: 18, trend: "up" }}
            />
          </div>
        </div>

        {/* Top Campaigns */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">
            Top Campaigns by Engagement
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topCampaigns.map((campaign, i) => (
              <Card
                key={campaign.id}
                className="animate-slide-up"
                style={{ animationDelay: `${(i + 1) * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <Badge variant="electric">{campaign.platform}</Badge>
                  <span className="text-sm font-semibold text-green-400">
                    {campaign.engagement}% engagement
                  </span>
                </div>
                <h3 className="mt-3 font-semibold text-white">
                  {campaign.title}
                </h3>
                <div className="mt-4 space-y-2 text-sm text-surface-400">
                  <p>Reach: {formatNumber(campaign.reach)}</p>
                  <p>Participants: {campaign.participants}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Coming Soon */}
        <Card className="flex flex-col items-center justify-center py-16 animate-slide-up">
          <div className="rounded-2xl bg-surface-800/50 p-4">
            <Sparkles className="h-12 w-12 text-surface-500" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-white">
            Detailed analytics coming soon
          </h3>
          <p className="mt-2 max-w-md text-center text-sm text-surface-400">
            We&apos;re building advanced analytics including time-series charts,
            demographic breakdowns, and export options. Stay tuned!
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
