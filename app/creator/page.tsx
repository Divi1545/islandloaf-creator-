"use client";

import Link from "next/link";
import {
  DollarSign,
  Trophy,
  Film,
  TrendingUp,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils/scoring";
import { cn } from "@/lib/utils/cn";

const mockUser = {
  id: "1",
  full_name: "Alex Creator",
  role: "creator" as const,
  avatar_url: null,
};

const recentActivity = [
  { id: "1", text: "Joined Beach Campaign", time: "2 hours ago" },
  { id: "2", text: "Submitted video for Summer Vibes", time: "1 day ago" },
  { id: "3", text: "Won 1st place in Ocean Views Campaign", time: "3 days ago" },
];

const activeCampaigns = [
  {
    id: "1",
    title: "Beach Campaign",
    platform: "TikTok",
    progress: 75,
    deadline: "Mar 15, 2025",
    prizePool: "$5,000",
  },
  {
    id: "2",
    title: "Summer Vibes",
    platform: "Instagram",
    progress: 40,
    deadline: "Mar 28, 2025",
    prizePool: "$3,000",
  },
  {
    id: "3",
    title: "Ocean Views",
    platform: "YouTube",
    progress: 100,
    deadline: "Feb 10, 2025",
    prizePool: "$2,500",
  },
];

export default function CreatorDashboardPage() {
  return (
    <DashboardLayout
      user={mockUser}
      currentPath="/creator"
    >
      <div className="space-y-8 animate-fade-in">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Welcome back,{" "}
            <span className="gradient-text">{mockUser.full_name}</span>
          </h1>
          <p className="mt-1 text-surface-400">
            Here&apos;s what&apos;s happening with your campaigns today.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="animate-slide-up" style={{ animationDelay: "0ms" }}>
            <StatCard
              icon={DollarSign}
              label="Total Earnings"
              value={formatCurrency(12500)}
              change={{ value: 12, trend: "up" }}
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "50ms" }}>
            <StatCard
              icon={Trophy}
              label="Active Campaigns"
              value="3"
              change={{ value: 1, trend: "up" }}
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
            <StatCard
              icon={Film}
              label="Submissions"
              value="12"
              change={{ value: 3, trend: "up" }}
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "150ms" }}>
            <StatCard
              icon={TrendingUp}
              label="Win Rate"
              value="42%"
              change={{ value: 5, trend: "up" }}
            />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <Card className="h-full animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                  Recent Activity
                </h2>
                <Sparkles className="h-5 w-5 text-electric" />
              </div>
              <ul className="space-y-4">
                {recentActivity.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-surface-800/50"
                  >
                    <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-electric" />
                    <div>
                      <p className="text-sm font-medium text-gray-200">
                        {item.text}
                      </p>
                      <p className="text-xs text-surface-500">{item.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Active Campaigns */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Active Campaigns
              </h2>
              <Link href="/creator/campaigns">
                <Button variant="ghost" size="sm">
                  View all
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {activeCampaigns.map((campaign, i) => (
                <Link
                  key={campaign.id}
                  href={`/campaigns/${campaign.id}`}
                  className={cn(
                    "block animate-slide-up",
                    "transition-transform hover:scale-[1.02]"
                  )}
                  style={{ animationDelay: `${(i + 1) * 50}ms` }}
                >
                  <Card className="h-full">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-white">
                          {campaign.title}
                        </h3>
                        <Badge variant="electric" className="mt-2">
                          {campaign.platform}
                        </Badge>
                      </div>
                      <span className="text-sm font-medium text-electric">
                        {campaign.prizePool}
                      </span>
                    </div>
                    <div className="mt-4">
                      <div className="mb-2 flex justify-between text-xs text-surface-400">
                        <span>Progress</span>
                        <span>{campaign.progress}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-surface-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-electric to-brand-500 transition-all"
                          style={{ width: `${campaign.progress}%` }}
                        />
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-surface-500">
                      Deadline: {campaign.deadline}
                    </p>
                    <span className="btn-secondary mt-4 flex w-full items-center justify-center px-4 py-2 text-xs rounded-lg">
                      View Details
                    </span>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
