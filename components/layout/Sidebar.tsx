"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Trophy,
  Film,
  Wallet,
  Users,
  BarChart3,
  Plus,
  ClipboardCheck,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

type SidebarRole = "creator" | "brand" | "admin" | "moderator";

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarProps {
  role: SidebarRole;
  currentPath: string;
}

const creatorLinks: SidebarLink[] = [
  { href: "/creator", label: "Dashboard", icon: LayoutDashboard },
  { href: "/creator/campaigns", label: "Campaigns", icon: Trophy },
  { href: "/creator/submissions", label: "My Submissions", icon: Film },
  { href: "/creator/wallet", label: "Wallet", icon: Wallet },
];

const brandLinks: SidebarLink[] = [
  { href: "/brand", label: "Dashboard", icon: LayoutDashboard },
  { href: "/brand/campaigns", label: "My Campaigns", icon: Trophy },
  { href: "/brand/campaigns/create", label: "Create Campaign", icon: Plus },
  { href: "/brand/analytics", label: "Analytics", icon: BarChart3 },
];

const adminLinks: SidebarLink[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/campaigns", label: "Campaigns", icon: Trophy },
  { href: "/admin/metrics", label: "Metrics Queue", icon: ClipboardCheck },
  { href: "/admin/payouts", label: "Payouts", icon: CreditCard },
];

function getLinksForRole(role: SidebarRole): SidebarLink[] {
  switch (role) {
    case "creator":
      return creatorLinks;
    case "brand":
      return brandLinks;
    case "admin":
    case "moderator":
      return adminLinks;
    default:
      return creatorLinks;
  }
}

function getRoleLabel(role: SidebarRole): string {
  switch (role) {
    case "creator":
      return "Creator";
    case "brand":
      return "Brand";
    case "admin":
      return "Admin";
    case "moderator":
      return "Moderator";
    default:
      return role;
  }
}

export function Sidebar({ role, currentPath }: SidebarProps) {
  const links = getLinksForRole(role);
  const roleLabel = getRoleLabel(role);

  return (
    <aside className="flex flex-col w-64 shrink-0 bg-surface-900/50 border-r border-surface-700/50">
      <div className="p-4 border-b border-surface-700/50">
        <span className="badge-electric">{roleLabel}</span>
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {links.map((link) => {
          const exactMatch = currentPath === link.href;
          const isChildPath =
            link.href !== "/creator" &&
            link.href !== "/brand" &&
            link.href !== "/admin" &&
            currentPath.startsWith(link.href + "/");
          const hasMoreSpecificMatch = links.some(
            (l) =>
              l.href !== link.href &&
              currentPath.startsWith(l.href) &&
              l.href.length > link.href.length
          );
          const isActive =
            exactMatch || (isChildPath && !hasMoreSpecificMatch);
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                isActive ? "sidebar-link-active" : "sidebar-link"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
