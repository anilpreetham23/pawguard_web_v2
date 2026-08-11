import { cn } from "../ui/utils";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

type AlertVariant = "info" | "success" | "warning" | "error";

const config: Record<AlertVariant, { bg: string; icon: string; Icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  info: { bg: "bg-primary/5 border-primary/20", icon: "text-primary", Icon: Info },
  success: { bg: "bg-emerald-500/5 border-emerald-500/20", icon: "text-emerald-600", Icon: CheckCircle2 },
  warning: { bg: "bg-amber-500/5 border-amber-500/20", icon: "text-amber-600", Icon: AlertTriangle },
  error: { bg: "bg-destructive/5 border-destructive/20", icon: "text-destructive", Icon: XCircle },
};

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Alert({ variant = "info", title, children, className }: AlertProps) {
  const { bg, icon, Icon } = config[variant];

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-card border px-5 py-4",
        "transition-all duration-gentle ease-gentle",
        bg,
        className,
      )}
    >
      <Icon size={18} className={`shrink-0 mt-0.5 ${icon}`} />
      <div className="flex flex-col gap-1">
        {title && <p className="text-foreground font-semibold text-sm">{title}</p>}
        <p className="text-muted-foreground text-sm leading-relaxed">{children}</p>
      </div>
    </div>
  );
}
