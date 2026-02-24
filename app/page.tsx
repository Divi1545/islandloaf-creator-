import Link from "next/link";
import {
  Trophy,
  BarChart3,
  Wallet,
  Zap,
  Target,
  Award,
  Users,
  Megaphone,
  DollarSign,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={null} />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-b from-surface-950 via-surface-950 to-surface-900"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,212,255,0.15),transparent)]"
          aria-hidden
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="gradient-text">
              Where Creators Compete & Brands Win
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-surface-300 max-w-2xl mx-auto">
            Join the premier marketplace where creators showcase their talent,
            compete for prizes, and get paid. Brands launch campaigns that drive
            real engagement.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <Button variant="primary" size="lg">
                Join as Creator
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="secondary" size="lg">
                Launch Campaign
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-surface-800/50 bg-surface-900/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <Users className="h-8 w-8 text-electric" aria-hidden />
              <span className="text-2xl sm:text-3xl font-bold text-white">
                500+
              </span>
              <span className="text-surface-400 text-sm font-medium">
                Creators
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Megaphone className="h-8 w-8 text-electric" aria-hidden />
              <span className="text-2xl sm:text-3xl font-bold text-white">
                100+
              </span>
              <span className="text-surface-400 text-sm font-medium">
                Campaigns
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <DollarSign className="h-8 w-8 text-electric" aria-hidden />
              <span className="text-2xl sm:text-3xl font-bold text-white">
                $50K+
              </span>
              <span className="text-surface-400 text-sm font-medium">
                Paid Out
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-12">
            Why IslandLoaf?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="flex flex-col items-center text-center p-8">
              <div className="rounded-2xl bg-electric/10 p-4 mb-4">
                <Trophy className="h-10 w-10 text-electric" aria-hidden />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Compete & Earn
              </h3>
              <p className="text-surface-400 text-sm">
                Enter campaigns, create content, and climb the leaderboard. Top
                performers win real prizes.
              </p>
            </Card>
            <Card glow className="flex flex-col items-center text-center p-8">
              <div className="rounded-2xl bg-electric/10 p-4 mb-4">
                <BarChart3 className="h-10 w-10 text-electric" aria-hidden />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Track Performance
              </h3>
              <p className="text-surface-400 text-sm">
                Real-time metrics and transparent scoring. See exactly where you
                stand.
              </p>
            </Card>
            <Card className="flex flex-col items-center text-center p-8">
              <div className="rounded-2xl bg-electric/10 p-4 mb-4">
                <Wallet className="h-10 w-10 text-electric" aria-hidden />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Get Paid
              </h3>
              <p className="text-surface-400 text-sm">
                Secure payouts when you win. No hassle, no delays—just your
                earnings.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface-900/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-electric/20 border-2 border-electric/40 w-16 h-16 flex items-center justify-center mb-4">
                <Zap className="h-8 w-8 text-electric" aria-hidden />
              </div>
              <span className="text-electric font-semibold text-sm mb-2">
                Step 1
              </span>
              <h3 className="text-xl font-semibold text-white mb-2">Join</h3>
              <p className="text-surface-400 text-sm max-w-xs">
                Sign up as a creator or brand. It&apos;s free and takes seconds.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-electric/20 border-2 border-electric/40 w-16 h-16 flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-electric" aria-hidden />
              </div>
              <span className="text-electric font-semibold text-sm mb-2">
                Step 2
              </span>
              <h3 className="text-xl font-semibold text-white mb-2">Create</h3>
              <p className="text-surface-400 text-sm max-w-xs">
                Creators submit content. Brands launch campaigns and set prizes.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-electric/20 border-2 border-electric/40 w-16 h-16 flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-electric" aria-hidden />
              </div>
              <span className="text-electric font-semibold text-sm mb-2">
                Step 3
              </span>
              <h3 className="text-xl font-semibold text-white mb-2">Win</h3>
              <p className="text-surface-400 text-sm max-w-xs">
                Leaderboards determine winners. Prizes paid out automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
