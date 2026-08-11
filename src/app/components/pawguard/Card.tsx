import { cn } from "../ui/utils";

type CardVariant = "default" | "bordered" | "elevated";

const variantStyles: Record<CardVariant, string> = {
  default: "bg-card border border-border shadow-sm",
  bordered: "bg-background border border-border",
  elevated: "bg-card border border-border shadow-md",
};

interface CardProps extends React.ComponentProps<"div"> {
  variant?: CardVariant;
}

export function Card({
  className,
  variant = "default",
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card p-[var(--space-7)] flex flex-col gap-[var(--space-5)]",
        "transition-all duration-gentle ease-gentle",
        "hover:-translate-y-0.5",
        variant === "elevated" ? "hover:shadow-lg hover:-translate-y-1" : "hover:shadow-md",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
