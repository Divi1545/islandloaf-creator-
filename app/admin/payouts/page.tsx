"use client";

import { CreditCard, DollarSign, CheckCircle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { formatCurrency } from "@/lib/utils/scoring";

const mockUser = {
  id: "1",
  full_name: "Admin User",
  role: "admin" as const,
  avatar_url: null,
};

type PayoutStatus = "pending" | "completed" | "failed";

const mockPayouts = [
  {
    id: "1",
    userName: "Alice Johnson",
    amount: 12500,
    status: "pending" as PayoutStatus,
    requestedAt: "Feb 14, 2025",
    avatar_url: null,
  },
  {
    id: "2",
    userName: "Bob Smith",
    amount: 8500,
    status: "pending" as PayoutStatus,
    requestedAt: "Feb 13, 2025",
    avatar_url: null,
  },
  {
    id: "3",
    userName: "Carol Williams",
    amount: 22000,
    status: "completed" as PayoutStatus,
    requestedAt: "Feb 10, 2025",
    avatar_url: null,
  },
  {
    id: "4",
    userName: "David Brown",
    amount: 5600,
    status: "pending" as PayoutStatus,
    requestedAt: "Feb 14, 2025",
    avatar_url: null,
  },
  {
    id: "5",
    userName: "Eva Martinez",
    amount: 15000,
    status: "failed" as PayoutStatus,
    requestedAt: "Feb 12, 2025",
    avatar_url: null,
  },
];

const statusVariant: Record<PayoutStatus, "warning" | "success" | "danger"> = {
  pending: "warning",
  completed: "success",
  failed: "danger",
};

const totalPending = mockPayouts
  .filter((p) => p.status === "pending")
  .reduce((sum, p) => sum + p.amount, 0);

const totalProcessedThisMonth = mockPayouts
  .filter((p) => p.status === "completed")
  .reduce((sum, p) => sum + p.amount, 0);

export default function AdminPayoutsPage() {
  const handleMarkComplete = (id: string, userName: string) => {
    console.log("POST /api/admin/payouts/complete", id);
    alert(`Marked complete: ${userName}`);
  };

  const handleMarkFailed = (id: string, userName: string) => {
    if (confirm(`Mark payout as failed for ${userName}?`)) {
      console.log("POST /api/admin/payouts/fail", id);
      alert(`Marked failed: ${userName}`);
    }
  };

  return (
    <DashboardLayout user={mockUser} currentPath="/admin/payouts">
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Payout <span className="gradient-text">Management</span>
          </h1>
          <p className="mt-1 text-surface-400">
            Process and track payout requests.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="animate-slide-up" style={{ animationDelay: "0ms" }}>
            <StatCard
              icon={CreditCard}
              label="Total Pending"
              value={formatCurrency(totalPending)}
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "50ms" }}>
            <StatCard
              icon={DollarSign}
              label="Total Processed This Month"
              value={formatCurrency(totalProcessedThisMonth)}
              change={{ value: 15, trend: "up" }}
            />
          </div>
        </div>

        {/* Table */}
        <Card className="overflow-hidden animate-slide-up">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPayouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={payout.avatar_url}
                        name={payout.userName}
                        size="sm"
                      />
                      <span className="font-medium text-white">
                        {payout.userName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-electric">
                    {formatCurrency(payout.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[payout.status]}>
                      {payout.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-surface-400">
                    {payout.requestedAt}
                  </TableCell>
                  <TableCell className="text-right">
                    {payout.status === "pending" && (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            handleMarkComplete(payout.id, payout.userName)
                          }
                          className="!bg-green-600 hover:!bg-green-500"
                        >
                          <CheckCircle className="mr-1 h-3.5 w-3.5" />
                          Mark Complete
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() =>
                            handleMarkFailed(payout.id, payout.userName)
                          }
                        >
                          Mark Failed
                        </Button>
                      </div>
                    )}
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
