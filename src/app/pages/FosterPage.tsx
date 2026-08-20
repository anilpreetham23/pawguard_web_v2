"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  ShieldCheck,
  Stethoscope,
  Package,
  Clock,
  ArrowRight,
  Home,
  Check,
  BadgeCheck,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import PageHeader from "../components/PageHeader";
import {
  PageShell,
  Section,
  Button,
  Card,
  Reveal,
  StaggerGrid,
  StaggerItem,
  Badge,
} from "../components/pawguard";
import { scrollTo } from "../../motion/scroll";
import { useAuth } from "../providers/auth-provider";
import { useFosterStatus } from "../hooks/useFosterStatus";
import { fosterService } from "@/services/api/foster";
import { QUERY_KEYS, getErrorMessage, isApiError } from "@/lib/api";
import { queryClient } from "@/lib/react-query";

const FOSTER_ROLES = [
  {
    title: "Medical Recovery Foster",
    desc: "Provide a calm home environment for dogs recovering from surgery, injury, or medical treatments.",
    commitment: "2–4 weeks per placement",
    img: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500&h=350&fit=crop&auto=format",
    requirements: [
      "Ability to administer oral or topical medication",
      "Quiet home space without high activity",
      "Reliable schedule for care follow-ups",
    ],
  },
  {
    title: "Puppy & Litter Foster",
    desc: "Care for vulnerable young puppies or nursing mothers until they are old enough and healthy enough for adoption.",
    commitment: "4–8 weeks per placement",
    img: "https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=500&h=350&fit=crop&auto=format",
    requirements: [
      "Time for frequent feedings & basic care",
      "Easy-to-clean indoor environment",
      "Basic puppy socialization and handling",
    ],
  },
  {
    title: "Behavioral Recovery Foster",
    desc: "Help shy, fearful, or rescued street dogs build confidence and learn home manners in a reassuring environment.",
    commitment: "3–8 weeks per placement",
    img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&h=350&fit=crop&auto=format",
    requirements: [
      "Patience and experience with dog handling",
      "Secure outdoor space or leash walking ability",
      "No aggressive resident pets",
    ],
  },
  {
    title: "Short-Term Emergency Foster",
    desc: "Provide temporary housing during sudden rescue cases, shelter space limitations, or transition periods.",
    commitment: "14–90 days per placement",
    img: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=350&fit=crop&auto=format",
    requirements: [
      "Flexible schedule for short-notice placements",
      "Secure living space",
      "Basic dog handling confidence",
    ],
  },
];

const FOSTER_SUPPORT = [
  {
    title: "Temporary Home Housing",
    desc: "Provide a quiet, low-stress environment for dogs recovering from injury, surgery, or rescue trauma.",
    icon: Home,
  },
  {
    title: "Supplies & Medical Care Support",
    desc: "Basic supplies, food guidance, and veterinary care coordination are arranged for foster placements.",
    icon: Package,
  },
  {
    title: "Behavioral & Home Training",
    desc: "Help dogs learn basic home manners, social confidence, and routine in a supportive setting.",
    icon: Heart,
  },
  {
    title: "Matched Placements",
    desc: "Placements are matched based on your home environment, pet experience, and availability.",
    icon: ShieldCheck,
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Submit Application",
    desc: "Fill out an application detailing your care preferences and capacity.",
  },
  {
    step: "02",
    title: "Review & Orientation",
    desc: "Our foster team reviews your profile application and verifies your home setup.",
  },
  {
    step: "03",
    title: "Placement Matching",
    desc: "When a dog needing foster care matches your profile, introduction and placement are coordinated.",
  },
  {
    step: "04",
    title: "Home Care & Progress",
    desc: "Provide daily care, log progress notes, and maintain contact with foster coordinators.",
  },
  {
    step: "05",
    title: "Forever Home Adoption",
    desc: "Celebrate as your foster dog gets adopted into a permanent home, or apply to adopt.",
  },
];

const FAQS = [
  {
    q: "How long does a foster placement typically last?",
    a: "Placement duration ranges from 14 to 90 days depending on the dog's recovery needs and adoption readiness.",
  },
  {
    q: "What if I have existing pets at home?",
    a: "Many foster carers have pets. Placements are matched based on your home environment, and slow, controlled introductions are recommended.",
  },
  {
    q: "Can I adopt my foster dog if I decide to?",
    a: "Yes, foster carers can submit an adoption application for their foster dog if they wish to permanently adopt.",
  },
  {
    q: "What basic requirements are needed to foster?",
    a: "You need a safe living space, time for daily care, and agreement to follow PawGuard care and medical guidelines.",
  },
];

export default function FosterPage() {
  const { isAuthenticated, openAuthDialog } = useAuth();
  const { status, fosterProfile, canApply, isApproved, isPending, refetch } = useFosterStatus();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Form State (ONLY supported API fields: preferences, max_capacity, notes)
  const [preferences, setPreferences] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("1");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ max_capacity?: string }>({});

  const validateForm = () => {
    const errs: { max_capacity?: string } = {};
    if (maxCapacity.trim() !== "") {
      const parsed = Number(maxCapacity);
      if (isNaN(parsed) || !Number.isInteger(parsed) || parsed < 1) {
        errs.max_capacity = "Maximum capacity must be a positive integer (at least 1).";
      }
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!isAuthenticated) {
      openAuthDialog("sign-in");
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        preferences: preferences.trim() || null,
        max_capacity: maxCapacity.trim() !== "" ? Number(maxCapacity) : 1,
        notes: notes.trim() || null,
      };

      await fosterService.apply(payload);

      // Invalidate relevant React Query queries
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.community.meDashboard,
      });
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.foster.profiles,
      });

      // Refetch foster status hook
      refetch();

      setSubmitSuccess(true);
    } catch (err: unknown) {
      if (isApiError(err)) {
        if (err.status === 401) {
          openAuthDialog("sign-in");
        } else if (err.status === 409) {
          setSubmitError("A Foster application has already been submitted for your account.");
        } else {
          setSubmitError(getErrorMessage(err));
        }
      } else {
        setSubmitError("An unexpected error occurred while submitting your application. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
        <PageHeader
          eyebrow="Foster Care Program"
          title="Open your home. Save a life directly."
          subtitle="Provide temporary housing, care, and love for dogs recovering from injury, illness, or rescue trauma while they await permanent adoption."
          right={
            <div className="aspect-[4/3] lg:aspect-[16/9] bg-secondary rounded-img overflow-hidden shadow-md">
              <img
                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=640&h=480&fit=crop&auto=format"
                alt="Foster dog playing happily in a warm home"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          }
        >
          <div className="flex items-center gap-4 flex-wrap">
            {!isAuthenticated ? (
              <>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => openAuthDialog("sign-in")}
                >
                  Apply to Foster
                </Button>
                <Link href="/foster/dashboard">
                  <Button variant="secondary" size="lg">
                    Foster Dashboard
                  </Button>
                </Link>
              </>
            ) : isApproved ? (
              <Link href="/foster/dashboard">
                <Button variant="primary" size="lg">
                  Go to Foster Dashboard
                </Button>
              </Link>
            ) : isPending || submitSuccess ? (
              <Link href="/foster/dashboard">
                <Button variant="primary" size="lg">
                  View Application Status
                </Button>
              </Link>
            ) : (
              <>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    const el = document.getElementById("apply");
                    if (el) scrollTo(el);
                  }}
                >
                  Apply to Foster
                </Button>
                <Link href="/foster/dashboard">
                  <Button variant="secondary" size="lg">
                    Foster Dashboard
                  </Button>
                </Link>
              </>
            )}

            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                const el = document.getElementById("roles");
                if (el) scrollTo(el);
              }}
            >
              Explore Roles
            </Button>
          </div>
        </PageHeader>

        {/* ── STATUS BANNER IF AUTHENTICATED & APPLIED ─────────────────────── */}
        {isAuthenticated && (fosterProfile || submitSuccess) && (
          <Section bg="default" className="py-4">
            <div className="bg-primary/5 border border-primary/20 rounded-card p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <BadgeCheck size={20} className="text-primary shrink-0" />
                <div>
                  <p className="text-foreground font-bold text-sm">
                    {isApproved
                      ? "You are an Approved PawGuard Foster Family!"
                      : isPending || submitSuccess
                      ? "Your Foster Application is Under Review"
                      : `Foster Status: ${fosterProfile?.status}`}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {isApproved
                      ? `Max capacity: ${fosterProfile?.max_capacity} dog(s) · Active placements: ${fosterProfile?.active_count}`
                      : "Our foster team is reviewing your profile application."}
                  </p>
                </div>
              </div>
              <Link href="/foster/dashboard">
                <Button variant="primary" size="sm">
                  Open Foster Dashboard <ArrowRight size={13} />
                </Button>
              </Link>
            </div>
          </Section>
        )}

        {/* ── FOSTER CARE OVERVIEW ─────────────────────────────────────────── */}
        <Reveal>
          <Section bg="dark" className="py-section-sm lg:py-section-md">
            <div className="flex flex-col gap-10">
              <SectionHeading eyebrow="Program Overview" eyebrowClassName="text-white/80" className="[&_h2]:text-white">
                How foster care supports rescue dogs.
              </SectionHeading>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {FOSTER_SUPPORT.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="bg-white/5 border border-white/10 rounded-card p-6 flex flex-col gap-3"
                    >
                      <span className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-white">
                        <Icon size={20} />
                      </span>
                      <h3 className="text-white font-bold text-lg">{item.title}</h3>
                      <p className="text-white/70 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </Section>
        </Reveal>

        {/* ── FOSTER APPLICATION SECTION ───────────────────────────────────── */}
        <Reveal>
          <Section id="apply" bg="default">
            <div className="max-w-2xl mx-auto flex flex-col gap-8">
              <div className="text-center flex flex-col items-center gap-2">
                <SectionHeading eyebrow="Application" align="center">
                  Apply to Foster
                </SectionHeading>
                <p className="text-muted-foreground text-sm max-w-lg">
                  Submit your foster care preferences and availability to join PawGuard's foster family network.
                </p>
              </div>

              {!isAuthenticated ? (
                <Card className="p-8 text-center flex flex-col items-center gap-4">
                  <Home size={40} className="text-primary" />
                  <h3 className="text-foreground font-serif font-bold text-xl">
                    Sign in to submit your Foster Application
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-md">
                    Please sign in or create an account to apply for the PawGuard Foster Program.
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => openAuthDialog("sign-in")}
                  >
                    Sign In / Register to Apply
                  </Button>
                </Card>
              ) : submitSuccess || isPending || isApproved ? (
                <Card className="p-8 text-center flex flex-col items-center gap-4 bg-emerald-500/5 border-emerald-500/20">
                  <CheckCircle2 size={48} className="text-emerald-600" />
                  <h3 className="text-foreground font-serif font-bold text-2xl">
                    {isApproved ? "You are an Approved Foster Family!" : "Foster Application Submitted"}
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-md">
                    {isApproved
                      ? "Your account is approved for foster placements. You can view placement updates and status on your dashboard."
                      : "Thank you for applying. Your foster profile application has been received and is currently under review by our team."}
                  </p>
                  <Link href="/foster/dashboard">
                    <Button variant="primary" size="lg">
                      Go to Foster Dashboard <ArrowRight size={15} />
                    </Button>
                  </Link>
                </Card>
              ) : (
                <Card className="p-6 sm:p-8">
                  <form onSubmit={handleSubmitApplication} className="flex flex-col gap-6">
                    {submitError && (
                      <div className="p-4 rounded-card bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3">
                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    {/* Preference Field */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="preferences" className="text-sm font-semibold text-foreground">
                        Foster Role / Care Preferences (Optional)
                      </label>
                      <select
                        id="preferences"
                        value={preferences}
                        onChange={(e) => setPreferences(e.target.value)}
                        className="w-full rounded-card border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      >
                        <option value="">Select a preferred foster role (Optional)</option>
                        <option value="Medical Recovery Foster">Medical Recovery Foster</option>
                        <option value="Puppy & Litter Foster">Puppy & Litter Foster</option>
                        <option value="Behavioral Recovery Foster">Behavioral Recovery Foster</option>
                        <option value="Short-Term Emergency Foster">Short-Term Emergency Foster</option>
                        <option value="General Foster Care">General Foster Care</option>
                      </select>
                    </div>

                    {/* Maximum Capacity Field */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="maxCapacity" className="text-sm font-semibold text-foreground">
                        Maximum Foster Capacity (Optional, Default: 1)
                      </label>
                      <input
                        id="maxCapacity"
                        type="number"
                        min="1"
                        step="1"
                        value={maxCapacity}
                        onChange={(e) => setMaxCapacity(e.target.value)}
                        placeholder="1"
                        className={`w-full rounded-card border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                          fieldErrors.max_capacity ? "border-destructive" : "border-border"
                        }`}
                      />
                      {fieldErrors.max_capacity && (
                        <span className="text-xs text-destructive">{fieldErrors.max_capacity}</span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        Maximum number of dogs you can accommodate concurrently in your home.
                      </span>
                    </div>

                    {/* Notes & Experience Field */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="notes" className="text-sm font-semibold text-foreground">
                        Additional Notes & Pet Experience (Optional)
                      </label>
                      <textarea
                        id="notes"
                        rows={4}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Tell us about your home environment, past experience with dogs, or any specific availability..."
                        className="w-full rounded-card border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-y"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full mt-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting Application..." : "Submit Foster Application"}
                    </Button>
                  </form>
                </Card>
              )}
            </div>
          </Section>
        </Reveal>

        {/* ── FOSTER ROLES ─────────────────────────────────────────────────── */}
        <Reveal>
          <Section id="roles" bg="card">
            <div className="flex flex-col gap-12">
              <div>
                <SectionHeading eyebrow="Foster Categories">
                  Choose a foster role that fits your home.
                </SectionHeading>
                <p className="text-muted-foreground text-base mt-2 max-w-[640px]">
                  Whether you have two weeks or several months, a quiet apartment or a spacious home — there is a dog needing a temporary placement.
                </p>
              </div>

              <StaggerGrid className="grid-cols-1 lg:grid-cols-2 gap-8">
                {FOSTER_ROLES.map((role) => (
                  <StaggerItem key={role.title}>
                    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-all duration-fast">
                      <div className="aspect-[16/9] bg-secondary overflow-hidden relative">
                        <img
                          src={role.img}
                          alt={role.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge variant="default">{role.commitment}</Badge>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col gap-4 flex-1">
                        <div>
                          <h3 className="text-foreground font-bold text-xl">{role.title}</h3>
                          <p className="text-muted-foreground text-sm mt-1.5 leading-relaxed">
                            {role.desc}
                          </p>
                        </div>

                        <div className="border-t border-border pt-4 mt-auto flex flex-col gap-2">
                          <p className="text-xs font-semibold text-foreground uppercase tracking-wider font-condensed">
                            Requirements:
                          </p>
                          {role.requirements.map((req) => (
                            <div key={req} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Check size={14} className="text-primary shrink-0" />
                              <span>{req}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </div>
          </Section>
        </Reveal>

        {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
        <Reveal>
          <Section bg="default">
            <div className="flex flex-col gap-12">
              <SectionHeading eyebrow="Process">
                How foster placements work
              </SectionHeading>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {HOW_IT_WORKS.map((step) => (
                  <div key={step.step} className="flex flex-col gap-3">
                    <span className="text-primary font-serif font-bold text-3xl leading-none">
                      {step.step}
                    </span>
                    <h3 className="text-foreground font-bold text-base">{step.title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </Reveal>

        {/* ── FAQS ─────────────────────────────────────────────────────────── */}
        <Reveal>
          <Section bg="card">
            <div className="max-w-3xl mx-auto flex flex-col gap-8">
              <div className="text-center flex flex-col items-center gap-2">
                <SectionHeading eyebrow="Common Questions">
                  Frequently Asked Questions
                </SectionHeading>
                <p className="text-muted-foreground text-sm">
                  Essential information about PawGuard foster care.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {FAQS.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div
                      key={faq.q}
                      className="border border-border rounded-card bg-background overflow-hidden transition-all duration-fast"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-foreground text-base hover:text-primary transition-colors"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          size={18}
                          className={`shrink-0 transition-transform duration-fast ${
                            isOpen ? "rotate-180 text-primary" : "text-muted-foreground"
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-border/50 pt-3">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Section>
        </Reveal>

        {/* ── BOTTOM CTA SECTION ───────────────────────────────────────────── */}
        <Reveal>
          <Section bg="default" containerWidth="narrow">
            <div className="text-center flex flex-col gap-6 items-center">
              <h2 className="text-foreground font-serif font-bold text-3xl lg:text-4xl leading-tight tracking-tight">
                Ready to foster a rescue dog?
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed max-w-[540px]">
                Join PawGuard's foster network. Every foster placement opens shelter space and gives a dog a safe home to heal.
              </p>
              <div className="flex gap-4 flex-wrap justify-center">
                {!isAuthenticated ? (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => openAuthDialog("sign-in")}
                  >
                    Apply to Foster <ArrowRight size={15} />
                  </Button>
                ) : isApproved || isPending || submitSuccess ? (
                  <Link href="/foster/dashboard">
                    <Button variant="primary" size="lg">
                      Go to Foster Dashboard <ArrowRight size={15} />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => {
                      const el = document.getElementById("apply");
                      if (el) scrollTo(el);
                    }}
                  >
                    Apply to Foster <ArrowRight size={15} />
                  </Button>
                )}
                <Link href="/volunteer">
                  <Button variant="outline" size="lg">
                    Explore Volunteer Roles
                  </Button>
                </Link>
              </div>
            </div>
          </Section>
        </Reveal>
      </main>
    </PageShell>
  );
}
