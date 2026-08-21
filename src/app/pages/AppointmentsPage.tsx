"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bell, CalendarPlus, Clock, Stethoscope, XCircle } from "lucide-react";
import { PageShell, Card, Reveal, Alert, Button, Input, Skeleton, EmptyState, Badge } from "../components/pawguard";
import PageHeader from "../components/PageHeader";
import SectionHeading from "../components/SectionHeading";
import { useApiMutation, useApiErrorMessage, QUERY_KEYS } from "@/lib/api";
import { queryClient } from "@/lib/react-query";
import { appointmentsService } from "@/services/api/appointments";
import { useAuth } from "../providers/auth-provider";
import { useMyAppointments } from "../hooks/useMyAppointments";
import { useMyPets } from "../hooks/useMyPets";
import { useVetClinics } from "../hooks/useVetClinics";
import { getErrorMessage } from "@/lib/api";
import type { AppointmentStatus, PetAppointmentResponse } from "@/lib/api";

const STATUS_CONFIG: Record<AppointmentStatus, { variant: "default" | "urgent" | "success" | "neutral" | "special"; label: string }> = {
  requested: { variant: "special", label: "Requested" },
  confirmed: { variant: "success", label: "Confirmed" },
  cancelled: { variant: "urgent", label: "Cancelled" },
  completed: { variant: "neutral", label: "Completed" },
  no_show: { variant: "urgent", label: "No-show" },
};

function AppointmentSkeleton() {
  return (
    <Card className="gap-3 p-5">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-10 w-full mt-2" />
    </Card>
  );
}

export default function AppointmentsPage() {
  const { status: authStatus, isAuthenticated, openAuthDialog } = useAuth();
  const isAuthReady = authStatus !== "loading";

  const { appointments, isLoading, isError, error, refetch } = useMyAppointments(isAuthenticated);
  const { pets } = useMyPets(isAuthenticated);
  const { clinics } = useVetClinics(true);

  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const petNameById = useMemo(() => new Map(pets.map((p) => [p.id, p.name])), [pets]);
  const clinicById = useMemo(() => new Map(clinics.map((c) => [c.id, c])), [clinics]);

  const cancelMutation = useApiMutation<PetAppointmentResponse, void>({
    mutationFn: () =>
      appointmentsService.cancelAppointment(cancellingId ?? "", {
        reason: cancelReason.trim() === "" ? null : cancelReason.trim(),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.companionPets.appointments });
      setCancellingId(null);
      setCancelReason("");
    },
  });

  const cancelErrorText = useApiErrorMessage(cancelMutation.error);

  const beginCancel = useCallback((id: string) => {
    setCancellingId(id);
    setCancelReason("");
  }, []);

  const abortCancel = useCallback(() => {
    setCancellingId(null);
    setCancelReason("");
    cancelMutation.reset();
  }, [cancelMutation]);

  const confirmCancel = useCallback(() => {
    if (!cancellingId) return;
    cancelMutation.mutate();
  }, [cancellingId, cancelMutation]);

  const formatRange = (a: PetAppointmentResponse) => {
    const start = new Date(a.starts_at);
    const end = new Date(a.ends_at);
    if (Number.isNaN(start.getTime())) return a.starts_at;
    const datePart = start.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    const timePart = start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const endTime = Number.isNaN(end.getTime())
      ? ""
      : ` – ${end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
    return `${datePart} · ${timePart}${endTime}`;
  };

  if (!isAuthReady) {
    return (
      <PageShell>
        <main id="main-content" className="flex-1">
          <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-[calc(var(--header-height)+2rem)] pb-section-lg">
            <Skeleton className="h-8 w-1/2 mb-10" />
            <div className="flex flex-col gap-5">
              <AppointmentSkeleton />
              <AppointmentSkeleton />
              <AppointmentSkeleton />
            </div>
          </div>
        </main>
      </PageShell>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageShell>
        <main id="main-content" className="flex-1">
          <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-[calc(var(--header-height)+2rem)] pb-section-lg">
            <Reveal>
              <SectionHeading eyebrow="My Appointments">Your Scheduled Visits</SectionHeading>
              <p className="text-muted-foreground text-base leading-relaxed mt-3 max-w-[560px]">
                Track and manage the veterinary visits you've scheduled for your companions.
              </p>
            </Reveal>
            <Reveal>
              <Card className="mt-10">
                <Alert variant="info" title="Sign in to view your appointments">
                  Your appointment history is private and tied to your PawGuard account.
                </Alert>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Button variant="primary" size="md" onClick={() => openAuthDialog("sign-in")}>
                    Sign in to continue
                  </Button>
                  <Button variant="outline" size="md" asLink={{ href: "/appointments/book" }}>
                    Book an appointment
                  </Button>
                </div>
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
        <PageHeader
          eyebrow="My Appointments"
          title="Your Scheduled Visits"
          subtitle="Review your veterinary appointments, see their status, and cancel a visit you no longer need."
          right={
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="lg" asLink={{ href: "/reminders" }}>
                <Bell size={16} />
                Smart Reminders
              </Button>
              <Button variant="primary" size="lg" asLink={{ href: "/appointments/book" }}>
                <CalendarPlus size={16} />
                Book Appointment
              </Button>
            </div>
          }
        />

        <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-section-md lg:py-section-lg">
          {cancelMutation.isError && cancelErrorText && (
            <Alert variant="error" title="We couldn't cancel the appointment" className="mb-6">
              {cancelErrorText}{" "}
              <button onClick={() => confirmCancel()} className="font-semibold text-destructive underline underline-offset-2 hover:opacity-80 transition-opacity">
                Retry
              </button>
            </Alert>
          )}

          {isLoading ? (
            <div className="flex flex-col gap-5">
              <AppointmentSkeleton />
              <AppointmentSkeleton />
              <AppointmentSkeleton />
            </div>
          ) : isError ? (
            <Alert variant="error" title="Couldn't load your appointments">
              {getErrorMessage(error)}{" "}
              <button onClick={() => refetch()} className="font-semibold text-destructive underline underline-offset-2 hover:opacity-80 transition-opacity">
                Retry
              </button>
            </Alert>
          ) : appointments.length === 0 ? (
            <Reveal>
              <EmptyState
                icon="heart"
                title="No appointments yet"
                description="When you book a veterinary visit it will appear here with its status and details."
                action={{ label: "Book your first appointment", to: "/appointments/book" }}
              />
            </Reveal>
          ) : (
            <div className="flex flex-col gap-5">
              {appointments.map((apt) => {
                const status = STATUS_CONFIG[apt.status] ?? STATUS_CONFIG.requested;
                const clinic = clinicById.get(apt.clinic_id);
                const isCancellable = apt.status === "requested" || apt.status === "confirmed";
                const isCancellingThis = cancellingId === apt.id;
                return (
                  <Reveal key={apt.id}>
                    <Card className="p-6 flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-foreground font-bold text-lg">
                              {petNameById.get(apt.pet_id) ?? "Your pet"}
                            </h3>
                            <Badge variant={status.variant}>{status.label}</Badge>
                          </div>
                          <p className="text-muted-foreground text-sm flex items-center gap-2">
                            <Stethoscope size={14} className="text-primary shrink-0" />
                            {clinic ? clinic.name : "Veterinary clinic"}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Clock size={14} className="text-primary shrink-0" />
                          {formatRange(apt)}
                        </div>
                      </div>

                      <p className="text-muted-foreground text-sm leading-relaxed">
                        <span className="font-semibold text-foreground">Reason:</span> {apt.reason}
                      </p>
                      {apt.notes && (
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          <span className="font-semibold text-foreground">Notes:</span> {apt.notes}
                        </p>
                      )}
                      {apt.cancellation_reason && apt.status === "cancelled" && (
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          <span className="font-semibold text-destructive">Cancellation reason:</span> {apt.cancellation_reason}
                        </p>
                      )}

                      {isCancellable && (
                        <div className="border-t border-border pt-4">
                          {isCancellingThis ? (
                            <div className="flex flex-col gap-4">
                              <Input
                                id={`cancel-reason-${apt.id}`}
                                label="Reason for cancelling (optional)"
                                placeholder="e.g. The vet said we're all clear"
                                maxLength={255}
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                              />
                              <div className="flex flex-wrap gap-3">
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="md"
                                  isLoading={cancelMutation.isPending}
                                  disabled={cancelMutation.isPending}
                                  onClick={confirmCancel}
                                >
                                  <XCircle size={15} />
                                  Confirm Cancellation
                                </Button>
                                <Button type="button" variant="outline" size="md" onClick={abortCancel} disabled={cancelMutation.isPending}>
                                  Keep Appointment
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button type="button" variant="outline" size="sm" onClick={() => beginCancel(apt.id)}>
                              Cancel appointment
                            </Button>
                          )}
                        </div>
                      )}
                    </Card>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </PageShell>
  );
}
