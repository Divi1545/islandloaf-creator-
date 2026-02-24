"use client";

import { useState } from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
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
  full_name: "Alex Creator",
  role: "creator" as const,
  avatar_url: null,
};

// Balance in cents: $245.00 = 24500
const mockWallet = {
  balance: 24500,
  transactions: [
    {
      id: "1",
      type: "payout" as const,
      description: "Payout to bank account",
      amount: -15000,
      date: "Feb 14, 2025",
    },
    {
      id: "2",
      type: "earning" as const,
      description: "Beach Campaign - 1st place",
      amount: 5000,
      date: "Feb 12, 2025",
    },
    {
      id: "3",
      type: "earning" as const,
      description: "Summer Vibes - participation",
      amount: 500,
      date: "Feb 10, 2025",
    },
    {
      id: "4",
      type: "payout" as const,
      description: "Payout to bank account",
      amount: -8000,
      date: "Feb 5, 2025",
    },
    {
      id: "5",
      type: "earning" as const,
      description: "Ocean Views - 2nd place",
      amount: 2500,
      date: "Feb 1, 2025",
    },
  ],
};

export default function CreatorWalletPage() {
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submit
    setTimeout(() => {
      setIsSubmitting(false);
      setPayoutAmount("");
      setPayoutModalOpen(false);
    }, 1000);
  };

  return (
    <DashboardLayout user={mockUser} currentPath="/creator/wallet">
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Wallet
          </h1>
          <p className="mt-1 text-surface-400">
            Manage your earnings and request payouts.
          </p>
        </div>

        {/* Balance Card */}
        <Card glow className="animate-slide-up">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-electric/10 p-4">
                <Wallet className="h-10 w-10 text-electric" />
              </div>
              <div>
                <p className="text-sm font-medium text-surface-400">
                  Available Balance
                </p>
                <p className="text-3xl font-bold text-white sm:text-4xl">
                  {formatCurrency(mockWallet.balance)}
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setPayoutModalOpen(true)}
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Request Payout
            </Button>
          </div>
        </Card>

        {/* Transaction History */}
        <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <h2 className="mb-4 text-lg font-semibold text-white">
            Transaction History
          </h2>
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockWallet.transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        {tx.type === "earning" ? (
                          <ArrowDownLeft className="h-4 w-4 text-green-400" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-red-400" />
                        )}
                        <span className="capitalize">{tx.type}</span>
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-200">
                      {tx.description}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "font-medium",
                          tx.amount >= 0 ? "text-green-400" : "text-red-400"
                        )}
                      >
                        {tx.amount >= 0 ? "+" : "-"}
                        {formatCurrency(Math.abs(tx.amount))}
                      </span>
                    </TableCell>
                    <TableCell className="text-surface-400">{tx.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Payout Modal */}
        <Modal
          isOpen={payoutModalOpen}
          onClose={() => setPayoutModalOpen(false)}
          title="Request Payout"
        >
          <form onSubmit={handlePayoutSubmit} className="space-y-4">
            <Input
              label="Amount (USD)"
              type="number"
              placeholder="0.00"
              value={payoutAmount}
              onChange={(e) => setPayoutAmount(e.target.value)}
              min="1"
              step="0.01"
              required
            />
            <p className="text-sm text-surface-400">
              Available: {formatCurrency(mockWallet.balance)}. Minimum payout:
              $10.00
            </p>
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setPayoutModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
                className="flex-1"
              >
                Submit
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
