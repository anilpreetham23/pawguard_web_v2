"use client";

import { forwardRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";
import { INTRO_STATS, type ServiceData } from "./services-data";
import { fadeUp, panelVariants } from "./motion-variants";
import { StoryContent, CountStat } from "./StoryContent";

interface StoryPanelProps {
  mode: "intro" | "service";
  service: ServiceData | null;
  isGuideActive?: boolean;
}

function IntroPanel() {
  return (
    <motion.div variants={panelVariants} className="flex h-full flex-col overflow-hidden">
      <motion.div variants={fadeUp(0.05)}>
        <p className="font-condensed text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Our Rescue Ecosystem
        </p>
        <h3 className="mt-3 font-serif text-3xl font-bold leading-[1.14] tracking-tight text-foreground lg:text-[2.6rem]">
          One coordinated platform. Four specialized rescue services. One shared mission.
        </h3>
        <p className="mt-5 max-w-[480px] text-[15px] leading-relaxed text-muted-foreground">
          Every rescue begins with a report, moves through coordinated teams, and ends with a life
          protected. Explore the four sectors to see how each service fits into the same journey.
        </p>
      </motion.div>

      <motion.div variants={fadeUp(0.16)} className="mt-8 border-t border-border/70 pt-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
          {INTRO_STATS.map((s, i) => (
            <CountStat
              key={s.label}
              value={s.value}
              label={s.label}
              color="var(--color-primary)"
              delay={0.16 + i * 0.06}
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        variants={fadeUp(0.3)}
        className="mt-auto flex items-center gap-3 pt-8 text-sm text-muted-foreground"
      >
        <span className="inline-flex h-8 w-8 animate-hint-nudge items-center justify-center rounded-full bg-primary/10 text-primary">
          <ArrowRight size={15} aria-hidden="true" />
        </span>
        <span className="font-medium">Hover a sector — or press an arrow key — to begin</span>
      </motion.div>
    </motion.div>
  );
}

/**
 * StoryPanel — forwarded ref so ServicesExperience can pass it to GuidePath.
 * The `isGuideActive` prop triggers a subtle lift + highlight on the panel
 * when the guide path reaches it, making the panel feel "activated" by the line.
 */
export const StoryPanel = forwardRef<HTMLDivElement, StoryPanelProps>(
  function StoryPanel({ mode, service, isGuideActive }, ref) {
    const key = mode === "intro" ? "intro" : service!.id;

    return (
      <motion.div
        ref={ref}
        id="services-story-panel"
        role="tabpanel"
        aria-label="PawGuard service details"
        className="relative grid min-h-[520px] sm:min-h-[600px] lg:min-h-[720px]"

      >
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={key}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="[grid-area:1/1]"
          >
            {mode === "intro" ? <IntroPanel /> : <StoryContent service={service!} />}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    );
  }
);
