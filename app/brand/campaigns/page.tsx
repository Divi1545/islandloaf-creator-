"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Eye, Pencil } from "lucide-react";
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
import { formatCurrency } from "@/lib/utils/scoring";
import { cn } from "@/lib/utils/cn";

const mockUser = {
  id: "1",
  full_name: "Acme Brand",
  role: "brand" as const,
  avatar_url: null,
};

type CampaignStatus = "draft" | "active" | "completed" | "cancelled";

const mockCampaigns = [
  {
    id: "1",
    title: "Summer Vibes Challenge",
    platform: "TikTok",
    type: "Free",
    status: "active" as CampaignStatus,
    prizePool: 500000,
    participants: 127,
    deadline: "Mar 15, 2025",
  },
  {
    id: "2",
    title: "Fitness Transformation",
    platform: "Instagram",
    type: "Entry",
    status: "active" as CampaignStatus,
    prizePool: 1000000,
    participants: 89,
    deadline: "Mar 20, 2025",
  },
  {
    id: "3",
    title: "Tech Unboxing Showdown",
    platform: "YouTube",
    type: "Hybrid",
    status: "draft" as CampaignStatus,
    prizePool: 2500000,
    participants: 0,
    deadline: "Mar 25, 2025",
  },
  {
    id: "4",
    title: "Dance Battle 2025",
    platform: "TikTok",
    type: "Free",
    status: "completed" as CampaignStatus,
    prizePool: 750000,
    participants: 203,
    deadline: "Mar 18, 2025",
  },
  {
    id: "5",
    title: "Foodie Adventures",
    platform: "Instagram",
    type: "Free",
    status: "cancelled" as CampaignStatus,
    prizePool: 300000,
    participants: 45,
    deadline: "Mar 22, 2025",
  },
];

const statusFilters: { value: CampaignStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const statusVariant: Record<CampaignStatus, "electric" | "success" | "warning" | "danger"> = {
  draft: "warning",
  active: "success",
  completed: "electric",
  cancelled: "danger",
};

export default function BrandCampaignsPage() {
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "all">("all");

  const filteredCampaigns =
    statusFilter === "all"
      ? mockCampaigns
      : mockCampaigns.filter((c) => c.status === statusFilter);

  return (
    <DashboardLayout user={mockUser} currentPath="/brand/campaigns">
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              My Campaigns
            </h1>
            <p className="mt-1 text-surface-400">
              Manage and track all your campaigns in one place.
            </p>
          </div>
          <Link href="/brand/campaigns/create">
            <Button variant="primary" size="md">
              <Plus className="mr-2 h-4 w-4" />
              Create New Campaign
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 rounded-xl bg-surface-900/60 p-1 border border-surface-700/50">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={cn(
                "rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
                statusFilter === filter.value
                  ? "bg-electric/10 text-electric border border-electric/20"
                  : "text-surface-400 hover:text-white hover:bg-surface-800/50"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prize Pool</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign, i) => (
                  <TableRow
                    key={campaign.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <TableCell className="font-medium text-white">
                      {campaign.title}
                    </TableCell>
                    <TableCell>{campaign.platform}</TableCell>
                    <TableCell>{campaign.type}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[campaign.status]}>
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(campaign.prizePool)}
                    </TableCell>
                    <TableCell>{campaign.participants}</TableCell>
                    <TableCell>{campaign.deadline}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/brand/campaigns/${campaign.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredCampaigns.length === 0 && (
            <div className="py-12 text-center text-surface-400">
              No campaigns found for this filter.
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
