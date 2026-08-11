import { cn } from "../ui/utils";

type BadgeVariant = "default" | "urgent" | "new" | "success" | "neutral" | "special";

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-primary/10 text-primary",
  urgent: "bg-destructive/10 text-destructive",
  new: "bg-emerald-500/10 text-emerald-700",
  success: "bg-emerald-500/10 text-emerald-700",
  neutral: "bg-muted text-muted-foreground",
  special: "bg-amber-500/10 text-amber-700",
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-2xs font-semibold tracking-wider uppercase rounded-full",
        "transition-all duration-gentle ease-gentle",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
