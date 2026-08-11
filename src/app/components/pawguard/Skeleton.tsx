import { cn } from "../ui/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-md",
        "bg-[length:200%_100%] bg-gradient-to-r from-muted via-muted/40 to-muted",
        "animate-shimmer",
        className,
      )}
      aria-hidden="true"
    />
  );
}
