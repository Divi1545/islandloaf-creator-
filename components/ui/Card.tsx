import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

function Card({ className, children, glow = false, ...props }: CardProps) {
  return (
    <div
      className={cn("glass-card", glow && "glow-electric", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Card };
