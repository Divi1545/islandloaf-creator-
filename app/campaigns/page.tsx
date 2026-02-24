"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { formatCurrency } from "@/lib/utils/scoring";

const MOCK_CAMPAIGNS = [
  {
    id: "1",
    title: "Summer Vibes Challenge",
    platform: "tiktok" as const,
    type: "free" as const,
    prize_pool: 500000, // cents
    entry_fee: 0,
    deadline: "2025-03-15T23:59:59Z",
    participant_count: 127,
  },
  {
    id: "2",
    title: "Fitness Transformation",
    platform: "instagram" as const,
    type: "entry" as const,
    prize_pool: 1000000,
    entry_fee: 500,
    deadline: "2025-03-20T23:59:59Z",
    participant_count: 89,
  },
  {
    id: "3",
    title: "Tech Unboxing Showdown",
    platform: "youtube" as const,
    type: "hybrid" as const,
    prize_pool: 2500000,
    entry_fee: 1000,
    deadline: "2025-03-25T23:59:59Z",
    participant_count: 45,
  },
  {
    id: "4",
    title: "Dance Battle 2025",
    platform: "tiktok" as const,
    type: "free" as const,
    prize_pool: 750000,
    entry_fee: 0,
    deadline: "2025-03-18T23:59:59Z",
    participant_count: 203,
  },
  {
    id: "5",
    title: "Foodie Adventures",
    platform: "instagram" as const,
    type: "free" as const,
    prize_pool: 300000,
    entry_fee: 0,
    deadline: "2025-03-22T23:59:59Z",
    participant_count: 156,
  },
  {
    id: "6",
    title: "Gaming Highlights",
    platform: "youtube" as const,
    type: "entry" as const,
    prize_pool: 1500000,
    entry_fee: 2000,
    deadline: "2025-03-30T23:59:59Z",
    participant_count: 67,
  },
];

const PLATFORMS = ["All", "TikTok", "Instagram", "YouTube"] as const;
const TYPES = ["All", "Free", "Entry", "Hybrid"] as const;

function formatDeadline(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function CampaignsPage() {
  const [platform, setPlatform] = useState<string>("All");
  const [type, setType] = useState<string>("All");

  const filtered = MOCK_CAMPAIGNS.filter((c) => {
    if (platform !== "All" && c.platform !== platform.toLowerCase())
      return false;
    if (type !== "All" && c.type !== type.toLowerCase()) return false;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={null} />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">
            Explore Campaigns
          </h1>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="w-full sm:w-48">
              <Select
                label="Platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Select>
            </div>
            <div className="w-full sm:w-48">
              <Select
                label="Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Campaign Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((campaign) => (
              <Link key={campaign.id} href={`/campaigns/${campaign.id}`}>
                <Card
                  className="h-full hover:border-electric/30 transition-all duration-200 cursor-pointer group"
                  glow={false}
                >
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="electric">
                      {campaign.platform.charAt(0).toUpperCase() +
                        campaign.platform.slice(1)}
                    </Badge>
                    <Badge variant="success">
                      {campaign.type.charAt(0).toUpperCase() +
                        campaign.type.slice(1)}
                    </Badge>
                  </div>
                  <h2 className="text-lg font-semibold text-white mb-3 group-hover:text-electric transition-colors">
                    {campaign.title}
                  </h2>
                  <div className="space-y-2 text-sm">
                    <p className="text-surface-300">
                      <span className="text-electric font-medium">Prize:</span>{" "}
                      {formatCurrency(campaign.prize_pool)}
                    </p>
                    {campaign.entry_fee > 0 && (
                      <p className="text-surface-300">
                        <span className="text-surface-400">Entry:</span>{" "}
                        {formatCurrency(campaign.entry_fee)}
                      </p>
                    )}
                    <p className="text-surface-400">
                      Deadline: {formatDeadline(campaign.deadline)}
                    </p>
                    <p className="text-surface-400">
                      {campaign.participant_count} participants
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-surface-400">
              No campaigns match your filters.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
