"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock, Stethoscope, PawPrint } from "lucide-react";
import { PageShell, Card, Reveal, Alert, Button, Input, Textarea, Skeleton, EmptyState } from "../components/pawguard";
import SectionHeading from "../components/SectionHeading";
import { useApiMutation, useApiErrorMessage, QUERY_KEYS, toApiDateTime, isApiError } from "@/lib/api";
import { queryClient } from "@/lib/react-query";
import { appointmentsService } from "@/services/api/appointments";
import { useAuth } from "../providers/auth-provider";
import { useMyPets } from "../hooks/useMyPets";
import { useVetClinics } from "../hooks/useVetClinics";
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

export default function AppointmentBookPage() {
  const { status: authStatus, isAuthenticated, openAuthDialog } = useAuth();
  const isAuthReady = authStatus !== "loading";

  const { pets, isLoading: petsLoading, isError: petsError, error: petsErrorObj, refetch: refetchPets } = useMyPets(isAuthenticated);
  const { clinics, isLoading: clinicsLoading, isError: clinicsError, error: clinicsErrorObj, refetch: refetchClinics } = useVetClinics(true);

  const [petId, setPetId] = useState("");
  const [clinicId, setClinicId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState<number>(30);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState<PetAppointmentResponse | null>(null);

  const mutation = useApiMutation<PetAppointmentResponse, void>({
    mutationFn: () =>
      appointmentsService.bookAppointment({
        pet_id: petId,
        clinic_id: clinicId,
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
  const selectedClinic = useMemo(() => clinics.find((c) => c.id === clinicId) ?? null, [clinics, clinicId]);

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

  const minDate = toDateInputValue(today());

  const clientValidationError = useMemo(() => {
    if (!petId) return "Please select a pet for this appointment.";
    if (!clinicId) return "Please choose a veterinary clinic.";
    if (!date) return "Please choose an appointment date.";
    if (!startTime) return "Please choose an appointment start time.";
    if (!startsAt) return "That date/time isn't valid.";
    if (startsAt.getTime() <= Date.now()) {
      return "Please choose a date and time in the future.";
    }
    if (!reason.trim()) return "Please tell us the reason for the visit.";
    return null;
  }, [petId, clinicId, date, startTime, startsAt, reason]);

  const endTimeLabel = endsAt
    ? endsAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    : "—";

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (clientValidationError) return;
      mutation.mutate();
    },
    [clientValidationError, mutation],
  );

  if (!isAuthReady) {
    return (
      <PageShell>
        <main id="main-content" className="flex-1">
          <div className="max-w-[760px] mx-auto px-6 lg:px-8 pt-[calc(var(--header-height)+2rem)] pb-section-lg">
            <Skeleton className="h-10 w-2/3 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-10" />
            <Card className="flex flex-col gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </Card>
          </div>
        </main>
      </PageShell>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageShell>
        <main id="main-content" className="flex-1">
          <div className="max-w-[760px] mx-auto px-6 lg:px-8 pt-[calc(var(--header-height)+2rem)] pb-section-lg">
            <Reveal>
              <SectionHeading eyebrow="Veterinary Care">Book an Appointment</SectionHeading>
              <p className="text-muted-foreground text-base leading-relaxed mt-3 max-w-[560px]">
                 Schedule a visit for your pet at one of our partner clinics.
              </p>
            </Reveal>
            <Reveal>
              <Card className="mt-10">
                <Alert variant="info" title="Sign in to book an appointment">
                  Appointment booking requires a PawGuard account so we can link the visit to your pet.
                </Alert>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Button variant="primary" size="md" onClick={() => openAuthDialog("sign-in")}>
                    Sign in to continue
                  </Button>
                  <Button variant="outline" size="md" onClick={() => openAuthDialog("sign-up")}>
                    Create an account
                  </Button>
                </div>
              </Card>
            </Reveal>
          </div>
        </main>
      </PageShell>
    );
  }

  if (submitted) {
    return (
      <PageShell>
        <main id="main-content" className="flex-1 flex items-start justify-center px-6 lg:px-8 pt-[calc(var(--header-height)+2rem)] pb-section-lg">
          <div className="max-w-[560px] w-full">
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
        </main>
      </PageShell>
    );
  }

  if (!petsLoading && !petsError && pets.length === 0) {
    return (
      <PageShell>
        <main id="main-content" className="flex-1">
          <div className="max-w-[760px] mx-auto px-6 lg:px-8 pt-[calc(var(--header-height)+2rem)] pb-section-lg">
            <Reveal>
              <SectionHeading eyebrow="Veterinary Care">Book an Appointment</SectionHeading>
              <p className="text-muted-foreground text-base leading-relaxed mt-3 max-w-[560px]">
                Choose a companion, pick a clinic, and select a date and time.
              </p>
            </Reveal>
            <Reveal>
              <Card className="mt-10">
                <EmptyState
                  icon="heart"
                  title="No pets yet"
                  description="Add your adopted pet to My Pets before booking a veterinary appointment."
                  action={{ label: "Go to My Pets", to: "/account/pets" }}
                />
              </Card>
            </Reveal>
          </div>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-[calc(var(--header-height)+1.5rem)]">
          <Link
            href="/veterinary"
            className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-primary transition-colors duration-fast group"
          >
            <ArrowLeft size={15} className="transition-transform duration-fast group-hover:-translate-x-0.5" />
            Back to Veterinary Directory
          </Link>
        </div>

        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-8 lg:py-12">
          <Reveal>
            <div className="max-w-[760px]">
              <SectionHeading eyebrow="Veterinary Care">Book an Appointment</SectionHeading>
              <p className="text-muted-foreground text-base leading-relaxed mt-3 max-w-[560px]">
                Choose a pet, pick a clinic, and select a date and time. The clinic reviews your request before confirming.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <Card className="mt-10 max-w-[760px]">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FieldSelect id="book-pet" label="Pet" value={petId} onChange={setPetId} disabled={petsLoading || petsError}>
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
                  title="No pets yet"
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

                <div className="h-px bg-border" />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
                  <p className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Clock size={14} className="text-primary shrink-0" />
                    Estimated end time: <span className="font-semibold text-foreground">{endTimeLabel}</span>
                  </p>
                )}

                <Input
                  id="book-reason"
                  label="Reason for visit"
                  placeholder="e.g. Annual check-up, vaccination, injury follow-up"
                  maxLength={255}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />

                <Textarea
                  id="book-notes"
                  label="Notes for the clinic (optional)"
                  maxLength={4000}
                  placeholder="Allergies, medications, symptoms, or anything the vet should know…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />

                <div className="flex flex-col gap-3 pt-1">
                  {clientValidationError && (
                    <Alert variant="warning" title="Almost there">
                      {clientValidationError}
                    </Alert>
                  )}
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={mutation.isPending}
                    disabled={mutation.isPending || petsLoading || clinicsLoading || pets.length === 0 || clinics.length === 0}
                  >
                    <Stethoscope size={15} />
                    Book Appointment
                  </Button>
                  <p className="text-muted-foreground text-xs flex items-center gap-1.5">
                    <CalendarDays size={12} className="shrink-0" />
                    The clinic reviews your request and confirms the slot before the visit.
                  </p>
                </div>
              </form>
            </Card>
          </Reveal>
        </div>
      </main>
    </PageShell>
  );
}
