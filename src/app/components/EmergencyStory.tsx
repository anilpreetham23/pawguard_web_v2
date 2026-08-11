"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSafeScrollTrigger } from "./hooks/useSafeScrollTrigger";
import { Section } from "./pawguard/Section";
import { EditorialHeading } from "./pawguard/EditorialHeading";
import { Atmosphere } from "../../motion/components/Atmosphere";
import { useMotionStore } from "../../motion/motion-store";
import { cn } from "./ui/utils";

gsap.registerPlugin(ScrollTrigger);

const STAGE_WEIGHTS = [0.16, 0.14, 0.16, 0.18, 0.18, 0.18];

const STAGES = [
  {
    id: "report",
    number: 1,
    title: "Report Received",
    description:
      "Your report is logged instantly with GPS coordinates, condition photos, and contact info.",
    duration: "Immediate",
    team: "Dispatch Center",
    image: "/images/rescue-process/step-1.webp",
    emotion: "Frightened",
  },
  {
    id: "dispatch",
    number: 2,
    title: "Dispatcher Assigned",
    description:
      "A dispatcher reviews the report, checks urgency, and coordinates the nearest team within a minute.",
    duration: "~45 seconds",
    team: "Dispatch Center",
    image: "/images/rescue-process/step-2.webp",
    emotion: "Hopeful",
  },
  {
    id: "enroute",
    number: 3,
    title: "Rescue Vehicle En Route",
    description:
      "The nearest team heads out with live GPS tracking, and you get a real-time ETA.",
    duration: "Under 12 minutes",
    team: "Rescue Operations",
    image: "/images/rescue-process/step-3.webp",
    emotion: "Alert",
  },
  {
    id: "veterinary",
    number: 4,
    title: "Veterinary Care",
    description:
      "On-site triage begins immediately, followed by emergency treatment and transport to a vet clinic.",
    duration: "Varies by condition",
    team: "Medical Team",
    image: "/images/rescue-process/step-4.webp",
    emotion: "Safe",
  },
  {
    id: "recovery",
    number: 5,
    title: "Recovery",
    description:
      "The dog is monitored, placed in foster care, and you get regular status updates.",
    duration: "Days to weeks",
    team: "Foster Network",
    image: "/images/rescue-process/step-5.webp",
    emotion: "Recovering",
  },
  {
    id: "adoption",
    number: 6,
    title: "Adoption or Release",
    description:
      "Once healthy, the dog is reunited with family or matched with a forever home.",
    duration: "Until placement",
    team: "Adoption Services",
    image: "/images/rescue-process/step-6.webp",
    emotion: "Happy",
  },
];

interface TimelineLayout {
  viewBox: { width: number; height: number };
  path: string;
}

export default function EmergencyStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<SVGPathElement>(null);
  const fillRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const motionTier = useMotionStore((s) => s.motionTier);
  const animate = motionTier === "full";

  const [layout, setLayout] = useState<TimelineLayout | null>(null);

  const headerRef = useRef<HTMLDivElement>(null);

  useSafeScrollTrigger(350);

  /* ── Measurement ─────────────────────────────────────────────────────── */

  const measureTimeline = useCallback(() => {
    const wrapper = timelineRef.current;
    if (!wrapper) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const cw = wrapperRect.width;
    const ch = wrapperRect.height;

    // Measure NODE centers — the snake path must pass through the nodes
    const nodes = nodeRefs.current.filter(Boolean) as HTMLDivElement[];
    if (nodes.length === 0) return;

    const centers = nodes.map((node) => {
      const r = node.getBoundingClientRect();
      return {
        x: r.left + r.width / 2 - wrapperRect.left,
        y: r.top + r.height / 2 - wrapperRect.top,
      };
    });

    // Equalize row heights (tallest card wins) so all six nodes land on an even
    // vertical pitch. Alternating grid rows otherwise auto-place the node into a
    // second implicit track, and varied card text makes row heights differ →
    // uneven node spacing and nodes drifting off their card center.
    const rows = wrapper.querySelectorAll<HTMLElement>(".rescue-row");
    let maxRowH = 0;
    rows.forEach((row) => {
      const h = row.offsetHeight;
      if (h > maxRowH) maxRowH = h;
    });
    if (maxRowH > 0) {
      wrapper.style.setProperty("--timeline-row-h", `${Math.ceil(maxRowH)}px`);
    }

    // Build tight cubic-bezier snake path through measured node centers
    const cx = centers[0].x;
    const swing = Math.min(Math.max(cw * 0.04, 20), 30);
    const startY = centers[0].y - 16;
    const endY = centers[centers.length - 1].y + 16;

    let d = `M ${cx} ${startY}`;
    centers.forEach((c, i) => {
      const prev = i === 0 ? { x: cx, y: startY } : centers[i - 1];
      const dy = c.y - prev.y;
      const swingDir = i % 2 === 0 ? -1 : 1;
      const sx = cx + swingDir * swing;
      d += ` C ${sx} ${prev.y + dy * 0.33}, ${sx} ${c.y - dy * 0.33}, ${cx} ${c.y}`;
    });
    d += ` L ${cx} ${endY}`;

    setLayout({
      viewBox: { width: cw, height: ch },
      path: d,
    });
  }, []);

  /* ── ResizeObserver + fonts ──────────────────────────────────────────── */

  useLayoutEffect(() => {
    document.fonts.ready.then(() => measureTimeline());

    const wrapper = timelineRef.current;
    if (!wrapper) return;

    const ro = new ResizeObserver(() => measureTimeline());
    ro.observe(wrapper);
    return () => ro.disconnect();
  }, [measureTimeline]);

  /* ── GSAP scroll animation ────────────────────────────────────────── */

  useEffect(() => {
    if (!animate || !layout) return;
    const section = sectionRef.current;
    const pathEl = fillRef.current;
    const header = headerRef.current;
    if (!section || !pathEl) return;

    const n = STAGES.length;
    let acc = 0;
    const segments = STAGE_WEIGHTS.map((w) => {
      const start = acc;
      acc += w;
      return [start, acc] as const;
    });

    const ctx = gsap.context(() => {
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

      // Header — lead-in reveal synced to the timeline with a soft rise
      if (header) {
        tl.fromTo(
          header,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.08, ease: "power2.out" },
          0,
        );
      }

      // Path draw — lengthen over the full scroll with organic pacing
      tl.fromTo(
        pathEl,
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 0.94, ease: "power1.inOut" },
        0.04,
      );

      // Nodes + cards — card slides from its own side (converging on the path)
      STAGES.forEach((_, i) => {
        const [s, e] = segments[i];
        const node = nodeRefs.current[i];
        const card = cardRefs.current[i];
        const seg = Math.max(0.001, e - s);

        if (node) {
          tl.fromTo(
            node,
            { scale: 0.35, opacity: 0 },
            { scale: 1, opacity: 1, duration: seg * 0.5, ease: "back.out(1.7)" },
            s,
          );
        }
        if (card) {
          const even = i % 2 === 0;
          tl.fromTo(
            card,
            { x: even ? -28 : 28, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: seg * 0.6,
              ease: "power3.out",
              clearProps: "transform",
            },
            s + seg * 0.02,
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, [animate, layout]);

  /* ── Render ──────────────────────────────────────────────────────────── */

  return (
    <Section
      bg="default"
      className="emergency-story overflow-hidden"
      data-nav-anchor="emergency"
    >
      <Atmosphere tint="urgency" intensity={0.4} />

      <div ref={sectionRef}>
        {/* Header — GSAP-animated lead-in (vía headerRef) */}
        <div
          ref={headerRef}
          className="flex flex-col gap-3 mb-8 md:mb-10 lg:mb-12 max-w-[680px]"
        >
          <EditorialHeading eyebrow="The Rescue Process" static>
            When you report a dog in need, here is *exactly* what happens.
          </EditorialHeading>
          <p className="text-muted-foreground text-sm lg:text-base leading-relaxed mt-1">
            Every stage of the process is coordinated through a single system — from
            the moment you submit a report to the moment the dog reaches safety.
          </p>
        </div>

        {/* Timeline — cards drive vertical rhythm */}
        <div ref={timelineRef} className="relative">
          {/* Snake SVG — decorative, rendered from measured node coordinates */}
          {layout && (
            <svg
              ref={svgRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden lg:block"
              viewBox={`0 0 ${layout.viewBox.width} ${layout.viewBox.height}`}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="rescue-snake-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="55%" stopColor="#0d9488" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
              <path
                ref={trackRef}
                d={layout.path}
                fill="none"
                stroke="var(--border)"
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
              />
              <path
                ref={fillRef}
                d={layout.path}
                fill="none"
                stroke="url(#rescue-snake-grad)"
                strokeWidth="4"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                className="rescue-fill"
                pathLength={1}
                style={{
                  strokeDasharray: 1,
                  strokeDashoffset: animate ? 1 : 0,
                }}
              />
            </svg>
          )}

          {/* Steps — cards are primary, nodes follow */}
          <div className="flex flex-col gap-4 lg:gap-5">
            {STAGES.map((stage, i) => {
              const even = i % 2 === 0;

              return (
                <div
                  key={stage.id}
                  className="rescue-row relative flex items-start gap-5 lg:grid lg:min-h-[140px] lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-x-[var(--timeline-gap-x)]"
                >
                  {/* Card — primary layout driver, determines row height */}
                  <div
                    ref={(el) => {
                      cardRefs.current[i] = el;
                    }}
                    className={cn(
                      "min-w-0 flex-1",
                      "lg:flex-none lg:max-w-[460px] lg:row-start-1",
                      even
                        ? "lg:col-start-1 lg:justify-self-end"
                        : "lg:col-start-3 lg:justify-self-start",
                    )}
                  >
                    <article
                      className="rescue-card group h-full rounded-2xl border border-border bg-background p-5 transition-all duration-gentle ease-gentle"
                      aria-labelledby={`stage-title-${stage.id}`}
                      aria-describedby={`stage-desc-${stage.id}`}
                    >
                      <div className="flex gap-4">
                        {/* Dog image — consistent size via CSS class */}
                        <div className="relative shrink-0">
                          <img
                            src={stage.image}
                            alt={`${stage.title} — ${stage.emotion} dog`}
                            loading="lazy"
                            className="rescue-card-img"
                          />
                          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-border/60 bg-card px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-foreground/70">
                            {stage.emotion}
                          </span>
                        </div>

                        {/* Text — left-aligned */}
                        <div className="min-w-0 flex-1">
                          <h3
                            id={`stage-title-${stage.id}`}
                            className="text-base font-bold leading-snug text-foreground"
                          >
                            {stage.title}
                          </h3>
                          <p
                            id={`stage-desc-${stage.id}`}
                            className="mt-2 text-sm leading-relaxed text-muted-foreground"
                          >
                            {stage.description}
                          </p>

                          {/* Chips */}
                          <div className="mt-4 flex flex-wrap gap-2">
                            {[
                              { label: "Time", value: stage.duration },
                              { label: "Team", value: stage.team },
                            ].map((m) => (
                              <span
                                key={m.label}
                                className="inline-flex items-center gap-1.5 rounded-md border border-border/40 bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground"
                              >
                                <span className="text-muted-foreground/60">
                                  {m.label}:
                                </span>
                                <span className="font-semibold text-foreground/80">
                                  {m.value}
                                </span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>

                  {/* Node — sits on the SVG curve, aligned to card center */}
                  <div
                    ref={(el) => {
                      nodeRefs.current[i] = el;
                    }}
                    data-state={animate ? "upcoming" : "complete"}
                    className="rescue-node relative z-10 flex items-center justify-center rounded-full border-2 font-mono text-sm font-bold lg:col-start-2 lg:row-start-1 lg:justify-self-center"
                    style={{
                      width: "var(--timeline-node-size)",
                      height: "var(--timeline-node-size)",
                    }}
                    aria-hidden="true"
                  >
                    {stage.number}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}