"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ClipboardCheck,
  Check,
  X,
  Pencil,
  ExternalLink,
  BarChart3,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatNumber, calculateScore } from "@/lib/utils/scoring";

const mockUser = {
  id: "1",
  full_name: "Admin User",
  role: "admin" as const,
  avatar_url: null,
};

type Submission = {
  id: string;
  creatorName: string;
  campaignName: string;
  platform: string;
  videoUrl: string;
  views: number;
  likes: number;
  comments: number;
  confidenceScore: number;
};

const mockSubmissions: Submission[] = [
  {
    id: "1",
    creatorName: "Alice Johnson",
    campaignName: "Summer Vibes Challenge",
    platform: "TikTok",
    videoUrl: "https://tiktok.com/@alice/video/123",
    views: 125000,
    likes: 8500,
    comments: 420,
    confidenceScore: 0.95,
  },
  {
    id: "2",
    creatorName: "Bob Smith",
    campaignName: "Fitness Transformation",
    platform: "YouTube",
    videoUrl: "https://youtube.com/watch?v=abc123",
    views: 45000,
    likes: 3200,
    comments: 180,
    confidenceScore: 0.72,
  },
  {
    id: "3",
    creatorName: "Carol Williams",
    campaignName: "Tech Unboxing Showdown",
    platform: "Instagram",
    videoUrl: "https://instagram.com/reel/xyz789",
    views: 89000,
    likes: 6200,
    comments: 310,
    confidenceScore: 0.88,
  },
  {
    id: "4",
    creatorName: "David Brown",
    campaignName: "Summer Vibes Challenge",
    platform: "TikTok",
    videoUrl: "https://tiktok.com/@david/video/456",
    views: 210000,
    likes: 15200,
    comments: 890,
    confidenceScore: 0.61,
  },
];

function getConfidenceBadge(score: number) {
  if (score >= 0.9) return { variant: "success" as const, label: "High" };
  if (score >= 0.7) return { variant: "electric" as const, label: "Medium" };
  return { variant: "warning" as const, label: "Low" };
}

export default function AdminMetricsPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState(mockSubmissions);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingSubmission, setEditingSubmission] = useState<Submission | null>(
    null
  );
  const [editViews, setEditViews] = useState("");
  const [editLikes, setEditLikes] = useState("");
  const [editComments, setEditComments] = useState("");

  const openEditModal = (sub: Submission) => {
    setEditingSubmission(sub);
    setEditViews(sub.views.toString());
    setEditLikes(sub.likes.toString());
    setEditComments(sub.comments.toString());
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingSubmission(null);
  };

  const handleApproveEdit = () => {
    if (!editingSubmission) return;
    const views = parseInt(editViews, 10) || 0;
    const likes = parseInt(editLikes, 10) || 0;
    const comments = parseInt(editComments, 10) || 0;
    console.log("POST /api/admin/metrics/approve", {
      id: editingSubmission.id,
      views,
      likes,
      comments,
    });
    alert(`Approved with edited metrics: ${views} views, ${likes} likes, ${comments} comments`);
    setSubmissions((prev) =>
      prev.filter((s) => s.id !== editingSubmission.id)
    );
    closeEditModal();
  };

  const handleApprove = (id: string) => {
    console.log("POST /api/admin/metrics/approve", id);
    alert("Metrics approved");
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleReject = (id: string) => {
    if (confirm("Reject this metrics submission?")) {
      console.log("POST /api/admin/metrics/reject", id);
      alert("Metrics rejected");
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleProcessAll = () => {
    if (submissions.length === 0) {
      alert("No pending submissions to process");
      return;
    }
    if (confirm(`Process all ${submissions.length} pending submissions?`)) {
      console.log("POST /api/admin/metrics/process-all");
      alert(`Processed ${submissions.length} submissions`);
      setSubmissions([]);
    }
  };

  const queueEmpty = submissions.length === 0;

  return (
    <DashboardLayout user={mockUser} currentPath="/admin/metrics">
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Metrics <span className="gradient-text">Moderation Queue</span>
            </h1>
            <p className="mt-1 text-surface-400">
              Review AI-extracted metrics before approval.
            </p>
          </div>
          {!queueEmpty && (
            <Button
              variant="primary"
              size="md"
              onClick={handleProcessAll}
              className="animate-slide-up"
            >
              <ClipboardCheck className="mr-2 h-4 w-4" />
              Process All Pending
            </Button>
          )}
        </div>

        {queueEmpty ? (
          <Card className="animate-slide-up">
            <EmptyState
              icon={BarChart3}
              title="Queue is empty"
              description="No metrics submissions pending review. New submissions will appear here."
              action={{
                label: "Back to Dashboard",
                onClick: () => router.push("/admin"),
              }}
            />
          </Card>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub, i) => {
              const score = calculateScore(sub.views, sub.likes, sub.comments);
              const confidence = getConfidenceBadge(sub.confidenceScore);
              return (
                <Card
                  key={sub.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-white">
                          {sub.creatorName}
                        </h3>
                        <span className="text-surface-400">•</span>
                        <span className="text-surface-400">
                          {sub.campaignName}
                        </span>
                        <Badge variant="electric">{sub.platform}</Badge>
                        <Badge variant={confidence.variant}>
                          Confidence: {confidence.label} (
                          {(sub.confidenceScore * 100).toFixed(0)}%)
                        </Badge>
                      </div>
                      <a
                        href={sub.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-electric hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Video
                      </a>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span>
                          <span className="text-surface-400">Views:</span>{" "}
                          {formatNumber(sub.views)}
                        </span>
                        <span>
                          <span className="text-surface-400">Likes:</span>{" "}
                          {formatNumber(sub.likes)}
                        </span>
                        <span>
                          <span className="text-surface-400">Comments:</span>{" "}
                          {formatNumber(sub.comments)}
                        </span>
                        <span className="font-medium text-electric">
                          Score: {formatNumber(Math.round(score))}
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApprove(sub.id)}
                      >
                        <Check className="mr-1 h-3.5 w-3.5" />
                        Approve
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openEditModal(sub)}
                      >
                        <Pencil className="mr-1 h-3.5 w-3.5" />
                        Edit & Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleReject(sub.id)}
                      >
                        <X className="mr-1 h-3.5 w-3.5" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <Modal
          isOpen={editModalOpen}
          onClose={closeEditModal}
          title="Edit Metrics & Approve"
        >
          {editingSubmission && (
            <div className="space-y-4">
              <p className="text-sm text-surface-400">
                Adjust the AI-extracted metrics if needed, then approve.
              </p>
              <Input
                label="Views"
                type="number"
                value={editViews}
                onChange={(e) => setEditViews(e.target.value)}
              />
              <Input
                label="Likes"
                type="number"
                value={editLikes}
                onChange={(e) => setEditLikes(e.target.value)}
              />
              <Input
                label="Comments"
                type="number"
                value={editComments}
                onChange={(e) => setEditComments(e.target.value)}
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={closeEditModal}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleApproveEdit}>
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
