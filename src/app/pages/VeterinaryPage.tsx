"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  Phone,
  Mail,
  Navigation,
  Syringe,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Info,
  X,
  MapPin,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import SectionHeading from "../components/SectionHeading";
import {
  PageShell,
  Section,
  Card,
  Reveal,
  StaggerGrid,
  StaggerItem,
  EmptyState,
  Skeleton,
  Alert,
  Input,
  Button,
  Badge,
} from "../components/pawguard";
import { useVeterinaryPartners } from "../hooks/useVeterinaryPartners";
import { getErrorMessage } from "@/lib/api";
import { cn } from "../components/ui/utils";
import type { VeterinaryPartner } from "@/types";

const PAGE_SIZE = 9;

const TONE_GRADIENTS: Record<string, string> = {
  cyan: "from-cyan-200/90 via-sky-100 to-cyan-100",
  teal: "from-teal-200/90 via-emerald-100 to-teal-100",
  indigo: "from-indigo-200/90 via-violet-100 to-indigo-100",
  amber: "from-amber-200/90 via-orange-100 to-amber-100",
  rose: "from-rose-200/90 via-pink-100 to-rose-100",
  emerald: "from-emerald-200/90 via-green-100 to-emerald-100",
};

function PartnerPlaceholder({
  emoji,
  tone,
}: {
  emoji?: string;
  tone?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex items-center justify-center bg-gradient-to-br h-full w-full",
        TONE_GRADIENTS[tone ?? ""] ?? TONE_GRADIENTS.cyan
      )}
    >
      <span className="text-6xl leading-none drop-shadow-sm select-none">
        {emoji ?? "🏥"}
      </span>
    </div>
  );
}

function PartnerCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-card overflow-hidden shadow-sm flex flex-col">
      <Skeleton className="h-40 rounded-none" />
      <div className="p-[var(--space-6)] flex flex-col gap-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-10 w-full mt-2" />
      </div>
    </div>
  );
}

function PartnerCard({
  partner,
  onViewDetails,
}: {
  partner: VeterinaryPartner;
  onViewDetails: (partner: VeterinaryPartner) => void;
}) {
  const bookingHref = `/appointments/book?clinic_id=${partner.id}`;

  return (
    <Card variant="elevated" className="gap-0 overflow-hidden p-0 flex flex-col justify-between h-full">
      <div>
        <div className="relative">
          <div className="aspect-[7/4] relative overflow-hidden">
            <PartnerPlaceholder emoji={partner.emoji} tone={partner.tone} />
          </div>
          {partner.isEmergency && (
            <span
              className="absolute top-3 left-3 bg-destructive text-white text-2xs font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm shadow-sm"
              style={{ animation: "badge-urgent-pulse 6s ease-in-out infinite" }}
            >
              Emergency
            </span>
          )}
          {partner.directionsUrl && (
            <a
              href={partner.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-background/90 backdrop-blur border border-border text-foreground text-xs font-semibold tracking-wide uppercase px-3 py-1.5 rounded-btn shadow-sm hover:bg-card transition-colors duration-fast"
            >
              <Navigation size={13} className="text-primary" />
              Directions
            </a>
          )}
        </div>

        <div className="p-[var(--space-6)] flex flex-col gap-[var(--space-5)]">
          <div className="flex flex-col gap-1">
            <h3 className="text-foreground font-bold text-lg leading-snug">
              {partner.name}
            </h3>
            {partner.isEmergency && (
              <p className="text-destructive text-xs font-semibold tracking-wider uppercase">
                24/7 Emergency Care
              </p>
            )}
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed flex items-start gap-2">
            <Navigation
              size={15}
              className="shrink-0 mt-0.5 text-muted-foreground/70"
            />
            {partner.address}
          </p>

          {partner.services.length > 0 && (
            <ul className="flex flex-wrap gap-2" aria-label="Services offered">
              {partner.services.map((service) => (
                <li
                  key={service}
                  className="inline-flex items-center gap-1.5 bg-primary/5 text-foreground/80 text-xs font-medium px-3 py-1.5 rounded-full"
                >
                  <Syringe size={11} className="text-primary" />
                  {service}
                </li>
              ))}
            </ul>
          )}

          <div className="h-px bg-border" />

          <div className="flex flex-col gap-3">
            <a
              href={`tel:${partner.phone.replace(/[^+\d]/g, "")}`}
              className="flex items-center gap-2.5 text-muted-foreground text-sm hover:text-foreground transition-colors duration-fast"
            >
              <Phone size={15} className="shrink-0 text-primary" />
              {partner.phone}
            </a>
            {partner.email && (
              <a
                href={`mailto:${partner.email}`}
                className="flex items-center gap-2.5 text-muted-foreground text-sm hover:text-foreground transition-colors duration-fast break-all"
              >
                <Mail size={15} className="shrink-0 text-primary" />
                {partner.email}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="p-[var(--space-6)] pt-0 flex flex-col gap-2 mt-auto">
        <Button
          variant={partner.isEmergency ? "destructive" : "primary"}
          size="md"
          asLink={{ href: bookingHref }}
          className="w-full"
        >
          <CalendarDays size={15} />
          Book Appointment
        </Button>
        <Button
          variant="outline"
          size="md"
          onClick={() => onViewDetails(partner)}
          className="w-full"
        >
          <Info size={15} />
          View Details
        </Button>
      </div>
    </Card>
  );
}

function ClinicDetailModal({
  partner,
  onClose,
}: {
  partner: VeterinaryPartner;
  onClose: () => void;
}) {
  const bookingHref = `/appointments/book?clinic_id=${partner.id}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-[640px] max-h-[90vh] overflow-y-auto bg-card border border-border rounded-card shadow-2xl p-6 sm:p-8 flex flex-col gap-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted"
          aria-label="Close details"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col gap-2 pr-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="neutral">Verified Partner Clinic</Badge>
            {partner.isEmergency ? (
              <Badge variant="urgent">24/7 Emergency Care</Badge>
            ) : (
              <Badge variant="success">Standard Hours</Badge>
            )}
          </div>
          <h2 className="text-foreground font-serif font-bold text-2xl sm:text-3xl">
            {partner.name}
          </h2>
        </div>

        <div className="flex flex-col gap-4 text-sm text-muted-foreground">
          <div className="flex items-start gap-2.5">
            <MapPin size={18} className="shrink-0 mt-0.5 text-primary" />
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">Address</span>
              <span>{partner.address}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Phone size={18} className="shrink-0 text-primary" />
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">Phone</span>
              <a
                href={`tel:${partner.phone.replace(/[^+\d]/g, "")}`}
                className="hover:underline text-foreground"
              >
                {partner.phone}
              </a>
            </div>
          </div>

          {partner.email && (
            <div className="flex items-center gap-2.5">
              <Mail size={18} className="shrink-0 text-primary" />
              <div className="flex flex-col">
                <span className="font-semibold text-foreground">Email</span>
                <a
                  href={`mailto:${partner.email}`}
                  className="hover:underline text-foreground"
                >
                  {partner.email}
                </a>
              </div>
            </div>
          )}
        </div>

        {partner.services && partner.services.length > 0 && (
          <div className="flex flex-col gap-2 pt-2 border-t border-border">
            <span className="text-xs font-semibold tracking-wider uppercase font-condensed text-foreground">
              Services Offered
            </span>
            <div className="flex flex-wrap gap-2">
              {partner.services.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full"
                >
                  <Syringe size={12} />
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap sm:flex-nowrap gap-3 pt-4 border-t border-border">
          <Button
            variant="primary"
            size="lg"
            asLink={{ href: bookingHref }}
            className="w-full sm:w-auto flex-1"
          >
            <CalendarDays size={16} />
            Book Appointment at this Clinic
          </Button>
          {partner.directionsUrl && (
            <a
              href={partner.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-card border border-border text-foreground text-xs font-semibold tracking-wider uppercase px-5 py-3 rounded-btn hover:border-primary hover:text-primary transition-all duration-fast"
            >
              <Navigation size={16} />
              Directions
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VeterinaryPage() {
  const {
    data: partners = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useVeterinaryPartners();

  const [query, setQuery] = useState("");
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedPartner, setSelectedPartner] = useState<VeterinaryPartner | null>(
    null
  );

  // Reset to first page whenever search/filter changes
  useEffect(() => {
    setPage(1);
  }, [query, emergencyOnly]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return partners.filter((partner) => {
      if (emergencyOnly && !partner.isEmergency) return false;
      if (!q) return true;
      const haystack = [
        partner.name,
        partner.address,
        ...partner.services,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [partners, query, emergencyOnly]);

  const filteredCount = filtered.length;
  const emergencyCount = useMemo(
    () => partners.filter((p) => p.isEmergency).length,
    [partners]
  );

  const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagePartners = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <PageHeader
          eyebrow="Veterinary Directory"
          title="Trusted Care, Right Down the Street"
          subtitle="A verified network of partner clinics dedicated to keeping your companions healthy — including round-the-clock emergency care."
        />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-section-md lg:py-section-lg">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <aside className="lg:w-[240px] shrink-0">
              <Card className="sticky top-[88px]">
                <h3 className="text-foreground font-semibold text-xs tracking-wider uppercase mb-4">
                  Find a Clinic
                </h3>
                <Input
                  id="vet-search"
                  label="Search"
                  type="search"
                  placeholder="Name, address, service…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="h-px bg-border my-5" />
                <label className="flex items-center gap-3 cursor-pointer group min-h-[44px] py-1">
                  <input
                    type="checkbox"
                    checked={emergencyOnly}
                    onChange={(e) => setEmergencyOnly(e.target.checked)}
                    className="w-5 h-5 accent-destructive rounded border-border shrink-0"
                  />
                  <span className="text-muted-foreground text-sm group-hover:text-foreground transition-colors duration-fast">
                    Emergency only
                    {emergencyCount > 0 && (
                      <span className="ml-1.5 text-destructive font-semibold">
                        ({emergencyCount})
                      </span>
                    )}
                  </span>
                </label>
                <Button
                  variant="outline"
                  size="md"
                  className="mt-4 w-full"
                  disabled={!query && !emergencyOnly}
                  onClick={() => {
                    setQuery("");
                    setEmergencyOnly(false);
                  }}
                >
                  Clear Filters
                </Button>
              </Card>
            </aside>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground text-sm">
                  <span className="font-semibold text-foreground">
                    {isLoading ? "…" : filteredCount}
                  </span>{" "}
                  partner clinic{filteredCount === 1 ? "" : "s"} available
                </p>
              </div>

              {isLoading ? (
                <StaggerGrid key={`skeleton-${page}-${query}-${emergencyOnly}`} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-grid-md">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <StaggerItem key={i}>
                      <PartnerCardSkeleton />
                    </StaggerItem>
                  ))}
                </StaggerGrid>
              ) : isError ? (
                <Alert
                  variant="error"
                  title="Couldn't load the veterinary directory"
                >
                  {getErrorMessage(error)}{" "}
                  <button
                    onClick={() => refetch()}
                    className="font-semibold text-destructive underline underline-offset-2 hover:opacity-80 transition-opacity"
                  >
                    Retry
                  </button>
                </Alert>
              ) : filtered.length === 0 ? (
                <EmptyState
                  icon="search"
                  title={
                    partners.length === 0
                      ? "No veterinary partners yet"
                      : "No clinics match your filters"
                  }
                  description={
                    partners.length === 0
                      ? "Our partner network is growing. Check back soon for trusted clinics near you."
                      : "Try a different search or disable the emergency filter — you'll find care nearby."
                  }
                  action={
                    query || emergencyOnly
                      ? {
                          label: "Clear Filters",
                          onClick() {
                            setQuery("");
                            setEmergencyOnly(false);
                          },
                        }
                      : undefined
                  }
                />
              ) : (
                <StaggerGrid key={`${page}-${query}-${emergencyOnly}`} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-grid-md">
                  {pagePartners.map((partner) => (
                    <StaggerItem key={partner.id}>
                      <PartnerCard
                        partner={partner}
                        onViewDetails={(p) => setSelectedPartner(p)}
                      />
                    </StaggerItem>
                  ))}
                </StaggerGrid>
              )}

              {!isLoading &&
                !isError &&
                pagePartners.length > 0 &&
                totalPages > 1 && (
                  <div className="flex items-center justify-between mt-10 gap-4">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage <= 1}
                      className="inline-flex items-center gap-2 bg-card border border-border text-foreground text-xs font-semibold tracking-wider uppercase px-4 py-2.5 rounded-btn hover:border-primary hover:text-primary transition-all duration-fast disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <ChevronLeft size={15} />
                      Prev
                    </button>
                    <p className="text-muted-foreground text-sm">
                      Page{" "}
                      <span className="font-semibold text-foreground">
                        {currentPage}
                      </span>{" "}
                      of {totalPages}
                    </p>
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage >= totalPages}
                      className="inline-flex items-center gap-2 bg-card border border-border text-foreground text-xs font-semibold tracking-wider uppercase px-4 py-2.5 rounded-btn hover:border-primary hover:text-primary transition-all duration-fast disabled:opacity-40 disabled:pointer-events-none"
                    >
                      Next
                      <ChevronRight size={15} />
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>

        {selectedPartner && (
          <ClinicDetailModal
            partner={selectedPartner}
            onClose={() => setSelectedPartner(null)}
          />
        )}

        <Reveal>
          <Section bg="card">
            <div className="max-w-[800px] mx-auto flex flex-col gap-12">
              <SectionHeading eyebrow="Vetted Partners" align="center">
                Our Network, Their Expertise
              </SectionHeading>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-grid-md">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Verified Clinics",
                    desc: "Every partner is vetted by PawGuard so your companion always receives reputable, standard-of-care treatment.",
                  },
                  {
                    icon: Syringe,
                    title: "Full-Circle Care",
                    desc: "From routine vaccinations to specialized surgery and radiology — a single trusted place for every need.",
                  },
                  {
                    icon: Phone,
                    title: "Emergency, Day or Night",
                    desc: "Clinics marked Emergency operate round-the-clock and answer critical calls any hour, any day.",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="bg-background border border-border rounded-card p-6 flex flex-col items-center text-center gap-3 shadow-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon size={22} className="text-primary" />
                      </div>
                      <h3 className="text-foreground font-bold text-base">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </Section>
        </Reveal>
      </main>
    </PageShell>
  );
}