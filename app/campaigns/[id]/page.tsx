import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Trophy, Users, Target, DollarSign } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { formatCurrency, formatNumber } from "@/lib/utils/scoring";

const MOCK_CAMPAIGNS: Record<
  string,
  {
    id: string;
    title: string;
    description: string;
    platform: "tiktok" | "instagram" | "youtube";
    type: "free" | "entry" | "hybrid";
    status: "active" | "draft" | "paused" | "completed";
    prize_pool: number;
    entry_fee: number;
    target_views: number;
    participants: number;
    deadline: string;
    hashtags: string[];
    required_tag: string;
    rules: string;
  }
> = {
  "1": {
    id: "1",
    title: "Summer Vibes Challenge",
    description:
      "Show us your best summer content! Create engaging videos that capture the essence of summer—whether it's beach days, road trips, backyard BBQs, or sunset vibes. The most creative and engaging entries will win cash prizes.",
    platform: "tiktok",
    type: "free",
    status: "active",
    prize_pool: 500000,
    entry_fee: 0,
    target_views: 10000,
    participants: 127,
    deadline: "2025-03-15T23:59:59Z",
    hashtags: ["#SummerVibes", "#IslandLoaf", "#CreatorChallenge"],
    required_tag: "@IslandLoaf",
    rules: `1. Content must be original and created specifically for this campaign.\n2. Use all required hashtags in your post.\n3. Tag @IslandLoaf in your content.\n4. No inappropriate or offensive content.\n5. Videos must be between 15-60 seconds.\n6. One entry per creator.`,
  },
  "2": {
    id: "2",
    title: "Fitness Transformation",
    description:
      "Share your fitness journey! Before and after, workout routines, meal prep—inspire others with your transformation story.",
    platform: "instagram",
    type: "entry",
    status: "active",
    prize_pool: 1000000,
    entry_fee: 500,
    target_views: 25000,
    participants: 89,
    deadline: "2025-03-20T23:59:59Z",
    hashtags: ["#FitnessTransformation", "#IslandLoaf", "#GetFit"],
    required_tag: "@IslandLoaf",
    rules: `1. Original fitness content only.\n2. Must show genuine transformation or progress.\n3. Use all required hashtags.\n4. One entry per creator.`,
  },
  "3": {
    id: "3",
    title: "Tech Unboxing Showdown",
    description:
      "Unbox the latest tech and show us your reaction! Gadgets, phones, laptops—create the most engaging unboxing content.",
    platform: "youtube",
    type: "hybrid",
    status: "active",
    prize_pool: 2500000,
    entry_fee: 1000,
    target_views: 50000,
    participants: 45,
    deadline: "2025-03-25T23:59:59Z",
    hashtags: ["#TechUnboxing", "#IslandLoaf", "#Gadgets"],
    required_tag: "@IslandLoaf",
    rules: `1. Unboxing content only.\n2. Video length 5-15 minutes.\n3. Use all required hashtags in description.\n4. One entry per creator.`,
  },
  "4": {
    id: "4",
    title: "Dance Battle 2025",
    description:
      "Show off your best moves! Any dance style welcome. The most viewed and engaged content wins.",
    platform: "tiktok",
    type: "free",
    status: "active",
    prize_pool: 750000,
    entry_fee: 0,
    target_views: 15000,
    participants: 203,
    deadline: "2025-03-18T23:59:59Z",
    hashtags: ["#DanceBattle", "#IslandLoaf", "#DanceChallenge"],
    required_tag: "@IslandLoaf",
    rules: `1. Dance content only.\n2. Use all required hashtags.\n3. 15-60 seconds.\n4. One entry per creator.`,
  },
  "5": {
    id: "5",
    title: "Foodie Adventures",
    description:
      "Share your best food content! Recipes, restaurant reviews, cooking hacks—make us hungry.",
    platform: "instagram",
    type: "free",
    status: "active",
    prize_pool: 300000,
    entry_fee: 0,
    target_views: 8000,
    participants: 156,
    deadline: "2025-03-22T23:59:59Z",
    hashtags: ["#FoodieAdventures", "#IslandLoaf", "#FoodContent"],
    required_tag: "@IslandLoaf",
    rules: `1. Food-related content only.\n2. Use all required hashtags.\n3. Reels or Stories format.\n4. One entry per creator.`,
  },
  "6": {
    id: "6",
    title: "Gaming Highlights",
    description:
      "Your best gaming moments! Clips, montages, funny moments—show us what you've got.",
    platform: "youtube",
    type: "entry",
    status: "active",
    prize_pool: 1500000,
    entry_fee: 2000,
    target_views: 30000,
    participants: 67,
    deadline: "2025-03-30T23:59:59Z",
    hashtags: ["#GamingHighlights", "#IslandLoaf", "#Gaming"],
    required_tag: "@IslandLoaf",
    rules: `1. Gaming content only.\n2. Video length 3-20 minutes.\n3. Use all required hashtags.\n4. One entry per creator.`,
  },
};

const MOCK_LEADERBOARD = [
  { rank: 1, creator: "CreatorPro", score: 12500, views: 15000 },
  { rank: 2, creator: "SummerQueen", score: 11200, views: 13500 },
  { rank: 3, creator: "VibeMaster", score: 9800, views: 11800 },
  { rank: 4, creator: "BeachDays", score: 8700, views: 10200 },
  { rank: 5, creator: "SunsetChaser", score: 7600, views: 9100 },
];

function formatDeadline(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  return `${days} days left`;
}

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const campaign = MOCK_CAMPAIGNS[id];
  if (!campaign) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={null} />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Campaign Hero */}
          <div className="mb-10">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="electric">
                {campaign.platform.charAt(0).toUpperCase() +
                  campaign.platform.slice(1)}
              </Badge>
              <Badge variant="success">
                {campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)}
              </Badge>
              <Badge
                variant={
                  campaign.status === "active"
                    ? "success"
                    : campaign.status === "completed"
                      ? "warning"
                      : "electric"
                }
              >
                {campaign.status.charAt(0).toUpperCase() +
                  campaign.status.slice(1)}
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {campaign.title}
            </h1>
            <p className="text-surface-300 text-lg leading-relaxed">
              {campaign.description}
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
            <Card className="flex items-center gap-4 p-4">
              <div className="rounded-xl bg-electric/10 p-2.5">
                <Trophy className="h-6 w-6 text-electric" aria-hidden />
              </div>
              <div>
                <p className="text-xs text-surface-400">Prize Pool</p>
                <p className="text-lg font-bold text-white">
                  {formatCurrency(campaign.prize_pool)}
                </p>
              </div>
            </Card>
            <Card className="flex items-center gap-4 p-4">
              <div className="rounded-xl bg-electric/10 p-2.5">
                <DollarSign className="h-6 w-6 text-electric" aria-hidden />
              </div>
              <div>
                <p className="text-xs text-surface-400">Entry Fee</p>
                <p className="text-lg font-bold text-white">
                  {campaign.entry_fee === 0
                    ? "Free"
                    : formatCurrency(campaign.entry_fee)}
                </p>
              </div>
            </Card>
            <Card className="flex items-center gap-4 p-4">
              <div className="rounded-xl bg-electric/10 p-2.5">
                <Target className="h-6 w-6 text-electric" aria-hidden />
              </div>
              <div>
                <p className="text-xs text-surface-400">Target Views</p>
                <p className="text-lg font-bold text-white">
                  {formatNumber(campaign.target_views)}
                </p>
              </div>
            </Card>
            <Card className="flex items-center gap-4 p-4">
              <div className="rounded-xl bg-electric/10 p-2.5">
                <Users className="h-6 w-6 text-electric" aria-hidden />
              </div>
              <div>
                <p className="text-xs text-surface-400">Participants</p>
                <p className="text-lg font-bold text-white">
                  {campaign.participants}
                </p>
              </div>
            </Card>
            <Card className="flex items-center gap-4 p-4">
              <div className="rounded-xl bg-electric/10 p-2.5">
                <Calendar className="h-6 w-6 text-electric" aria-hidden />
              </div>
              <div>
                <p className="text-xs text-surface-400">Deadline</p>
                <p className="text-lg font-bold text-white">
                  {formatDeadline(campaign.deadline)}
                </p>
              </div>
            </Card>
          </div>

          {/* CTA */}
          <div className="mb-10">
            <Link href="/auth/login">
              <Button variant="primary" size="lg">
                Join Campaign
              </Button>
            </Link>
          </div>

          {/* Rules */}
          <Card className="mb-10 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Rules</h2>
            <pre className="text-surface-300 text-sm whitespace-pre-wrap font-sans">
              {campaign.rules}
            </pre>
          </Card>

          {/* Hashtags */}
          <Card className="mb-10 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Required Hashtags
            </h2>
            <div className="flex flex-wrap gap-2">
              {campaign.hashtags.map((tag) => (
                <Badge key={tag} variant="electric">
                  {tag}
                </Badge>
              ))}
              <Badge variant="warning">{campaign.required_tag}</Badge>
            </div>
          </Card>

          {/* Leaderboard Preview */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Leaderboard Preview
            </h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Views</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_LEADERBOARD.map((row) => (
                  <TableRow key={row.rank}>
                    <TableCell className="font-medium text-electric">
                      #{row.rank}
                    </TableCell>
                    <TableCell>{row.creator}</TableCell>
                    <TableCell>{formatNumber(row.score)}</TableCell>
                    <TableCell>{formatNumber(row.views)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
