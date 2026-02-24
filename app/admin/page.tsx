"use client";

import Link from "next/link";
import {
  Users,
  Megaphone,
  ClipboardCheck,
  CreditCard,
  ChevronRight,
  UserPlus,
  BarChart3,
  DollarSign,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";

const mockUser = {
  id: "1",
  full_name: "Admin User",
  role: "admin" as const,
  avatar_url: null,
};

const mockStats = {
  totalUsers: 1247,
  activeCampaigns: 12,
  pendingApprovals: 8,
  pendingPayouts: 5,
};

const recentActivity = [
  { id: "1", text: "New user registered", time: "2 min ago" },
  { id: "2", text: "Campaign created", time: "15 min ago" },
  { id: "3", text: "Payout requested", time: "1 hour ago" },
  { id: "4", text: "Metrics submission approved", time: "2 hours ago" },
  { id: "5", text: "User approved", time: "3 hours ago" },
];

const quickActions = [
  {
    title: "Approve Users",
    description: "Review and approve pending user registrations",
    href: "/admin/users",
    icon: UserPlus,
  },
  {
    title: "Process Metrics",
    description: "Moderate AI-extracted metrics submissions",
    href: "/admin/metrics",
    icon: BarChart3,
  },
  {
    title: "Handle Payouts",
    description: "Process pending payout requests",
    href: "/admin/payouts",
    icon: DollarSign,
  },
];

export default function AdminDashboardPage() {
  return (
    <DashboardLayout user={mockUser} currentPath="/admin">
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="mt-1 text-surface-400">
            Overview of platform activity and quick actions.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="animate-slide-up" style={{ animationDelay: "0ms" }}>
            <StatCard
              icon={Users}
              label="Total Users"
              value={mockStats.totalUsers}
              change={{ value: 12, trend: "up" }}
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "50ms" }}>
            <StatCard
              icon={Megaphone}
              label="Active Campaigns"
              value={mockStats.activeCampaigns}
              change={{ value: 2, trend: "up" }}
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
            <StatCard
              icon={ClipboardCheck}
              label="Pending Approvals"
              value={mockStats.pendingApprovals}
              change={{ value: 3, trend: "down" }}
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "150ms" }}>
            <StatCard
              icon={CreditCard}
              label="Pending Payouts"
              value={mockStats.pendingPayouts}
              change={{ value: 1, trend: "down" }}
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="h-full animate-slide-up" style={{ animationDelay: "200ms" }}>
              <h2 className="mb-4 text-lg font-semibold text-white">
                Recent Activity
              </h2>
              <div className="space-y-3">
                {recentActivity.map((item, i) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl bg-surface-800/50 px-4 py-3 transition-colors hover:bg-surface-800"
                  >
                    <span className="text-gray-200">{item.text}</span>
                    <span className="text-sm text-surface-400">{item.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4 animate-slide-up" style={{ animationDelay: "250ms" }}>
            <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
            {quickActions.map((action, i) => (
              <Link key={action.href} href={action.href}>
                <Card
                  className="group flex items-center gap-4 transition-all hover:border-electric/30 hover:shadow-[0_0_20px_rgba(0,212,255,0.1)]"
                  glow
                >
                  <div className="rounded-xl bg-surface-800/50 p-2.5">
                    <action.icon className="h-5 w-5 text-electric" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-white group-hover:text-electric">
                      {action.title}
                    </h3>
                    <p className="mt-0.5 text-sm text-surface-400">
                      {action.description}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-surface-400 group-hover:text-electric" />
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
