"use client";

import { useRouter } from "next/navigation";
import { Film } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatNumber } from "@/lib/utils/scoring";
import { cn } from "@/lib/utils/cn";

const mockUser = {
  id: "1",
  full_name: "Alex Creator",
  role: "creator" as const,
  avatar_url: null,
};

type SubmissionStatus =
  | "pending_review"
  | "ai_processed"
  | "approved"
  | "rejected";

const mockSubmissions = [
  {
    id: "1",
    campaignName: "Beach Campaign",
    platform: "TikTok",
    videoUrl: "https://tiktok.com/@alex/video/123456789",
    status: "ai_processed" as SubmissionStatus,
    score: 2450,
    submittedAt: "Feb 12, 2025",
  },
  {
    id: "2",
    campaignName: "Summer Vibes",
    platform: "Instagram",
    videoUrl: "https://instagram.com/reel/abc123xyz",
    status: "approved" as SubmissionStatus,
    score: 3120,
    submittedAt: "Feb 10, 2025",
  },
  {
    id: "3",
    campaignName: "Ocean Views",
    platform: "YouTube",
    videoUrl: "https://youtube.com/watch?v=xyz789",
    status: "rejected" as SubmissionStatus,
    score: 890,
    submittedAt: "Feb 8, 2025",
  },
  {
    id: "4",
    campaignName: "Fitness Challenge",
    platform: "Instagram",
    videoUrl: "https://instagram.com/reel/fitness456",
    status: "pending_review" as SubmissionStatus,
    score: 0,
    submittedAt: "Feb 14, 2025",
  },
];

function getStatusBadgeVariant(
  status: SubmissionStatus
): "electric" | "success" | "warning" | "danger" {
  switch (status) {
    case "pending_review":
      return "warning";
    case "ai_processed":
      return "electric";
    case "approved":
      return "success";
    case "rejected":
      return "danger";
    default:
      return "electric";
  }
}

function formatStatus(status: SubmissionStatus): string {
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function truncateUrl(url: string, maxLength = 35): string {
  if (url.length <= maxLength) return url;
  return url.slice(0, maxLength - 3) + "...";
}

export default function CreatorSubmissionsPage() {
  const router = useRouter();
  const hasSubmissions = mockSubmissions.length > 0;

  return (
    <DashboardLayout user={mockUser} currentPath="/creator/submissions">
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            My Submissions
          </h1>
          <p className="mt-1 text-surface-400">
            Track your campaign submissions and their status.
          </p>
        </div>

        {hasSubmissions ? (
          <Card className="overflow-hidden animate-slide-up">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Video URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSubmissions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell>
                        <span className="font-medium text-white">
                          {sub.campaignName}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="electric">{sub.platform}</Badge>
                      </TableCell>
                      <TableCell>
                        <a
                          href={sub.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-electric hover:underline max-w-[200px] truncate block"
                        >
                          {truncateUrl(sub.videoUrl)}
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(sub.status)}>
                          {formatStatus(sub.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "font-medium",
                            sub.score > 0 ? "text-white" : "text-surface-500"
                          )}
                        >
                          {sub.score > 0 ? formatNumber(sub.score) : "—"}
                        </span>
                      </TableCell>
                      <TableCell className="text-surface-400">
                        {sub.submittedAt}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        ) : (
          <Card className="animate-slide-up">
            <EmptyState
              icon={Film}
              title="No submissions yet"
              description="Join a campaign and submit your first video to get started."
              action={{
                label: "Browse Campaigns",
                onClick: () => router.push("/creator/campaigns"),
              }}
            />
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
