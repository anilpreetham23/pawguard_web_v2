"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionStore } from "../../../motion/motion-store";
import { cn } from "../ui/utils";
import { useSafeScrollTrigger } from "../hooks/useSafeScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface StagePalette {
  node: string;
  nodeBg: string;
  accent: string;
  light: string;
  text: string;
  border: string;
}

interface StageData {
  id: string;
  title: string;
  summary: string;
  details: string[];
  time: string;
  icon: (active: boolean) => React.ReactNode;
  palette: StagePalette;
}

const STAGES: StageData[] = [
  {
    id: "report",
    title: "Report Received",
    summary: "Your emergency report is captured with precise location and dog details.",
    details: [
      "GPS coordinates recorded from your device",
      "Dog condition and photos documented",
      "Priority level assessed by dispatch protocol",
      "Report routed to nearest dispatch center",
    ],
    time: "Immediate",
    palette: {
      node: "#6b7280", nodeBg: "rgba(107,114,128,0.12)", accent: "#6b7280",
      light: "rgba(107,114,128,0.06)", text: "#4b5563", border: "rgba(107,114,128,0.2)",
    },
    icon: (active) => (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    id: "verify",
    title: "Verification",
    summary: "Dispatch confirms every detail before mobilizing a response team.",
    details: [
      "Contact information verified with reporter",
      "Location accuracy confirmed on map",
      "Severity assessment validated against criteria",
      "Additional details requested if needed",
    ],
    time: "~30 seconds",
    palette: {
      node: "#f59e0b", nodeBg: "rgba(245,158,11,0.12)", accent: "#f59e0b",
      light: "rgba(245,158,11,0.06)", text: "#d97706", border: "rgba(245,158,11,0.2)",
    },
    icon: (active) => (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    id: "assigned",
    title: "Volunteer Assigned",
    summary: "The nearest trained rescue team receives the full case briefing.",
    details: [
      "Closest trained volunteer identified by GPS",
      "Rescue team alerted with full case details",
      "Specialized equipment prepared for the situation",
      "Backup team placed on standby if needed",
    ],
    time: "~2 minutes",
    palette: {
      node: "#3b82f6", nodeBg: "rgba(59,130,246,0.12)", accent: "#3b82f6",
      light: "rgba(59,130,246,0.06)", text: "#2563eb", border: "rgba(59,130,246,0.2)",
    },
    icon: (active) => (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: "enroute",
    title: "En Route",
    summary: "The rescue team is traveling to the dog's location with live ETA.",
    details: [
      "ETA calculated and shared with reporter via SMS",
      "Optimal route selected based on traffic data",
      "Real-time GPS tracking available for dispatch",
      "Local authorities notified for traffic coordination",
    ],
    time: "Under 12 min",
    palette: {
      node: "#8b5cf6", nodeBg: "rgba(139,92,246,0.12)", accent: "#8b5cf6",
      light: "rgba(139,92,246,0.06)", text: "#7c3aed", border: "rgba(139,92,246,0.2)",
    },
    icon: (active) => (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: "rescue",
    title: "Rescue",
    summary: "The team is on scene performing a safe, professional extraction.",
    details: [
      "On-scene assessment of dog condition and environment",
      "Safe extraction performed using appropriate equipment",
      "Immediate first aid administered if required",
      "Dog secured and prepared for transport",
    ],
    time: "Varies",
    palette: {
      node: "#ef4444", nodeBg: "rgba(239,68,68,0.12)", accent: "#ef4444",
      light: "rgba(239,68,68,0.06)", text: "#dc2626", border: "rgba(239,68,68,0.2)",
    },
    icon: (active) => (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    id: "safe",
    title: "Safe",
    summary: "The dog is secured and en route to appropriate medical care.",
    details: [
      "Dog transported to partner veterinary clinic",
      "Medical team pre-notified with arrival ETA",
      "Reporter receives outcome confirmation",
      "Case logged for follow-up and recovery tracking",
    ],
    time: "Until handover",
    palette: {
      node: "#22c55e", nodeBg: "rgba(34,197,94,0.12)", accent: "#22c55e",
      light: "rgba(34,197,94,0.06)", text: "#16a34a", border: "rgba(34,197,94,0.2)",
    },
    icon: (active) => (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
];

function ProgressHeader({ count }: { count: number }) {
  return (
    <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] px-5 py-3.5">
      <div className="flex items-center gap-3">
        <div className="relative w-2.5 h-2.5">
          <div className="absolute inset-0 bg-emergency rounded-full animate-ping opacity-75" />
          <div className="absolute inset-0 bg-emergency rounded-full" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-white/90 text-xs font-bold tracking-wider uppercase font-label block leading-tight">
            Active Rescue Timeline
          </span>
          <span className="text-white/40 text-2xs font-mono">
            Scroll through the stages below
          </span>
        </div>
        <div className="shrink-0 flex items-center gap-1.5 bg-white/5 rounded-full px-2.5 py-1">
          <span className="text-white/50 text-2xs font-mono">{count}</span>
          <span className="text-white/20 text-2xs">stages</span>
        </div>
      </div>
    </div>
  );
}

const NON_CRITICAL_STAGE_IDS = ["report", "verify", "assigned"];

interface RescueTimelineGSAPProps {
  severity?: "critical" | "non-critical";
}

export function RescueTimelineGSAP({ severity = "critical" }: RescueTimelineGSAPProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const connectorRef = useRef<HTMLDivElement>(null);
  const connectorGlowRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const detailRefs = useRef<(HTMLUListElement | null)[]>([]);
  const arrowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const motionTier = useMotionStore((s) => s.motionTier);

  const visibleStages =
    severity === "non-critical"
      ? STAGES.filter((s) => NON_CRITICAL_STAGE_IDS.includes(s.id))
      : STAGES;

  useSafeScrollTrigger(350);

  useEffect(() => {
    const section = sectionRef.current;
    const connector = connectorRef.current;
    const connectorGlow = connectorGlowRef.current;
    if (!section || !connector) return;

    const isBasic = motionTier === "reduced" || motionTier === "none";

    const ctx = gsap.context(() => {
      if (isBasic) {
        // Reduced motion: reveal everything instantly, no scroll scrub.
        gsap.set([connector, connectorGlow, nodeRefs.current.filter(Boolean), contentRefs.current.filter(Boolean), arrowRefs.current.filter(Boolean)], { clearProps: "all" });
        gsap.set(connector, { scaleY: 1 });
        if (connectorGlow) gsap.set(connectorGlow, { scaleY: 1, opacity: 0.4 });
        detailRefs.current.forEach((list) => {
          if (!list) return;
          gsap.set(list.querySelectorAll("li"), { clearProps: "all" });
        });
        return;
      }

      gsap.fromTo(connector, { scaleY: 0 }, {
        scaleY: 1, ease: "none",
        scrollTrigger: { trigger: section, start: "top 75%", end: "bottom 25%", scrub: 0.5, invalidateOnRefresh: true },
      });

      if (connectorGlow) {
        gsap.fromTo(connectorGlow, { scaleY: 0, opacity: 0 }, {
          scaleY: 1, opacity: 0.4, ease: "none",
          scrollTrigger: { trigger: section, start: "top 75%", end: "bottom 40%", scrub: 0.4, invalidateOnRefresh: true },
        });
      }

      // Group nodes + content + arrows into a single staggered timeline per stage
      // instead of individual ScrollTriggers for each element.
      const allNodes = nodeRefs.current.filter(Boolean);
      const allContents = contentRefs.current.filter(Boolean);
      const allArrows = arrowRefs.current.filter(Boolean);

      if (allNodes.length) {
        gsap.fromTo(allNodes, { scale: 0, opacity: 0, rotate: -30 }, {
          scale: 1, opacity: 1, rotate: 0, ease: "none", stagger: 0.1,
          scrollTrigger: { trigger: section, start: "top 70%", end: "bottom 60%", scrub: 0.5, invalidateOnRefresh: true },
        });
      }

      if (allContents.length) {
        gsap.fromTo(allContents, { opacity: 0, y: 24 }, {
          opacity: 1, y: 0, ease: "none", stagger: 0.1,
          scrollTrigger: { trigger: section, start: "top 70%", end: "bottom 60%", scrub: 0.5, invalidateOnRefresh: true },
        });
      }

      if (allArrows.length) {
        gsap.fromTo(allArrows, { opacity: 0, scaleY: 0 }, {
          opacity: 1, scaleY: 1, ease: "none", stagger: 0.1,
          scrollTrigger: { trigger: section, start: "top 70%", end: "bottom 60%", scrub: 0.5, invalidateOnRefresh: true },
        });
      }

      // Detail lists — one trigger per list (6 total, each animates its li children)
      detailRefs.current.forEach((list) => {
        if (!list) return;
        const items = list.querySelectorAll("li");
        if (items.length) {
          gsap.fromTo(items, { opacity: 0, x: -12 }, {
            opacity: 1, x: 0, ease: "none", stagger: 0.08,
            scrollTrigger: { trigger: list, start: "top 80%", end: "top 35%", scrub: 0.5, invalidateOnRefresh: true },
          });
        }
      });
    }, section);

    return () => ctx.revert();
  }, [motionTier, severity]);

  return (
    <div ref={sectionRef} className="flex flex-col gap-1 relative">
      <div className="bg-card border border-border rounded-card overflow-hidden shadow-sm relative">
        <ProgressHeader count={visibleStages.length} />

        <div className="relative px-5 py-6">
          <div className="absolute left-[31px] top-[36px] bottom-[36px] w-[3px] bg-border/30 rounded-full overflow-hidden origin-top">
            <div ref={connectorRef} className="w-full bg-gradient-to-b from-[#ef4444] via-[#8b5cf6] to-[#22c55e] rounded-full" style={{ transformOrigin: "top", transform: "scaleY(0)", height: "100%" }} />
          </div>
          <div className="absolute left-[31px] top-[36px] bottom-[36px] w-[3px] rounded-full overflow-hidden origin-top pointer-events-none">
            <div ref={connectorGlowRef} className="w-full bg-gradient-to-b from-[#ef4444] via-[#a78bfa] to-[#4ade80] rounded-full blur-[6px]" style={{ transformOrigin: "top", transform: "scaleY(0)", height: "100%" }} />
          </div>

          <div className="flex flex-col gap-5 relative z-10">
            {visibleStages.map((stage, i) => {
              const p = stage.palette;
              return (
                <div key={stage.id} className="relative">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        ref={(el) => { nodeRefs.current[i] = el; }}
                        className="relative z-10 w-[26px] h-[26px] shrink-0 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: p.nodeBg, color: p.node }}
                      >
                        {stage.icon(true)}
                      </div>
                      {i < visibleStages.length - 1 && (
                        <div
                          ref={(el) => { arrowRefs.current[i] = el; }}
                          className="w-px h-[18px] my-0.5 origin-top"
                          style={{ backgroundColor: p.border }}
                        />
                      )}
                    </div>

                    <div ref={(el) => { contentRefs.current[i] = el; }} className="flex-1 min-w-0 pb-1">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <h4 className="text-foreground text-sm font-bold" style={{ color: p.text }}>
                          {stage.title}
                        </h4>
                        <span className="text-2xs font-mono shrink-0" style={{ color: p.text + "99" }}>
                          {stage.time}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed mb-1.5" style={{ color: p.text + "aa" }}>
                        {stage.summary}
                      </p>
                      <ul ref={(el) => { detailRefs.current[i] = el; }} className="space-y-0.5">
                        {stage.details.map((d, j) => (
                          <li key={j} className="flex items-start gap-1.5 text-2xs" style={{ color: p.text + "77" }}>
                            <span className="mt-[3px] shrink-0 w-1 h-1 rounded-full" style={{ backgroundColor: p.accent }} />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
