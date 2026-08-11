"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EditorialHeading } from "../pawguard/EditorialHeading";
import { Atmosphere } from "../../../motion/components/Atmosphere";
import { LiveActivityFeed } from "../services/LiveActivityFeed";
import { RescueJourneyGallery } from "./RescueJourneyGallery";
import { useAmbientPause } from "../../hooks/useAmbientPause";
import "./rescue-journey.css";

export default function RescueJourneySection() {
  const sectionRef = useAmbientPause<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      aria-label="Rescue journey gallery"
      className="relative overflow-hidden bg-background px-6 py-section-md lg:px-8 lg:py-section-lg"
    >
      <Atmosphere tint="transformation" intensity={0.35} />
      <div className="mx-auto max-w-[1280px] relative">
        <EditorialHeading eyebrow="Rescue Journey" align="center">
          Every Rescue Has a *Story*
        </EditorialHeading>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted-foreground lg:text-base">
          From the first phone call to the walk through the front door — follow
          real animals through every stage of care, recovery, and rehoming.
        </p>

        {/* 45/55 desktop → 50/50 tablet → stacked gallery-first mobile */}
        <div className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-10 lg:grid-cols-[45fr_55fr] lg:gap-14">
          <RescueJourneyGallery />

          <div className="flex flex-col justify-center gap-8">
            <div className="flex flex-col gap-3">
              <h3 className="font-serif text-xl font-bold text-foreground lg:text-2xl">
                Live from the field
              </h3>
              <p className="max-w-md text-sm text-muted-foreground leading-relaxed lg:text-base">
                Every card is a real operation — rescue, treatment, foster
                placement, or adoption — reported as it happens across the
                network.
              </p>
            </div>

            <LiveActivityFeed />

            <Link
              href="/stories"
              className="self-start inline-flex items-center gap-1.5 text-primary text-sm font-semibold hover:text-primary-hover transition-colors duration-fast"
            >
              Read success stories
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
