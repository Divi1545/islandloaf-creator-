import { cn } from "@/lib/utils/cn";

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
} as const;

export interface AvatarProps {
  src?: string | null;
  name: string;
  size?: keyof typeof sizeClasses;
  className?: string;
}

function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-700 font-medium text-surface-300",
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

export { Avatar };
