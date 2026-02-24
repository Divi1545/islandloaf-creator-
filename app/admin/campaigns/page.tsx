"use client";

import { Play, Pause, XCircle } from "lucide-react";
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

const mockUser = {
  id: "1",
  full_name: "Admin User",
  role: "admin" as const,
  avatar_url: null,
};

type CampaignStatus = "active" | "paused" | "draft" | "completed" | "cancelled";

const mockCampaigns = [
  {
    id: "1",
    title: "Summer Vibes Challenge",
    brand: "Acme Brand",
    platform: "TikTok",
    type: "Video",
    status: "active" as CampaignStatus,
    prizePool: 500000,
    participants: 127,
    deadline: "Mar 15, 2025",
  },
  {
    id: "2",
    title: "Fitness Transformation",
    brand: "FitLife Co",
    platform: "YouTube",
    type: "Video",
    status: "active" as CampaignStatus,
    prizePool: 1000000,
    participants: 89,
    deadline: "Mar 20, 2025",
  },
  {
    id: "3",
    title: "Tech Unboxing Showdown",
    brand: "TechGear",
    platform: "Instagram",
    type: "Reel",
    status: "paused" as CampaignStatus,
    prizePool: 2500000,
    participants: 45,
    deadline: "Mar 25, 2025",
  },
  {
    id: "4",
    title: "Recipe Remix Contest",
    brand: "KitchenPro",
    platform: "TikTok",
    type: "Video",
    status: "draft" as CampaignStatus,
    prizePool: 150000,
    participants: 0,
    deadline: "Apr 1, 2025",
  },
  {
    id: "5",
    title: "Gaming Highlights",
    brand: "GameZone",
    platform: "YouTube",
    type: "Short",
    status: "completed" as CampaignStatus,
    prizePool: 750000,
    participants: 203,
    deadline: "Feb 1, 2025",
  },
  {
    id: "6",
    title: "Fashion Forward",
    brand: "StyleHub",
    platform: "Instagram",
    type: "Reel",
    status: "cancelled" as CampaignStatus,
    prizePool: 300000,
    participants: 12,
    deadline: "Mar 10, 2025",
  },
];

const statusVariant: Record<
  CampaignStatus,
  "electric" | "success" | "warning" | "danger"
> = {
  active: "success",
  paused: "warning",
  draft: "warning",
  completed: "electric",
  cancelled: "danger",
};

export default function AdminCampaignsPage() {
  const handleActivate = (id: string, title: string) => {
    console.log("POST /api/admin/campaigns/activate", id);
    alert(`Activated: ${title}`);
  };

  const handlePause = (id: string, title: string) => {
    console.log("POST /api/admin/campaigns/pause", id);
    alert(`Paused: ${title}`);
  };

  const handleCancel = (id: string, title: string) => {
    if (confirm(`Cancel campaign "${title}"?`)) {
      console.log("POST /api/admin/campaigns/cancel", id);
      alert(`Cancelled: ${title}`);
    }
  };

  return (
    <DashboardLayout user={mockUser} currentPath="/admin/campaigns">
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Campaign <span className="gradient-text">Control</span>
          </h1>
          <p className="mt-1 text-surface-400">
            Manage all platform campaigns.
          </p>
        </div>

        <Card className="overflow-hidden animate-slide-up">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Brand</TableHead>
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
              {mockCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium text-white">
                    {campaign.title}
                  </TableCell>
                  <TableCell className="text-surface-400">
                    {campaign.brand}
                  </TableCell>
                  <TableCell>{campaign.platform}</TableCell>
                  <TableCell>{campaign.type}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[campaign.status]}>
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-electric font-medium">
                    {formatCurrency(campaign.prizePool)}
                  </TableCell>
                  <TableCell>
                    {formatNumber(campaign.participants)}
                  </TableCell>
                  <TableCell className="text-surface-400">
                    {campaign.deadline}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {campaign.status === "paused" && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            handleActivate(campaign.id, campaign.title)
                          }
                        >
                          <Play className="mr-1 h-3.5 w-3.5" />
                          Activate
                        </Button>
                      )}
                      {campaign.status === "active" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            handlePause(campaign.id, campaign.title)
                          }
                        >
                          <Pause className="mr-1 h-3.5 w-3.5" />
                          Pause
                        </Button>
                      )}
                      {(campaign.status === "active" ||
                        campaign.status === "paused" ||
                        campaign.status === "draft") && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() =>
                            handleCancel(campaign.id, campaign.title)
                          }
                        >
                          <XCircle className="mr-1 h-3.5 w-3.5" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
}
