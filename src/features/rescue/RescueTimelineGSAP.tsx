"use client";

import { useEffect, useRef } from "react";
import { getGsap } from "@/motion/gsap-register";
import { CheckCircle2, Clock } from "lucide-react";
import { useMotionStore } from "@/motion/motion-store";
import { cn } from "@/components/ui/utils";
import { useSafeScrollTrigger } from "@/hooks/useSafeScrollTrigger";

export type PublicTrackingStatus =
  | "REPORTED"
  | "VERIFIED"
  | "EN_ROUTE"
  | "ON_SCENE"
  | "STABILIZED"
  | "IN_TRANSIT"
  | "ARRIVED_AT_VET"
  | "TREATED"
  | "RESOLVED"
  | "CANCELLED";

export function normalizePublicStatus(
  status: string | null | undefined
): PublicTrackingStatus {
  if (!status) return "REPORTED";
  const upper = status.toUpperCase().trim();
  switch (upper) {
    case "REPORTED":
      return "REPORTED";
    case "VERIFIED":
    case "TRIAGED":
    case "ACCEPTED":
      return "VERIFIED";
    case "EN_ROUTE":
    case "DISPATCHED":
    case "RESPONDING":
      return "EN_ROUTE";
    case "ON_SCENE":
    case "STABILIZING":
      return "ON_SCENE";
    case "STABILIZED":
    case "CONTAINED":
      return "STABILIZED";
    case "IN_TRANSIT":
    case "TRANSPORTING":
      return "IN_TRANSIT";
    case "ARRIVED_AT_VET":
    case "ADMITTED":
    case "IN_SURGERY":
      return "ARRIVED_AT_VET";
    case "TREATED":
    case "RECOVERING":
    case "FOSTERED":
      return "TREATED";
    case "RESOLVED":
    case "REUNITED":
    case "ADOPTED":
    case "CLOSED":
      return "RESOLVED";
    case "CANCELLED":
    case "FALSE_ALARM":
      return "CANCELLED";
    default:
      return "REPORTED";
  }
}

interface ProtocolStep {
  statusKey: PublicTrackingStatus;
  stepNum: string;
  title: string;
  desc: string;
  targetDurationMinutes: number;
  icon: string;
  accentColor: string;
}

const PUBLIC_PROTOCOL_STEPS: ProtocolStep[] = [
  {
    statusKey: "REPORTED",
    stepNum: "01",
    title: "Report Received & Automated Triage",
    desc: "Incident logged with GPS coordinates. System verifies media assets and assigns initial priority score.",
    targetDurationMinutes: 1,
    icon: "phone",
    accentColor: "var(--emotion-urgency)",
  },
  {
    statusKey: "VERIFIED",
    stepNum: "02",
    title: "Dispatcher Verification",
    desc: "Emergency coordinator validates reporter details and determines required medical/vehicle equipment.",
    targetDurationMinutes: 3,
    icon: "check",
    accentColor: "var(--color-primary-600)",
  },
  {
    statusKey: "EN_ROUTE",
    stepNum: "03",
    title: "Rescue Unit Dispatched",
    desc: "Mobile veterinary unit accepts dispatch assignment and begins navigation to the exact incident location.",
    targetDurationMinutes: 15,
    icon: "team",
    accentColor: "var(--color-primary-600)",
  },
  {
    statusKey: "ON_SCENE",
    stepNum: "04",
    title: "On-Scene Assessment & Containment",
    desc: "Rescuers arrive on site, secure the animal safely, and perform immediate field vital checks.",
    targetDurationMinutes: 20,
    icon: "shield",
    accentColor: "var(--color-primary-700)",
  },
  {
    statusKey: "STABILIZED",
    stepNum: "05",
    title: "Field Stabilization",
    desc: "First-aid, wound dressing, or sedation administered on site prior to vehicle loading.",
    targetDurationMinutes: 30,
    icon: "heart",
    accentColor: "var(--color-primary-700)",
  },
  {
    statusKey: "IN_TRANSIT",
    stepNum: "06",
    title: "Transit to Partner Clinic",
    desc: "Animal is securely placed in climate-controlled ambulance en route to designated emergency veterinary hospital.",
    targetDurationMinutes: 45,
    icon: "team",
    accentColor: "var(--color-primary-800)",
  },
  {
    statusKey: "ARRIVED_AT_VET",
    stepNum: "07",
    title: "Hospital Intake & Triage",
    desc: "Transferred to clinical team. Full diagnostic examination, X-rays, or emergency surgery initiated.",
    targetDurationMinutes: 60,
    icon: "home",
    accentColor: "var(--color-primary-800)",
  },
  {
    statusKey: "TREATED",
    stepNum: "08",
    title: "Clinical Recovery & Medical Hold",
    desc: "Post-op care, microchip scan, and transition to partner shelter or verified foster home.",
    targetDurationMinutes: 120,
    icon: "heart",
    accentColor: "var(--color-primary-900)",
  },
  {
    statusKey: "RESOLVED",
    stepNum: "09",
    title: "Case Resolved & Rehomed",
    desc: "Reunited with original owner or placed in permanent adoption pipeline. Case finalized.",
    targetDurationMinutes: 180,
    icon: "check",
    accentColor: "var(--color-primary-900)",
  },
];

const ORDERED_KEYS: PublicTrackingStatus[] = [
  "REPORTED",
  "VERIFIED",
  "EN_ROUTE",
  "ON_SCENE",
  "STABILIZED",
  "IN_TRANSIT",
  "ARRIVED_AT_VET",
  "TREATED",
  "RESOLVED",
];

interface RescueTimelineGSAPProps {
  currentStatus: string;
  createdAtIso?: string;
  updatedAtIso?: string;
}

export function RescueTimelineGSAP({
  currentStatus,
  createdAtIso,
}: RescueTimelineGSAPProps) {
  const normalized = normalizePublicStatus(currentStatus);
  const activeIndex = ORDERED_KEYS.indexOf(normalized);
  const effectiveIndex = activeIndex >= 0 ? activeIndex : 0;

  const motionTier = useMotionStore((s) => s.motionTier);
  const sectionRef = useRef<HTMLDivElement>(null);
  const connectorRef = useRef<HTMLDivElement>(null);
  const connectorGlowRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useSafeScrollTrigger(350);

  useEffect(() => {
    const section = sectionRef.current;
    const connector = connectorRef.current;
    const connectorGlow = connectorGlowRef.current;
    if (!section || !connector) return;

    const isBasic = motionTier === "reduced" || motionTier === "none";
    let ctx: any = null;

    getGsap().then(({ gsap }) => {
      ctx = gsap.context(() => {
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

        const nodes = nodeRefs.current.filter(Boolean);
        if (nodes.length > 0) {
          gsap.fromTo(
            nodes,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              ease: "back.out(1.7)",
              stagger: 0.08,
              scrollTrigger: {
                trigger: section,
                start: "top 70%",
                end: "bottom 55%",
                scrub: 0.5,
                invalidateOnRefresh: true,
              },
            }
          );
        }

        const contents = contentRefs.current.filter(Boolean);
        if (contents.length > 0) {
          gsap.fromTo(
            contents,
            { opacity: 0, x: -16 },
            {
              opacity: 1,
              x: 0,
              ease: "none",
              stagger: 0.08,
              scrollTrigger: {
                trigger: section,
                start: "top 70%",
                end: "bottom 55%",
                scrub: 0.5,
                invalidateOnRefresh: true,
              },
            }
          );
        }
      }, section);
    }).catch(() => {});

    return () => {
      if (ctx?.revert) ctx.revert();
    };
  }, [motionTier]);

  return (
    <div ref={sectionRef} className="relative py-4" role="list" aria-label="Rescue protocol tracking timeline">
      <div className="absolute left-[19px] top-[24px] bottom-[24px] w-[3px] bg-border/30 rounded-full overflow-hidden origin-top">
        <div
          ref={connectorRef}
          className="w-full rounded-full origin-top bg-gradient-to-b from-primary via-primary-600 to-emerald-600"
          style={{ transformOrigin: "top", transform: "scaleY(0)", height: "100%" }}
        />
      </div>

      <div className="flex flex-col gap-6 relative z-10">
        {PUBLIC_PROTOCOL_STEPS.map((step, idx) => {
          const isPassed = idx < effectiveIndex;
          const isCurrent = idx === effectiveIndex;

          return (
            <div
              key={step.statusKey}
              ref={(el) => { contentRefs.current[idx] = el; }}
              className={cn(
                "flex gap-4 items-start relative rounded-card p-3.5 transition-all duration-300",
                isCurrent ? "bg-primary/5 border border-primary/20 shadow-sm" : "hover:bg-background/60"
              )}
              role="listitem"
            >
              <div
                ref={(el) => { nodeRefs.current[idx] = el; }}
                className={cn(
                  "relative z-10 w-[38px] h-[38px] shrink-0 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300",
                  isPassed
                    ? "bg-emerald-600 text-white shadow-sm"
                    : isCurrent
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-md scale-110"
                    : "bg-muted text-muted-foreground border border-border"
                )}
              >
                {isPassed ? <CheckCircle2 size={16} /> : step.stepNum}
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className={cn("font-bold text-sm sm:text-base leading-tight", isCurrent ? "text-primary" : "text-foreground")}>
                    {step.title}
                  </h4>
                  <span className="text-[11px] font-mono text-muted-foreground shrink-0 flex items-center gap-1">
                    <Clock size={12} /> {step.targetDurationMinutes}m target
                  </span>
                </div>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
