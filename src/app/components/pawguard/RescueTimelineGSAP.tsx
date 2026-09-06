"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle2, Clock } from "lucide-react";
import { useMotionStore } from "../../../motion/motion-store";
import { cn } from "../ui/utils";
import { useSafeScrollTrigger } from "../hooks/useSafeScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type PublicTrackingStatus =
  | "REPORTED"
  | "VERIFIED"
  | "DISPATCHED"
  | "LOCATED"
  | "RESOLVED"
  | "CANCELLED";

export function normalizePublicStatus(rawStatus?: string | null): PublicTrackingStatus {
  if (!rawStatus) return "REPORTED";
  const upper = rawStatus.toUpperCase().trim();
  if (upper === "VERIFIED") return "VERIFIED";
  if (upper === "DISPATCHED") return "DISPATCHED";
  if (upper === "LOCATED") return "LOCATED";
  if (upper === "RESOLVED" || upper === "RESCUED" || upper === "ADMITTED") return "RESOLVED";
  if (upper === "CANCELLED" || upper === "REJECTED") return "CANCELLED";
  return "REPORTED";
}

export interface TimelineStage {
  id: string;
  title: string;
  summaryUpcoming: string;
  summaryCurrent: string;
  summaryCompleted: string;
  details: string[];
}

const PUBLIC_TIMELINE_STAGES: TimelineStage[] = [
  {
    id: "report",
    title: "Report Received",
    summaryUpcoming: "Emergency report to be registered.",
    summaryCurrent: "Emergency report received and logged.",
    summaryCompleted: "Emergency report registered with precise location.",
    details: [
      "GPS location and address logged",
      "Dog physical condition documented",
      "Severity level registered",
    ],
  },
  {
    id: "verify",
    title: "Verification",
    summaryUpcoming: "Pending coordinator review.",
    summaryCurrent: "Awaiting rescue coordinator verification.",
    summaryCompleted: "Case verified by rescue coordinator.",
    details: [
      "Reporter contact validation",
      "Incident location mapping verified",
      "Triage priority confirmed",
    ],
  },
  {
    id: "assigned",
    title: "Rescue Unit Assigned",
    summaryUpcoming: "Unit assignment follows verification.",
    summaryCurrent: "Coordinator assigning rescue unit.",
    summaryCompleted: "Rescue unit assigned to incident.",
    details: [
      "Nearest responder identified",
      "Case details briefed to team",
      "Rescue equipment prepared",
    ],
  },
  {
    id: "dispatched",
    title: "Dispatched",
    summaryUpcoming: "Dispatch pending unit assignment.",
    summaryCurrent: "Rescue unit en route to scene.",
    summaryCompleted: "Rescue unit dispatched.",
    details: [
      "Response team traveling to location",
      "Live ETA calculated when available",
      "Route navigation active",
    ],
  },
  {
    id: "on_scene",
    title: "On Scene",
    summaryUpcoming: "Arrival assessment at location.",
    summaryCurrent: "Rescue team active at scene.",
    summaryCompleted: "Extraction and initial care completed.",
    details: [
      "On-scene safety evaluation",
      "Safe extraction protocol",
      "Immediate triage administered",
    ],
  },
  {
    id: "resolved",
    title: "Resolved",
    summaryUpcoming: "Veterinary intake & final resolution.",
    summaryCurrent: "Finalizing case handover & transport.",
    summaryCompleted: "Case successfully resolved & handed over to medical care.",
    details: [
      "Dog transported to veterinary facility",
      "Intake medical record created",
      "Reporter notified of resolution",
    ],
  },
];

function getStageIndex(normStatus: PublicTrackingStatus): number {
  switch (normStatus) {
    case "REPORTED":
      return 1; // Stage 1 (Verification) is CURRENT
    case "VERIFIED":
      return 2; // Stage 2 (Rescue Unit Assigned) is CURRENT
    case "DISPATCHED":
      return 3; // Stage 3 (Dispatched) is CURRENT
    case "LOCATED":
      return 4; // Stage 4 (On Scene) is CURRENT
    case "RESOLVED":
      return 5; // Stage 5 (Resolved) is COMPLETED (all 6 COMPLETED)
    case "CANCELLED":
      return -1;
    default:
      return 1;
  }
}

interface RescueTimelineGSAPProps {
  status?: string;
  severity?: "critical" | "non-critical";
  etaDisplay?: string | null;
  estimatedArrivalMinutes?: number | null;
}

export function RescueTimelineGSAP({
  status = "REPORTED",
  severity = "critical",
  etaDisplay,
  estimatedArrivalMinutes,
}: RescueTimelineGSAPProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const connectorRef = useRef<HTMLDivElement>(null);
  const connectorGlowRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const motionTier = useMotionStore((s) => s.motionTier);

  const normStatus = normalizePublicStatus(status);
  const activeIndex = getStageIndex(normStatus);

  const showEta =
    (normStatus === "DISPATCHED" || normStatus === "LOCATED") &&
    Boolean(
      etaDisplay ||
        (typeof estimatedArrivalMinutes === "number" && estimatedArrivalMinutes > 0)
    );

  const formattedEta = showEta
    ? etaDisplay || `${estimatedArrivalMinutes} minutes`
    : null;

  useSafeScrollTrigger(350);

  useEffect(() => {
    const section = sectionRef.current;
    const connector = connectorRef.current;
    const connectorGlow = connectorGlowRef.current;
    if (!section || !connector) return;

    const isBasic = motionTier === "reduced" || motionTier === "none";

    const ctx = gsap.context(() => {
      if (isBasic) {
        gsap.set(
          [
            connector,
            connectorGlow,
            nodeRefs.current.filter(Boolean),
            contentRefs.current.filter(Boolean),
          ],
          { clearProps: "all" }
        );
        gsap.set(connector, { scaleY: 1 });
        return;
      }

      gsap.fromTo(
        connector,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            end: "bottom 25%",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        }
      );

      if (connectorGlow) {
        gsap.fromTo(
          connectorGlow,
          { scaleY: 0, opacity: 0 },
          {
            scaleY: 1,
            opacity: 0.4,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              end: "bottom 40%",
              scrub: 0.4,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      const allNodes = nodeRefs.current.filter(Boolean);
      const allContents = contentRefs.current.filter(Boolean);

      if (allNodes.length) {
        gsap.fromTo(
          allNodes,
          { scale: 0.8, opacity: 0.5 },
          {
            scale: 1,
            opacity: 1,
            ease: "none",
            stagger: 0.08,
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              end: "bottom 60%",
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      if (allContents.length) {
        gsap.fromTo(
          allContents,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            stagger: 0.08,
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              end: "bottom 60%",
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, [motionTier, status]);

  if (normStatus === "CANCELLED") {
    return (
      <div className="bg-card border border-border rounded-card p-6 shadow-sm flex flex-col gap-3">
        <div className="flex items-center gap-2 text-destructive font-bold text-base">
          <Clock size={18} />
          <span>Report Cancelled / Closed</span>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          This emergency report has been cancelled or closed by the coordinator.
        </p>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="flex flex-col gap-1 relative">
      <div className="bg-card border border-border rounded-card overflow-hidden shadow-sm relative">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="relative w-3 h-3 shrink-0">
              <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75" />
              <div className="absolute inset-0 bg-primary rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-white/90 text-xs font-bold tracking-wider uppercase font-condensed block leading-tight">
                Live Rescue Status
              </span>
              <span className="text-white/60 text-2xs">
                Authoritative public pipeline
              </span>
            </div>
            <div className="shrink-0 flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1">
              <span className="text-white text-xs font-semibold uppercase font-mono">
                {normStatus}
              </span>
            </div>
          </div>
        </div>

        {/* ETA & Status Info Bar */}
        <div className="bg-muted/40 border-b border-border p-4">
          {showEta && formattedEta ? (
            <div className="flex items-center gap-2.5 text-primary font-bold text-sm">
              <Clock size={16} className="animate-pulse" />
              <span>Estimated arrival: {formattedEta}</span>
            </div>
          ) : (
            <p className="text-muted-foreground text-xs font-medium flex items-center gap-2">
              <Clock size={14} className="shrink-0 text-muted-foreground/70" />
              <span>ETA will appear after a rescue unit has been dispatched.</span>
            </p>
          )}
        </div>

        {/* Timeline Stages */}
        <div className="relative px-5 py-6">
          <div className="absolute left-[31px] top-[36px] bottom-[36px] w-[3px] bg-border/30 rounded-full overflow-hidden origin-top">
            <div
              ref={connectorRef}
              className="w-full bg-gradient-to-b from-emerald-500 via-primary to-amber-500 rounded-full"
              style={{ transformOrigin: "top", transform: "scaleY(0)", height: "100%" }}
            />
          </div>
          <div className="absolute left-[31px] top-[36px] bottom-[36px] w-[3px] rounded-full overflow-hidden origin-top pointer-events-none">
            <div
              ref={connectorGlowRef}
              className="w-full bg-gradient-to-b from-emerald-400 via-primary to-amber-400 rounded-full blur-[6px]"
              style={{ transformOrigin: "top", transform: "scaleY(0)", height: "100%" }}
            />
          </div>

          <div className="flex flex-col gap-6 relative z-10">
            {PUBLIC_TIMELINE_STAGES.map((stage, i) => {
              const isCompleted = activeIndex > i || (activeIndex === 5 && i === 5);
              const isCurrent = activeIndex === i && activeIndex !== 5;
              const isUpcoming = !isCompleted && !isCurrent;

              const summaryText = isCompleted
                ? stage.summaryCompleted
                : isCurrent
                  ? stage.summaryCurrent
                  : stage.summaryUpcoming;

              return (
                <div key={stage.id} className="relative">
                  <div className="flex gap-4 items-start">
                    <div className="flex flex-col items-center shrink-0 mt-0.5">
                      <div
                        ref={(el) => {
                          nodeRefs.current[i] = el;
                        }}
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 font-bold text-xs",
                          isCompleted
                            ? "bg-emerald-500 text-white shadow-sm"
                            : isCurrent
                              ? "bg-primary text-primary-foreground ring-4 ring-primary/20 animate-pulse-soft"
                              : "bg-muted text-muted-foreground border border-border"
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={15} />
                        ) : isCurrent ? (
                          <span className="w-2 h-2 rounded-full bg-white" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                        )}
                      </div>
                    </div>

                    <div
                      ref={(el) => {
                        contentRefs.current[i] = el;
                      }}
                      className="flex-1 min-w-0"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h4
                          className={cn(
                            "text-sm font-bold",
                            isCompleted
                              ? "text-foreground"
                              : isCurrent
                                ? "text-primary"
                                : "text-muted-foreground"
                          )}
                        >
                          {stage.title}
                        </h4>
                        <span className="text-2xs font-mono font-semibold tracking-wider uppercase">
                          {isCompleted
                            ? "Completed"
                            : isCurrent
                              ? "Current"
                              : "Upcoming"}
                        </span>
                      </div>

                      <p
                        className={cn(
                          "text-xs leading-relaxed mt-0.5",
                          isCurrent
                            ? "text-foreground font-medium"
                            : "text-muted-foreground"
                        )}
                      >
                        {summaryText}
                      </p>

                      {(isCompleted || isCurrent) && (
                        <ul className="mt-2 space-y-1">
                          {stage.details.map((d, j) => (
                            <li
                              key={j}
                              className="flex items-center gap-1.5 text-2xs text-muted-foreground"
                            >
                              <span
                                className={cn(
                                  "w-1 h-1 rounded-full shrink-0",
                                  isCompleted ? "bg-emerald-500" : "bg-primary"
                                )}
                              />
                              {d}
                            </li>
                          ))}
                        </ul>
                      )}
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
