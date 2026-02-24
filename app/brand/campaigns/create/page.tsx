"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";

const mockUser = {
  id: "1",
  full_name: "Acme Brand",
  role: "brand" as const,
  avatar_url: null,
};

const STEPS = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Prize Setup" },
  { id: 3, label: "Rules & Tags" },
  { id: 4, label: "Review" },
];

interface FormData {
  title: string;
  description: string;
  platform: string;
  campaignType: string;
  prizePool: string;
  entryFee: string;
  targetViews: string;
  hashtags: string;
  requiredTag: string;
  rules: string;
  maxParticipants: string;
  deadline: string;
}

const initialFormData: FormData = {
  title: "",
  description: "",
  platform: "",
  campaignType: "free",
  prizePool: "",
  entryFee: "",
  targetViews: "",
  hashtags: "",
  requiredTag: "@IslandLoaf",
  rules: "",
  maxParticipants: "",
  deadline: "",
};

export default function CreateCampaignPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // In production: await fetch('/api/campaigns', { method: 'POST', body: JSON.stringify(formData) })
      await new Promise((r) => setTimeout(r, 1000));
      setSuccess(true);
      setTimeout(() => router.push("/brand/campaigns"), 2000);
    } catch {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <DashboardLayout user={mockUser} currentPath="/brand/campaigns/create">
        <div className="flex min-h-[60vh] flex-col items-center justify-center animate-fade-in">
          <div className="rounded-full bg-green-500/20 p-4">
            <Check className="h-12 w-12 text-green-400" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-white">
            Campaign Created Successfully!
          </h2>
          <p className="mt-2 text-surface-400">
            Redirecting to your campaigns...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={mockUser} currentPath="/brand/campaigns/create">
      <div className="mx-auto max-w-2xl space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <Link
            href="/brand/campaigns"
            className="text-sm text-surface-400 hover:text-electric transition-colors"
          >
            ← Back to Campaigns
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Create New Campaign
          </h1>
          <p className="mt-1 text-surface-400">
            Set up your campaign in a few simple steps.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex gap-2">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={cn(
                "flex-1 h-2 rounded-full transition-all",
                step >= s.id ? "bg-electric/50" : "bg-surface-800"
              )}
            />
          ))}
        </div>
        <p className="text-sm text-surface-400">
          Step {step} of 4: {STEPS[step - 1].label}
        </p>

        {/* Form card */}
        <Card glow className="p-6 sm:p-8">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6 animate-slide-up">
              <Input
                label="Campaign Title"
                placeholder="e.g. Summer Vibes Challenge"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
              />
              <Textarea
                label="Description"
                placeholder="Describe your campaign and what creators need to do..."
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={4}
              />
              <Select
                label="Platform"
                value={formData.platform}
                onChange={(e) => updateField("platform", e.target.value)}
              >
                <option value="">Select platform</option>
                <option value="TikTok">TikTok</option>
                <option value="Instagram">Instagram</option>
                <option value="YouTube">YouTube</option>
              </Select>
            </div>
          )}

          {/* Step 2: Prize Setup */}
          {step === 2 && (
            <div className="space-y-6 animate-slide-up">
              <Select
                label="Campaign Type"
                value={formData.campaignType}
                onChange={(e) => updateField("campaignType", e.target.value)}
              >
                <option value="free">Free</option>
                <option value="entry">Entry</option>
                <option value="hybrid">Hybrid</option>
              </Select>
              <Input
                label="Prize Pool (USD)"
                type="number"
                placeholder="5000"
                value={formData.prizePool}
                onChange={(e) => updateField("prizePool", e.target.value)}
              />
              <Input
                label="Entry Fee (cents, 0 for free)"
                type="number"
                placeholder="0"
                value={formData.entryFee}
                onChange={(e) => updateField("entryFee", e.target.value)}
                disabled={formData.campaignType === "free"}
              />
              <Input
                label="Target Views"
                type="number"
                placeholder="10000"
                value={formData.targetViews}
                onChange={(e) => updateField("targetViews", e.target.value)}
              />
            </div>
          )}

          {/* Step 3: Rules & Tags */}
          {step === 3 && (
            <div className="space-y-6 animate-slide-up">
              <Input
                label="Hashtags (comma separated)"
                placeholder="#SummerVibes, #IslandLoaf, #CreatorChallenge"
                value={formData.hashtags}
                onChange={(e) => updateField("hashtags", e.target.value)}
              />
              <Input
                label="Required Tag"
                placeholder="@IslandLoaf"
                value={formData.requiredTag}
                onChange={(e) => updateField("requiredTag", e.target.value)}
              />
              <Textarea
                label="Rules"
                placeholder="1. Content must be original...&#10;&#10;2. Use all required hashtags..."
                value={formData.rules}
                onChange={(e) => updateField("rules", e.target.value)}
                rows={5}
              />
              <Input
                label="Max Participants"
                type="number"
                placeholder="100"
                value={formData.maxParticipants}
                onChange={(e) => updateField("maxParticipants", e.target.value)}
              />
              <Input
                label="Deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => updateField("deadline", e.target.value)}
              />
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-6 animate-slide-up">
              <div className="rounded-xl border border-surface-700/50 bg-surface-800/30 p-6 space-y-4">
                <h3 className="font-semibold text-white">Campaign Summary</h3>
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-surface-400">Title</span>
                    <span className="text-white">{formData.title || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-400">Platform</span>
                    <span className="text-white">{formData.platform || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-400">Type</span>
                    <Badge variant="electric">{formData.campaignType}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-400">Prize Pool</span>
                    <span className="text-electric">
                      ${formData.prizePool || "0"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-400">Entry Fee</span>
                    <span className="text-white">
                      {formData.campaignType === "free"
                        ? "Free"
                        : `${formData.entryFee}¢`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-400">Target Views</span>
                    <span className="text-white">
                      {formData.targetViews || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-400">Required Tag</span>
                    <span className="text-white">
                      {formData.requiredTag || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-400">Deadline</span>
                    <span className="text-white">
                      {formData.deadline || "—"}
                    </span>
                  </div>
                </div>
                {formData.description && (
                  <div className="pt-3 border-t border-surface-700/50">
                    <span className="text-surface-400 text-sm">Description</span>
                    <p className="mt-1 text-white text-sm">{formData.description}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            {step < 4 ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => setStep((s) => Math.min(4, s + 1))}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                loading={submitting}
                onClick={handleSubmit}
              >
                Create Campaign
              </Button>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
