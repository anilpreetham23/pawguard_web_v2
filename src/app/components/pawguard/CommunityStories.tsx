"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "../ui/utils";
import { useMotionStore } from "../../../motion/motion-store";
import { duration, ease } from "../../../motion/motion.config";
import { useAmbientPause } from "../../hooks/useAmbientPause";
import { EditorialHeading } from "./EditorialHeading";
import { useSuccessStories } from "../../hooks/useSuccessStories";

interface StoryData {
  id: string;
  animal: string;
  type: string;
  quote: string;
  headline: string;
  excerpt: string;
  img: string;
  adopter: string;
  date: string;
}

const STORIES: StoryData[] = [
  {
    id: "bruno",
    animal: "Bruno",
    type: "Golden Retriever Mix",
    quote: "The gentlest, most grateful dog we've ever known.",
    headline: "From the Streets of Millbrook to His Forever Home",
    excerpt: "Bruno was found severely malnourished and unable to walk following a road accident. PawGuard's emergency team reached the scene in under 12 minutes.",
    img: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1000&h=600&fit=crop&auto=format",
    adopter: "Helena & Stefan Lindqvist",
    date: "March 2024",
  },
  {
    id: "mochi",
    animal: "Mochi",
    type: "Dog",
    quote: "Three days trapped, and she still wagged the moment we held her.",
    headline: "Tiny Survivor, Giant Spirit",
    excerpt: "Mochi was trapped in a collapsed building following storm damage. Rescue teams worked through the night to reach her.",
    img: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1000&h=600&fit=crop&auto=format",
    adopter: "The Nakamura Family",
    date: "June 2023",
  },
  {
    id: "rex",
    animal: "Rex",
    type: "Dog",
    quote: "He just needed someone to believe in him. Turns out, that was Philip.",
    headline: "Second Chances Work",
    excerpt: "Rex had been returned to three shelters before PawGuard's behavioural team discovered he needed a quiet, single-adult household.",
    img: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=1000&h=600&fit=crop&auto=format",
    adopter: "Philip Adeyemi",
    date: "January 2024",
  },
  {
    id: "willow",
    animal: "Willow",
    type: "Dog",
    quote: "Two weeks turned into six months. I guess we were the ones who got rescued.",
    headline: "A Foster Failure (The Best Kind)",
    excerpt: "Willow came in as a foster placement for two weeks. Her foster family couldn't imagine life without her.",
    img: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=1000&h=600&fit=crop&auto=format",
    adopter: "The Okafor Family",
    date: "September 2023",
  },
  {
    id: "nala",
    animal: "Nala",
    type: "Dog",
    quote: "She walked straight into their arms and never looked back.",
    headline: "The Office Dog Who Wasn't",
    excerpt: "Nala was surrendered when her owner relocated. Two weeks at PawGuard, and she found her perfect match.",
    img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1000&h=600&fit=crop&auto=format",
    adopter: "James & Priya Mehta",
    date: "April 2024",
  },
  {
    id: "scout",
    animal: "Scout",
    type: "Dog",
    quote: "His energy is endless, but so is his love for the trail.",
    headline: "Built for the Outdoors",
    excerpt: "Scout was rescued from a hoarding situation. His boundless energy found its match in a hiking-obsessed couple from Ashford.",
    img: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=1000&h=600&fit=crop&auto=format",
    adopter: "Marie & Leo Dubois",
    date: "October 2023",
  },
];

function ProgressDots({
  count,
  active,
  onSelect,
}: {
  count: number;
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2" role="tablist" aria-label="Story navigation">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          role="tab"
          aria-selected={i === active}
          aria-label={`Story ${i + 1}: ${STORIES[i].animal}`}
          onClick={() => onSelect(i)}
          className={cn(
            "h-1.5 rounded-full transition-all duration-narrative ease-gentle focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            i === active
              ? "w-8 bg-primary"
              : "w-1.5 bg-foreground/15 hover:bg-foreground/30",
          )}
        />
      ))}
    </div>
  );
}

function StoryCard({
  story,
  isActive,
  onFocus,
}: {
  story: StoryData;
  isActive: boolean;
  onFocus: () => void;
}) {
  const motionTier = useMotionStore((s) => s.motionTier);

  return (
    <div
      className={cn(
        "relative min-w-[85vw] lg:min-w-[75vw] h-[420px] lg:h-[500px] rounded-img overflow-hidden snap-start shrink-0",
        "transition-shadow duration-ui",
        isActive ? "shadow-xl" : "shadow-md",
      )}
      onMouseEnter={onFocus}
    >
      <img
        src={story.img}
        alt={story.headline}
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-all duration-narrative ease-gentle will-change-transform animate-story-photo-zoom",
          isActive ? "scale-100" : "scale-[1.02]",
        )}
        loading="lazy"
        decoding="async"
      />
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-gentle",
          isActive
            ? "bg-gradient-to-t from-black/75 via-black/30 to-black/40"
            : "bg-gradient-to-t from-black/80 via-black/50 to-black/60",
        )}
      />

      <div className="relative z-10 flex flex-col justify-end h-full p-6 lg:p-10">
        <div className="max-w-[640px]">
          <motion.div
            initial={motionTier === "full" ? false : undefined}
            animate={
              isActive && motionTier === "full"
                ? { opacity: 1, y: 0 }
                : { opacity: 0.55, y: 4 }
            }
            transition={{ duration: duration.gentle / 1000, ease: ease.gentle }}
          >
            <Quote size={18} className="text-white/30 mb-2"
              aria-hidden="true"
            />
            <blockquote className="text-white font-serif font-bold text-xl lg:text-2xl leading-snug tracking-tight">
              &ldquo;{story.quote}&rdquo;
            </blockquote>
          </motion.div>

          <motion.div
            className="mt-4 lg:mt-5 flex flex-wrap items-center gap-x-4 gap-y-1"
            initial={motionTier === "full" ? false : undefined}
            animate={
              isActive && motionTier === "full"
                ? { opacity: 1, y: 0 }
                : { opacity: 0.4, y: 4 }
            }
            transition={{ duration: duration.gentle / 1000, ease: ease.gentle, delay: 0.05 }}
          >
            <span className="text-white/80 text-sm font-medium animate-story-name-breathe">{story.adopter}</span>
            <span className="text-white/40 text-xs">{story.type} &middot; {story.date}</span>
          </motion.div>

          <motion.div
            className="mt-3 overflow-hidden"
            initial={false}
            animate={{
              height: isActive ? "auto" : 0,
              opacity: isActive ? 1 : 0,
            }}
            transition={{ duration: duration.gentle / 1000, ease: ease.gentle }}
          >
            {isActive && (
              <p className="text-white/60 text-sm leading-relaxed line-clamp-2">
                {story.excerpt}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function CommunityStories() {
  const { data: remoteStories } = useSuccessStories();
  const storiesToDisplay: StoryData[] =
    remoteStories && remoteStories.length > 0
      ? remoteStories.map((s) => ({
          id: s.id,
          animal: s.title,
          type: "Rescue Dog",
          quote: s.summary || "A story of hope and recovery.",
          headline: s.title,
          excerpt: s.summary || s.body.slice(0, 120),
          img:
            s.hero_image_url ||
            "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1000&h=600&fit=crop&auto=format",
          adopter: "PawGuard Family",
          date: s.published_at ? s.published_at.slice(0, 10) : "Recent",
        }))
      : STORIES;

  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [sectionVisible, setSectionVisible] = useState(true);
  const motionTier = useMotionStore((s) => s.motionTier);
  useAmbientPause(sectionRef);

  const autoIdxRef = useRef(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>(Array(storiesToDisplay.length).fill(null));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const io = new IntersectionObserver(
      ([entry]) => setSectionVisible(entry.isIntersecting),
      { rootMargin: "120px 0px" },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
    if (cards.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = cards.indexOf(entry.target as HTMLElement);
            if (idx >= 0) setActiveIdx(idx);
          }
        }
      },
      { root: container, threshold: 0.6 },
    );

    cards.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);

  const scrollTo = useCallback((idx: number) => {
    autoIdxRef.current = idx;
    const target = cardRefs.current[idx];
    const container = containerRef.current;
    if (target && container) {
      const left =
        container.scrollLeft +
        (target.getBoundingClientRect().left - container.getBoundingClientRect().left);
      container.scrollTo({
        left,
        behavior: motionTier === "full" ? "smooth" : "auto",
      });
    }
  }, [motionTier]);

  const goNext = useCallback(() => {
    const next = Math.min(activeIdx + 1, storiesToDisplay.length - 1);
    if (next !== activeIdx) scrollTo(next);
  }, [activeIdx, storiesToDisplay.length, scrollTo]);

  const goPrev = useCallback(() => {
    const prev = Math.max(activeIdx - 1, 0);
    if (prev !== activeIdx) scrollTo(prev);
  }, [activeIdx, scrollTo]);

  useEffect(() => {
    if (motionTier === "none" || !sectionVisible) return;
    const id = setInterval(() => {
      scrollTo((autoIdxRef.current + 1) % storiesToDisplay.length);
    }, 4500);
    return () => clearInterval(id);
  }, [motionTier, sectionVisible, storiesToDisplay.length, scrollTo]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    },
    [goNext, goPrev],
  );

  if (motionTier === "none") {
    return (
      <section className="py-section-md lg:py-section-lg px-6 lg:px-8 bg-card">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col gap-2 mb-12">
            <p className="text-primary text-xs font-semibold tracking-[0.12em] uppercase">
              Community Stories
            </p>
            <h2 className="text-foreground font-serif font-bold text-2xl lg:text-3xl leading-tight tracking-tight">
              Real Rescues, Real Families
            </h2>
          </div>
          <div className="grid gap-grid-md md:grid-cols-2 lg:grid-cols-3">
            {storiesToDisplay.map((story) => (
              <div key={story.id} className="bg-background rounded-card p-5 border border-border/40">
                <blockquote className="text-foreground font-serif font-bold text-base leading-snug mb-3">
                  &ldquo;{story.quote}&rdquo;
                </blockquote>
                <p className="text-muted-foreground text-sm mb-3">{story.excerpt}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-foreground font-semibold">{story.adopter}</span>
                  <span className="text-muted-foreground">&middot;</span>
                  <span className="text-muted-foreground">{story.animal}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-section-md lg:py-section-lg px-6 lg:px-8 bg-card overflow-hidden relative">
      <div className="max-w-[1280px] mx-auto relative">
        <div className="flex flex-col gap-2 mb-10 lg:mb-14">
          <EditorialHeading eyebrow="Community Stories">
            Real Rescues, *Real* Families
          </EditorialHeading>
          <p className="text-muted-foreground text-sm lg:text-base max-w-[480px] mt-1">
            Every adoption is a story worth telling. These are just a few of the lives changed through PawGuard.
          </p>
        </div>
      </div>

      <div className="relative max-w-[1280px] mx-auto">
        {storiesToDisplay.length > 1 && (
          <>
            <button
              onClick={goPrev}
              disabled={activeIdx === 0}
              aria-label="Previous story"
              className={cn(
                "absolute left-2 lg:left-0 top-1/2 -translate-y-1/2 z-20",
                "w-9 h-9 lg:w-10 lg:h-10 rounded-full",
                "bg-white/10 backdrop-blur-sm border border-white/10",
                "flex items-center justify-center",
                "text-white/70 hover:text-white hover:bg-white/20",
                "transition-all duration-gentle ease-gentle focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                activeIdx === 0 && "opacity-0 pointer-events-none",
              )}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={goNext}
              disabled={activeIdx === storiesToDisplay.length - 1}
              aria-label="Next story"
              className={cn(
                "absolute right-2 lg:right-0 top-1/2 -translate-y-1/2 z-20",
                "w-9 h-9 lg:w-10 lg:h-10 rounded-full",
                "bg-white/10 backdrop-blur-sm border border-white/10",
                "flex items-center justify-center",
                "text-white/70 hover:text-white hover:bg-white/20",
                "transition-all duration-gentle ease-gentle focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                activeIdx === storiesToDisplay.length - 1 && "opacity-0 pointer-events-none",
              )}
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        <div
          ref={containerRef}
          role="tablist"
          aria-label="Success stories"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className={cn(
            "flex gap-4 lg:gap-6 overflow-x-auto snap-x snap-mandatory",
            "scrollbar-none pb-2",
            motionTier === "full" ? "scroll-smooth" : "",
          )}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {storiesToDisplay.map((story, i) => (
            <div
              key={story.id}
              ref={(el) => { cardRefs.current[i] = el; }}
              role="tabpanel"
              aria-label={`Story ${i + 1}: ${story.animal}`}
            >
              <StoryCard
                story={story}
                isActive={hoveredIdx !== null ? hoveredIdx === i : activeIdx === i}
                onFocus={() => setHoveredIdx(i)}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 lg:mt-8 flex items-center justify-center gap-4">
          <ProgressDots
            count={storiesToDisplay.length}
            active={hoveredIdx !== null ? hoveredIdx : activeIdx}
            onSelect={scrollTo}
          />
        </div>
      </div>
    </section>
  );
}
