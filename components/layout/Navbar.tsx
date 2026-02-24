"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";

export interface NavbarUser {
  id: string;
  full_name: string;
  role: string;
  avatar_url?: string | null;
}

interface NavbarProps {
  user?: NavbarUser | null;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/creators", label: "Creators" },
];

function getDashboardPath(role: string): string {
  switch (role) {
    case "creator":
      return "/creator";
    case "brand":
      return "/brand";
    case "admin":
    case "moderator":
      return "/admin";
    default:
      return "/creator";
  }
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full",
        "bg-surface-950/80 backdrop-blur-xl border-b border-surface-700/50"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center">
          <span className="gradient-text text-xl font-bold">IslandLoaf</span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors",
                pathname === link.href
                  ? "text-electric"
                  : "text-surface-300 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side: user menu or sign in */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-surface-800 transition-colors"
                aria-expanded={userDropdownOpen}
                aria-haspopup="true"
              >
                <Avatar
                  src={user.avatar_url}
                  name={user.full_name}
                  size="sm"
                />
                <span className="hidden sm:inline text-sm font-medium text-gray-200 max-w-[120px] truncate">
                  {user.full_name}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-surface-400 transition-transform",
                    userDropdownOpen && "rotate-180"
                  )}
                />
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    aria-hidden="true"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-xl bg-surface-900 border border-surface-700/50 shadow-xl py-1 z-50 animate-fade-in"
                    role="menu"
                  >
                    <Link
                      href={getDashboardPath(user.role)}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-200 hover:bg-surface-800 hover:text-white transition-colors"
                      role="menuitem"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/api/auth/logout"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-200 hover:bg-surface-800 hover:text-white transition-colors"
                      role="menuitem"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Link>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/auth/login">
              <Button variant="primary" size="sm">
                Sign In
              </Button>
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-surface-300 hover:bg-surface-800 hover:text-white transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-surface-700/50 bg-surface-950/95 backdrop-blur-xl animate-slide-up">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-electric bg-electric/10"
                    : "text-surface-300 hover:bg-surface-800 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
