"use client";

import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: {
    value: number;
    trend: "up" | "down";
  };
  className?: string;
}

function StatCard({ icon: Icon, label, value, change, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "glass-card glow-electric",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-surface-400">{label}</p>
          <p className="mt-1 text-2xl font-bold text-white">{value}</p>
          {change && (
            <span
              className={cn(
                "mt-2 inline-flex items-center text-sm font-medium",
                change.trend === "up" ? "text-green-400" : "text-red-400"
              )}
            >
              {change.trend === "up" ? "↑" : "↓"} {Math.abs(change.value)}%
              <span className="ml-1 text-surface-400">vs last period</span>
            </span>
          )}
        </div>
        <div className="rounded-xl bg-surface-800/50 p-2.5">
          <Icon className="h-5 w-5 text-electric" aria-hidden />
        </div>
      </div>
    </div>
  );
}

export { StatCard };
