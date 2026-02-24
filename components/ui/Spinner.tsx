import { cn } from "@/lib/utils/cn";

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-[3px]",
} as const;

export interface SpinnerProps {
  size?: keyof typeof sizeClasses;
  className?: string;
}

function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "animate-spin rounded-full border-electric border-t-transparent",
        sizeClasses[size],
        className
      )}
    />
  );
}

export { Spinner };
