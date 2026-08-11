"use client";

import { Phone, Navigation, Clock, AlertTriangle, Shield } from "lucide-react";

interface DispatchInfo {
  label: string;
  number: string;
}

interface SafetyTip {
  text: string;
}

interface DispatchPanelProps {
  steps?: string[];
  contacts?: DispatchInfo[];
  tips?: string[];
  responseTime?: string;
}

export function DispatchPanel({
  steps = [
    "Your report goes directly to the nearest available unit.",
    "An operator may call you for further details.",
    "Do not intervene if the situation is dangerous.",
    "You will receive a status update once a team is dispatched.",
  ],
  contacts = [
    { label: "PawGuard Emergency", number: "1-800-PAW-GUARD" },
    { label: "Animal Control", number: "1-800-555-0199" },
    { label: "Veterinary Helpline", number: "1-800-555-0177" },
  ],
  tips = [
    "Keep a safe distance from injured dogs.",
    "Do not attempt to move the dog unless trained.",
    "Keep other people and pets away from the area.",
    "Stay on the line with emergency services.",
  ],
  responseTime = "12",
}: DispatchPanelProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="bg-card border border-border rounded-card overflow-hidden shadow-sm">
        <div className="bg-emergency px-5 py-3">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse-soft" />
            <span className="text-white text-xs font-bold tracking-wider uppercase font-condensed">Active Dispatch Protocol</span>
          </div>
        </div>
        <div className="p-5 flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <p className="text-foreground text-xs font-semibold tracking-wider uppercase font-condensed">What happens next</p>
            <ol className="flex flex-col gap-3">
              {steps.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="shrink-0 w-6 h-6 bg-primary/10 text-primary text-xs font-bold flex items-center justify-center rounded-full font-mono">
                    {i + 1}
                  </div>
                  <span className="text-muted-foreground text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="h-px bg-border" />

          <div className="flex flex-col gap-3">
            <p className="text-foreground text-xs font-semibold tracking-wider uppercase font-condensed">Emergency contacts</p>
            <div className="flex flex-col gap-3">
              {contacts.map((c) => (
                <div key={c.label} className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">{c.label}</span>
                  <a href={`tel:${c.number}`} className="text-primary font-bold text-sm hover:underline font-mono tracking-tight">
                    {c.number}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-border" />

          <div className="flex flex-col gap-2.5">
            <p className="text-foreground text-xs font-semibold tracking-wider uppercase font-condensed">Safety guidance</p>
            <ul className="flex flex-col gap-2">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5 text-muted-foreground text-sm leading-relaxed">
                  <Shield size={12} className="text-emergency shrink-0 mt-0.5" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-card p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emergency/10 rounded-lg flex items-center justify-center">
            <Clock size={18} className="text-emergency" />
          </div>
          <div>
            <p className="text-foreground font-bold text-lg font-mono tracking-tight">&lt;{responseTime} min</p>
            <p className="text-muted-foreground text-xs">Average dispatch time for critical cases</p>
          </div>
        </div>
      </div>
    </div>
  );
}
