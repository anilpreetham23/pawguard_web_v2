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
  accentVariant: "green" | "navy" | "amber" | "community";
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
      accentVariant: "green",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" strokeWidth="2.5" />
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
      accentVariant: "navy",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 10c-1.5 0-3 1.2-3 2.8 0 2.2 2.2 4.2 3 4.2s3-2 3-4.2c0-1.6-1.5-2.8-3-2.8z" fill="currentColor" />
          <circle cx="7" cy="8.5" r="2" fill="currentColor" />
          <circle cx="17" cy="8.5" r="2" fill="currentColor" />
          <circle cx="4" cy="14" r="1.8" fill="currentColor" />
          <circle cx="20" cy="14" r="1.8" fill="currentColor" />
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
      accentVariant: "amber",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" strokeWidth="2.5" />
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
      accentVariant: "community",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
                accentVariant={item.accentVariant}
                index={i}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
