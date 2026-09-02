"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { duration, ease, stagger, delay, sectionReveal } from "../../motion/motion.config";
import { EditorialHeading } from "./pawguard/EditorialHeading";
import { useAmbientPause } from "../hooks/useAmbientPause";
import { useImpactStats } from "../hooks/useImpactStats";
import { PawGuardFlipStatCard } from "./PawGuardFlipStatCard";

interface TrustItem {
  stat: string;
  statNum: number;
  title: string;
  tagline: string;
  backBadge: string;
  backTitle: string;
  backDescription: string;
  icon: React.ReactNode;
}

export default function TrustBar() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  useAmbientPause(sectionRef);
  const impactStats = useImpactStats();

  const dogsRescuedValue = impactStats[0]?.value ?? "4,200+";
  const activeVolunteersValue = impactStats[2]?.value ?? "800+";

  const trusts: TrustItem[] = [
    {
      stat: "501(c)(3)",
      statNum: 0,
      title: "Verified Nonprofit",
      tagline: "Every rupee is accounted for",
      backBadge: "TRANSPARENCY",
      backTitle: "Verified & Accountable",
      backDescription:
        "PawGuard operates with a commitment to transparent rescue and community support, with every contribution accounted for.",
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
          aria-hidden="true"
        >
          <path
            d="M16 4L6 8v10c0 5.5 3.5 9 10 10 6.5-1 10-4.5 10-10V8L16 4z"
            stroke="currentColor"
          />
          <path d="M10 16l3.5 3.5L22 12" stroke="currentColor" strokeWidth="2.5" />
        </svg>
      ),
    },
    {
      stat: dogsRescuedValue,
      statNum: 4200,
      title: "Dogs Rescued",
      tagline: "Each number has a name and a story",
      backBadge: "RESCUE IMPACT",
      backTitle: "Every Rescue Matters",
      backDescription:
        "Behind every rescue statistic is a companion who received care, protection and a chance to find safety.",
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
          aria-hidden="true"
        >
          <path
            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
            stroke="currentColor"
          />
        </svg>
      ),
    },
    {
      stat: "<12 min",
      statNum: 12,
      title: "Rescue Dispatch",
      tagline: "Priority routing that saves lives",
      backBadge: "DISPATCH",
      backTitle: "Rapid Response",
      backDescription:
        "Our dispatch system prioritizes calls by severity and routes them to the nearest available team.",
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
          aria-hidden="true"
        >
          <circle cx="16" cy="16" r="12" stroke="currentColor" />
          <polyline points="16 8 16 16 22 20" stroke="currentColor" />
        </svg>
      ),
    },
    {
      stat: activeVolunteersValue,
      statNum: 800,
      title: "Active Volunteers",
      tagline: "Ordinary people, extraordinary impact",
      backBadge: "COMMUNITY",
      backTitle: "Community Powered",
      backDescription:
        "Our volunteers help transform reports into real-world action by supporting rescues, reunification and community outreach.",
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
          aria-hidden="true"
        >
          <path d="M16 16a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" stroke="currentColor" />
          <path
            d="M6 28c0-5.523 4.477-10 10-10s10 4.477 10 10"
            stroke="currentColor"
          />
        </svg>
      ),
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative bg-card py-[var(--space-12)] lg:py-section-sm px-6 lg:px-8 overflow-hidden"
    >
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
          transition={{
            duration: duration.gentle / 1000,
            ease: ease.standard,
            delay: delay.short / 1000,
          }}
        >
          Every rescue begins with someone who refuses to look away.
          <br />
          Hover or tap any card below to flip it and reveal the story behind the number.
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
            <motion.div key={item.title} variants={sectionReveal.up as any}>
              <PawGuardFlipStatCard
                icon={item.icon}
                stat={item.stat}
                statNum={item.statNum}
                title={item.title}
                tagline={item.tagline}
                backBadge={item.backBadge}
                backTitle={item.backTitle}
                backDescription={item.backDescription}
                index={i}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
