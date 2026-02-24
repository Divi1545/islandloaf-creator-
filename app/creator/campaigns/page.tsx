"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Calendar, DollarSign } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils/cn";

const mockUser = {
  id: "1",
  full_name: "Alex Creator",
  role: "creator" as const,
  avatar_url: null,
};

const browseCampaigns = [
  {
    id: "1",
    title: "Beach Campaign",
    platform: "TikTok",
    prizePool: "$5,000",
    deadline: "Mar 15, 2025",
    description: "Create beach-themed content showcasing summer vibes.",
  },
  {
    id: "2",
    title: "Fitness Challenge",
    platform: "Instagram",
    prizePool: "$3,500",
    deadline: "Mar 20, 2025",
    description: "Share your fitness journey and transformation.",
  },
  {
    id: "3",
    title: "Tech Unboxing",
    platform: "YouTube",
    prizePool: "$8,000",
    deadline: "Apr 1, 2025",
    description: "Unbox and review the latest tech gadgets.",
  },
  {
    id: "4",
    title: "Foodie Adventures",
    platform: "TikTok",
    prizePool: "$2,000",
    deadline: "Mar 25, 2025",
    description: "Showcase unique food experiences and recipes.",
  },
  {
    id: "5",
    title: "Travel Diaries",
    platform: "Instagram",
    prizePool: "$4,500",
    deadline: "Apr 5, 2025",
    description: "Document your travel adventures and hidden gems.",
  },
];

const myCampaigns = [
  {
    id: "1",
    title: "Beach Campaign",
    platform: "TikTok",
    status: "active",
    deadline: "Mar 15, 2025",
    submitted: true,
    prizePool: "$5,000",
  },
  {
    id: "2",
    title: "Summer Vibes",
    platform: "Instagram",
    status: "active",
    deadline: "Mar 28, 2025",
    submitted: true,
    prizePool: "$3,000",
  },
  {
    id: "3",
    title: "Ocean Views",
    platform: "YouTube",
    status: "ended",
    deadline: "Feb 10, 2025",
    submitted: true,
    prizePool: "$2,500",
  },
  {
    id: "4",
    title: "Fitness Challenge",
    platform: "Instagram",
    status: "active",
    deadline: "Mar 20, 2025",
    submitted: false,
    prizePool: "$3,500",
  },
];

export default function CreatorCampaignsPage() {
  const [activeTab, setActiveTab] = useState<"browse" | "my">("browse");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DashboardLayout user={mockUser} currentPath="/creator/campaigns">
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Campaigns
          </h1>
          <p className="mt-1 text-surface-400">
            Browse available campaigns or manage your joined campaigns.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 rounded-xl bg-surface-900/60 p-1 border border-surface-700/50">
          <button
            onClick={() => setActiveTab("browse")}
            className={cn(
              "flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all sm:flex-none",
              activeTab === "browse"
                ? "bg-electric/10 text-electric border border-electric/20"
                : "text-surface-400 hover:text-white"
            )}
          >
            Browse Campaigns
          </button>
          <button
            onClick={() => setActiveTab("my")}
            className={cn(
              "flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all sm:flex-none",
              activeTab === "my"
                ? "bg-electric/10 text-electric border border-electric/20"
                : "text-surface-400 hover:text-white"
            )}
          >
            My Campaigns
          </button>
        </div>

        {activeTab === "browse" ? (
          <>
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" />
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Browse grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {browseCampaigns.map((campaign, i) => (
                <Card
                  key={campaign.id}
                  className={cn(
                    "animate-slide-up flex flex-col",
                    "transition-transform hover:scale-[1.02]"
                  )}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <Badge variant="electric">{campaign.platform}</Badge>
                    <span className="text-sm font-semibold text-electric">
                      {campaign.prizePool}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-white">
                    {campaign.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-surface-400">
                    {campaign.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-surface-500">
                    <Calendar className="h-3.5 w-3.5" />
                    {campaign.deadline}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link href={`/campaigns/${campaign.id}`} className="flex-1">
                      <Button variant="primary" size="sm" className="w-full">
                        View
                      </Button>
                    </Link>
                    <Button variant="secondary" size="sm">
                      Join
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        ) : (
          /* My Campaigns list */
          <div className="space-y-4">
            {myCampaigns.map((campaign, i) => (
              <Card
                key={campaign.id}
                className={cn(
                  "animate-slide-up flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
                  "transition-transform hover:scale-[1.01]"
                )}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-white">
                      {campaign.title}
                    </h3>
                    <Badge variant="electric">{campaign.platform}</Badge>
                    <Badge
                      variant={
                        campaign.status === "active" ? "success" : "warning"
                      }
                    >
                      {campaign.status}
                    </Badge>
                    {campaign.submitted ? (
                      <Badge variant="electric">Submitted</Badge>
                    ) : (
                      <Badge variant="warning">Pending</Badge>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-surface-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Deadline: {campaign.deadline}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {campaign.prizePool}
                    </span>
                  </div>
                </div>
                <Link href={`/campaigns/${campaign.id}`}>
                  <Button variant="secondary" size="sm">
                    View
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
