"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Quote,
  ArrowRight,
  BadgeCheck,
  Clock,
  CalendarDays,
} from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import PageHeader from "../components/PageHeader";
import { useFocusOnError } from "../hooks/useFocusOnError";
import { useDashboardSummary } from "../hooks/useDashboardSummary";
import {
  PageShell,
  Section,
  Button,
  Input,
  Textarea,
  Reveal,
  StaggerGrid,
  StaggerItem,
  VolunteerImpactPanel,
} from "../components/pawguard";
import { scrollTo } from "../../motion/scroll";
import { useAuth } from "../providers/auth-provider";
import { communityService } from "@/services/api/community";
import { getErrorMessage } from "@/lib/api";
import type { VolunteerProfileResponse, VolunteerStatus } from "@/lib/api";

const VOLUNTEER_STATUS_META: Record<
  VolunteerStatus,
  { label: string; hint: string; badge: string }
> = {
  applied: {
    label: "Application received",
    hint: "Our coordinator will review your application within 5 business days.",
    badge: "bg-amber-500/10 border border-amber-500/25 text-amber-700",
  },
  onboarded: {
    label: "Onboarding",
    hint: "You've been accepted — complete orientation to get started.",
    badge: "bg-sky-500/10 border border-sky-500/25 text-sky-700",
  },
  active: {
    label: "Active volunteer",
    hint: "You're an active volunteer. Thank you for your time!",
    badge: "bg-emerald-500/10 border border-emerald-500/25 text-emerald-700",
  },
  inactive: {
    label: "Inactive",
    hint: "Your volunteer profile is inactive. Re-apply to get involved again.",
    badge: "bg-muted text-muted-foreground border border-border",
  },
};

const ROLES = [
  {
    title: "Foster Care",
    desc: "Provide temporary housing for dogs recovering from injury, illness, or trauma. Training and supplies provided.",
    commitment: "2–4 weeks per placement",
    img: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&auto=format",
    quote:
      "Seeing a scared dog learn to trust again in your own home — there's nothing like it.",
    quotee: "Maya, Foster Carer",
    requirements: [
      "Home with outdoor space (dogs)",
      "No aggressive resident pets",
      "Able to administer medication",
    ],
  },
  {
    title: "Transport",
    desc: "Drive dogs between rescue sites, veterinary clinics, and foster homes. One of our highest-demand roles.",
    commitment: "4–8 hours per week",
    img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop&auto=format",
    quote: "Every trip I make means a dog is one step closer to safety.",
    quotee: "Carlos, Transport Volunteer",
    requirements: [
      "Valid driver's licence",
      "Reliable vehicle",
      "Flexible schedule",
    ],
  },
  {
    title: "Events & Outreach",
    desc: "Staff adoption events, community awareness campaigns, and fundraisers. No experience required.",
    commitment: "Events on weekends",
    img: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400&h=300&fit=crop&auto=format",
    quote:
      "I helped three dogs find homes at my first adoption event. I was hooked.",
    quotee: "Priya, Events Volunteer",
    requirements: [
      "Friendly and approachable",
      "Comfortable with public speaking",
      "18+ years old",
    ],
  },
  {
    title: "Shelter Support",
    desc: "Assist with dog feeding, enrichment, cleaning, and socialization at partner shelter facilities.",
    commitment: "4+ hours per week",
    img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop&auto=format",
    quote:
      "The dogs remember you. Every time I walk in, they know I'm there to help.",
    quotee: "James, Shelter Volunteer",
    requirements: [
      "Physical fitness for handling dogs",
      "Background check required",
      "Minimum 6-month commitment",
    ],
  },
];

const STEPS = [
  {
    num: "01",
    title: "Browse Roles",
    desc: "Review available volunteer roles and identify the best fit for your schedule and skills.",
  },
  {
    num: "02",
    title: "Submit Application",
    desc: "Complete a brief online application. We review all applications within 5 business days.",
  },
  {
    num: "03",
    title: "Orientation",
    desc: "Attend a 2-hour orientation session covering dog handling, safety, and protocols.",
  },
  {
    num: "04",
    title: "Start Volunteering",
    desc: "Get matched with your first placement and begin making a direct impact.",
  },
];

export default function VolunteerPage() {
  const { isAuthenticated, openAuthDialog } = useAuth();
  const { summary: dashboard } = useDashboardSummary();
  const volunteerProfile = (dashboard?.volunteer_profile ??
    null) as VolunteerProfileResponse | null;
  const volunteerMeta = volunteerProfile
    ? VOLUNTEER_STATUS_META[volunteerProfile.status]
    : null;
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    availability: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { setRef } = useFocusOnError(errors);

  function validateField(field: keyof typeof form, value: string) {
    const e: Record<string, string> = {};
    if (!value.trim())
      e[field] =
        `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    setErrors((prev) => ({ ...prev, ...e }));
  }

  const [formStep, setFormStep] = useState<"basic" | "details">("basic");

  function validateStep() {
    const e: Record<string, string> = {};
    if (formStep === "basic") {
      if (!form.name.trim()) e.name = "Full Name is required";
      if (!form.email.trim()) {
        e.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(form.email.trim())) {
        e.email = "Please enter a valid email address";
      }
    } else if (formStep === "details") {
      if (!form.phone.trim()) e.phone = "Phone number is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (formStep === "basic") {
      if (!validateStep()) return;
      setFormStep("details");
      return;
    }
    if (!validateStep()) return;
    if (!isAuthenticated) {
      openAuthDialog("sign-in");
      return;
    }
    setIsLoading(true);
    setHasError(false);
    setFormError("");
    setProgress(0);
    const interval = setInterval(
      () => setProgress((p) => Math.min(p + 8, 92)),
      120,
    );
    communityService
      .applyVolunteer({
        emergency_contact_name: form.name.trim(),
        emergency_contact_phone: form.phone.trim(),
        availability: form.availability.trim() || null,
        notes: form.message.trim() || null,
        skills: form.role ? `Role: ${form.role}` : null,
      })
      .then(() => {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
          setSubmitted(true);
        }, 400);
      })
      .catch((err) => {
        clearInterval(interval);
        setIsLoading(false);
        setHasError(true);
        setFormError(getErrorMessage(err));
      });
  }

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <PageHeader
          eyebrow="Get Involved"
          title="Your time saves lives directly."
          subtitle="Every volunteer hour translates to a faster rescue, a warmer foster bed, or a smoother adoption. Pick a role that fits your life."
          right={
            <div className="aspect-[4/3] lg:aspect-[16/9] bg-secondary rounded-img overflow-hidden shadow-md">
              <img
                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=640&h=480&fit=crop&auto=format"
                alt="Volunteer with rescued dogs"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          }
        >
          <div className="flex items-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                const el = document.getElementById("apply");
                if (el) scrollTo(el);
              }}
            >
              Apply to Volunteer
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                const el = document.getElementById("roles");
                if (el) scrollTo(el);
              }}
            >
              View Roles
            </Button>
          </div>
        </PageHeader>

        <Section bg="dark">
          <VolunteerImpactPanel />
        </Section>

        <Reveal>
          <Section id="roles" bg="card">
            <div className="flex flex-col gap-12">
              <SectionHeading eyebrow="Available Positions">
                Volunteer Roles
              </SectionHeading>
              <StaggerGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-grid-md">
                {ROLES.map((role) => (
                  <StaggerItem key={role.title}>
                    <div className="bg-background border border-border rounded-card overflow-hidden shadow-sm hover:shadow-glow-card hover:border-primary/20 transition-all duration-ui group flex flex-col h-full">
                      <div className="relative aspect-[4/3] bg-secondary overflow-hidden">
                        <img
                          src={role.img}
                          alt={role.title}
                          className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-gentle ease-out will-change-transform"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm text-foreground text-2xs font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
                          Make an Impact
                        </div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <p className="text-white text-xs font-semibold">
                            {role.commitment}
                          </p>
                        </div>
                      </div>
                      <div className="p-5 flex flex-col gap-3 flex-1">
                        <h3 className="text-foreground font-bold text-xl">
                          {role.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {role.desc}
                        </p>
                        <div className="bg-card border border-border rounded-lg p-4 mt-auto">
                          <Quote size={14} className="text-primary/30 mb-1" />
                          <p className="text-foreground text-sm italic leading-relaxed">
                            &ldquo;{role.quote}&rdquo;
                          </p>
                          <p className="text-muted-foreground text-xs font-medium mt-2">
                            &mdash; {role.quotee}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            const el = document.getElementById("apply");
                            if (el) scrollTo(el);
                          }}
                          className="w-full mt-1 text-center text-primary font-semibold text-xs tracking-wider uppercase py-2.5 rounded-btn border border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all duration-fast"
                        >
                          Apply for This Role
                        </button>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </div>
          </Section>
        </Reveal>

        <Reveal>
          <Section bg="default">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--space-12)] lg:gap-[var(--space-16)] items-start">
              <div className="flex flex-col gap-8">
                <SectionHeading eyebrow="Eligibility">
                  General Requirements
                </SectionHeading>
                <div className="flex flex-col gap-0">
                  {[
                    {
                      label: "Age",
                      detail:
                        "18 years or older (16+ with guardian consent for some roles)",
                    },
                    {
                      label: "Time Commitment",
                      detail: "Minimum 4 hours per week for ongoing positions",
                    },
                    {
                      label: "Background Check",
                      detail:
                        "Required for all roles involving direct dog contact",
                    },
                    {
                      label: "Training",
                      detail:
                        "2-hour orientation mandatory before first placement",
                    },
                    {
                      label: "Location",
                      detail:
                        "Must reside within 30 miles of an active facility",
                    },
                  ].map((req) => (
                    <div
                      key={req.label}
                      className="flex items-start gap-4 py-4 border-b border-border last:border-0"
                    >
                      <div className="w-5 h-5 shrink-0 bg-primary flex items-center justify-center mt-0.5 rounded-full">
                        <span className="text-primary-foreground text-2xs font-bold">
                          &#10003;
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-foreground font-semibold text-sm">
                          {req.label}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          {req.detail}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-8">
                <SectionHeading eyebrow="Process">How to Apply</SectionHeading>
                <div className="flex flex-col gap-6">
                  {STEPS.map((step) => (
                    <div key={step.num} className="flex items-start gap-5">
                      <span className="shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="font-mono text-primary font-bold text-xs">
                          {step.num}
                        </span>
                      </span>
                      <div className="flex flex-col gap-1 pt-0.5">
                        <h3 className="text-foreground font-semibold text-base">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        </Reveal>

        <Reveal>
          <Section id="apply" bg="card" containerWidth="narrow">
            <div className="flex flex-col gap-12">
              <SectionHeading eyebrow="Apply Now" align="center">
                Volunteer Application
              </SectionHeading>
              {isAuthenticated && volunteerProfile && volunteerMeta ? (
                <div
                  className="bg-background border border-border rounded-modal p-8 flex flex-col gap-5 shadow-sm"
                  role="status"
                  aria-live="polite"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <BadgeCheck size={22} />
                    </span>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-foreground font-bold text-xl">
                        Volunteer status
                      </h3>
                      <span
                        className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold tracking-wider uppercase ${volunteerMeta.badge}`}
                      >
                        {volunteerMeta.label}
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {volunteerMeta.hint}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {volunteerProfile.availability && (
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <Clock size={15} className="mt-0.5 shrink-0" />
                        <div>
                          <p className="text-foreground font-semibold text-xs uppercase tracking-wider">
                            Availability
                          </p>
                          <p>{volunteerProfile.availability}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <CalendarDays size={15} className="mt-0.5 shrink-0" />
                      <div>
                        <p className="text-foreground font-semibold text-xs uppercase tracking-wider">
                          Applied
                        </p>
                        <p>
                          {new Date(
                            volunteerProfile.created_at,
                          ).toLocaleDateString(undefined, {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    {volunteerProfile.skills && (
                      <div className="sm:col-span-2 flex flex-col gap-1.5">
                        <p className="text-foreground font-semibold text-xs uppercase tracking-wider">
                          Skills &amp; interests
                        </p>
                        <p className="text-muted-foreground">
                          {volunteerProfile.skills}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/account"
                      className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-xs font-semibold tracking-wider uppercase px-5 py-2.5 rounded-btn hover:bg-primary-hover transition-all duration-fast"
                    >
                      View your account
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ) : hasError ? (
                <div
                  className="bg-background border border-border rounded-modal p-8 flex flex-col gap-4 shadow-sm"
                  role="alert"
                >
                  <div className="w-12 h-12 bg-destructive/10 rounded-2xl flex items-center justify-center">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-destructive"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <h3 className="text-foreground font-bold text-xl">
                    Submission failed
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {formError ||
                      "We could not process your application. Please check your information and try again."}
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      setHasError(false);
                      setFormError("");
                    }}
                    className="self-start"
                  >
                    Try Again
                  </Button>
                </div>
              ) : submitted ? (
                <div
                  className="bg-background border border-border rounded-modal p-8 flex flex-col gap-4 shadow-sm animate-celebration-pop"
                  role="status"
                  aria-live="polite"
                >
                  <h3 className="text-foreground font-bold text-xl">
                    Application Received
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    Thank you for applying. Our volunteer coordinator will be in
                    touch within 5 business days to discuss next steps.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {formStep === "basic" ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input
                          label="Full Name"
                          placeholder="Jane Smith"
                          ref={setRef("name")}
                          value={form.name}
                          onChange={(e) => {
                            setForm({ ...form, name: e.target.value });
                            if (errors.name) setErrors({ ...errors, name: "" });
                          }}
                          onBlur={() => {
                            if (!form.name.trim())
                              validateField("name", form.name);
                          }}
                          error={errors.name}
                          autoComplete="name"
                        />
                        <Input
                          label="Email"
                          type="email"
                          placeholder="your@email.com"
                          ref={setRef("email")}
                          value={form.email}
                          onChange={(e) => {
                            setForm({ ...form, email: e.target.value });
                            if (errors.email)
                              setErrors({ ...errors, email: "" });
                          }}
                          onBlur={() => {
                            if (!form.email.trim())
                              validateField("email", form.email);
                          }}
                          error={errors.email}
                          autoComplete="email"
                          inputMode="email"
                        />
                      </div>
                      <p className="text-muted-foreground text-sm -mt-2">
                        You will be able to add more details in the next step.
                      </p>
                      <Button type="submit" variant="secondary" size="lg">
                        Continue <ArrowRight size={14} />
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input
                          label="Phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                          ref={setRef("phone")}
                          value={form.phone}
                          onChange={(e) => {
                            setForm({ ...form, phone: e.target.value });
                            if (errors.phone) setErrors({ ...errors, phone: "" });
                          }}
                          error={errors.phone}
                          autoComplete="tel"
                          inputMode="tel"
                        />
                        <div className="flex flex-col gap-2">
                          <label className="text-foreground text-xs font-semibold tracking-wider uppercase font-condensed">
                            Preferred Role
                          </label>
                          <select
                            value={form.role}
                            onChange={(e) =>
                              setForm({ ...form, role: e.target.value })
                            }
                            aria-label="Preferred Role"
                            className="w-full h-12 bg-input-background border border-border rounded-input px-4 text-foreground text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-standard"
                          >
                            <option value="">Select a role</option>
                            {ROLES.map((r) => (
                              <option key={r.title}>{r.title}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <Input
                        label="Availability"
                        placeholder="e.g. Weekday evenings, Saturday mornings"
                        value={form.availability}
                        onChange={(e) =>
                          setForm({ ...form, availability: e.target.value })
                        }
                      />
                      <Textarea
                        label="Message (Optional)"
                        placeholder="Tell us about your experience with dogs..."
                        value={form.message}
                        onChange={(e) =>
                          setForm({ ...form, message: e.target.value })
                        }
                        maxLength={500}
                        rows={4}
                      />
                      <div className="flex flex-col gap-2">
                        {isLoading && (
                          <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all duration-gentle ease-out"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        )}
                        <div className="flex gap-3">
                          <Button
                            type="button"
                            variant="ghost"
                            size="md"
                            onClick={() => setFormStep("basic")}
                          >
                            Back
                          </Button>
                          <Button
                            type="submit"
                            variant="secondary"
                            size="lg"
                            isLoading={isLoading}
                            context="volunteer"
                            className="flex-1"
                          >
                            Submit Application
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </form>
              )}
            </div>
          </Section>
        </Reveal>
      </main>
    </PageShell>
  );
}
