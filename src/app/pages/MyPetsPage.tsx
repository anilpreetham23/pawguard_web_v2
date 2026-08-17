"use client";

import Link from "next/link";
import {
  CalendarDays,
  CalendarClock,
  PawPrint,
  CheckCircle2,
  Stethoscope,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import {
  PageShell,
  Card,
  Reveal,
  Skeleton,
  EmptyState,
  Alert,
  Badge,
} from "../components/pawguard";
import { AddCompanionPetButton } from "../components/AddCompanionPetButton";
import { useAuth } from "../providers/auth-provider";
import { useMyPets } from "../hooks/useMyPets";
import { useAdoptionApplicationsAll } from "../hooks/useAdoptionApplicationsAll";
import { useSafetyTag } from "../hooks/useSafetyTag";
import { getErrorMessage, isApiError } from "@/lib/api";
import type { AdoptionApplicationResponse, CompanionPetResponse } from "@/lib/api";

/** Adoptions that have reached an approved/completed (owned) state. */
const ADOPTED_STATUSES: ReadonlyArray<AdoptionApplicationResponse["status"]> = [
  "approved",
  "completed",
];

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatBirthDate(birthDate: string | null): string {
  if (!birthDate) return "";
  const date = new Date(birthDate);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function speciesLabel(species: string): string {
  if (!species) return "Pet";
  return species.charAt(0).toUpperCase() + species.slice(1);
}

function sexLabel(sex: string | null): string {
  switch ((sex ?? "").toLowerCase()) {
    case "male":
      return "Male";
    case "female":
      return "Female";
    default:
      return sex ?? "";
  }
}

function AdoptedPetCard({ app }: { app: AdoptionApplicationResponse }) {
  const dog = app.dog;
  const completed = app.status === "completed";

  return (
    <Card className="justify-between">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-11 h-11 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
            <PawPrint size={20} className="text-primary" />
          </span>
          <div className="min-w-0">
            <p className="text-foreground font-bold text-base truncate">
              {dog?.name ?? "Adopted pet"}
            </p>
            <p className="text-muted-foreground text-xs">
              {dog?.breed ? `${dog.breed}` : "Dog"}
              {dog?.gender ? ` · ${sexLabel(dog.gender)}` : ""}
            </p>
          </div>
        </div>
        <Badge variant={completed ? "success" : "special"}>
          {completed ? "Adopted" : "Adoption approved"}
        </Badge>
      </div>

      <div className="flex flex-col gap-1 text-sm text-muted-foreground">
        {(app.completed_at || app.updated_at) && (
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-primary shrink-0" />
            {completed ? "Adoption completed" : "Adoption approved"} ·{" "}
            {formatDate(app.completed_at ?? app.updated_at)}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-4">
        <AddCompanionPetButton
          applicationId={app.id}
          dogId={app.dog_id}
          petName={dog?.name ?? app.dog_id}
          breed={dog?.breed ?? null}
          sex={dog?.gender ?? null}
          species="dog"
          size="sm"
        />
        <p className="text-xs text-muted-foreground">
          Manage this pet&apos;s veterinary visits, reminders, and QR safety tag
          through its pet profile.
        </p>
        <Link
          href={`/adopt/${app.dog_id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          View dog profile
          <ArrowRight size={13} />
        </Link>
      </div>
    </Card>
  );
}

function CompanionPetCard({ pet }: { pet: CompanionPetResponse }) {
  const { data: safetyTag, isLoading: tagLoading, isError: tagError } = useSafetyTag(pet.id);

  return (
    <Card className="justify-between">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-11 h-11 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
            <PawPrint size={20} className="text-primary" />
          </span>
          <div className="min-w-0">
            <p className="text-foreground font-bold text-base truncate">{pet.name}</p>
            <p className="text-muted-foreground text-xs">
              {speciesLabel(pet.species)}
              {pet.breed ? ` · ${pet.breed}` : ""}
            </p>
          </div>
        </div>
        <Badge variant="neutral">My Pet</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
        {sexLabel(pet.sex) && <span>Sex: <span className="text-foreground font-medium">{sexLabel(pet.sex)}</span></span>}
        {formatBirthDate(pet.birth_date) && (
          <span>Born: <span className="text-foreground font-medium">{formatBirthDate(pet.birth_date)}</span></span>
        )}
        {pet.breed && <span>Breed: <span className="text-foreground font-medium">{pet.breed}</span></span>}
        <span>
          {pet.is_scan_enabled ? "QR safety tag: On" : "QR safety tag: Off"}
        </span>
      </div>

      {pet.is_scan_enabled && (
        <div className="flex flex-col gap-2 border-t border-border pt-4">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wider font-condensed">Safety Tag</p>
          {tagLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <span className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              Loading safety tag…
            </div>
          ) : tagError ? (
            <p className="text-destructive text-xs">
              {isApiError(tagError) && tagError.isNotFound
                ? "No safety tag provisioned yet."
                : "We couldn't load the safety tag."}
            </p>
          ) : safetyTag ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${safetyTag.is_active ? "text-emerald-700" : "text-muted-foreground"}`}>
                  <span className={`h-2 w-2 rounded-full ${safetyTag.is_active ? "bg-emerald-500" : "bg-muted-foreground/50"}`} />
                  {safetyTag.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Token prefix: <span className="font-mono text-foreground">{safetyTag.token_prefix}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Scans: {safetyTag.scan_count} · Last scanned: {safetyTag.last_scanned_at ? new Date(safetyTag.last_scanned_at).toLocaleString() : "Never"}
              </p>
              <p className="text-xs text-muted-foreground">
                The QR code image can be printed from the admin dashboard.
              </p>
            </div>
          ) : null}
        </div>
      )}

      <div className="flex flex-wrap gap-2 border-t border-border pt-4">
        <Link
          href={`/lost-found/report/lost?pet_id=${pet.id}`}
          className="inline-flex items-center gap-1.5 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold tracking-wider uppercase px-4 py-2.5 rounded-btn hover:bg-destructive hover:text-destructive-foreground transition-all duration-fast"
        >
          <AlertTriangle size={14} />
          Report Pet Lost
        </Link>
        <Link
          href="/appointments/book"
          className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold tracking-wider uppercase font-condensed px-4 py-2.5 rounded-btn hover:bg-primary-hover transition-all duration-fast"
        >
          <Stethoscope size={14} />
          Book vet visit
        </Link>
        <Link
          href="/reminders"
          className="inline-flex items-center gap-1.5 bg-card border border-border text-foreground text-xs font-semibold tracking-wider uppercase px-4 py-2.5 rounded-btn hover:border-primary hover:text-primary transition-all duration-fast"
        >
          <CalendarClock size={14} />
          Reminders
        </Link>
        <Link
          href="/veterinary"
          className="inline-flex items-center gap-1.5 bg-card border border-border text-foreground text-xs font-semibold tracking-wider uppercase px-4 py-2.5 rounded-btn hover:border-primary hover:text-primary transition-all duration-fast"
        >
          <CalendarDays size={14} />
          Veterinary
        </Link>
      </div>
    </Card>
  );
}

export default function MyPetsPage() {
  const { isAuthenticated, status: authStatus, openAuthDialog } = useAuth();
  const isAuthReady = authStatus !== "loading";

  const {
    pets,
    total,
    isLoading: petsLoading,
    isError: petsError,
    error: petsErrorObj,
    refetch: refetchPets,
  } = useMyPets(isAuthenticated);

  const {
    applications,
    isLoading: appsLoading,
    isError: appsError,
    error: appsErrorObj,
    refetch: refetchApps,
  } = useAdoptionApplicationsAll(isAuthenticated);

  const adoptedPets = applications.filter((app) =>
    ADOPTED_STATUSES.includes(app.status)
  );

  const petsAuthError = isApiError(petsErrorObj) && petsErrorObj.isUnauthorized;
  const appsAuthError = isApiError(appsErrorObj) && appsErrorObj.isUnauthorized;

  if (!isAuthReady) {
    return (
      <PageShell>
        <main id="main-content" className="flex-1">
          <PageHeader eyebrow="My Pets" title="My Pets" subtitle="Your adopted pets." />
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-section-md lg:py-section-lg flex flex-col gap-10">
            <div className="h-8 w-44 bg-muted rounded animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-grid-md">
              {[0, 1, 2].map((i) => <Skeleton key={i} className="h-56" />)}
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
          <PageHeader eyebrow="My Pets" title="My Pets" subtitle="Sign in to see your adopted pets." />
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-section-md lg:py-section-lg">
            <Reveal>
              <Card>
                <EmptyState
                  icon="heart"
                  title="Sign in to see your pets"
                  description="Your adopted pets will appear here once you sign in."
                  action={{ label: "Sign in", onClick: () => openAuthDialog("sign-in") }}
                />
              </Card>
            </Reveal>
          </div>
        </main>
      </PageShell>
    );
  }

  const loading = petsLoading || appsLoading;
  const hasError = petsError || appsError;

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <PageHeader
          eyebrow="My Pets"
          title="My Pets"
          subtitle="Your adopted pets and the pet profiles linked to your account."
        />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-section-md lg:py-section-lg flex flex-col gap-12">
          {loading ? (
            <div className="flex flex-col gap-10">
              <p className="text-sm font-semibold text-muted-foreground" role="status">
                Loading your pets…
              </p>
              <div className="h-8 w-48 bg-muted rounded animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-grid-md">
                {[0, 1, 2].map((i) => <Skeleton key={i} className="h-56" />)}
              </div>
            </div>
          ) : hasError ? (
            petsAuthError || appsAuthError ? (
              <Alert variant="error" title="Sign in required">
                Please sign in to view your pets.{" "}
                <button
                  onClick={() => openAuthDialog("sign-in")}
                  className="font-semibold text-destructive underline underline-offset-2 hover:opacity-80 transition-opacity"
                >
                  Sign in now
                </button>
              </Alert>
            ) : (
                <Alert variant="error" title="We couldn't load your pets">
                {petsError ? getErrorMessage(petsErrorObj) : appsError ? getErrorMessage(appsErrorObj) : ""}{" "}
                <button
                  onClick={() => {
                    if (petsError) refetchPets();
                    if (appsError) refetchApps();
                  }}
                  className="font-semibold text-destructive underline underline-offset-2 hover:opacity-80 transition-opacity"
                >
                  Try again
                </button>
              </Alert>
            )
          ) : (
            <>
              {/* ── Adopted pets ─────────────────────────────────────────────── */}
              <section aria-labelledby="adopted-heading" className="flex flex-col gap-5">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 id="adopted-heading" className="text-foreground font-bold text-2xl">
                      Adopted Pets
                      <span className="ml-2 text-sm font-semibold text-muted-foreground align-middle">
                        {adoptedPets.length}
                      </span>
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                      Dogs you&apos;ve adopted through PawGuard, shown once your adoption is approved.
                    </p>
                  </div>
                  <Link
                    href="/adopt"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    Adopt a dog
                    <ArrowRight size={13} />
                  </Link>
                </div>

                {adoptedPets.length === 0 ? (
                  <Card>
                    <EmptyState
                      icon="heart"
                      title="No adopted pets yet"
                      description="When an adoption is approved, the adopted dog will appear here as an Adopted Pet."
                      action={{ label: "Browse adoptable dogs", to: "/adopt" }}
                    />
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-grid-md">
                    {adoptedPets.map((app) => (
                      <AdoptedPetCard key={app.id} app={app} />
                    ))}
                  </div>
                )}
              </section>

              {/* ── My Pets ───────────────────────────────────────────────────── */}
              <section aria-labelledby="companion-heading" className="flex flex-col gap-5">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 id="companion-heading" className="text-foreground font-bold text-2xl">
                      My Pets
                      <span className="ml-2 text-sm font-semibold text-muted-foreground align-middle">
                        {total}
                      </span>
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                      Pets you can use to book veterinary visits, manage reminders, and use the QR safety tag.
                    </p>
                  </div>
                  <Link
                    href="/appointments/book"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    Book a vet visit
                    <ArrowRight size={13} />
                  </Link>
                </div>

                {petsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-grid-md">
                    {[0, 1, 2].map((i) => <Skeleton key={i} className="h-56" />)}
                  </div>
                ) : pets.length === 0 ? (
                  <Card>
                    <EmptyState
                      icon="heart"
                      title="No pets yet"
                      description="Once an adoption is approved you can add your pet from My Applications."
                      action={{ label: "Go to My Applications", to: "/applications" }}
                    />
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-grid-md">
                    {pets.map((pet) => (
                      <CompanionPetCard key={pet.id} pet={pet} />
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </PageShell>
  );
}
