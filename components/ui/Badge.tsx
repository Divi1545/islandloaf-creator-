import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

const variantClasses = {
  electric: "badge-electric",
  success: "badge-success",
  warning: "badge-warning",
  danger: "badge-danger",
} as const;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variantClasses;
}

function Badge({
  variant = "electric",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(variantClasses[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
