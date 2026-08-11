"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionStore } from "../../motion/motion-store";
import { useSafeScrollTrigger } from "./hooks/useSafeScrollTrigger";
import { cn } from "./ui/utils";

gsap.registerPlugin(ScrollTrigger);

type StepIcon = "phone" | "check" | "team" | "shield" | "heart" | "home";

interface TimelineStep {
  num: string;
  title: string;
  desc: string;
  time: string;
  color: string;
  icon: StepIcon;
}

interface RescueTimelineProps {
  steps: TimelineStep[];
}

function StepIconSVG({ icon, color }: { icon: StepIcon; color: string }) {
  const props = {
    viewBox: "0 0 24 24",
    className: "w-4 h-4",
    fill: "none",
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (icon) {
    case "phone":
      return (
        <svg {...props}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case "check":
      return (
        <svg {...props}>
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      );
    case "team":
      return (
        <svg {...props}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "shield":
      return (
        <svg {...props}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case "heart":
      return (
        <svg {...props}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    case "home":
      return (
        <svg {...props}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
  }
}

export default function RescueTimeline({ steps }: RescueTimelineProps) {
  const motionTier = useMotionStore((s) => s.motionTier);
  const sectionRef = useRef<HTMLDivElement>(null);
  const connectorRef = useRef<HTMLDivElement>(null);
  const connectorGlowRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useSafeScrollTrigger(350);

  useEffect(() => {
    const section = sectionRef.current;
    const connector = connectorRef.current;
    const connectorGlow = connectorGlowRef.current;
    if (!section || !connector) return;

    const isBasic = motionTier === "reduced" || motionTier === "none";

    const ctx = gsap.context(() => {
      if (isBasic) {
        gsap.set([connector, connectorGlow, ...nodeRefs.current, ...cardRefs.current], { clearProps: "all" });
        gsap.set(connector, { scaleY: 1 });
        if (connectorGlow) gsap.set(connectorGlow, { scaleY: 1, opacity: 0.4 });
        return;
      }

      // Draw connector line
      gsap.fromTo(connector, { scaleY: 0 }, {
        scaleY: 1, ease: "none",
        scrollTrigger: { trigger: section, start: "top 75%", end: "bottom 25%", scrub: 0.5, invalidateOnRefresh: true },
      });

      // Glow effect
      if (connectorGlow) {
        gsap.fromTo(connectorGlow, { scaleY: 0, opacity: 0 }, {
          scaleY: 1, opacity: 0.4, ease: "none",
          scrollTrigger: { trigger: section, start: "top 75%", end: "bottom 40%", scrub: 0.4, invalidateOnRefresh: true },
        });
      }

      // Staggered node reveal
      const allNodes = nodeRefs.current.filter(Boolean);
      if (allNodes.length) {
        gsap.fromTo(allNodes, { scale: 0, opacity: 0, rotate: -30 }, {
          scale: 1, opacity: 1, rotate: 0, ease: "back.out(1.7)", stagger: 0.12,
          scrollTrigger: { trigger: section, start: "top 70%", end: "bottom 60%", scrub: 0.5, invalidateOnRefresh: true },
        });
      }

      // Staggered card reveal
      const allCards = cardRefs.current.filter(Boolean);
      if (allCards.length) {
        gsap.fromTo(allCards, { opacity: 0, x: -24 }, {
          opacity: 1, x: 0, ease: "none", stagger: 0.12,
          scrollTrigger: { trigger: section, start: "top 70%", end: "bottom 60%", scrub: 0.5, invalidateOnRefresh: true },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [motionTier]);

  // Build gradient from step colors
  const gradientColors = steps.map((s) => s.color).join(", ");

  return (
    <div
      ref={sectionRef}
      className="relative"
      role="list"
      aria-label="Rescue process timeline"
    >
      {/* Connector line */}
      <div className="absolute left-[19px] top-[24px] bottom-[24px] w-[3px] bg-border/30 rounded-full overflow-hidden origin-top">
        <div
          ref={connectorRef}
          className="w-full rounded-full origin-top"
          style={{
            background: `linear-gradient(to bottom, ${gradientColors})`,
            transformOrigin: "top",
            transform: "scaleY(0)",
            height: "100%",
          }}
        />
      </div>

      {/* Glow overlay */}
      <div className="absolute left-[19px] top-[24px] bottom-[24px] w-[3px] rounded-full overflow-hidden origin-top pointer-events-none">
        <div
          ref={connectorGlowRef}
          className="w-full rounded-full blur-[6px] origin-top"
          style={{
            background: `linear-gradient(to bottom, ${gradientColors})`,
            transformOrigin: "top",
            transform: "scaleY(0)",
            height: "100%",
          }}
        />
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-6 relative z-10">
        {steps.map((step, i) => (
          <div
            key={step.num}
            ref={(el) => { cardRefs.current[i] = el; }}
            className={cn(
              "group flex gap-4 items-start relative",
              "rounded-card p-4 -ml-4 mr-0",
              "transition-all duration-300 ease-out",
              "hover:bg-background/80 hover:shadow-sm hover:ml-0 hover:mr-[-16px] hover:px-6",
            )}
            role="listitem"
          >
            {/* Node */}
            <div
              ref={(el) => { nodeRefs.current[i] = el; }}
              className={cn(
                "relative z-10 w-[38px] h-[38px] shrink-0 rounded-full",
                "flex items-center justify-center",
                "transition-all duration-300 ease-out",
                "group-hover:scale-110 group-hover:shadow-lg",
              )}
              style={{
                backgroundColor: `${step.color}18`,
                color: step.color,
                boxShadow: `0 0 0 3px ${step.color}10`,
              }}
            >
              <StepIconSVG icon={step.icon} color={step.color} />
              {/* Pulse ring on hover */}
              <span
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"
                style={{ backgroundColor: `${step.color}20` }}
                aria-hidden="true"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3
                  className="text-foreground font-bold text-base leading-tight"
                  style={{ color: step.color }}
                >
                  {step.title}
                </h3>
                <span
                  className="text-2xs font-mono shrink-0 px-2 py-0.5 rounded-full"
                  style={{
                    color: step.color,
                    backgroundColor: `${step.color}10`,
                  }}
                >
                  {step.time}
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
