"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Bell,
  BellPlus,
  CalendarDays,
  CheckCircle2,
  Clock,
  Pill,
  Shield,
  Trash2,
  XCircle,
} from "lucide-react";
import {
  PageShell,
  Card,
  Reveal,
  Alert,
  Button,
  Input,
  Textarea,
  Skeleton,
  EmptyState,
  Badge,
} from "../components/pawguard";
import PageHeader from "../components/PageHeader";
import SectionHeading from "../components/SectionHeading";
import {
  useApiMutation,
  useApiErrorMessage,
  QUERY_KEYS,
  toApiDateTime,
} from "@/lib/api";
import { queryClient } from "@/lib/react-query";
import { remindersService } from "@/services/api/reminders";
import { useAuth } from "../providers/auth-provider";
import { useMyPets } from "../hooks/useMyPets";
import {
  useMyReminders,
  type PetReminderWithPet,
} from "../hooks/useMyReminders";
import { getErrorMessage } from "@/lib/api";
import type { PetReminderResponse, ReminderKind } from "@/lib/api";

const KIND_CONFIG: Record<
  ReminderKind,
  { badge: "default" | "special"; label: string; Icon: typeof Shield }
> = {
  vaccination: { badge: "default", label: "Vaccination", Icon: Shield },
  medication: { badge: "special", label: "Medication", Icon: Pill },
};

const toDateInputValue = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function ReminderSkeleton() {
  return (
    <Card className="gap-4 p-5">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-9 w-32 mt-2" />
    </Card>
  );
}

interface ReminderCardProps {
  reminder: PetReminderWithPet;
  isDeleting: boolean;
  onDelete: () => void;
}

function ReminderCard({ reminder, isDeleting, onDelete }: ReminderCardProps) {
  const kind = KIND_CONFIG[reminder.kind] ?? KIND_CONFIG.medication;
  const { Icon } = kind;
  const due = new Date(reminder.due_at);
  const isPast = Number.isFinite(due.getTime()) && due.getTime() < Date.now();
  const datePart = Number.isFinite(due.getTime())
    ? due.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : reminder.due_at;
  const timePart = Number.isFinite(due.getTime())
    ? due.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    : "";

  return (
    <Card className="p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 flex-wrap">
            <Icon size={18} className="text-primary shrink-0" />
            <h3 className="text-foreground font-bold text-lg">
              {reminder.title}
            </h3>
            <Badge variant={kind.badge}>{kind.label}</Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            For{" "}
            <span className="font-semibold text-foreground">
              {reminder.petName}
            </span>
          </p>
        </div>
        <div
          className={`text-sm flex items-center gap-2 ${isPast ? "text-destructive" : "text-muted-foreground"}`}
        >
          <Clock
            size={14}
            className={
              isPast ? "text-destructive shrink-0" : "text-primary shrink-0"
            }
          />
          {datePart}
          {timePart ? ` · ${timePart}` : ""}
          {isPast && <Badge variant="urgent">Due</Badge>}
        </div>
      </div>

      {reminder.details && (
        <p className="text-muted-foreground text-sm leading-relaxed">
          <span className="font-semibold text-foreground">Details:</span>{" "}
          {reminder.details}
        </p>
      )}

      <div className="border-t border-border pt-4 flex items-center justify-between gap-3 flex-wrap">
        <span className="text-xs text-muted-foreground">
          {reminder.source_key.startsWith("medical_record:")
            ? "Auto-created by your veterinary clinic"
            : "Added by you"}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          isLoading={isDeleting}
          disabled={isDeleting}
          onClick={onDelete}
        >
          <Trash2 size={14} />
          Dismiss
        </Button>
      </div>
    </Card>
  );
}

export default function RemindersPage() {
  const { status: authStatus, isAuthenticated, openAuthDialog } = useAuth();
  const isAuthReady = authStatus !== "loading";

  const { pets, isLoading: petsLoading } = useMyPets(isAuthenticated);
  const { reminders, isLoading, isError, error, refetch } = useMyReminders(
    pets,
    isAuthenticated,
  );

  const [creating, setCreating] = useState(false);
  const [petId, setPetId] = useState("");
  const [kind, setKind] = useState<ReminderKind>("medication");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const createMutation = useApiMutation<PetReminderResponse, void>({
    mutationFn: () => {
      const due = new Date(date && time ? `${date}T${time}` : date);
      return remindersService.createReminder(petId, {
        kind,
        title: title.trim(),
        details: details.trim() === "" ? null : details.trim(),
        due_at: due.toISOString(),
        source_key: `manual:${Date.now().toString(36)}`,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.companionPets.reminders("all"),
      });
      setCreating(false);
      setTitle("");
      setDetails("");
      setDate("");
      setTime("");
      setKind("medication");
      setPetId("");
    },
  });

  const deleteMutation = useApiMutation<null, void>({
    mutationFn: async () => {
      const reminder = reminders.find((r) => r.id === deletingId);
      if (!reminder) return null;
      return remindersService.deleteReminder(reminder.pet_id, reminder.id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.companionPets.reminders("all"),
      });
      setDeletingId(null);
    },
  });

  const createErrorText = useApiErrorMessage(createMutation.error);
  const deleteErrorText = useApiErrorMessage(deleteMutation.error);

  const createValidationError = useMemo(() => {
    if (!petId) return "Please choose which companion the reminder is for.";
    if (!title.trim()) return "Please give the reminder a title.";
    if (!date) return "Please choose a due date.";
    if (!time) return "Please choose a due time.";
    const due = new Date(`${date}T${time}`);
    if (Number.isNaN(due.getTime())) return "That date/time isn't valid.";
    return null;
  }, [petId, title, date, time]);

  const minDate = toDateInputValue(new Date());

  const beginDelete = useCallback((id: string) => setDeletingId(id), []);
  const abortDelete = useCallback(() => {
    setDeletingId(null);
    deleteMutation.reset();
  }, [deleteMutation]);
  const confirmDelete = useCallback(() => {
    if (!deletingId) return;
    deleteMutation.mutate();
  }, [deletingId, deleteMutation]);

  const handleCreate = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (createValidationError) return;
      createMutation.mutate();
    },
    [createValidationError, createMutation],
  );

  const defaultPetId = useMemo(() => pets[0]?.id ?? "", [pets]);

  if (!isAuthReady) {
    return (
      <PageShell>
        <main id="main-content" className="flex-1">
          <div className="max-w-[860px] mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-height)+2rem)] pb-section-lg">
            <Skeleton className="h-8 w-1/2 mb-10" />
            <ReminderSkeleton />
            <ReminderSkeleton />
            <ReminderSkeleton />
          </div>
        </main>
      </PageShell>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageShell>
        <main id="main-content" className="flex-1">
          <div className="max-w-[760px] mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-height)+2rem)] pb-section-lg">
            <Reveal>
              <SectionHeading eyebrow="Smart Reminders">
                Never Miss Vet Care
              </SectionHeading>
              <p className="text-muted-foreground text-base leading-relaxed mt-3 max-w-[560px]">
                Track vaccinations and medication schedules for your companions
                in one place.
              </p>
            </Reveal>
            <Reveal>
              <Card className="mt-10">
                <Alert variant="info" title="Sign in to view your reminders">
                  Reminders are tied to your PawGuard account and companion
                  pets.
                </Alert>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => openAuthDialog("sign-in")}
                  >
                    Sign in to continue
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => openAuthDialog("sign-up")}
                  >
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

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <PageHeader
          eyebrow="Smart Reminders"
          title="Vet Care, On Schedule"
          subtitle="Keep vaccination and medication reminders for all your companions in one place — including ones your clinic sets automatically after a visit."
          right={
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="lg"
                asLink={{ href: "/appointments" }}
              >
                <CalendarDays size={16} />
                My Appointments
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={() => setCreating((v) => !v)}
              >
                <BellPlus size={16} />
                Add Reminder
              </Button>
            </div>
          }
        />

        <div className="max-w-[860px] mx-auto px-4 sm:px-6 lg:px-8 py-section-md lg:py-section-lg">
          {(createMutation.isError || deleteMutation.isError) && (
            <Alert
              variant="error"
              title="Something went wrong"
              className="mb-6"
            >
              {createMutation.isError
                ? `${createErrorText} `
                : `${deleteErrorText} `}
              <button
                onClick={() =>
                  createMutation.isError
                    ? createMutation.mutate()
                    : confirmDelete()
                }
                className="font-semibold text-destructive underline underline-offset-2 hover:opacity-80 transition-opacity"
              >
                Retry
              </button>
            </Alert>
          )}

          {creating && (
            <Reveal>
              <Card className="mb-8 p-6">
                <form onSubmit={handleCreate} className="flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <Bell size={18} className="text-primary" />
                    <h2 className="text-foreground font-bold text-lg">
                      Add a Reminder
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="remind-pet"
                        className="text-foreground text-xs font-semibold tracking-wider uppercase font-condensed"
                      >
                        Companion
                      </label>
                      <select
                        id="remind-pet"
                        value={petId || defaultPetId}
                        onChange={(e) => setPetId(e.target.value)}
                        disabled={petsLoading}
                        className="w-full h-12 bg-input-background border border-border rounded-input px-4 text-foreground text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-gentle ease-gentle disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-muted"
                      >
                        {petsLoading ? (
                          <option value="">Loading your pets…</option>
                        ) : (
                          <>
                            <option value="">Select a pet</option>
                            {pets.map((pet) => (
                              <option key={pet.id} value={pet.id}>
                                {pet.name}
                              </option>
                            ))}
                          </>
                        )}
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-foreground text-xs font-semibold tracking-wider uppercase font-condensed">
                        Kind
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          type="button"
                          variant={
                            kind === "vaccination" ? "primary" : "outline"
                          }
                          size="sm"
                          aria-pressed={kind === "vaccination"}
                          onClick={() => setKind("vaccination")}
                        >
                          <Shield size={14} />
                          Vaccination
                        </Button>
                        <Button
                          type="button"
                          variant={
                            kind === "medication" ? "primary" : "outline"
                          }
                          size="sm"
                          aria-pressed={kind === "medication"}
                          onClick={() => setKind("medication")}
                        >
                          <Pill size={14} />
                          Medication
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Input
                    id="remind-title"
                    label="Title"
                    placeholder={
                      kind === "medication"
                        ? "e.g. Heartworm pill"
                        : "e.g. Rabies booster"
                    }
                    maxLength={255}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Textarea
                    id="remind-details"
                    label="Details (optional)"
                    placeholder="e.g. Give with food, in the morning"
                    maxLength={4000}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input
                      id="remind-date"
                      label="Due date"
                      type="date"
                      min={minDate}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                    <Input
                      id="remind-time"
                      label="Due time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>

                  {createValidationError && (
                    <Alert variant="warning" title="Check the form">
                      {createValidationError}
                    </Alert>
                  )}

                  <div className="flex flex-wrap gap-3 pt-1">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      isLoading={createMutation.isPending}
                      disabled={
                        !!createValidationError || createMutation.isPending
                      }
                    >
                      <BellPlus size={15} />
                      Save Reminder
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      onClick={() => {
                        setCreating(false);
                        createMutation.reset();
                      }}
                      disabled={createMutation.isPending}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            </Reveal>
          )}

          {pets.length === 0 && (
            <Reveal>
              <Card className="mb-8">
                <Alert variant="info" title="Add a pet first">
                  Reminders are attached to your pets. Add a pet from
                  your profile to start tracking care schedules.
                </Alert>
              </Card>
            </Reveal>
          )}

          {isLoading ? (
            <div className="flex flex-col gap-5">
              <ReminderSkeleton />
              <ReminderSkeleton />
              <ReminderSkeleton />
            </div>
          ) : isError ? (
            <Alert variant="error" title="Couldn't load your reminders">
              {getErrorMessage(error)}{" "}
              <button
                onClick={() => refetch()}
                className="font-semibold text-destructive underline underline-offset-2 hover:opacity-80 transition-opacity"
              >
                Retry
              </button>
            </Alert>
          ) : reminders.length === 0 ? (
            <Reveal>
              <EmptyState
                icon="search"
                customIcon={Bell}
                title="No reminders yet"
                description="Add a vaccination or medication reminder for your companions, or let your clinic set one after a visit."
                action={
                  creating
                    ? undefined
                    : {
                        label: "Add your first reminder",
                        onClick: () => setCreating(true),
                      }
                }
              />
            </Reveal>
          ) : (
            <div className="flex flex-col gap-5">
              {reminders.map((reminder) => {
                const isDeleting = deletingId === reminder.id;
                if (isDeleting) {
                  return (
                    <Reveal key={reminder.id}>
                      <Card className="p-6 flex flex-col gap-4">
                        <Alert variant="warning" title="Dismiss this reminder?">
                          It will no longer appear in your care schedule. This
                          includes reminders your clinic set automatically.
                        </Alert>
                        <div className="flex flex-wrap gap-3">
                          <Button
                            type="button"
                            variant="destructive"
                            size="md"
                            isLoading={deleteMutation.isPending}
                            disabled={deleteMutation.isPending}
                            onClick={confirmDelete}
                          >
                            <XCircle size={15} />
                            Dismiss Reminder
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="md"
                            onClick={abortDelete}
                            disabled={deleteMutation.isPending}
                          >
                            Keep It
                          </Button>
                        </div>
                      </Card>
                    </Reveal>
                  );
                }
                return (
                  <Reveal key={reminder.id}>
                    <ReminderCard
                      reminder={reminder}
                      isDeleting={false}
                      onDelete={() => beginDelete(reminder.id)}
                    />
                  </Reveal>
                );
              })}
            </div>
          )}

          {reminders.length > 0 && (
            <Reveal>
              <div className="mt-8 flex flex-col gap-2">
                <Alert variant="success" title="What about completed care?">
                  <span className="inline-flex items-start gap-2">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                    <span>
                      Dismiss a reminder once the care is done to keep your
                      schedule tidy. Clinic-set reminders reappear after future
                      visits.
                    </span>
                  </span>
                </Alert>
              </div>
            </Reveal>
          )}
        </div>
      </main>
    </PageShell>
  );
}
