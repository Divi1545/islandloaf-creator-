"use client";

import Link from "next/link";
import {
  Megaphone,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatNumber } from "@/lib/utils/scoring";
import { cn } from "@/lib/utils/cn";

const mockUser = {
  id: "1",
  full_name: "Acme Brand",
  role: "brand" as const,
  avatar_url: null,
};

const mockStats = {
  activeCampaigns: 3,
  totalReach: 245000,
  prizePoolDistributed: 1250000, // cents
  creatorsEngaged: 89,
};

const mockCampaigns = [
  {
    id: "1",
    title: "Summer Vibes Challenge",
    status: "active" as const,
    participants: 127,
    prizePool: 500000,
    deadline: "Mar 15, 2025",
  },
  {
    id: "2",
    title: "Fitness Transformation",
    status: "active" as const,
    participants: 89,
    prizePool: 1000000,
    deadline: "Mar 20, 2025",
  },
  {
    id: "3",
    title: "Tech Unboxing Showdown",
    status: "draft" as const,
    participants: 0,
    prizePool: 2500000,
    deadline: "Mar 25, 2025",
  },
];

const statusVariant = {
  active: "success" as const,
  draft: "warning" as const,
  completed: "electric" as const,
  cancelled: "danger" as const,
};

export default function BrandDashboardPage() {
  return (
    <DashboardLayout user={mockUser} currentPath="/brand">
      <div className="space-y-8 animate-fade-in">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Welcome back,{" "}
            <span className="gradient-text">{mockUser.full_name}</span>
          </h1>
          <p className="mt-1 text-surface-400">
            Here&apos;s an overview of your campaigns and performance.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="animate-slide-up" style={{ animationDelay: "0ms" }}>
            <StatCard
              icon={Megaphone}
              label="Active Campaigns"
              value={mockStats.activeCampaigns}
              change={{ value: 1, trend: "up" }}
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "50ms" }}>
            <StatCard
              icon={TrendingUp}
              label="Total Reach"
              value={formatNumber(mockStats.totalReach)}
              change={{ value: 18, trend: "up" }}
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
            <StatCard
              icon={DollarSign}
              label="Prize Pool Distributed"
              value={formatCurrency(mockStats.prizePoolDistributed)}
              change={{ value: 12, trend: "up" }}
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "150ms" }}>
            <StatCard
              icon={Users}
              label="Creators Engaged"
              value={mockStats.creatorsEngaged}
              change={{ value: 8, trend: "up" }}
            />
          </div>
        </div>

        {/* My Campaigns */}
        <div>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-white">My Campaigns</h2>
            <Link href="/brand/campaigns/create">
              <Button variant="primary" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Create Campaign
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockCampaigns.map((campaign, i) => (
              <Link
                key={campaign.id}
                href={`/brand/campaigns/${campaign.id}`}
                className={cn(
                  "block animate-slide-up",
                  "transition-transform hover:scale-[1.02]"
                )}
                style={{ animationDelay: `${(i + 1) * 50}ms` }}
              >
                <Card className="h-full">
                  <div className="flex items-start justify-between">
                    <Badge variant={statusVariant[campaign.status]}>
                      {campaign.status}
                    </Badge>
                    <span className="text-sm font-medium text-electric">
                      {formatCurrency(campaign.prizePool)}
                    </span>
                  </div>
                  <h3 className="mt-3 font-semibold text-white">
                    {campaign.title}
                  </h3>
                  <div className="mt-4 space-y-2 text-sm text-surface-400">
                    <p className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {campaign.participants} participants
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {campaign.deadline}
                    </p>
                  </div>
                  <span className="btn-secondary mt-4 flex w-full items-center justify-center gap-1 px-4 py-2 text-xs rounded-lg">
                    View Details
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Link href="/brand/campaigns/create">
            <Button variant="primary" size="md">
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </Link>
          <Link href="/brand/campaigns">
            <Button variant="secondary" size="md">
              View All Campaigns
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
