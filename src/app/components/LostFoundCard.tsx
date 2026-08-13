"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { InteractiveImage } from "../../motion/components/InteractiveImage";
import { cn } from "./ui/utils";
import type { LostFoundCase } from "@/types";

const TONE_GRADIENTS: Record<string, string> = {
  amber: "from-amber-200/90 via-orange-100 to-amber-100",
  sky: "from-sky-200/90 via-cyan-100 to-sky-100",
  rose: "from-rose-200/90 via-pink-100 to-rose-100",
  teal: "from-teal-200/90 via-emerald-100 to-teal-100",
  violet: "from-violet-200/90 via-purple-100 to-violet-100",
  indigo: "from-indigo-200/90 via-blue-100 to-indigo-100",
};

const STATUS_BADGE: Record<
  LostFoundCase["status"],
  { label: string; cls: string }
> = {
  active: {
    label: "Active",
    cls: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  },
  resolved: {
    label: "Resolved",
    cls: "bg-muted text-muted-foreground border-border",
  },
  expired: {
    label: "Expired",
    cls: "bg-muted text-muted-foreground border-border",
  },
};

function PhotoPlaceholder({ emoji, tone }: { emoji: string; tone: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-0 flex items-center justify-center bg-gradient-to-br",
        TONE_GRADIENTS[tone] ?? TONE_GRADIENTS.amber,
      )}
    >
      <span className="text-6xl leading-none drop-shadow-sm select-none">{emoji}</span>
    </div>
  );
}

export default function LostFoundCard({ caseItem }: { caseItem: LostFoundCase }) {
  const status = STATUS_BADGE[caseItem.status] ?? STATUS_BADGE.active;
  const [photoFailed, setPhotoFailed] = useState(false);
  const showPhoto = Boolean(caseItem.photoUrl) && !photoFailed;

  return (
    <Link
      href={`/lost-found/${caseItem.id}`}
      className="group bg-card border border-border rounded-card overflow-hidden shadow-sm flex flex-col transition-all duration-gentle ease-gentle hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {showPhoto ? (
          <InteractiveImage
            src={caseItem.photoUrl!}
            alt={`${caseItem.petName} — ${caseItem.animalType}, ${caseItem.breed}`}
            variant="featured"
            className="absolute inset-0 w-full h-full"
            noParallax
            noFloat
            onError={() => setPhotoFailed(true)}
          />
        ) : (
          <PhotoPlaceholder emoji={caseItem.emoji} tone={caseItem.tone} />
        )}

        <div className="absolute top-3 left-3 flex gap-2 z-20">
          <span
            className={cn(
              "bg-white/90 text-foreground text-2xs font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm shadow-sm",
              caseItem.kind === "lost" && "text-destructive",
            )}
          >
            {caseItem.kind === "lost" ? "Lost" : "Found"}
          </span>
        </div>
        <div className="absolute top-3 right-3 z-20">
          <span
            className={cn(
              "inline-flex items-center px-2 py-1 text-2xs font-semibold tracking-wider uppercase rounded-sm border backdrop-blur bg-background/80",
              status.cls,
            )}
          >
            {status.label}
          </span>
        </div>
      </div>

      <div className="p-[var(--space-6)] flex flex-col gap-[var(--space-4)] flex-1">
        <div className="flex flex-col gap-1">
          <h3 className="text-foreground font-bold text-lg leading-snug group-hover:text-primary transition-colors duration-fast">
            {caseItem.petName}
          </h3>
          <p className="text-muted-foreground text-sm">
            {caseItem.animalType.charAt(0).toUpperCase() + caseItem.animalType.slice(1)}
            {caseItem.breed ? ` · ${caseItem.breed}` : ""}
          </p>
        </div>

        <div className="flex flex-col gap-2 text-muted-foreground text-sm mt-auto">
          <p className="flex items-start gap-2">
            <MapPin size={15} className="shrink-0 mt-0.5 text-muted-foreground/70" />
            <span className="line-clamp-2">{caseItem.location}</span>
          </p>
          <p className="flex items-center gap-2">
            <CalendarDays size={15} className="shrink-0 text-muted-foreground/70" />
            {caseItem.date}
            {caseItem.reportedDaysAgo > 0 && (
              <span className="text-muted-foreground/70">· {caseItem.reportedDaysAgo}d ago</span>
            )}
          </p>
        </div>
      </div>
    </Link>
  );
}