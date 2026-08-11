"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { sectionReveal, duration, ease, stagger, delay } from "../../motion/motion.config";
import { useCountUp } from "../../motion/hooks/use-count-up";
import { EditorialHeading } from "./pawguard/EditorialHeading";
import { useAmbientPause } from "../hooks/useAmbientPause";

interface TrustItem {
  stat: string;
  statNum: number;
  title: string;
  tagline: string;
  evidence: string;
  icon: React.ReactNode;
}

const trusts: TrustItem[] = [
  {
    stat: "501(c)(3)",
    statNum: 0,
    title: "Verified Nonprofit",
    tagline: "Every dollar is accounted for",
    evidence: "PawGuard is a registered 501(c)(3) nonprofit organization (EIN 87-1234567). Our financial records are audited annually and published publicly. 78% of every dollar goes directly to dog care programs.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
        <path d="M16 4L6 8v10c0 5.5 3.5 9 10 10 6.5-1 10-4.5 10-10V8L16 4z" stroke="currentColor" />
        <path d="M10 16l3.5 3.5L22 12" stroke="currentColor" strokeWidth="2.5" />
      </svg>
    ),
  },
  {
    stat: "4,200+",
    statNum: 4200,
    title: "Dogs Rescued",
    tagline: "Each number has a name and a story",
    evidence: "Since 2020, our rescue teams have responded across 12 municipalities — from stray puppies trapped in storm drains to injured dogs struck by vehicles. Every dog receives triage, medical treatment, and a path to safety.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" />
      </svg>
    ),
  },
  {
    stat: "<12 min",
    statNum: 12,
    title: "Emergency Response",
    tagline: "Coordination that saves lives",
    evidence: "Our dispatch system prioritizes calls by severity and routes them to the nearest available team. From the moment a report comes in, a responder is en route — coordinating with local shelters, veterinary partners, and law enforcement when needed.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
        <circle cx="16" cy="16" r="12" stroke="currentColor" />
        <polyline points="16 8 16 16 22 20" stroke="currentColor" />
      </svg>
    ),
  },
  {
    stat: "800+",
    statNum: 800,
    title: "Active Volunteers",
    tagline: "Ordinary people, extraordinary impact",
    evidence: "Our volunteer network spans fosters, drivers, event coordinators, veterinarians, and shelter support — all trained and vetted. Each volunteer commits to regular shifts, with 85% reporting increased confidence in emergency dog handling within their first three months.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
        <path d="M16 16a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" stroke="currentColor" />
        <path d="M6 28c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="currentColor" />
      </svg>
    ),
  },
];

function EvidenceCard({ item, index }: { item: TrustItem; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const { display, triggerRef } = useCountUp(item.stat, {
    delay: delay.short / 1000 + index * stagger.slow,
    duration: duration.deliberate / 1000,
  });

  return (
    <motion.div
      className="flex flex-col bg-background border border-border rounded-card cursor-default overflow-hidden relative h-[310px]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      tabIndex={0}
      role="region"
      aria-label={`${item.stat} — ${item.title}. ${item.tagline}`}
      aria-expanded={expanded}
      variants={sectionReveal.up as any}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocus={() => setExpanded(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setExpanded(false);
      }}
      animate={expanded ? { scale: 1.02, boxShadow: "var(--shadow-hover-card)" } : { scale: 1, boxShadow: "var(--shadow-sm)" }}
      transition={{ duration: duration.fast / 1000, ease: ease.standard }}
    >
      <div className="flex flex-col items-center text-center gap-3 px-6 flex-1 justify-center">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          {item.icon}
        </div>
        <div className="flex flex-col gap-1">
          <span
            ref={item.statNum > 0 ? triggerRef : undefined}
            className="font-mono font-bold text-3xl lg:text-3xl text-foreground leading-none tracking-tight tabular-nums"
          >
            {item.statNum > 0 ? display : item.stat}
          </span>
          <span className="font-medium text-sm text-foreground">{item.title}</span>
          <span className="text-xs text-muted-foreground leading-relaxed">{item.tagline}</span>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="evidence"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: duration.fast / 1000, ease: ease.standard }}
            className="absolute inset-x-0 bottom-0 bg-background/95 backdrop-blur-sm border-t border-border/50 px-6 py-4"
          >
            <p className="text-xs text-muted-foreground leading-relaxed text-center">
              {item.evidence}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function TrustBar() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  useAmbientPause(sectionRef);

  return (
    <section ref={sectionRef} className="relative bg-card py-[var(--space-12)] lg:py-section-sm px-6 lg:px-8 overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute -left-40 -top-44 h-[560px] w-[560px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,214,150,0.22) 0%, rgba(255,214,150,0) 62%)",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-primary/25 via-primary/10 to-transparent" />
      </div>

      <div className="relative max-w-[1280px] mx-auto flex flex-col gap-10">
        <EditorialHeading eyebrow="Verified Impact" align="center">
          Evidence of a *Community* That Acts
        </EditorialHeading>
        <motion.p
          className="text-muted-foreground text-sm lg:text-base leading-relaxed max-w-xl mx-auto text-center mt-1"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: duration.gentle / 1000, ease: ease.standard, delay: delay.short / 1000 }}
        >
            Every rescue begins with someone who refuses to look away.
            <br />
            Hover or focus any stat below to see what it really means.
          </motion.p>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{
            visible: {
              transition: {
                staggerChildren: stagger.slow,
                delayChildren: delay.medium / 1000,
              },
            },
          }}
        >
          {trusts.map((item, i) => (
            <EvidenceCard key={item.title} item={item} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
