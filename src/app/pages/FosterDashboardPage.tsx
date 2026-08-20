"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  User,
  ArrowRight,
  Calendar,
  Package,
  Heart,
  Info,
  BadgeCheck,
  Plus,
  Send,
  FileText,
  Sparkles,
  Activity,
  Stethoscope,
  Smile,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import SectionHeading from "../components/SectionHeading";
import {
  PageShell,
  Section,
  Card,
  Reveal,
  Button,
  Badge,
  EmptyState,
} from "../components/pawguard";
import { useAuth } from "../providers/auth-provider";
import { useFosterStatus, type FosterLifecycleStatus } from "../hooks/useFosterStatus";
import { useFosterPlacements } from "../hooks/useFosterPlacements";
import { fosterService } from "@/services/api/foster";
import {
  QUERY_KEYS,
  getErrorMessage,
  isApiError,
  useApiQuery,
  type SupplyItemType,
  type FosterPlacementResponse,
} from "@/lib/api";
import { queryClient } from "@/lib/react-query";

const STATUS_CONFIG: Record<
  FosterLifecycleStatus,
  { label: string; badgeVariant: "default" | "urgent" | "success" | "neutral" | "special"; hint: string }
> = {
  NOT_APPLIED: {
    label: "Not Applied",
    badgeVariant: "neutral",
    hint: "You have not submitted a foster application yet.",
  },
  APPLIED: {
    label: "Application Under Review",
    badgeVariant: "special",
    hint: "Your foster profile application has been received and is currently under review by our foster team.",
  },
  APPROVED: {
    label: "Approved Foster Carer",
    badgeVariant: "success",
    hint: "You are an approved PawGuard foster carer, ready for active placement matching.",
  },
  REJECTED: {
    label: "Application Not Approved",
    badgeVariant: "urgent",
    hint: "Your foster application was not approved at this time.",
  },
  INACTIVE: {
    label: "Foster Profile Inactive",
    badgeVariant: "neutral",
    hint: "Your foster profile is currently inactive.",
  },
};

function formatDate(isoString: string | null | undefined): string {
  if (!isoString) return "N/A";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "N/A";
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return "N/A";
  }
}

export default function FosterDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, status: authStatus, openAuthDialog } = useAuth();
  const { status, fosterProfile, isLoading, refetch: refetchStatus } = useFosterStatus();
  const { placements, activePlacement, isLoading: placementsLoading, refetch: refetchPlacements } = useFosterPlacements();

  const selectedPlacement = activePlacement ?? placements[0] ?? null;
  const placementId = selectedPlacement?.id;

  // Placement Progress Logs Query
  const { data: progressLogs = [], refetch: refetchProgress } = useApiQuery({
    queryKey: QUERY_KEYS.foster.placementProgress(placementId ?? ""),
    enabled: Boolean(placementId),
    queryFn: () => fosterService.getPlacementProgress(placementId!),
  });

  // Placement Supply Dispatches Query
  const { data: supplies = [], refetch: refetchSupplies } = useApiQuery({
    queryKey: QUERY_KEYS.foster.placementSupplies(placementId ?? ""),
    enabled: Boolean(placementId),
    queryFn: () => fosterService.getPlacementSupplies(placementId!),
  });

  // Active Modals / Forms State
  const [activeTab, setActiveTab] = useState<"overview" | "progress" | "supplies">("overview");

  // Progress Log Form State
  const [logForm, setLogForm] = useState({
    weight_kg: "",
    mood_rating: "5",
    exercise_minutes: "",
    feeding_notes: "",
    medication_notes: "",
    behavior_notes: "",
    notes: "",
  });
  const [isSubmittingLog, setIsSubmittingLog] = useState(false);
  const [logError, setLogError] = useState<string | null>(null);
  const [logSuccess, setLogSuccess] = useState(false);

  // Supply Request Form State
  const [supplyForm, setSupplyForm] = useState({
    item_type: "food" as SupplyItemType,
    quantity: "1",
    description: "",
  });
  const [isSubmittingSupply, setIsSubmittingSupply] = useState(false);
  const [supplyError, setSupplyError] = useState<string | null>(null);
  const [supplySuccess, setSupplySuccess] = useState(false);

  // Convert to Adopt State
  const [isConverting, setIsConverting] = useState(false);
  const [convertError, setConvertError] = useState<string | null>(null);

  // Progress Log Submit Handler
  const handleProgressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!placementId) return;
    setLogError(null);
    setIsSubmittingLog(true);

    try {
      await fosterService.createPlacementProgress(placementId, {
        weight_kg: logForm.weight_kg ? Number(logForm.weight_kg) : null,
        mood_rating: logForm.mood_rating ? Number(logForm.mood_rating) : null,
        exercise_minutes: logForm.exercise_minutes ? Number(logForm.exercise_minutes) : null,
        feeding_notes: logForm.feeding_notes.trim() || null,
        medication_notes: logForm.medication_notes.trim() || null,
        behavior_notes: logForm.behavior_notes.trim() || null,
        notes: logForm.notes.trim() || null,
      });

      setLogSuccess(true);
      setLogForm({
        weight_kg: "",
        mood_rating: "5",
        exercise_minutes: "",
        feeding_notes: "",
        medication_notes: "",
        behavior_notes: "",
        notes: "",
      });
      void refetchProgress();
      setTimeout(() => setLogSuccess(false), 4000);
    } catch (err: unknown) {
      setLogError(getErrorMessage(err));
    } finally {
      setIsSubmittingLog(false);
    }
  };

  // Supply Request Submit Handler
  const handleSupplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!placementId) return;
    setSupplyError(null);
    setIsSubmittingSupply(true);

    try {
      await fosterService.requestSupplies(placementId, {
        item_type: supplyForm.item_type,
        quantity: Number(supplyForm.quantity) || 1,
        description: supplyForm.description.trim() || null,
      });

      setSupplySuccess(true);
      setSupplyForm({ item_type: "food", quantity: "1", description: "" });
      void refetchSupplies();
      setTimeout(() => setSupplySuccess(false), 4000);
    } catch (err: unknown) {
      setSupplyError(getErrorMessage(err));
    } finally {
      setIsSubmittingSupply(false);
    }
  };

  // Convert to Adopt Handler
  const handleConvertToAdopt = async () => {
    if (!placementId) return;
    if (!confirm("Are you sure you want to convert this active placement into an adoption application?")) {
      return;
    }
    setConvertError(null);
    setIsConverting(true);

    try {
      await fosterService.convertToAdopt(placementId);
      void refetchPlacements();
      void refetchStatus();
      router.push("/applications");
    } catch (err: unknown) {
      setConvertError(getErrorMessage(err));
      setIsConverting(false);
    }
  };

  // 1. Unauthenticated User State
  if (!isAuthenticated || authStatus === "unauthenticated") {
    return (
      <PageShell>
        <main id="main-content" className="flex-1">
          <PageHeader
            eyebrow="Foster Care"
            title="Foster Dashboard"
            subtitle="Track your foster application status, profile capacity, and active placement overview."
          />
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-section-md">
            <Reveal>
              <Card className="p-8">
                <EmptyState
                  customIcon={Home}
                  title="Sign in to view your Foster Dashboard"
                  description="Your foster profile status, care preferences, capacity, and active placement summaries will appear here."
                  action={{
                    label: "Sign In / Register",
                    onClick: () => openAuthDialog("sign-in"),
                  }}
                />
              </Card>
            </Reveal>
          </div>
        </main>
      </PageShell>
    );
  }

  // 2. Loading State
  if (isLoading || placementsLoading) {
    return (
      <PageShell>
        <main id="main-content" className="flex-1">
          <PageHeader
            eyebrow="Foster Care"
            title="Foster Dashboard"
            subtitle="Loading your foster profile information..."
          />
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-section-md flex flex-col gap-6">
            <div className="h-28 bg-muted/40 animate-pulse rounded-card" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="h-32 bg-muted/40 animate-pulse rounded-card" />
              <div className="h-32 bg-muted/40 animate-pulse rounded-card" />
              <div className="h-32 bg-muted/40 animate-pulse rounded-card" />
              <div className="h-32 bg-muted/40 animate-pulse rounded-card" />
            </div>
          </div>
        </main>
      </PageShell>
    );
  }

  // 3. User Has Not Applied State
  if (status === "NOT_APPLIED" || !fosterProfile) {
    return (
      <PageShell>
        <main id="main-content" className="flex-1">
          <PageHeader
            eyebrow="Foster Care"
            title="Foster Dashboard"
            subtitle="Welcome to the PawGuard Foster Care Portal."
          />
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-section-md">
            <Reveal>
              <Card className="p-8">
                <EmptyState
                  customIcon={Home}
                  title="You haven't applied to the Foster Program yet"
                  description="Provide temporary housing, care, and love for dogs recovering from rescue. PawGuard coordinates care and placements for dogs in need."
                  action={{
                    label: "Explore Foster Program & Apply",
                    onClick: undefined,
                  }}
                />
                <div className="flex justify-center mt-4">
                  <Link href="/foster">
                    <Button variant="primary" size="lg">
                      Go to Foster Program Page <ArrowRight size={15} />
                    </Button>
                  </Link>
                </div>
              </Card>
            </Reveal>
          </div>
        </main>
      </PageShell>
    );
  }

  // 4. Authenticated Foster Profile Dashboard
  const statusInfo = STATUS_CONFIG[status] ?? STATUS_CONFIG.APPLIED;

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        {/* ── HEADER ───────────────────────────────────────────────────────── */}
        <PageHeader
          eyebrow="Foster Care Portal"
          title="Foster Dashboard"
          subtitle={`Welcome back${user?.full_name ? `, ${user.full_name}` : ""}. View your profile status, capacity, and active placement summaries.`}
        >
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/foster">
              <Button variant="outline" size="sm">
                Foster Program Page
              </Button>
            </Link>
            <Link href="/account">
              <Button variant="outline" size="sm">
                Account Settings
              </Button>
            </Link>
          </div>
        </PageHeader>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-section-md flex flex-col gap-10">
          {/* ── STATUS CARD BANNER ─────────────────────────────────────────── */}
          <Reveal>
            <Card className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <BadgeCheck size={24} />
                  </span>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-foreground font-bold text-xl">
                        Foster Profile Status
                      </h2>
                      <Badge variant={statusInfo.badgeVariant}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
                      {statusInfo.hint}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col text-right text-xs text-muted-foreground gap-1 shrink-0">
                  <span>Profile ID: <code className="text-foreground font-mono">{fosterProfile.id.slice(0, 8)}...</code></span>
                  <span>Registered: <strong className="text-foreground">{formatDate(fosterProfile.created_at)}</strong></span>
                  <span>Last Updated: <strong className="text-foreground">{formatDate(fosterProfile.updated_at)}</strong></span>
                </div>
              </div>
            </Card>
          </Reveal>

          {/* ── OVERVIEW STATS GRID ─────────────────────────────────────────── */}
          <Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Max Capacity */}
              <Card className="p-6 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Max Capacity
                  </span>
                  <Home size={18} className="text-primary" />
                </div>
                <p className="text-3xl font-bold text-foreground font-serif">
                  {fosterProfile.max_capacity} {fosterProfile.max_capacity === 1 ? "dog" : "dogs"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Maximum concurrent placements
                </p>
              </Card>

              {/* Active Placements Count */}
              <Card className="p-6 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Active Placements
                  </span>
                  <Heart size={18} className="text-primary" />
                </div>
                <p className="text-3xl font-bold text-foreground font-serif">
                  {placements.length > 0 ? placements.length : fosterProfile.active_count}
                </p>
                <p className="text-xs text-muted-foreground">
                  {placements.length === 1 ? "Active dog in care" : "Active dogs in care"}
                </p>
              </Card>

              {/* Availability */}
              <Card className="p-6 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Availability
                  </span>
                  <ShieldCheck size={18} className="text-primary" />
                </div>
                <p className="text-xl font-bold text-foreground font-serif">
                  {fosterProfile.is_available ? "Available" : "Unavailable"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {fosterProfile.is_available ? "Ready for placement matching" : "Paused for new placements"}
                </p>
              </Card>

              {/* Application Date */}
              <Card className="p-6 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Application Date
                  </span>
                  <Calendar size={18} className="text-primary" />
                </div>
                <p className="text-xl font-bold text-foreground font-serif">
                  {formatDate(fosterProfile.created_at)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Profile creation date
                </p>
              </Card>
            </div>
          </Reveal>

          {/* ── PLACEMENT SUMMARY & MANAGEMENT SECTION ─────────────────────── */}
          <Reveal>
            <div className="flex flex-col gap-6">
              <SectionHeading eyebrow="Placements">
                Active Foster Placements & Care Portal
              </SectionHeading>

              {placements.length === 0 ? (
                <Card className="p-8">
                  <EmptyState
                    customIcon={Home}
                    title="No Active Foster Placements"
                    description="You currently have 0 active foster placements assigned. When a rescue dog matching your home profile requires foster care, your coordinator will reach out."
                  />
                </Card>
              ) : (
                <div className="flex flex-col gap-6">
                  {/* Active Placement Card */}
                  {selectedPlacement && (
                    <Card className="p-6 flex flex-col gap-6 border-primary/20 bg-primary/5">
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
                        <div className="flex items-center gap-4">
                          {(selectedPlacement.dog?.image_url ?? selectedPlacement.dog?.photo_url ?? selectedPlacement.dog?.image_urls?.[0]) ? (
                            <img
                              src={(selectedPlacement.dog?.image_url ?? selectedPlacement.dog?.photo_url ?? selectedPlacement.dog?.image_urls?.[0])!}
                              alt={selectedPlacement.dog?.name ?? "Foster Dog"}
                              className="w-16 h-16 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold text-xl">
                              {selectedPlacement.dog?.name?.[0] ?? "D"}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-foreground font-bold text-2xl">
                                {selectedPlacement.dog?.name ?? "Foster Dog"}
                              </h3>
                              <Badge variant="success">Active Placement</Badge>
                            </div>
                            <p className="text-muted-foreground text-sm">
                              {selectedPlacement.dog?.breed ?? "Rescue Dog"} · {selectedPlacement.dog?.gender ?? "Unknown"} · Placed on {formatDate(selectedPlacement.start_date)}
                            </p>
                          </div>
                        </div>

                        {/* Convert to Adopt Button */}
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleConvertToAdopt}
                          disabled={isConverting}
                        >
                          <Sparkles size={14} />
                          {isConverting ? "Processing..." : "Apply to Permanently Adopt"}
                        </Button>
                      </div>

                      {convertError && (
                        <div className="p-3 bg-destructive/10 text-destructive text-xs rounded-card border border-destructive/20">
                          {convertError}
                        </div>
                      )}

                      {/* Tab Selector: Overview vs Care Progress vs Supply Requisition */}
                      <div className="flex items-center gap-2 border-b border-border pb-2">
                        <button
                          type="button"
                          onClick={() => setActiveTab("overview")}
                          className={`px-4 py-2 text-sm font-semibold rounded-card transition-colors ${
                            activeTab === "overview"
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-secondary"
                          }`}
                        >
                          Placement Info
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab("progress")}
                          className={`px-4 py-2 text-sm font-semibold rounded-card transition-colors ${
                            activeTab === "progress"
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-secondary"
                          }`}
                        >
                          Care Progress Logs ({progressLogs.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab("supplies")}
                          className={`px-4 py-2 text-sm font-semibold rounded-card transition-colors ${
                            activeTab === "supplies"
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-secondary"
                          }`}
                        >
                          Supply Requisitions ({supplies.length})
                        </button>
                      </div>

                      {/* TAB 1: OVERVIEW */}
                      {activeTab === "overview" && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="bg-background p-4 rounded-card border border-border">
                            <span className="text-xs font-semibold text-muted-foreground uppercase block mb-1">
                              Placement ID
                            </span>
                            <code className="text-xs text-foreground font-mono">{selectedPlacement.id}</code>
                          </div>
                          <div className="bg-background p-4 rounded-card border border-border">
                            <span className="text-xs font-semibold text-muted-foreground uppercase block mb-1">
                              Placement Start Date
                            </span>
                            <span className="text-foreground font-medium">{formatDate(selectedPlacement.start_date)}</span>
                          </div>
                          <div className="bg-background p-4 rounded-card border border-border">
                            <span className="text-xs font-semibold text-muted-foreground uppercase block mb-1">
                              Placement Notes
                            </span>
                            <span className="text-foreground font-medium">{selectedPlacement.notes || "Standard foster placement"}</span>
                          </div>
                        </div>
                      )}

                      {/* TAB 2: CARE PROGRESS LOGGING */}
                      {activeTab === "progress" && (
                        <div className="flex flex-col gap-6">
                          {/* Progress Log Submission Form */}
                          <div className="bg-background p-6 rounded-card border border-border flex flex-col gap-4">
                            <h4 className="text-foreground font-bold text-base flex items-center gap-2">
                              <Activity size={18} className="text-primary" />
                              Log Daily Care & Progress Update
                            </h4>

                            {logSuccess && (
                              <div className="p-3 bg-emerald-500/10 text-emerald-700 text-xs rounded-card border border-emerald-500/20">
                                Care progress log submitted successfully!
                              </div>
                            )}

                            {logError && (
                              <div className="p-3 bg-destructive/10 text-destructive text-xs rounded-card border border-destructive/20">
                                {logError}
                              </div>
                            )}

                            <form onSubmit={handleProgressSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                              <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                                  Weight (kg)
                                </label>
                                <input
                                  type="number"
                                  step="0.1"
                                  value={logForm.weight_kg}
                                  onChange={(e) => setLogForm({ ...logForm, weight_kg: e.target.value })}
                                  placeholder="e.g. 14.5"
                                  className="w-full rounded-card border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                                  Mood Rating (1 to 5)
                                </label>
                                <select
                                  value={logForm.mood_rating}
                                  onChange={(e) => setLogForm({ ...logForm, mood_rating: e.target.value })}
                                  className="w-full rounded-card border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                  <option value="5">5 - Excellent & Energetic</option>
                                  <option value="4">4 - Happy & Relaxed</option>
                                  <option value="3">3 - Neutral / Calm</option>
                                  <option value="2">2 - Shy / Anxious</option>
                                  <option value="1">1 - Lethargic / Unwell</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                                  Exercise (Minutes)
                                </label>
                                <input
                                  type="number"
                                  value={logForm.exercise_minutes}
                                  onChange={(e) => setLogForm({ ...logForm, exercise_minutes: e.target.value })}
                                  placeholder="e.g. 45"
                                  className="w-full rounded-card border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              </div>

                              <div className="sm:col-span-3">
                                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                                  Feeding & Appetite Notes
                                </label>
                                <input
                                  type="text"
                                  value={logForm.feeding_notes}
                                  onChange={(e) => setLogForm({ ...logForm, feeding_notes: e.target.value })}
                                  placeholder="e.g. Ate full meal, good appetite..."
                                  className="w-full rounded-card border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              </div>

                              <div className="sm:col-span-3">
                                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                                  Medication Check-In
                                </label>
                                <input
                                  type="text"
                                  value={logForm.medication_notes}
                                  onChange={(e) => setLogForm({ ...logForm, medication_notes: e.target.value })}
                                  placeholder="e.g. Administered morning oral medication..."
                                  className="w-full rounded-card border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              </div>

                              <div className="sm:col-span-3">
                                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                                  Behavior & Health Notes
                                </label>
                                <textarea
                                  rows={2}
                                  value={logForm.behavior_notes}
                                  onChange={(e) => setLogForm({ ...logForm, behavior_notes: e.target.value })}
                                  placeholder="e.g. Socialized well with family, learned crate command..."
                                  className="w-full rounded-card border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              </div>

                              <div className="sm:col-span-3 flex justify-end">
                                <Button type="submit" variant="primary" size="sm" disabled={isSubmittingLog}>
                                  <Send size={14} />
                                  {isSubmittingLog ? "Saving Log..." : "Submit Progress Log"}
                                </Button>
                              </div>
                            </form>
                          </div>

                          {/* Log History */}
                          <div className="flex flex-col gap-3">
                            <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              Recent Care Progress Logs ({progressLogs.length})
                            </h5>

                            {progressLogs.length === 0 ? (
                              <p className="text-xs text-muted-foreground italic bg-background p-4 rounded-card border border-border">
                                No progress logs recorded yet for this placement.
                              </p>
                            ) : (
                              progressLogs.map((log) => (
                                <div key={log.id} className="bg-background p-4 rounded-card border border-border flex flex-col gap-2 text-xs">
                                  <div className="flex items-center justify-between text-muted-foreground">
                                    <span>Logged on <strong>{formatDate(log.logged_at)}</strong></span>
                                    {log.mood_rating && <Badge variant="default">Mood: {log.mood_rating}/5</Badge>}
                                  </div>
                                  {log.weight_kg && <p className="text-foreground"><strong>Weight:</strong> {log.weight_kg} kg</p>}
                                  {log.feeding_notes && <p className="text-foreground"><strong>Feeding:</strong> {log.feeding_notes}</p>}
                                  {log.medication_notes && <p className="text-foreground"><strong>Medication:</strong> {log.medication_notes}</p>}
                                  {log.behavior_notes && <p className="text-foreground"><strong>Behavior:</strong> {log.behavior_notes}</p>}
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}

                      {/* TAB 3: SUPPLY REQUISITION REQUESTS */}
                      {activeTab === "supplies" && (
                        <div className="flex flex-col gap-6">
                          {/* Supply Request Form */}
                          <div className="bg-background p-6 rounded-card border border-border flex flex-col gap-4">
                            <h4 className="text-foreground font-bold text-base flex items-center gap-2">
                              <Package size={18} className="text-primary" />
                              Submit Supply Requisition Request
                            </h4>

                            {supplySuccess && (
                              <div className="p-3 bg-emerald-500/10 text-emerald-700 text-xs rounded-card border border-emerald-500/20">
                                Supply request submitted successfully! Shelter team will coordinate dispatch.
                              </div>
                            )}

                            {supplyError && (
                              <div className="p-3 bg-destructive/10 text-destructive text-xs rounded-card border border-destructive/20">
                                {supplyError}
                              </div>
                            )}

                            <form onSubmit={handleSupplySubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                              <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                                  Supply Item Category
                                </label>
                                <select
                                  value={supplyForm.item_type}
                                  onChange={(e) => setSupplyForm({ ...supplyForm, item_type: e.target.value as SupplyItemType })}
                                  className="w-full rounded-card border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                  <option value="food">Dog Food</option>
                                  <option value="crate">Crate / Housing</option>
                                  <option value="medication">Medication / Health</option>
                                  <option value="bedding">Bedding & Blankets</option>
                                  <option value="toys">Toys & Enrichment</option>
                                  <option value="other">Other Supplies</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                                  Quantity Requested
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  value={supplyForm.quantity}
                                  onChange={(e) => setSupplyForm({ ...supplyForm, quantity: e.target.value })}
                                  className="w-full rounded-card border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              </div>

                              <div className="sm:col-span-3">
                                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                                  Supply Description / Request Details
                                </label>
                                <input
                                  type="text"
                                  value={supplyForm.description}
                                  onChange={(e) => setSupplyForm({ ...supplyForm, description: e.target.value })}
                                  placeholder="e.g. Puppy dry kibble 5kg bag..."
                                  className="w-full rounded-card border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              </div>

                              <div className="sm:col-span-3 flex justify-end">
                                <Button type="submit" variant="primary" size="sm" disabled={isSubmittingSupply}>
                                  <Send size={14} />
                                  {isSubmittingSupply ? "Sending Request..." : "Request Supplies"}
                                </Button>
                              </div>
                            </form>
                          </div>

                          {/* Supply Dispatch History */}
                          <div className="flex flex-col gap-3">
                            <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              Supply Dispatches & Requisition History ({supplies.length})
                            </h5>

                            {supplies.length === 0 ? (
                              <p className="text-xs text-muted-foreground italic bg-background p-4 rounded-card border border-border">
                                No supply dispatches recorded yet for this placement.
                              </p>
                            ) : (
                              supplies.map((s) => (
                                <div key={s.id} className="bg-background p-4 rounded-card border border-border flex items-center justify-between text-xs">
                                  <div>
                                    <span className="font-bold text-foreground uppercase">{s.item_type}</span>
                                    {s.description && <p className="text-muted-foreground mt-0.5">{s.description}</p>}
                                  </div>
                                  <div className="text-right">
                                    <Badge variant="default">Qty: {s.quantity}</Badge>
                                    <span className="block text-muted-foreground text-2xs mt-1">{formatDate(s.dispatched_at)}</span>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </Card>
                  )}
                </div>
              )}
            </div>
          </Reveal>

          {/* ── PREFERENCES & NOTES DETAIL CARD ────────────────────────────── */}
          <Reveal>
            <Card className="p-6 flex flex-col gap-4">
              <h3 className="text-foreground font-bold text-lg border-b border-border pb-3">
                Care Preferences & Registered Notes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                    Care Preference
                  </span>
                  <p className="text-foreground font-medium bg-secondary/50 p-3 rounded-card border border-border/50">
                    {fosterProfile.preferences || "General Foster Care"}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                    Additional Notes & Background
                  </span>
                  <p className="text-foreground font-medium bg-secondary/50 p-3 rounded-card border border-border/50">
                    {fosterProfile.notes || "No additional notes provided."}
                  </p>
                </div>
              </div>
            </Card>
          </Reveal>

          {/* ── QUICK LINKS & NAVIGATION ───────────────────────────────────── */}
          <Reveal>
            <div className="flex justify-between items-center gap-4 flex-wrap border-t border-border pt-6">
              <div className="flex items-center gap-3">
                <Link href="/foster">
                  <Button variant="outline" size="sm">
                    Foster Program Overview
                  </Button>
                </Link>
                <Link href="/emergency">
                  <Button variant="outline" size="sm">
                    Emergency Rescue
                  </Button>
                </Link>
              </div>
              <Link href="/account">
                <Button variant="secondary" size="sm">
                  My Account & Settings <ArrowRight size={13} />
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </main>
    </PageShell>
  );
}
