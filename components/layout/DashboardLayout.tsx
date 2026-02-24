"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Navbar, type NavbarUser } from "./Navbar";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: NavbarUser;
  currentPath: string;
}

type SidebarRole = "creator" | "brand" | "admin" | "moderator";

function mapRole(role: string): SidebarRole {
  const r = role.toLowerCase();
  if (r === "creator" || r === "brand" || r === "admin" || r === "moderator") {
    return r as SidebarRole;
  }
  return "creator";
}

export function DashboardLayout({
  children,
  user,
  currentPath,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRole = mapRole(user.role);

  return (
    <div className="flex min-h-screen flex-col bg-surface-950">
      <Navbar user={user} />

      <div className="flex flex-1">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            aria-hidden="true"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - hidden on mobile, toggleable */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 lg:static lg:z-auto",
            "transform transition-transform duration-200 ease-in-out",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <Sidebar role={sidebarRole} currentPath={currentPath} />
        </div>

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto min-h-0">
          {/* Mobile sidebar toggle */}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden fixed bottom-4 left-4 z-30 p-3 rounded-xl bg-surface-800 border border-surface-600 text-surface-300 hover:text-white hover:bg-surface-700 transition-colors shadow-lg"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {children}
        </main>
      </div>
    </div>
  );
}
