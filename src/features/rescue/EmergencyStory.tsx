"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSafeScrollTrigger } from "@/hooks/useSafeScrollTrigger";
import { Section } from "@/layouts/Section";
import { EditorialHeading } from "@/layouts/EditorialHeading";
import { Atmosphere } from "@/motion/components/Atmosphere";
import { useMotionStore } from "@/motion/motion-store";
import { getGsap } from "@/motion/gsap-register";
import { cn } from "@/components/ui/utils";

const STAGE_WEIGHTS = [0.16, 0.14, 0.16, 0.18, 0.18, 0.18];

const STAGES = [
  {
    id: "report",
    num: "01",
    label: "Emergency Reported",
    title: "Caller pinpoints a high-urgency rescue",
    badge: "< 60 seconds",
    color: "var(--emotion-urgency)",
    desc: "A passerby submits a report with photo, condition assessment, and live GPS pin. System categorises it as Tier-1 critical.",
    metrics: [
      { k: "Triage", v: "Tier 1" },
      { k: "Auto-notify", v: "3 units" },
    ],
  },
  {
    id: "dispatch",
    num: "02",
    label: "Unit Dispatched",
    title: "Mobile team accepts and routes",
    badge: "2.4 mins avg",
    color: "var(--color-primary-600)",
    desc: "Nearest available ambulance accepts the request. Live telemetry streams real-time ETA back to the dispatch dashboard.",
    metrics: [
      { k: "Unit ID", v: "MED-04" },
      { k: "ETA", v: "11 mins" },
    ],
  },
  {
    id: "on-scene",
    num: "03",
    label: "On-Scene Stabilization",
    title: "Immediate field care & containment",
    badge: "Under 15 mins",
    color: "var(--color-primary-700)",
    desc: "Veterinary technicians arrive, secure the area, administer pain management, and stabilize the dog for transport.",
    metrics: [
      { k: "Vital check", v: "Stable" },
      { k: "Sedation", v: "As needed" },
    ],
  },
  {
    id: "surgery",
    num: "04",
    label: "Veterinary Surgery",
    title: "Clinical treatment at care centre",
    badge: "Same-day care",
    color: "var(--color-primary-800)",
    desc: "Transferred to PawGuard Central Hospital. Surgeons perform necessary procedures, microchip, and initiate recovery.",
    metrics: [
      { k: "Surgeon", v: "Dr. Chen" },
      { k: "ICU Stay", v: "48 hours" },
    ],
  },
  {
    id: "rehab",
    num: "05",
    label: "Foster & Rehabilitation",
    title: "Physical & emotional recovery",
    badge: "2-4 weeks",
    color: "var(--color-primary-600)",
    desc: "Placed with an experienced foster family. Behavioural team conducts daily assessments until the dog is ready for adoption.",
    metrics: [
      { k: "Foster", v: "Verified" },
      { k: "Assessment", v: "Passed" },
    ],
  },
  {
    id: "adoption",
    num: "06",
    label: "Forever Home",
    title: "Matching & final adoption",
    badge: "Lifetime bond",
    color: "var(--color-primary-900)",
    desc: "Approved adopter completes meet & greet, signs responsible ownership agreement, and receives ongoing PawGuard support.",
    metrics: [
      { k: "Match ID", v: "PG-882" },
      { k: "Guarantee", v: "30-Day" },
    ],
  },
] as const;

export default function EmergencyStory() {
  const motionTier = useMotionStore((s) => s.motionTier);
  const animate = motionTier !== "none" && motionTier !== "reduced";

  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const fillRef = useRef<SVGPathElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const nodeRefs = useRef<HTMLDivElement[]>([]);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  const [layout, setLayout] = useState<{
    pathD: string;
    nodePositions: { x: number; y: number }[];
    totalLength: number;
    svgHeight: number;
  } | null>(null);

  useSafeScrollTrigger(400);

  const measureLayout = useCallback(() => {
    const section = sectionRef.current;
    const svg = svgRef.current;
    if (!section || !svg) return;

    const nodes = nodeRefs.current.filter(Boolean);
    if (nodes.length !== STAGES.length) return;

    const isDesktop = window.innerWidth >= 1024;
    const svgRect = svg.getBoundingClientRect();

    const positions = nodes.map((n) => {
      const r = n.getBoundingClientRect();
      const cx = r.left + r.width / 2 - svgRect.left;
      const cy = r.top + r.height / 2 - svgRect.top;
      return { x: cx, y: cy };
    });

    if (positions.length < 2) return;

    let d = "";
    if (isDesktop) {
      d = `M ${positions[0].x} ${positions[0].y}`;
      for (let i = 0; i < positions.length - 1; i++) {
        const p1 = positions[i];
        const p2 = positions[i + 1];
        const midY = (p1.y + p2.y) / 2;
        d += ` C ${p1.x} ${midY}, ${p2.x} ${midY}, ${p2.x} ${p2.y}`;
      }
    } else {
      const fixedX = positions[0].x;
      d = `M ${fixedX} ${positions[0].y}`;
      for (let i = 1; i < positions.length; i++) {
        d += ` L ${fixedX} ${positions[i].y}`;
      }
    }

    const tmpPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    tmpPath.setAttribute("d", d);
    const totalLength = tmpPath.getTotalLength();
    const svgHeight = svgRect.height;

    setLayout({ pathD: d, nodePositions: positions, totalLength, svgHeight });
  }, []);

  useLayoutEffect(() => {
    measureLayout();
    const handleResize = () => measureLayout();
    window.addEventListener("resize", handleResize);
    const ro = new ResizeObserver(() => measureLayout());
    if (sectionRef.current) ro.observe(sectionRef.current);

    return () => {
      window.removeEventListener("resize", handleResize);
      ro.disconnect();
    };
  }, [measureLayout]);

  useEffect(() => {
    if (!animate || !layout) return;
    const section = sectionRef.current;
    const pathEl = fillRef.current;
    const header = headerRef.current;
    if (!section || !pathEl) return;

    const n = STAGES.length;
    let ctx: any = null;

    getGsap().then(({ gsap }) => {
      ctx = gsap.context(() => {
        let lastActive = -1;

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 30%",
            scrub: 0.75,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              const activeIdx = Math.min(n - 1, Math.floor(p * n));
              if (activeIdx === lastActive) return;
              lastActive = activeIdx;
              nodeRefs.current.forEach((node, i) => {
                if (!node) return;
                node.dataset.state =
                  i < activeIdx ? "complete" : i === activeIdx ? "active" : "upcoming";
              });
            },
          },
        });

        if (header) {
          tl.fromTo(
            header,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.08, ease: "power2.out" },
            0
          );
        }

        tl.fromTo(
          pathEl,
          { strokeDashoffset: layout.totalLength },
          { strokeDashoffset: 0, duration: 1, ease: "none" },
          0.04
        );

        cardRefs.current.forEach((card) => {
          if (!card) return;
          tl.fromTo(
            card,
            { opacity: 0, y: 28 },
            { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" }
          );
        });
      }, section);
    }).catch(() => {});

    return () => {
      if (ctx?.revert) ctx.revert();
    };
  }, [animate, layout]);

  return (
    <Section ref={sectionRef} bg="card" className="relative overflow-hidden">
      <Atmosphere variant="both" intensity={0.3} />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={headerRef} className="mb-12 lg:mb-16">
          <EditorialHeading
            eyebrow="Lifecycle of a Rescue"
            description="Follow the step-by-step protocol that ensures every rescued dog receives immediate medical response and verified adoption placement."
          >
            From Emergency Call to Forever Home
          </EditorialHeading>
        </div>

        <div className="relative">
          {layout && (
            <svg
              ref={svgRef}
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
              style={{ height: layout.svgHeight }}
            >
              <path
                d={layout.pathD}
                fill="none"
                stroke="var(--color-border)"
                strokeWidth="3"
                strokeDasharray="6 6"
              />
              <path
                ref={fillRef}
                d={layout.pathD}
                fill="none"
                stroke="var(--color-primary-600)"
                strokeWidth="4"
                strokeDasharray={layout.totalLength}
                strokeDashoffset={layout.totalLength}
              />
            </svg>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-12 lg:gap-y-20 gap-x-12 relative z-10">
            {STAGES.map((s, i) => (
              <div
                key={s.id}
                ref={(el) => {
                  if (el) cardRefs.current[i] = el;
                }}
                className={cn(
                  "flex flex-col gap-4 p-6 sm:p-8 rounded-card border border-border bg-card shadow-sm hover:shadow-md transition-shadow",
                  i % 2 === 1 && "lg:mt-16"
                )}
              >
                <div className="flex items-center justify-between">
                  <div
                    ref={(el) => {
                      if (el) nodeRefs.current[i] = el;
                    }}
                    data-state="upcoming"
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-primary/10 text-primary transition-colors"
                  >
                    {s.num}
                  </div>
                  <span className="text-2xs font-semibold px-2.5 py-1 rounded-full bg-secondary text-foreground uppercase tracking-wider font-condensed">
                    {s.badge}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-primary uppercase tracking-widest font-condensed">
                    {s.label}
                  </span>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-foreground">
                    {s.title}
                  </h3>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>

                <div className="pt-4 border-t border-border/60 grid grid-cols-2 gap-4">
                  {s.metrics.map((m) => (
                    <div key={m.k} className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground uppercase font-condensed font-semibold">
                        {m.k}
                      </span>
                      <span className="text-sm font-bold text-foreground">{m.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}