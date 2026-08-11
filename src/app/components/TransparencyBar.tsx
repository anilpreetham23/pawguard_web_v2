"use client";

interface TransparencyBarProps {
  pct: string;
  label: string;
  color?: string;
}

export default function TransparencyBar({ pct, label, color }: TransparencyBarProps) {
  const barColor = color || "bg-primary";

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">{label}</span>
        <span className="text-foreground font-bold text-sm">{pct}</span>
      </div>
      <div className="h-2.5 bg-secondary w-full rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barColor} transition-all duration-deliberate`} style={{ width: pct }} />
      </div>
    </div>
  );
}
