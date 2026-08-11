"use client";

import { Users, Truck, Home, Heart, TrendingUp } from "lucide-react";
import { DispatchReveal } from "./DispatchReveal";

interface ImpactStat {
  value: string;
  label: string;
  detail?: string;
  icon: React.ElementType;
}

interface VolunteerImpactPanelProps {
  stats?: ImpactStat[];
}

export function VolunteerImpactPanel({
  stats = [
    { value: "800+", label: "Active Volunteers", detail: "Across 12 municipalities", icon: Users },
    { value: "4", label: "Available Roles", detail: "Foster, Transport, Events, Shelter", icon: Truck },
    { value: "12", label: "Partner Facilities", detail: "Shelters & clinics", icon: Home },
    { value: "60%", label: "Faster Response", detail: "With volunteer support", icon: TrendingUp },
  ],
}: VolunteerImpactPanelProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <DispatchReveal key={s.label} delay={i * 0.08}>
            <div className="flex flex-col gap-3 bg-white/5 border border-white/10 rounded-glass p-5 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-gentle ease-gentle">
              <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
                <Icon size={16} className="text-background" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-background font-bold text-2xl lg:text-3xl font-serif leading-none">{s.value}</span>
                <span className="text-white/60 text-xs font-semibold tracking-wider uppercase font-condensed">{s.label}</span>
                {s.detail && <span className="text-white/40 text-2xs">{s.detail}</span>}
              </div>
            </div>
          </DispatchReveal>
        );
      })}
    </div>
  );
}
