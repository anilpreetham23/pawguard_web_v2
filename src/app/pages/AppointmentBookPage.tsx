"use client";

import { useCallback, useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, Stethoscope, PawPrint, Building2, CheckCircle2 } from "lucide-react";
import { PageShell, Card, Reveal, Alert, Button, Input, Textarea, Skeleton, EmptyState, Badge } from "../components/pawguard";
import SectionHeading from "../components/SectionHeading";
import { useApiMutation, useApiErrorMessage, QUERY_KEYS, toApiDateTime, isApiError } from "@/lib/api";
import { queryClient } from "@/lib/react-query";
import { appointmentsService } from "@/services/api/appointments";
import { useAuth } from "../providers/auth-provider";
import { useMyPets } from "../hooks/useMyPets";
import { useVetClinics } from "../hooks/useVetClinics";
import { useVeterinaryPartners } from "../hooks/useVeterinaryPartners";
import { getErrorMessage } from "@/lib/api";
import type { PetAppointmentResponse } from "@/lib/api";

const DURATION_OPTIONS = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "60 minutes" },
];

const today = () => new Date();
const toDateInputValue = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function FieldSelect({
  id,
  label,
  value,
  onChange,
  disabled,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-foreground text-xs font-semibold tracking-wider uppercase font-condensed">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full h-12 bg-input-background border border-border rounded-input px-4 text-foreground text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-gentle ease-gentle disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-muted"
      >
        {children}
      </select>
    </div>
  );
}

function AppointmentBookForm() {
  const searchParams = useSearchParams();
  const urlClinicId = searchParams ? searchParams.get("clinic_id") : null;

  const { status: authStatus, isAuthenticated, openAuthDialog } = useAuth();
  const isAuthReady = authStatus !== "loading";

  const { pets, isLoading: petsLoading, isError: petsError, error: petsErrorObj, refetch: refetchPets } = useMyPets(isAuthenticated);
  const { clinics, isLoading: clinicsLoading, isError: clinicsError, error: clinicsErrorObj, refetch: refetchClinics } = useVetClinics(true);
  const { data: partners } = useVeterinaryPartners();

  const [petId, setPetId] = useState("");
  const [clinicId, setClinicId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState<number>(30);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState<PetAppointmentResponse | null>(null);

  // Auto-select clinic from URL parameter
  useEffect(() => {
    if (urlClinicId && !clinicId) {
      setClinicId(urlClinicId);
    }
  }, [urlClinicId, clinicId]);

  const mutation = useApiMutation<PetAppointmentResponse, void>({
    mutationFn: () =>
      appointmentsService.bookAppointment({
        pet_id: petId,
        clinic_id: clinicId || urlClinicId || "",
        vet_id: null,
        starts_at: startsAtISO,
        ends_at: endsAtISO,
        reason: reason.trim(),
        notes: notes.trim() === "" ? null : notes.trim(),
      }),
    onSuccess: async (appointment) => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.companionPets.appointments });
      setSubmitted(appointment);
    },
  });

  const errorText = useApiErrorMessage(mutation.error);
  const petsAuthError = isApiError(petsErrorObj) && petsErrorObj.isUnauthorized;

  // After a 401, once the user signs in, resubmit automatically.
  useEffect(() => {
    if (mutation.isError && mutation.error?.isUnauthorized && isAuthenticated) {
      mutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, mutation.isError]);

  const selectedPet = useMemo(() => pets.find((p) => p.id === petId) ?? null, [pets, petId]);
  const selectedClinic = useMemo(() => {
    const idToFind = clinicId || urlClinicId;
    if (!idToFind) return null;
    const foundInClinics = clinics.find((c) => c.id === idToFind);
    if (foundInClinics) {
      return {
        id: foundInClinics.id,
        name: foundInClinics.name,
        address: foundInClinics.address,
      };
    }
    const foundInPartners = (partners ?? []).find((p) => p.id === idToFind);
    if (foundInPartners) {
      return {
        id: foundInPartners.id,
        name: foundInPartners.name,
        address: foundInPartners.address,
      };
    }
    return null;
  }, [clinics, partners, clinicId, urlClinicId]);

  const startsAt = useMemo(() => {
    if (!date || !startTime) return null;
    const d = new Date(`${date}T${startTime}`);
    return Number.isNaN(d.getTime()) ? null : d;
  }, [date, startTime]);

  const endsAt = useMemo(() => {
    if (!startsAt) return null;
    return new Date(startsAt.getTime() + duration * 60_000);
  }, [startsAt, duration]);

  const startsAtISO = startsAt ? toApiDateTime(startsAt) : "";
  const endsAtISO = endsAt ? toApiDateTime(endsAt) : "";

  const endTimeLabel = useMemo(() => {
    if (!endsAt) return "—";
    return endsAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }, [endsAt]);

  const minDate = toDateInputValue(today());

  const clientValidationError = useMemo(() => {
    if (!petId) return "Please select a pet for this appointment.";
    if (!clinicId && !urlClinicId) return "Please select a clinic for this appointment.";
    if (!date) return "Please select an appointment date.";
    if (!startTime) return "Please select an appointment time.";
    if (!reason.trim()) return "Please enter a reason for the visit.";
    if (startsAt && startsAt < new Date()) {
      return "Appointment start time must be in the future.";
    }
    return null;
  }, [petId, clinicId, urlClinicId, date, startTime, reason, startsAt]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (clientValidationError) return;
    mutation.mutate();
  }

  if (!isAuthReady) {
    return (
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-height)+2rem)] pb-section-lg">
        <Skeleton className="h-10 w-2/3 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <Card>
          <div className="flex flex-col gap-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-height)+2rem)] pb-section-lg">
        <Reveal>
          <SectionHeading eyebrow="Veterinary Care">Book an Appointment</SectionHeading>
          <p className="text-muted-foreground text-base leading-relaxed mt-3 max-w-[560px]">
            {urlClinicId
              ? "Select one of your pets and choose a date and time. The clinic will review your request before confirming."
              : "Select one of your pets, pick a clinic, and choose a date and time. The clinic reviews your request before confirming."}
          </p>
        </Reveal>
        <Reveal>
          <Card className="mt-10">
            <div className="flex flex-col items-center text-center gap-5 py-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl">
                <Stethoscope size={28} />
              </div>
              <div className="flex flex-col gap-2 max-w-[440px]">
                <h3 className="text-foreground font-bold text-xl">Sign in required to book an appointment</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Sign in with your PawGuard account so we can link the appointment to your registered pet and send confirmation updates.
                </p>
              </div>
              <Button variant="primary" size="md" onClick={() => openAuthDialog("sign-in")}>
                Sign In to Continue
              </Button>
            </div>
          </Card>
        </Reveal>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-[560px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-height)+2rem)] pb-section-lg">
        <Reveal>
          <div className="flex flex-col gap-5">
            <div
              className="bg-card border border-border rounded-card p-6 lg:p-8 shadow-lg flex flex-col gap-5 animate-celebration-pop"
              role="status"
              aria-live="polite"
            >
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center">
                <CalendarDays size={28} className="text-primary-foreground" />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-foreground font-bold text-2xl">Appointment Requested</h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Your visit has been submitted to {selectedClinic?.name ?? "the clinic"} for review. The clinic will confirm your slot.
                </p>
              </div>
              {selectedPet && (
                <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-center gap-4">
                  <PawPrint size={22} className="text-primary shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-foreground font-semibold text-sm">{selectedPet.name}</span>
                    <span className="text-muted-foreground text-sm">
                      {submitted.status} ·{" "}
                      {submitted.starts_at
                        ? new Date(submitted.starts_at).toLocaleString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-1 flex-wrap">
                <Link
                  href="/appointments"
                  className="bg-primary text-primary-foreground font-semibold text-xs tracking-wider uppercase font-condensed px-6 py-3 rounded-btn hover:bg-primary-hover transition-all duration-fast"
                >
                  View My Appointments
                </Link>
                <Button variant="outline" size="md" onClick={() => { setSubmitted(null); mutation.reset(); }}>
                  Book Another
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    );
  }

  if (!petsLoading && !petsError && pets.length === 0) {
    return (
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-height)+2rem)] pb-section-lg">
        <Reveal>
          <SectionHeading eyebrow="Veterinary Care">Book an Appointment</SectionHeading>
          <p className="text-muted-foreground text-base leading-relaxed mt-3 max-w-[560px]">
            {urlClinicId
              ? "Select one of your pets and choose a date and time. The clinic will review your request before confirming."
              : "Select one of your pets, pick a clinic, and choose a date and time. The clinic reviews your request before confirming."}
          </p>
        </Reveal>
        <Reveal>
          <Card className="mt-10">
            <EmptyState
              icon="heart"
              title="No pets available for appointment booking yet."
              description="Add your pet to My Pets before booking a veterinary appointment."
              action={{ label: "Go to My Pets", to: "/account/pets" }}
            />
          </Card>
        </Reveal>
      </div>
    );
  }

  return (
    <main id="main-content" className="flex-1">
      <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-[calc(var(--header-height)+1.5rem)]">
        <Link
          href="/veterinary"
          className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-primary transition-colors duration-fast group"
        >
          <ArrowLeft size={15} className="transition-transform duration-fast group-hover:-translate-x-0.5" />
          Back to Veterinary Directory
        </Link>
      </div>

      <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 lg:py-12">
        <Reveal>
          <div className="max-w-[960px]">
            <SectionHeading eyebrow="Veterinary Care">Book an Appointment</SectionHeading>
            <p className="text-muted-foreground text-base leading-relaxed mt-3 max-w-[720px]">
              {urlClinicId
                ? "Select one of your pets and choose a date and time. The clinic will review your request before confirming."
                : "Select one of your pets, pick a clinic, and choose a date and time. The clinic reviews your request before confirming."}
            </p>
          </div>
        </Reveal>

        <Reveal>
          <Card className="mt-10 w-full max-w-[1440px] 2xl:max-w-[1536px] p-6 sm:p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full">
              {mutation.isError && errorText && (
                <Alert variant="error" title={mutation.error?.isUnauthorized ? "Sign in required" : "We couldn't book the appointment"}>
                  {mutation.error?.isUnauthorized
                    ? "Booking an appointment requires a PawGuard account. Sign in to continue and we'll resubmit automatically."
                    : `${errorText} `}
                  {mutation.error?.isUnauthorized ? (
                    <button
                      onClick={() => openAuthDialog("sign-in")}
                      className="font-semibold text-destructive underline underline-offset-2 hover:opacity-80 transition-opacity"
                    >
                      Sign in now
                    </button>
                  ) : (
                    <button onClick={() => mutation.mutate()} className="font-semibold text-destructive underline underline-offset-2 hover:opacity-80 transition-opacity">
                      Retry
                    </button>
                  )}
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start w-full">
                <FieldSelect id="book-pet" label="Select Pet" value={petId} onChange={setPetId} disabled={petsLoading || petsError}>
                  {petsLoading ? (
                    <option value="">Loading your pets…</option>
                  ) : (
                    <>
                      <option value="">
                        {petsError ? "Couldn't load pets" : pets.length ? "Select a pet" : "No pets yet"}
                      </option>
                      {pets.map((pet) => (
                        <option key={pet.id} value={pet.id}>
                          {pet.name}
                          {pet.breed ? ` · ${pet.breed}` : ""}
                        </option>
                      ))}
                    </>
                  )}
                </FieldSelect>

                {urlClinicId ? (
                  <div className="flex flex-col gap-2 w-full">
                    <span className="text-foreground text-xs font-semibold tracking-wider uppercase font-condensed">
                      Selected Clinic
                    </span>
                    <div className="bg-primary/5 border border-primary/20 rounded-card p-4 flex items-start justify-between gap-4 min-h-[48px]">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                          <Building2 size={20} />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-foreground font-bold text-base leading-snug">
                            {selectedClinic?.name || "Loading clinic details…"}
                          </span>
                          {selectedClinic?.address && (
                            <span className="text-muted-foreground text-xs leading-relaxed mt-1">
                              {selectedClinic.address}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge variant="success" className="gap-1 shrink-0 text-xs px-3 py-1 font-semibold uppercase tracking-wider">
                        <CheckCircle2 size={12} /> Confirmed
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <FieldSelect id="book-clinic" label="Veterinary Clinic" value={clinicId} onChange={setClinicId} disabled={clinicsLoading}>
                    {clinicsLoading ? (
                      <option value="">Loading clinics…</option>
                    ) : (
                      <>
                        <option value="">{clinics.length ? "Select a clinic" : "No clinics available"}</option>
                        {clinics.map((clinic) => (
                          <option key={clinic.id} value={clinic.id}>
                            {clinic.name}
                            {clinic.is_emergency ? " · Emergency" : ""}
                          </option>
                        ))}
                      </>
                    )}
                  </FieldSelect>
                )}
              </div>

              {petsError && !petsLoading && (
                <Alert
                  variant="error"
                  title={petsAuthError ? "Sign in required" : "We couldn't load your pets"}
                >
                  {petsAuthError
                    ? "Please sign in to view your pets."
                    : `${getErrorMessage(petsErrorObj)} `}
                  {petsAuthError ? (
                    <button
                      onClick={() => openAuthDialog("sign-in")}
                      className="font-semibold text-destructive underline underline-offset-2 hover:opacity-80 transition-opacity"
                    >
                      Sign in now
                    </button>
                  ) : (
                    <button
                      onClick={() => refetchPets()}
                      className="font-semibold text-destructive underline underline-offset-2 hover:opacity-80 transition-opacity"
                    >
                      Try again
                    </button>
                  )}
                </Alert>
              )}
              {clinicsError && !clinicsLoading && (
                <Alert variant="error" title="Couldn't load clinics">
                  {getErrorMessage(clinicsErrorObj)}{" "}
                  <button onClick={() => refetchClinics()} className="font-semibold text-destructive underline underline-offset-2 hover:opacity-80 transition-opacity">
                    Retry
                  </button>
                </Alert>
              )}

              {!petsLoading && !petsError && pets.length === 0 && (
                <EmptyState
                  icon="heart"
                  title="No pets available for appointment booking yet."
                  description="Add a pet to your account to book veterinary appointments - then return here to schedule a visit."
                  action={{ label: "Go to My Pets", to: "/account/pets" }}
                  className="py-8"
                />
              )}
              {!clinicsLoading && !clinicsError && clinics.length === 0 && (
                <Alert variant="info" title="No clinics accepting bookings yet">
                  Our partner clinics are being onboarded. Check back soon to schedule an appointment.
                </Alert>
              )}

              <div className="h-px bg-border my-1" />

              <div className="flex flex-col gap-6 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
                  <Input
                    id="book-date"
                    label="Date"
                    type="date"
                    min={minDate}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                  <Input
                    id="book-time"
                    label="Start time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                  <FieldSelect
                    id="book-duration"
                    label="Duration"
                    value={String(duration)}
                    onChange={(value) => setDuration(Number(value))}
                  >
                    {DURATION_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </FieldSelect>
                </div>

                {endsAt && (
                  <p className="flex items-center gap-2 text-muted-foreground text-sm -mt-2">
                    <Clock size={14} className="text-primary shrink-0" />
                    Estimated end time: <span className="font-semibold text-foreground">{endTimeLabel}</span>
                  </p>
                )}
              </div>

              <Input
                id="book-reason"
                label="Reason for visit"
                placeholder="e.g. Annual check-up, vaccination, injury follow-up"
                maxLength={255}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                className="w-full"
              />

              <Textarea
                id="book-notes"
                label="Notes for the clinic (optional)"
                maxLength={4000}
                placeholder="Allergies, medications, symptoms, or anything the vet should know…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full min-h-[120px]"
              />

              <div className="flex flex-col gap-4 pt-2 border-t border-border/60">
                {clientValidationError && (
                  <Alert variant="warning" title="Almost there" className="w-full">
                    {clientValidationError}
                  </Alert>
                )}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
                  <p className="text-muted-foreground text-xs flex items-center gap-1.5">
                    <CalendarDays size={14} className="shrink-0 text-primary" />
                    The clinic reviews your request and confirms the slot before the visit.
                  </p>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={mutation.isPending}
                    disabled={mutation.isPending || petsLoading || clinicsLoading || pets.length === 0 || clinics.length === 0}
                    className="w-full sm:w-auto px-8 shrink-0 self-end"
                  >
                    <Stethoscope size={15} />
                    Book Appointment
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </Reveal>
      </div>
    </main>
  );
}

export default function AppointmentBookPage() {
  return (
    <PageShell>
      <Suspense
        fallback={
          <div className="max-w-[760px] mx-auto px-6 lg:px-8 pt-[calc(var(--header-height)+2rem)] pb-section-lg">
            <Skeleton className="h-10 w-2/3 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-10" />
            <Card className="flex flex-col gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </Card>
          </div>
        }
      >
        <AppointmentBookForm />
      </Suspense>
    </PageShell>
  );
}
