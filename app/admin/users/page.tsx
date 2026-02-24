"use client";

import { useState, useMemo } from "react";
import { Search, Check, X } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { cn } from "@/lib/utils/cn";

const mockUser = {
  id: "1",
  full_name: "Admin User",
  role: "admin" as const,
  avatar_url: null,
};

type UserStatus = "pending" | "approved" | "rejected";
type UserRole = "creator" | "brand" | "admin";

const mockUsers = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "creator" as UserRole,
    status: "approved" as UserStatus,
    joinedAt: "Jan 15, 2025",
    avatar_url: null,
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    role: "brand" as UserRole,
    status: "pending" as UserStatus,
    joinedAt: "Feb 10, 2025",
    avatar_url: null,
  },
  {
    id: "3",
    name: "Carol Williams",
    email: "carol@example.com",
    role: "creator" as UserRole,
    status: "rejected" as UserStatus,
    joinedAt: "Feb 8, 2025",
    avatar_url: null,
  },
  {
    id: "4",
    name: "David Brown",
    email: "david@example.com",
    role: "creator" as UserRole,
    status: "pending" as UserStatus,
    joinedAt: "Feb 12, 2025",
    avatar_url: null,
  },
  {
    id: "5",
    name: "Eva Martinez",
    email: "eva@example.com",
    role: "brand" as UserRole,
    status: "approved" as UserStatus,
    joinedAt: "Jan 22, 2025",
    avatar_url: null,
  },
  {
    id: "6",
    name: "Frank Lee",
    email: "frank@example.com",
    role: "creator" as UserRole,
    status: "pending" as UserStatus,
    joinedAt: "Feb 14, 2025",
    avatar_url: null,
  },
  {
    id: "7",
    name: "Grace Kim",
    email: "grace@example.com",
    role: "admin" as UserRole,
    status: "approved" as UserStatus,
    joinedAt: "Dec 1, 2024",
    avatar_url: null,
  },
  {
    id: "8",
    name: "Henry Chen",
    email: "henry@example.com",
    role: "creator" as UserRole,
    status: "approved" as UserStatus,
    joinedAt: "Feb 5, 2025",
    avatar_url: null,
  },
];

const statusVariant: Record<UserStatus, "warning" | "success" | "danger"> = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
};

const filterTabs = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
] as const;

export default function AdminUsersPage() {
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      const matchesFilter =
        filter === "all" || user.status === filter;
      const matchesSearch =
        search === "" ||
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  const handleApprove = (userId: string, userName: string) => {
    if (confirm(`Approve user ${userName}?`)) {
      console.log("POST /api/admin/users/approve", userId);
      alert(`Approved ${userName}`);
    }
  };

  const handleReject = (userId: string, userName: string) => {
    if (confirm(`Reject user ${userName}?`)) {
      console.log("POST /api/admin/users/reject", userId);
      alert(`Rejected ${userName}`);
    }
  };

  return (
    <DashboardLayout user={mockUser} currentPath="/admin/users">
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            User <span className="gradient-text">Management</span>
          </h1>
          <p className="mt-1 text-surface-400">
            Review and manage user registrations.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={cn(
                  "shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                  filter === tab.id
                    ? "bg-electric/10 text-electric border border-electric/20"
                    : "bg-surface-800 text-surface-300 hover:bg-surface-700 hover:text-white border border-surface-600"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <Card className="overflow-hidden animate-slide-up">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar src={user.avatar_url} name={user.name} size="sm" />
                      <span className="font-medium text-white">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-surface-400">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="electric">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[user.status]}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-surface-400">
                    {user.joinedAt}
                  </TableCell>
                  <TableCell className="text-right">
                    {user.status === "pending" && (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleApprove(user.id, user.name)}
                          className="!bg-green-600 hover:!bg-green-500"
                        >
                          <Check className="mr-1 h-3.5 w-3.5" />
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleReject(user.id, user.name)}
                        >
                          <X className="mr-1 h-3.5 w-3.5" />
                          Reject
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
