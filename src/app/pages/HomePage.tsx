"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Heart, Shield, Truck, Stethoscope, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "motion/react";
const pawguardVideo = "/videos/pawguard-hero.mp4";
import TrustBar from "../components/TrustBar";
import CallToActionSection from "../components/CallToActionSection";
import EmergencyStory from "../components/EmergencyStory";
import ServicesExperience from "../components/services/ServicesExperience";
import RescueJourneySection from "../components/rescue-journey/RescueJourneySection";
import ImpactMetric from "../components/ImpactMetric";
import RescueTimeline from "../components/RescueTimeline";
import AdoptionCard from "../components/AdoptionCard";
import SectionHeading from "../components/SectionHeading";
import Hero from "../components/hero/Hero";
import { PageShell, Section, Button, Reveal, StaggerGrid, StaggerItem, CommunityStories, EditorialHeading } from "../components/pawguard";
import { Atmosphere, Parallax } from "../../motion";
import { useAmbientPause } from "../hooks/useAmbientPause";
import { useImpactStats } from "../hooks/useImpactStats";
import { InteractiveImage } from "../../motion/components/InteractiveImage";
import { useMotionStore } from "../../motion/motion-store";

const ANIMALS = [
  { name: "Bella", breed: "Labrador Mix", age: "2 years", gender: "Female", img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=280&fit=crop&auto=format", urgent: true, newArrival: true },
  { name: "Max", breed: "German Shepherd", age: "3 years", gender: "Male", img: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=280&fit=crop&auto=format" },
  { name: "Luna", breed: "Siberian Husky", age: "1 year", gender: "Female", img: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=280&fit=crop&auto=format", newArrival: true },
  { name: "Charlie", breed: "Beagle", age: "4 years", gender: "Male", img: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400&h=280&fit=crop&auto=format" },
];

const STEPS = [
  { num: "01", title: "Emergency Report", desc: "Submit a rescue report with location, dog details, and situation type. Our dispatch center captures everything instantly.", time: "Immediate", color: "#6b7280", icon: "phone" as const },
  { num: "02", title: "Dispatch & Verify", desc: "Our team verifies the report, assesses priority, and mobilizes the nearest trained rescue volunteer.", time: "~30 sec", color: "#f59e0b", icon: "check" as const },
  { num: "03", title: "Rescue Deployed", desc: "A trained volunteer team en route with live ETA. GPS tracking keeps dispatch and reporters informed.", time: "< 12 min", color: "#3b82f6", icon: "team" as const },
  { num: "04", title: "On-Scene Rescue", desc: "Professional extraction, immediate first aid, and safe transport to our partner veterinary clinic.", time: "Varies", color: "#8b5cf6", icon: "shield" as const },
  { num: "05", title: "Care & Recovery", desc: "Veterinary assessment, treatment, and foster placement. Every dog receives a full recovery plan.", time: "1–14 days", color: "#ef4444", icon: "heart" as const },
  { num: "06", title: "Permanent Home", desc: "Matched dogs are placed in thoroughly vetted homes with ongoing support and follow-up.", time: "3–7 days", color: "#22c55e", icon: "home" as const },
];

const FAQS = [
  { q: "How do I report a dog emergency?", a: "Click the Emergency button in the navigation bar or visit our Emergency page. Fill out the quick report form with the location, dog description, and situation type. Our nearest available unit will respond immediately." },
  { q: "What is the adoption process?", a: "Browse available dogs, submit an adoption application, complete a meet-and-greet, and finalize the adoption with our team. The process typically takes 3–7 business days." },
  { q: "How can I volunteer with PawGuard?", a: "Visit our Volunteer page to see available roles including Foster Care, Transport, Events & Outreach, and Shelter Support. Complete a short application and we'll match you with the right opportunity." },
  { q: "Are donations tax-deductible?", a: "Yes. PawGuard is a registered 501(c)(3) nonprofit organization. All donations are fully tax-deductible to the extent permitted by law." },
  { q: "Do you provide veterinary care?", a: "Yes. We offer basic veterinary services including vaccinations, spay/neuter procedures, and emergency triage for rescued dogs. Partner clinics provide specialized care." },
];

function MissionSection() {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useMotionStore((s) => s.motionTier);
  const isReduced = tier === "reduced" || tier === "none";
  const isMobile = typeof window !== "undefined" && window.matchMedia("(pointer:coarse)").matches;

  const rawRotX = useMotionValue(0), rawRotY = useMotionValue(0), rawLift = useMotionValue(0);
  const rawGX = useMotionValue(50), rawGY = useMotionValue(50);
  const rotX = useSpring(rawRotX, { stiffness: 160, damping: 22, mass: 0.6 });
  const rotY = useSpring(rawRotY, { stiffness: 160, damping: 22, mass: 0.6 });
  const lift  = useSpring(rawLift, { stiffness: 160, damping: 22, mass: 0.6 });
  const glowX = useSpring(rawGX,   { stiffness: 100, damping: 20 });
  const glowY = useSpring(rawGY,   { stiffness: 100, damping: 20 });
  const glowOp = useSpring(0,      { stiffness: 100, damping: 20 });

  const cardTransform = useTransform(
    [rotX, rotY, lift],
    ([rx, ry, ly]: number[]) => `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(${ly}px)`,
  );
  const glowBg = useTransform(
    [glowX, glowY],
    ([gx, gy]: number[]) =>
      `radial-gradient(circle at ${gx}% ${gy}%, rgba(37,99,235,0.22) 0%, rgba(37,99,235,0.06) 40%, transparent 70%)`,
  );

  const rafRef = useRef(0);
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isReduced || isMobile) return;
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const rect = ref.current!.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top)  / rect.height;
      rawRotY.set((nx - 0.5) * 16); rawRotX.set(-(ny - 0.5) * 10);
      rawGX.set(nx * 100); rawGY.set(ny * 100);
    });
  }, [isReduced, isMobile, rawRotX, rawRotY, rawGX, rawGY]);

  const onEnter = useCallback(() => { rawLift.set(-10); glowOp.set(1); }, [rawLift, glowOp]);
  const onLeave = useCallback(() => {
    rawRotX.set(0); rawRotY.set(0); rawGX.set(50); rawGY.set(50); rawLift.set(0); glowOp.set(0);
  }, [rawRotX, rawRotY, rawGX, rawGY, rawLift, glowOp]);

  return (
    <Section bg="card">
      <Atmosphere tint="compassion" intensity={0.45} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--space-12)] lg:gap-[var(--space-16)] items-center">
        <Parallax speed={-0.08} className="relative">
          <div
            ref={ref}
            className="relative"
            style={{ perspective: "900px" }}
            onMouseMove={onMove}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
          >
          {/* Outer glow */}
          {!isReduced && !isMobile && (
            <motion.div aria-hidden="true"
              className="pointer-events-none absolute -inset-6 rounded-[28px] z-0"
              style={{ opacity: glowOp, background: glowBg }}
            />
          )}
          <motion.div
            className="relative z-10 will-change-transform"
            style={isReduced || isMobile ? undefined : { transform: cardTransform }}
          >
            <div className="relative rounded-img overflow-hidden shadow-md h-[280px] lg:h-[380px]">
              <InteractiveImage
                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=640&h=480&fit=crop&auto=format"
                alt="Two rescue dogs running freely together in an open field"
                variant="story"
                className="w-full h-full"
                noParallax
                noFloat
              />
              <figure className="absolute inset-x-3 bottom-3 rounded-card bg-background/80 backdrop-blur-sm border border-white/20 px-4 py-3 shadow-md">
                <figcaption className="text-sm text-foreground font-semibold leading-snug">
                  &ldquo;Organized compassion saves lives.&rdquo;
                </figcaption>
              </figure>
            </div>
          </motion.div>
        </div>
        </Parallax>
        <div className="flex flex-col gap-6">
          <EditorialHeading eyebrow="Our Mission">
            When you see a dog in ~crisis~, you should know *exactly* what to do.
          </EditorialHeading>
          <p className="text-muted-foreground text-base leading-relaxed">
            PawGuard was built to eliminate the gap between discovering a dog in distress and getting professional help to the scene. We coordinate rescue, medical care, foster placement, and adoption through a single system — so no dog falls through the cracks.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {[
              { icon: Shield, label: "24/7 Emergency Response" },
              { icon: Heart, label: "Medical & Rehabilitation" },
              { icon: Truck, label: "Transport Network" },
              { icon: Stethoscope, label: "Veterinary Partners" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 bg-background border border-border rounded-lg px-4 py-3">
                <Icon size={16} className="text-primary shrink-0" />
                <span className="text-foreground text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function VideoSection() {
  const sectionRef = useAmbientPause<HTMLElement>();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const tryPlay = () => video.play().catch(() => {});
    video.addEventListener("canplay", tryPlay);
    if (video.readyState >= 2) tryPlay();
    return () => video.removeEventListener("canplay", tryPlay);
  }, []);

  return (
    <section ref={sectionRef} data-theme="dark" className="bg-section-dark w-full relative overflow-hidden">
      <Atmosphere tint="reality" variant="both" intensity={0.5} />
      {/* Heading row — constrained */}
      <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-section-md lg:pt-section-lg pb-[var(--space-10)]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <SectionHeading eyebrow="In the Field" eyebrowClassName="text-white/80" className="max-w-[500px]">
            <span className="text-background">See PawGuard in Action</span>
          </SectionHeading>
          <p className="text-white/60 text-base leading-relaxed max-w-[400px]">
            Watch our teams respond to real emergencies, perform life-saving treatment, and reunite dogs with families.
          </p>
        </div>
      </div>
      {/* Full-bleed video — no gaps, no border-radius, no padding */}
      <div className="w-full aspect-video">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1280&h=720&fit=crop&auto=format"
          className="w-full h-full object-cover block"
        >
          <source src={pawguardVideo} type="video/mp4" />
        </video>
      </div>
    </section>
  );
}

function ImpactSection() {
  const sectionRef = useAmbientPause<HTMLElement>();
  const stats = useImpactStats();

  return (
    <section ref={sectionRef} className="bg-white py-section-md lg:py-section-lg px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          <div className="flex flex-col gap-2">
            <p className="text-primary text-xs font-semibold tracking-widest uppercase font-condensed">Our Impact</p>
            <EditorialHeading as="h3">By the *numbers*</EditorialHeading>
          </div>
          <div className="flex flex-wrap items-center gap-8 lg:gap-16">
            {stats.map((s, i) => (
              <ImpactMetric key={s.label} value={s.value} label={s.label} shimmerDelay={i * 2.6} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <Section bg="card">
      <div className="flex flex-col gap-12 relative">
        <EditorialHeading eyebrow="Process" align="center">
          How PawGuard *Works*
        </EditorialHeading>
        <div className="mx-auto w-full max-w-2xl">
          <RescueTimeline steps={STEPS} />
        </div>
      </div>
    </Section>
  );
}

function FeaturedDogsSection() {
  return (
    <Section bg="card">
      <div className="flex flex-col gap-12 relative">
        <div className="flex items-end justify-between">
          <EditorialHeading eyebrow="Ready for Adoption">
            Featured *Dogs*
          </EditorialHeading>
          <Link
            href="/adopt"
            className="hidden lg:inline-flex items-center gap-1.5 text-primary text-sm font-semibold hover:text-primary-hover transition-colors duration-fast"
          >
            View All Dogs
            <ArrowRight size={14} />
          </Link>
        </div>
        <StaggerGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-grid-md">
          {ANIMALS.map((a) => (
            <StaggerItem key={a.name}>
              <AdoptionCard {...a} />
            </StaggerItem>
          ))}
        </StaggerGrid>
        <Link
          href="/adopt"
          className="lg:hidden self-start text-primary text-sm font-semibold flex items-center gap-1.5"
        >
          View All Dogs
          <ArrowRight size={14} />
        </Link>
      </div>
    </Section>
  );
}

function VolunteerDonateSection() {
  const sectionRef = useAmbientPause<HTMLElement>();
  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-accent px-6 lg:px-12 py-section-md lg:py-section-lg flex flex-col gap-6 relative">
          <div className="flex flex-col gap-3">
            <p className="text-primary text-xs font-semibold tracking-widest uppercase font-condensed">Get Involved</p>
            <EditorialHeading as="h3">Volunteer With *Us*</EditorialHeading>
            <p className="text-muted-foreground text-base leading-relaxed max-w-[440px]">
              We need drivers, foster families, event coordinators, and shelter support. Pick the role that fits your schedule — no experience required.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <span className="font-serif font-bold text-5xl text-primary">800+</span>
            <div className="flex flex-col">
              <span className="text-foreground font-semibold text-lg">Active Volunteers</span>
              <span className="text-muted-foreground text-sm">Across 12 municipalities</span>
            </div>
          </div>
        </div>
        <div className="bg-primary px-6 lg:px-12 py-section-md lg:py-section-lg flex flex-col gap-6 relative">
          <div className="flex flex-col gap-3">
            <p className="text-primary-foreground/60 text-xs font-semibold tracking-widest uppercase font-condensed">Make an Impact</p>
            <h2 className="text-primary-foreground font-serif font-bold text-2xl lg:text-3xl leading-tight tracking-tight">Support Our Mission</h2>
            <p className="text-primary-foreground/70 text-base leading-relaxed max-w-[440px]">
              ₹2,000 covers a week of foster care. ₹8,000 funds emergency triage. ₹40,000 deploys a full rescue team. You choose the impact.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <span className="font-serif font-bold text-5xl text-white">78%</span>
            <div className="flex flex-col">
              <span className="text-white font-semibold text-lg">Direct to Programs</span>
              <span className="text-primary-foreground/80 text-sm">Of every dollar donated</span>
            </div>
          </div>
          <Button
            variant="light"
            size="md"
            asLink={{ href: "/donate" }}
          >
            Donate Now
          </Button>
        </div>
      </div>
    </section>
  );
}

function StoriesSection() {
  return <CommunityStories />;
}

function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <Section bg="default" containerWidth="narrow" aria-label="Frequently asked questions">
      <div className="flex flex-col gap-12 relative">
        <EditorialHeading eyebrow="FAQ" align="center">
          Frequently *Asked* Questions
        </EditorialHeading>
        <div className="flex flex-col">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-t border-border last:border-b">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                aria-expanded={openIdx === i}
                aria-controls={`faq-answer-${i}`}
                className="w-full flex items-center justify-between py-5 text-left gap-4 group min-h-[44px]"
              >
                <span className="text-foreground font-semibold text-base leading-snug group-hover:text-primary transition-colors duration-fast">
                  {faq.q}
                </span>
                <motion.div
                  animate={{ rotate: openIdx === i ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="shrink-0"
                >
                  <ChevronDown size={18} className="text-muted-foreground" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {openIdx === i && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 280, damping: 25, mass: 0.8 }}
                    className="overflow-hidden"
                  >
                    <p id={`faq-answer-${i}`} className="text-muted-foreground text-sm leading-relaxed pb-5">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:text-primary-hover transition-colors duration-fast"
          >
            Still have questions? Contact us
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </Section>
  );
}



export default function HomePage() {
  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <Hero />
        <TrustBar />
        <EmergencyStory />
        <Reveal variant="section"><MissionSection /></Reveal>
        <Reveal variant="section"><VideoSection /></Reveal>
        <Reveal variant="section"><ImpactSection /></Reveal>
        <Reveal variant="section"><HowItWorksSection /></Reveal>
        <ServicesExperience />
        <RescueJourneySection />
        <Reveal variant="section"><FeaturedDogsSection /></Reveal>
        <Reveal variant="section"><VolunteerDonateSection /></Reveal>
        <Reveal variant="section"><StoriesSection /></Reveal>
        <Reveal variant="section"><FaqSection /></Reveal>
        <Reveal variant="section"><CallToActionSection /></Reveal>
      </main>
    </PageShell>
  );
}
