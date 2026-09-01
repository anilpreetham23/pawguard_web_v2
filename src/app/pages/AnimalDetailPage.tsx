"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Home,
  MapPin,
  PawPrint,
  Ruler,
  Scale,
  Shield,
  CheckCircle2,
  Heart,
  Sparkles,
} from "lucide-react";
import { PageShell, Section, Card, Reveal, Button, Input, Textarea, Badge, EmptyState, SuccessState, Skeleton, Alert } from "../components/pawguard";
import SectionHeading from "../components/SectionHeading";
import AdoptionCard from "../components/AdoptionCard";
import { StaggerGrid, StaggerItem } from "../components/pawguard";
import { InteractiveImage } from "../../motion/components/InteractiveImage";
import { cn } from "../components/ui/utils";
import { getAnimalBySlug, ANIMALS } from "../data/animals";
import { useApiQuery, getErrorMessage, QUERY_KEYS } from "@/lib/api";
import { adoptionService } from "@/services/api/adoption";
import { dogProfileToPet, type Pet } from "@/services/api/adoption/mapper";
import { useAuth } from "../providers/auth-provider";
import { useAdoptionApplicationsAll } from "../hooks/useAdoptionApplicationsAll";
import { useQueryClient } from "@tanstack/react-query";
import { ensureScrollUnlocked, refreshScroll } from "@/motion/scroll";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";

const energyLabels: Record<string, string> = {
  Low: "Easy-going",
  Medium: "Balanced",
  High: "High energy",
};

const SIZE_LABEL: Record<"small" | "medium" | "large", string> = {
  small: "Small",
  medium: "Medium",
  large: "Large",
};

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof PawPrint;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon size={16} className="text-primary" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-muted-foreground text-2xs font-semibold tracking-wider uppercase font-condensed">
          {label}
        </span>
        <span className="text-foreground font-semibold text-sm truncate">{value}</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: "available" | "pending" | "adopted" }) {
  const map = {
    available: { label: "Available", cls: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" },
    pending: { label: "Application pending", cls: "bg-amber-500/10 text-amber-700 border-amber-500/20" },
    adopted: { label: "Adopted", cls: "bg-muted text-muted-foreground border-border" },
  } as const;
  const s = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1.5 text-2xs font-semibold tracking-wider uppercase rounded-full border",
        s.cls,
      )}
    >
      {s.label}
    </span>
  );
}

const PET_TONE_GRADIENTS: Record<string, string> = {
  amber: "from-amber-200/90 via-orange-100 to-amber-100",
  purple: "from-violet-200/90 via-purple-100 to-indigo-100",
  sky: "from-sky-200/90 via-cyan-100 to-sky-100",
  rose: "from-rose-200/90 via-pink-100 to-rose-100",
  teal: "from-teal-200/90 via-emerald-100 to-teal-100",
};

function AdoptionApplicationModal({
  petName,
  dogId,
  isOpen,
  onClose,
  onSuccess,
}: {
  petName: string;
  dogId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    residentialStatus: "owned",
    hasLandlordApproval: true,
    hasYardFence: true,
    householdMembersCount: "1",
    existingPetsMedicalDetails: "",
    petCareExperience: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);

    const promise = dogId
      ? adoptionService.submitApplication({
          dog_id: dogId,
          residential_status: form.residentialStatus,
          has_landlord_approval:
            form.residentialStatus === "rented" ? form.hasLandlordApproval : undefined,
          has_yard_fence: form.hasYardFence,
          household_members_count: Math.min(20, Math.max(1, parseInt(String(form.householdMembersCount), 10) || 1)),
          existing_pets_medical_details: form.existingPetsMedicalDetails.trim() || null,
          pet_care_experience: form.petCareExperience.trim() || null,
        })
      : new Promise((resolve) => setTimeout(resolve, 800));

    promise
      .then(() => {
        if (dogId) {
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adoption.applications });
        }
        onSuccess();
        onClose();
      })
      .catch((err) => setSubmitError(getErrorMessage(err)))
      .finally(() => setSubmitting(false));
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[600px] w-full p-6 sm:p-8 rounded-card border-border bg-card shadow-2xl gap-6">
        <DialogHeader className="text-left gap-2 pr-8">
          <Badge variant="neutral">Adoption Screening</Badge>
          <DialogTitle className="font-serif font-bold text-2xl sm:text-3xl text-foreground">
            Adoption Application for {petName}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Please complete the screening details below so our adoption team can review your application.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {submitError && (
            <Alert variant="error" title="Couldn't submit your application">
              {submitError}
            </Alert>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-foreground text-xs font-semibold tracking-wider uppercase font-condensed">
              Housing Arrangement *
            </label>
            <select
              value={form.residentialStatus}
              onChange={(e) => setForm({ ...form, residentialStatus: e.target.value })}
              className="w-full bg-background border border-border rounded-btn px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-standard"
              required
            >
              <option value="owned">I own my home</option>
              <option value="rented">I rent (Landlord approval required)</option>
              <option value="other">Other housing arrangement</option>
            </select>
          </div>

          {form.residentialStatus === "rented" && (
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-muted/40 rounded-card border border-border">
              <input
                type="checkbox"
                checked={form.hasLandlordApproval}
                onChange={(e) => setForm({ ...form, hasLandlordApproval: e.target.checked })}
                className="w-4 h-4 accent-primary rounded shrink-0"
              />
              <span className="text-sm text-foreground">
                I have explicit landlord approval to keep a dog in my residence
              </span>
            </label>
          )}

          <label className="flex items-center gap-3 cursor-pointer p-3 bg-muted/40 rounded-card border border-border">
            <input
              type="checkbox"
              checked={form.hasYardFence}
              onChange={(e) => setForm({ ...form, hasYardFence: e.target.checked })}
              className="w-4 h-4 accent-primary rounded shrink-0"
            />
            <span className="text-sm text-foreground">
              Residence has a secure enclosed yard / fenced outdoor space
            </span>
          </label>

          <div className="flex flex-col gap-2">
            <label className="text-foreground text-xs font-semibold tracking-wider uppercase font-condensed">
              Household Members Count
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={form.householdMembersCount}
              onFocus={(e) => e.currentTarget.select()}
              onMouseUp={(e) => {
                if (e.currentTarget.selectionStart === e.currentTarget.selectionEnd) {
                  e.currentTarget.select();
                }
              }}
              onChange={(e) => {
                setForm({ ...form, householdMembersCount: e.target.value });
              }}
              onBlur={() => {
                const parsed = parseInt(String(form.householdMembersCount), 10);
                if (isNaN(parsed) || parsed < 1) {
                  setForm({ ...form, householdMembersCount: "1" });
                } else if (parsed > 20) {
                  setForm({ ...form, householdMembersCount: "20" });
                } else {
                  setForm({ ...form, householdMembersCount: String(parsed) });
                }
              }}
              className="w-full bg-background border border-border rounded-btn px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-standard"
            />
          </div>

          <Textarea
            label="Existing Pets & Medical Details (Optional)"
            placeholder="List any pets currently living in your household and their vaccination status..."
            value={form.existingPetsMedicalDetails}
            onChange={(e) => setForm({ ...form, existingPetsMedicalDetails: e.target.value })}
            rows={2}
          />

          <Textarea
            label="Pet Care Experience (Optional)"
            placeholder="Briefly describe your experience caring for dogs or animals..."
            value={form.petCareExperience}
            onChange={(e) => setForm({ ...form, petCareExperience: e.target.value })}
            rows={2}
          />

          <div className="pt-3 border-t border-border flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="md" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={submitting}>
              Submit Application
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function LivePetDetailPage({ id }: { id: string }) {
  const {
    data: pet,
    isLoading,
    isError,
    error,
  } = useApiQuery({
    queryKey: QUERY_KEYS.adoption.pet(id),
    queryFn: () => adoptionService.getDog(id).then(dogProfileToPet),
  });

  const { isAuthenticated, openAuthDialog } = useAuth();
  // NOTE: Public adoption dog profiles (DogProfileResponse) do not currently
  // include safety-tag fields, and GET /dogs/{dog_id}/qr-image is staff-only.
  // Therefore a PawGuard Safety Tag section cannot be rendered here until the
  // backend exposes safety-tag metadata or a public QR image endpoint.
  // Real-backend duplicate-adoption guard: any application the signed-in user
  // has for this dog (other than a rejected one) locks out a second application.
  const { applications: myApplications } = useAdoptionApplicationsAll(isAuthenticated);
  const dogApplication =
    myApplications.find((app) => app.dog_id === id && app.status !== "rejected") ??
    null;
  const alreadyAdopted =
    !!dogApplication &&
    (dogApplication.status === "approved" || dogApplication.status === "completed");
  const applicationPending = !!dogApplication && !alreadyAdopted;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    ensureScrollUnlocked();
    refreshScroll();
    const t = setTimeout(() => {
      refreshScroll();
    }, 200);
    return () => clearTimeout(t);
  }, [pet, isLoading]);

  if (isLoading) {
    return (
      <PageShell>
        <main id="main-content" className="flex-1 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-height)+1.5rem)]">
          <Skeleton className="h-4 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            <Skeleton className="aspect-[4/5] rounded-img" />
            <div className="flex flex-col gap-5">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-14 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </main>
      </PageShell>
    );
  }

  if (isError || !pet) {
    return (
      <PageShell>
        <main
          id="main-content"
          className="flex-1 flex items-center justify-center px-6 pt-[var(--header-height)]"
        >
          <div className="max-w-[560px] w-full">
            <Alert variant="error" title="We couldn't find that dog">
              {isError ? getErrorMessage(error) : "The profile may have been removed."}
            </Alert>
            <div className="mt-5">
              <EmptyState
                icon="search"
                title="Profile unavailable"
                description="The dog may have been adopted or moved. Browse our currently available dogs instead."
                action={{ label: "Browse available dogs", to: "/adopt" }}
              />
            </div>
          </div>
        </main>
      </PageShell>
    );
  }

  const allImages = Array.from(
    new Set(
      [
        ...(pet.image_urls ?? []),
        ...(pet.photo_gallery_urls ?? []),
        pet.img,
      ].filter((url): url is string => Boolean(url && url.trim()))
    )
  );
  const activeImage = allImages[selectedImageIndex] || allImages[0];

  const isAvailable = pet.adoptionBadge !== "adopted";
  const factChips: Array<{ icon: typeof Scale; label: string; value: string }> = [
    { icon: CalendarDays, label: "Age", value: pet.age },
    { icon: Scale, label: "Size", value: SIZE_LABEL[pet.size] },
    { icon: Home, label: "Weight", value: pet.weight },
    { icon: MapPin, label: "Location", value: pet.location },
    { icon: Sparkles, label: "Colour", value: pet.color },
  ];

  function handleApplyClick() {
    if (!isAvailable || alreadyAdopted || applicationPending) return;
    if (!isAuthenticated) {
      openAuthDialog("sign-in");
      return;
    }
    setIsModalOpen(true);
  }

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-height)+1.5rem)]">
          <Link
            href="/adopt"
            className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-primary transition-colors duration-fast group"
          >
            <ArrowLeft size={15} className="transition-transform duration-fast group-hover:-translate-x-0.5" />
            Back to all dogs
          </Link>
        </div>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-stretch">
              <div className="flex flex-col gap-3">
                {activeImage ? (
                  <InteractiveImage
                    src={activeImage}
                    alt={`${pet.name} — ${pet.breed}`}
                    variant="hero"
                    aspectRatio="4/5"
                    className="rounded-img shadow-lg"
                    onImageLoad={() => refreshScroll()}
                  />
                ) : (
                  <div
                    className={cn(
                      "aspect-[4/5] rounded-img shadow-lg overflow-hidden relative bg-gradient-to-br",
                      PET_TONE_GRADIENTS[pet.tone] ?? PET_TONE_GRADIENTS.amber,
                    )}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[9rem] leading-none drop-shadow-sm select-none">
                        {pet.emoji}
                      </span>
                    </div>
                  </div>
                )}

                {allImages.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {allImages.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImageIndex(idx)}
                        className={cn(
                          "relative w-16 h-16 rounded-md overflow-hidden border-2 transition-all shrink-0",
                          selectedImageIndex === idx
                            ? "border-primary shadow-sm scale-105"
                            : "border-transparent opacity-70 hover:opacity-100",
                        )}
                      >
                        <img
                          src={imgUrl}
                          alt={`${pet.name} photo ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center gap-8">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-primary text-xs font-semibold tracking-widest uppercase font-condensed">
                      Dog
                    </span>
                    <span className="w-2 h-2 rounded-full bg-primary/30" />
                    <span className="text-muted-foreground text-xs font-semibold tracking-widest uppercase font-condensed">
                      {pet.breed}
                    </span>
                  </div>
                  <h1 className="font-serif font-bold text-5xl lg:text-6xl leading-none tracking-tight text-foreground">
                    {pet.name}
                  </h1>
                  <p className="text-muted-foreground text-lg leading-relaxed max-w-[520px]">
                    {pet.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-5 bg-card border border-border rounded-card">
                  {factChips.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex flex-col gap-1.5">
                      <Icon size={15} className="text-primary/70" />
                      <span className="text-muted-foreground text-2xs font-semibold tracking-wider uppercase">{label}</span>
                      <span className="text-foreground text-sm font-semibold">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {pet.vaccinationStatus === "up-to-date" && (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      <CheckCircle2 size={12} /> Vaccinated
                    </span>
                  )}
                  {pet.adoptionBadge === "recent" && (
                    <span className="inline-flex items-center gap-1.5 bg-destructive/10 text-destructive text-xs font-semibold px-2.5 py-1 rounded-full">
                      Urgent — needs a home fast
                    </span>
                  )}
                  {pet.healthStatus === "healthy" && (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      <Shield size={12} /> Health-checked
                    </span>
                  )}
                </div>

                {alreadyAdopted ? (
                  <SuccessState
                    icon={CheckCircle2}
                    title="Already Adopted by You"
                    description={`You have already adopted ${pet.name}. This dog is part of your account - book veterinary visits, set smart reminders, and manage it from My Pets.`}
                    action={{ label: "Go to My Pets", to: "/account/pets" }}
                    secondaryAction={{ label: "View My Applications", to: "/applications" }}
                  />
                ) : applicationPending ? (
                  <Alert variant="info" title="Application Already Submitted">
                    You&apos;ve already submitted an application for {pet.name}. Our team is reviewing it - track its progress in My Applications.
                    <div className="mt-4">
                      <Button asLink={{ href: "/applications" }} variant="outline" size="md">
                        View My Applications
                      </Button>
                    </div>
                  </Alert>
                ) : !submitted ? (
                  <div className="flex flex-col gap-3">
                    {!isAuthenticated && (
                      <p className="text-muted-foreground text-xs">
                        You&apos;ll need to sign in to submit an application. Clicking apply will open the sign-in dialog.
                      </p>
                    )}
                    <Button
                      variant={isAvailable ? "primary" : "outline"}
                      size="lg"
                      onClick={handleApplyClick}
                      disabled={!isAvailable}
                    >
                      {isAvailable ? <>Apply to adopt {pet.name}</> : <>Already adopted</>}
                    </Button>
                  </div>
                ) : (
                  <SuccessState
                    icon={Heart}
                    title={`Application received for ${pet.name}`}
                    description="Our adoption team will review your details and get back to you within 2 business days to arrange a meet & greet."
                    impact={{
                      value: `${pet.name}`,
                      label: "We'll personally review your application against this profile",
                    }}
                    action={{ label: "Browse more dogs", to: "/adopt" }}
                    secondaryAction={{ label: "Contact us", to: "/contact" }}
                  />
                )}
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <Section>
            <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-10 lg:gap-16">
              <div className="flex flex-col gap-6">
                <SectionHeading eyebrow="About them">
                  Meet {pet.name}
                </SectionHeading>
                <p className="text-foreground text-lg leading-relaxed">{pet.description}</p>
                <div className="flex flex-col gap-4">
                  <h3 className="text-foreground font-bold text-lg">Medical history</h3>
                  <p className="text-muted-foreground text-base leading-relaxed">{pet.medicalHistory}</p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <SectionHeading eyebrow="A good match for" as="h3">
                  {pet.name.split(" ")[0]}'s personality
                </SectionHeading>
                <ul className="flex flex-col gap-3">
                  {pet.personalityTraits.map((trait) => (
                    <li key={trait} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={13} className="text-primary" />
                      </span>
                      <span className="text-foreground text-base">{trait}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>
        </Reveal>

        <Reveal>
          <Section bg="card">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-grid-md">
              {[
                { title: "Care & attention", desc: "A dedicated care plan covering feeding, exercise, and daily enrichment." },
                { title: "Responsible rehoming", desc: "Every adoption includes a full medical history and ongoing support." },
                { title: "Adjustment period", desc: "We support both of you for the first 30 days in your home." },
              ].map((c, i) => (
                <Card key={c.title} variant="elevated" className="gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Home size={16} className="text-primary" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="font-mono text-primary text-xs font-bold">0{i + 1}</span>
                    <p className="text-foreground font-semibold text-base leading-snug">{c.title}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{c.desc}</p>
                  </div>
                </Card>
              ))}
            </div>
          </Section>
        </Reveal>

        <RelatedPets pet={pet} />
        <AdoptionApplicationModal
          petName={pet.name}
          dogId={id}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => setSubmitted(true)}
        />
      </main>
    </PageShell>
  );
}

function RelatedPets({ pet }: { pet: Pet }) {
  const { data: related = [] } = useApiQuery({
    queryKey: [...QUERY_KEYS.adoption.pets, "related", pet.id],
    queryFn: () => adoptionService.getRelatedDogs(pet.breed, pet.id, 3),
    select: (dogs) => dogs.map(dogProfileToPet),
  });

  if (related.length === 0) return null;

  return (
    <Reveal>
      <Section>
        <div className="flex flex-col gap-8">
          <SectionHeading eyebrow="Still looking">
            Meet more dogs waiting for a home
          </SectionHeading>
          <StaggerGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-grid-md">
            {related.map((relatedPet) => (
              <StaggerItem key={relatedPet.id}>
                <AdoptionCard
                  name={relatedPet.name}
                  breed={relatedPet.breed}
                  age={relatedPet.age}
                  gender={relatedPet.gender === "female" ? "Female" : "Male"}
                  desc={relatedPet.description}
                  temperament={relatedPet.personalityTraits.join(", ")}
                  vaccinated={relatedPet.vaccinationStatus === "up-to-date"}
                  newArrival={(relatedPet.addedDaysAgo ?? 99) <= 14}
                  slug={relatedPet.id}
                  emoji={relatedPet.emoji}
                  tone={relatedPet.tone}
                />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </Section>
    </Reveal>
  );
}

export default function AnimalDetailPage({ slug }: { slug?: string }) {
  const animal = getAnimalBySlug(slug ?? "");

  const { isAuthenticated, openAuthDialog } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [favourite, setFavourite] = useState(false);

  useEffect(() => {
    ensureScrollUnlocked();
    refreshScroll();
    const t = setTimeout(() => {
      refreshScroll();
    }, 200);
    return () => clearTimeout(t);
  }, [animal]);

  if (!animal) {
    // Live adoption profiles address detail pages by UUID (mock slugs are
    // simple names) — defer to the API-backed Pet view.
    if (slug) {
      return <LivePetDetailPage id={slug} />;
    }
    return (
      <PageShell>
        <main
          id="main-content"
          className="flex-1 flex items-center justify-center px-6 pt-[var(--header-height)]"
        >
          <EmptyState
            icon="search"
            title="We couldn't find that dog"
            description="The profile may have been adopted or moved. Browse our currently available dogs."
            action={{ label: "Browse available dogs", to: "/adopt" }}
          />
        </main>
      </PageShell>
    );
  }

  const isAvailable = animal.status === "available";
  const related = ANIMALS.filter((a) => a.slug !== animal.slug && a.status === "available").slice(0, 3);

  function handleApplyClick() {
    if (!isAvailable) return;
    if (!isAuthenticated) {
      openAuthDialog("sign-in");
      return;
    }
    setIsModalOpen(true);
  }

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        {/* ── Breadcrumb + back ─────────────────────────────────────────── */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-height)+1.5rem)]">
          <Link
            href="/adopt"
            className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-primary transition-colors duration-fast group"
          >
            <ArrowLeft size={15} className="transition-transform duration-fast group-hover:-translate-x-0.5" />
            Back to all dogs
          </Link>
        </div>

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-stretch">
              {/* Image */}
              <div className="relative">
                <InteractiveImage
                  src={animal.img}
                  alt={`${animal.name} — ${animal.breed}, ${animal.age}, ${animal.gender}`}
                  variant="hero"
                  aspectRatio="4/5"
                  className="rounded-img shadow-lg"
                  onImageLoad={() => refreshScroll()}
                  overlay={
                    <div className="absolute bottom-0 left-0 right-0 p-5 flex items-center justify-between">
                      <StatusBadge status={animal.status} />
                      <button
                        onClick={() => setFavourite((v) => !v)}
                        aria-label={favourite ? "Remove from favourites" : "Add to favourites"}
                        className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:bg-white transition-colors duration-fast"
                      >
                        <Heart
                          size={18}
                          className={cn(
                            "transition-colors duration-fast",
                            favourite ? "text-destructive fill-destructive" : "text-foreground",
                          )}
                        />
                      </button>
                    </div>
                  }
                />
              </div>

              {/* Identity + story */}
              <div className="flex flex-col justify-center gap-8">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-primary text-xs font-semibold tracking-widest uppercase font-condensed">
                      {animal.species}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-primary/30" />
                    <span className="text-muted-foreground text-xs font-semibold tracking-widest uppercase font-condensed">
                      {animal.breed}
                    </span>
                  </div>
                  <h1 className="font-serif font-bold text-5xl lg:text-6xl leading-none tracking-tight text-foreground">
                    {animal.name}
                  </h1>
                  <p className="text-muted-foreground text-lg leading-relaxed max-w-[520px]">
                    {animal.desc}
                  </p>
                </div>

                {/* Facts grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-5 bg-card border border-border rounded-card">
                  <Fact icon={CalendarDays} label="Age" value={animal.age} />
                  <Fact icon={Scale} label="Size" value={animal.size} />
                  <Fact icon={MapPin} label="Location" value={animal.location} />
                  <Fact icon={PawPrint} label="Temperament" value={animal.temperament} />
                  <Fact icon={Ruler} label="Good with" value={animal.goodWith.slice(0, 2).join(", ")} />
                  <Fact icon={Sparkles} label="Energy" value={energyLabels[animal.energy]} />
                </div>

                {/* Health chips */}
                <div className="flex flex-wrap gap-2">
                  {animal.vaccinated && (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      <CheckCircle2 size={12} /> Vaccinated
                    </span>
                  )}
                  {animal.microchipped && (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      <Shield size={12} /> Microchipped
                    </span>
                  )}
                  {animal.urgent && (
                    <span className="inline-flex items-center gap-1.5 bg-destructive/10 text-destructive text-xs font-semibold px-2.5 py-1 rounded-full">
                      Urgent — needs a home fast
                    </span>
                  )}
                </div>

                {/* Apply CTA */}
                {!submitted ? (
                  <div className="flex flex-col gap-3">
                    {!isAuthenticated && (
                      <p className="text-muted-foreground text-xs">
                        You&apos;ll need to sign in to submit an application. Clicking apply will open the sign-in dialog.
                      </p>
                    )}
                    <Button
                      variant={isAvailable ? "primary" : "outline"}
                      size="lg"
                      onClick={handleApplyClick}
                      disabled={!isAvailable}
                    >
                      {isAvailable ? <>Apply to adopt {animal.name}</> : <>Already adopted</>}
                    </Button>
                  </div>
                ) : (
                  <SuccessState
                    icon={Heart}
                    title={`Application received for ${animal.name}`}
                    description="Our adoption team will review your details and get back to you within 2 business days to arrange a meet & greet."
                    impact={{
                      value: `${animal.name}`,
                      label: "We'll personally review your application against this profile",
                    }}
                    action={{ label: "Browse more dogs", to: "/adopt" }}
                    secondaryAction={{ label: "Contact us", to: "/contact" }}
                  />
                )}
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── Story ─────────────────────────────────────────────────────── */}
        <Reveal>
          <Section>
            <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-10 lg:gap-16">
              <div className="flex flex-col gap-6">
                <SectionHeading eyebrow="Their story">
                  How {animal.name} came to PawGuard
                </SectionHeading>
                <p className="text-foreground text-lg leading-relaxed">{animal.story}</p>
              </div>

              <div className="flex flex-col gap-5">
                <SectionHeading eyebrow="A good match for" as="h3">
                  Who {animal.name} suits best
                </SectionHeading>
                <ul className="flex flex-col gap-3">
                  {animal.goodWith.map((g) => (
                    <li key={g} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={13} className="text-primary" />
                      </span>
                      <span className="text-foreground text-base">{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>
        </Reveal>

        {/* ── Care needs ─────────────────────────────────────────────────── */}
        <Reveal>
          <Section bg="card">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-grid-md">
              {animal.care.map((c, i) => (
                <Card key={c} variant="elevated" className="gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Home size={16} className="text-primary" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="font-mono text-primary text-xs font-bold">0{i + 1}</span>
                    <p className="text-foreground font-semibold text-base leading-snug">{c}</p>
                  </div>
                </Card>
              ))}
            </div>
          </Section>
        </Reveal>

        {/* ── More animals ──────────────────────────────────────────────── */}
        {related.length > 0 && (
          <Reveal>
            <Section>
              <div className="flex flex-col gap-8">
                <SectionHeading eyebrow="Still looking">
                  Meet more dogs waiting for a home
                </SectionHeading>
                <StaggerGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-grid-md">
                  {related.map((a) => (
                    <StaggerItem key={a.slug}>
                      <AdoptionCard {...a} />
                    </StaggerItem>
                  ))}
                </StaggerGrid>
              </div>
            </Section>
          </Reveal>
        )}
        <AdoptionApplicationModal
          petName={animal.name}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => setSubmitted(true)}
        />
      </main>
    </PageShell>
  );
}