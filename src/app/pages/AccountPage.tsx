"use client";

import Link from "next/link";
import {
  Bell,
  FileText,
  Heart,
  Mail,
  PawPrint,
  ShieldCheck,
  Trash2,
  ChevronRight,
  HeartHandshake,
  Siren,
  PiggyBank,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import { PageShell, Card, Reveal, Skeleton, EmptyState, Alert } from "../components/pawguard";
import { useAuth } from "../providers/auth-provider";
import { useFavorites } from "../hooks/useFavorites";
import { useDashboardSummary } from "../hooks/useDashboardSummary";
import { useMyPets } from "../hooks/useMyPets";
import { getErrorMessage } from "@/lib/api";

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function roleLabel(role: string): string {
  switch (role.toLowerCase()) {
    case "adopter":
      return "Adopter";
    case "volunteer":
      return "Volunteer";
    case "donor":
      return "Donor";
    case "foster":
      return "Foster";
    case "admin":
      return "Admin";
    default:
      return role;
  }
}

function DashboardCard({
  icon,
  label,
  count,
  to,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  to?: string;
  hint?: string;
}) {
  const inner = (
    <Card className="h-full transition-all duration-fast hover:border-primary/40 hover:shadow-sm">
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </span>
          <span className="text-2xl font-bold text-foreground font-mono">{count}</span>
        </div>
        <div>
          <p className="text-foreground font-semibold text-sm">{label}</p>
          {hint && <p className="text-muted-foreground text-xs mt-0.5">{hint}</p>}
        </div>
      </div>
    </Card>
  );

  return to ? (
    <Link
      href={to}
      className="block h-full group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring/60 rounded-card"
    >
      {inner}
    </Link>
  ) : (
    inner
  );
}

function SavedDogCard({
  id,
  name,
  breed,
  age,
  gender,
  emoji,
  tone,
  onRemove,
}: {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: string;
  emoji?: string;
  tone?: string;
  onRemove: () => void;
}) {
  const TONES: Record<string, string> = {
    amber: "from-amber-200/90 via-orange-100 to-amber-100",
    purple: "from-violet-200/90 via-purple-100 to-indigo-100",
    sky: "from-sky-200/90 via-cyan-100 to-sky-100",
    rose: "from-rose-200/90 via-pink-100 to-rose-100",
    teal: "from-teal-200/90 via-emerald-100 to-teal-100",
  };

  return (
    <div className="group bg-card border border-border rounded-card overflow-hidden shadow-sm flex flex-col transition-all duration-fast hover:border-primary/40 hover:shadow-md">
      <div
        aria-hidden="true"
        className={`relative aspect-[4/3] flex items-center justify-center bg-gradient-to-br ${TONES[tone ?? ""] ?? TONES.amber}`}
      >
        <span className="text-6xl leading-none drop-shadow-sm select-none">{emoji ?? "🐶"}</span>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${name} from saved`}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-muted-foreground hover:text-destructive hover:bg-white shadow-sm transition-colors duration-fast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring/60"
        >
          <Trash2 size={15} />
        </button>
      </div>
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <p className="text-foreground font-bold text-base truncate">{name}</p>
        <p className="text-muted-foreground text-xs">{breed} &middot; {age} &middot; {gender}</p>
        <Link
          href={`/adopt/${id}`}
          className="mt-auto pt-2 inline-flex items-center gap-1 text-primary text-xs font-semibold hover:underline"
        >
          View profile
          <ChevronRight size={13} />
        </Link>
      </div>
    </div>
  );
}

export default function AccountPage() {
  const { user, isAuthenticated, status: authStatus, openAuthDialog, refreshProfile } = useAuth();
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  const {
    summary,
    isLoading: dashboardLoading,
    isError: dashboardError,
    error: dashboardErrorObj,
    refetch: refetchDashboard,
  } = useDashboardSummary();
  const { total: petsTotal } = useMyPets(isAuthenticated);

  if (authStatus === "loading") {
    return (
      <PageShell>
        <main id="main-content" className="flex-1">
          <PageHeader eyebrow="Account" title="My Account" subtitle="Your PawGuard profile and saved dogs." />
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-section-md lg:py-section-lg">
            <div className="flex flex-col gap-6">
              <div className="h-56 rounded-card bg-muted animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[0, 1, 2, 3].map((i) => <div key={i} className="h-28 rounded-card bg-muted animate-pulse" />)}
              </div>
              <div className="h-40 rounded-card bg-muted animate-pulse" />
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
          <PageHeader eyebrow="Account" title="My Account" subtitle="Sign in to view your profile, activity, and saved dogs." />
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-section-md lg:py-section-lg">
            <Reveal>
              <Card>
                <EmptyState
                  icon="heart"
                  title="Sign in to see your account"
                  description="Your adoption applications, donations, rescue activity, and saved dogs will appear here."
                  action={{ label: "Sign in", onClick: () => openAuthDialog("sign-in") }}
                />
              </Card>
            </Reveal>
          </div>
        </main>
      </PageShell>
    );
  }

  const applicationsCount = summary?.adoption_applications?.length ?? 0;
  const rescueCount = summary?.rescue_cases?.length ?? 0;
  const donationsCount = summary?.donations?.length ?? 0;
  const lostFoundCount = summary?.lost_found_reports?.length ?? 0;

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <PageHeader
          eyebrow="Account"
          title={`Welcome${user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}`}
          subtitle="Your PawGuard profile, activity, and the dogs you've saved."
        />

        <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-section-md lg:py-section-lg flex flex-col gap-10">
          {/* ── Profile card ─────────────────────────────────────────────────── */}
          <Reveal>
            <Card>
              <div className="p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center gap-6">
                <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-2xl font-bold uppercase">
                  {user ? initials(user.full_name) || "U" : "U"}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-foreground font-bold text-2xl truncate">{user?.full_name ?? "Member"}</h2>
                    {user?.is_verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5">
                        <ShieldCheck size={12} />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                    <Mail size={14} />
                    <span className="truncate">{user?.email}</span>
                  </div>
                  {user && user.roles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {user.roles.map((role) => (
                        <span
                          key={role}
                          className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full"
                        >
                          {roleLabel(role)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 lg:items-end">
                  <Link
                    href="/applications"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-xs font-semibold tracking-wider uppercase px-5 py-2.5 rounded-btn hover:bg-primary-hover transition-all duration-fast"
                  >
                    <FileText size={14} />
                    My Applications
                  </Link>
                  <Link
                    href="/account/pets"
                    className="inline-flex items-center gap-2 bg-card border border-border text-foreground text-xs font-semibold tracking-wider uppercase px-5 py-2.5 rounded-btn hover:border-primary hover:text-primary transition-all duration-fast"
                  >
                    <PawPrint size={14} />
                    My Pets
                  </Link>
                  <Link
                    href="/notifications"
                    className="inline-flex items-center gap-2 bg-card border border-border text-foreground text-xs font-semibold tracking-wider uppercase px-5 py-2.5 rounded-btn hover:border-primary hover:text-primary transition-all duration-fast"
                  >
                    <Bell size={14} />
                    Notifications
                  </Link>
                  <button
                    type="button"
                    onClick={() => { void refreshProfile(); }}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors duration-fast underline underline-offset-2"
                  >
                    Refresh profile
                  </button>
                </div>
              </div>
            </Card>
          </Reveal>

          {/* ── Activity summary ────────────────────────────────────────────── */}
          <section aria-labelledby="activity-heading" className="flex flex-col gap-4">
            <div className="flex items-end justify-between">
              <div>
                <h2 id="activity-heading" className="text-foreground font-bold text-2xl">Your activity</h2>
                <p className="text-muted-foreground text-sm mt-1">A summary of your PawGuard involvement.</p>
              </div>
            </div>

            {dashboardLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[0, 1, 2, 3].map((i) => <div key={i} className="h-28 rounded-card bg-muted animate-pulse" />)}
              </div>
            ) : dashboardError ? (
              <Alert variant="error" title="Couldn't load your activity summary">
                {getErrorMessage(dashboardErrorObj)}{" "}
                <button onClick={() => refetchDashboard()} className="font-semibold text-destructive underline underline-offset-2 hover:opacity-80 transition-opacity">
                  Retry
                </button>
              </Alert>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <DashboardCard
                  icon={<PawPrint size={18} />}
                  label="My Pets"
                  count={petsTotal}
                  to="/account/pets"
                  hint="Companion &amp; adopted pets"
                />
                <DashboardCard
                  icon={<PawPrint size={18} />}
                  label="Adoption applications"
                  count={applicationsCount}
                  to="/applications"
                  hint="Track your applications"
                />
                <DashboardCard
                  icon={<HeartHandshake size={18} />}
                  label="Rescue cases"
                  count={rescueCount}
                  hint="Cases you've reported"
                />
                <DashboardCard
                  icon={<PiggyBank size={18} />}
                  label="Donations"
                  count={donationsCount}
                  hint="Contributions made"
                />
                <DashboardCard
                  icon={<Siren size={18} />}
                  label="Lost &amp; found reports"
                  count={lostFoundCount}
                  hint="Reports you've submitted"
                />
              </div>
            )}
          </section>

          {/* ── Saved dogs ──────────────────────────────────────────────────── */}
          <section aria-labelledby="saved-heading" className="flex flex-col gap-4">
            <div className="flex items-end justify-between">
              <div>
                <h2 id="saved-heading" className="text-foreground font-bold text-2xl">
                  Saved dogs
                  <span className="ml-2 text-sm font-semibold text-muted-foreground align-middle">
                    {favorites.length} saved
                  </span>
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Dogs you've marked with a heart while browsing. Stored on this device.
                </p>
              </div>
              {favorites.length > 0 && (
                <button
                  type="button"
                  onClick={clearFavorites}
                  className="text-xs text-destructive font-semibold hover:underline underline-offset-2"
                >
                  Clear all
                </button>
              )}
            </div>

            {favorites.length === 0 ? (
              <Card>
                <EmptyState
                  icon="heart"
                  title="No saved dogs yet"
                  description="Tap the heart on any adoptable dog to keep it here for later."
                  action={{ label: "Browse adoptable dogs", to: "/adopt" }}
                />
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-grid-md">
                {favorites.map((dog) => (
                  <SavedDogCard
                    key={dog.id}
                    id={dog.id}
                    name={dog.name}
                    breed={dog.breed}
                    age={dog.age}
                    gender={dog.gender}
                    emoji={dog.emoji}
                    tone={dog.tone}
                    onRemove={() => removeFavorite(dog.id)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </PageShell>
  );
}
