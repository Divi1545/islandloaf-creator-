"use client";

import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "./Button";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-6 text-center",
        className
      )}
    >
      <div className="mb-4 rounded-2xl bg-surface-800/50 p-4">
        <Icon className="h-12 w-12 text-surface-500" aria-hidden />
      </div>
      <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-surface-400">{description}</p>
      )}
      {action && (
        <Button
          variant="primary"
          size="md"
          onClick={action.onClick}
          className="mt-6"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

export { EmptyState };
