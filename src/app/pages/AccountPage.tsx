"use client";

import { useState, useEffect, useCallback } from "react";
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
  Calendar,
  Users,
  User,
  Lock,
  LayoutDashboard,
  Save,
  RotateCcw,
  CheckCircle2,
  Phone,
  Image as ImageIcon,
  Key,
  Shield,
  Clock,
  Check,
  AlertCircle,
  Smartphone,
  Sliders,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import {
  PageShell,
  Card,
  Reveal,
  Skeleton,
  EmptyState,
  Alert,
  Button,
  Input,
} from "../components/pawguard";
import { PhotoUploadInput } from "../components/PhotoUploadInput";
import { validateOptionalIndianPhone } from "@/lib/utils/validation";
import { useAuth } from "../providers/auth-provider";
import { useFavorites } from "../hooks/useFavorites";
import { useDashboardSummary } from "../hooks/useDashboardSummary";
import { useMyPets } from "../hooks/useMyPets";
import { getErrorMessage } from "@/lib/api";
import { authService } from "@/services/api/auth";
import { notificationsService } from "@/services/api/notifications";
import { cn } from "../components/ui/utils";

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

type SettingsTab = "overview" | "profile" | "notifications" | "security";

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

  // ── Navigation Tab State ───────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<SettingsTab>("overview");

  // ── Profile Form State ──────────────────────────────────────────────────────
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profilePhoneError, setProfilePhoneError] = useState<string | null>(null);

  // Sync user profile data into form state
  useEffect(() => {
    if (user) {
      setFullName(user.full_name ?? "");
      setPhone((user as any).phone ?? "");
      setAvatarUrl((user as any).avatar_url ?? "");
    }
  }, [user]);

  // ── Password / Security Form State ─────────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // ── Notification Preferences State ─────────────────────────────────────────
  const [prefEmail, setPrefEmail] = useState(true);
  const [prefSms, setPrefSms] = useState(false);
  const [prefPush, setPrefPush] = useState(true);
  const [quietStart, setQuietStart] = useState("");
  const [quietEnd, setQuietEnd] = useState("");
  const [isLoadingPrefs, setIsLoadingPrefs] = useState(false);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);
  const [prefsLoaded, setPrefsLoaded] = useState(false);
  const [prefsSuccess, setPrefsSuccess] = useState<string | null>(null);
  const [prefsError, setPrefsError] = useState<string | null>(null);

  const loadNotificationPrefs = useCallback(async () => {
    if (prefsLoaded) return;
    setIsLoadingPrefs(true);
    setPrefsError(null);
    try {
      const prefs = await notificationsService.getPreferences();
      setPrefEmail(prefs.enable_email);
      setPrefSms(prefs.enable_sms);
      setPrefPush(prefs.enable_push);
      setQuietStart(prefs.quiet_hours_start ?? "");
      setQuietEnd(prefs.quiet_hours_end ?? "");
      setPrefsLoaded(true);
    } catch (err) {
      setPrefsError(getErrorMessage(err));
    } finally {
      setIsLoadingPrefs(false);
    }
  }, [prefsLoaded]);

  useEffect(() => {
    if (activeTab === "notifications" && isAuthenticated) {
      void loadNotificationPrefs();
    }
  }, [activeTab, isAuthenticated, loadNotificationPrefs]);

  // ── Form Handlers ──────────────────────────────────────────────────────────
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim()) {
      setProfileError("Full Name is required.");
      return;
    }
    // Phone is optional, but if entered it must be a valid Indian mobile number
    const phoneFormatError = validateOptionalIndianPhone(phone);
    if (phoneFormatError) {
      setProfilePhoneError(phoneFormatError);
      return;
    }
    setProfilePhoneError(null);
    setIsSavingProfile(true);
    setProfileSuccess(null);
    setProfileError(null);
    try {
      await authService.updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim() || null,
        avatar_url: avatarUrl.trim() || null,
      });
      await refreshProfile();
      setProfileSuccess("Your profile information has been updated successfully.");
    } catch (err) {
      setProfileError(getErrorMessage(err));
    } finally {
      setIsSavingProfile(false);
    }
  }

  function handleResetProfile() {
    if (user) {
      setFullName(user.full_name ?? "");
      setPhone((user as any).phone ?? "");
      setAvatarUrl((user as any).avatar_url ?? "");
    }
    setProfileError(null);
    setProfileSuccess(null);
    setProfilePhoneError(null);
  }

  async function handleSavePassword(e: React.FormEvent) {
    e.preventDefault();
    setConfirmPassword("");
    if (!currentPassword) {
      setPasswordError("Current password is required.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }
    setIsSavingPassword(true);
    setPasswordSuccess(null);
    setPasswordError(null);
    try {
      await authService.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess("Your password has been changed successfully.");
    } catch (err) {
      setPasswordError(getErrorMessage(err));
    } finally {
      setIsSavingPassword(false);
    }
  }

  async function handleSavePrefs(e: React.FormEvent) {
    e.preventDefault();
    setIsSavingPrefs(true);
    setPrefsSuccess(null);
    setPrefsError(null);
    try {
      await notificationsService.updatePreferences({
        enable_email: prefEmail,
        enable_sms: prefSms,
        enable_push: prefPush,
        quiet_hours_start: quietStart.trim() || null,
        quiet_hours_end: quietEnd.trim() || null,
      });
      setPrefsSuccess("Notification preferences saved successfully.");
    } catch (err) {
      setPrefsError(getErrorMessage(err));
    } finally {
      setIsSavingPrefs(false);
    }
  }

  // ── Render States ──────────────────────────────────────────────────────────
  if (authStatus === "loading") {
    return (
      <PageShell>
        <main id="main-content" className="flex-1">
          <PageHeader eyebrow="Account" title="My Account" subtitle="Your PawGuard profile and saved dogs." />
          <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-section-md lg:py-section-lg">
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
          <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-section-md lg:py-section-lg">
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
          eyebrow="Account & Settings"
          title={`Welcome${user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}`}
          subtitle="Manage your personal profile, notifications, security settings, and saved dogs."
        />

        <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-section-md lg:py-section-lg flex flex-col gap-8">
          {/* ── Top Profile Card Header ───────────────────────────────────────── */}
          <Reveal>
            <Card>
              <div className="p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center gap-6">
                <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-2xl font-bold uppercase overflow-hidden shadow-sm">
                  {avatarUrl && avatarUrl.startsWith("http") ? (
                    <img src={avatarUrl} alt={user?.full_name ?? "User"} className="w-full h-full object-cover" />
                  ) : (
                    user ? initials(user.full_name) || "U" : "U"
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-foreground font-bold text-2xl truncate">{user?.full_name ?? "Member"}</h2>
                    {user?.is_verified ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5">
                        <ShieldCheck size={12} />
                        Verified Account
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-700 text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5">
                        Unverified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                    <Mail size={14} className="shrink-0" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                  {user && user.roles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {user.roles.map((role: string) => (
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
                <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end">
                  <Link
                    href="/applications"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-xs font-semibold tracking-wider uppercase px-4 py-2 rounded-btn hover:bg-primary-hover transition-all duration-fast"
                  >
                    <FileText size={14} />
                    My Applications
                  </Link>
                  <Link
                    href="/account/pets"
                    className="inline-flex items-center gap-2 bg-card border border-border text-foreground text-xs font-semibold tracking-wider uppercase px-4 py-2 rounded-btn hover:border-primary hover:text-primary transition-all duration-fast"
                  >
                    <PawPrint size={14} />
                    My Pets
                  </Link>
                </div>
              </div>
            </Card>
          </Reveal>

          {/* ── Navigation Tabs ───────────────────────────────────────────────── */}
          <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto scrollbar-none">
            {[
              { id: "overview", label: "Overview & Activity", icon: LayoutDashboard },
              { id: "profile", label: "Profile & Settings", icon: User },
              { id: "notifications", label: "Notifications", icon: Bell },
              { id: "security", label: "Security & Password", icon: Lock },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as SettingsTab)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider font-condensed transition-all duration-fast shrink-0",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-card border border-border text-foreground hover:border-primary/40 hover:text-primary",
                  )}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ── TAB 1: OVERVIEW & ACTIVITY ───────────────────────────────────── */}
          {activeTab === "overview" && (
            <div className="flex flex-col gap-10">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <DashboardCard
                      icon={<PawPrint size={18} />}
                      label="My Pets"
                      count={petsTotal}
                      to="/account/pets"
                      hint="Companion &amp; adopted pets"
                    />
                    <DashboardCard
                      icon={<FileText size={18} />}
                      label="Adoption applications"
                      count={applicationsCount}
                      to="/applications"
                      hint="Track your applications"
                    />
                    <DashboardCard
                      icon={<Calendar size={18} />}
                      label="Vet Appointments"
                      count={(summary as any)?.appointments?.length ?? 0}
                      to="/appointments"
                      hint="Bookings &amp; consultations"
                    />
                    <DashboardCard
                      icon={<Users size={18} />}
                      label="Volunteer Dashboard"
                      count={summary?.volunteer_profile ? 1 : 0}
                      to="/volunteer/dashboard"
                      hint={summary?.volunteer_profile ? "View shifts &amp; status" : "Apply to volunteer"}
                    />
                    <DashboardCard
                      icon={<Siren size={18} />}
                      label="Lost &amp; found reports"
                      count={lostFoundCount}
                      to="/lost-found"
                      hint="Reports &amp; sightings"
                    />
                    <DashboardCard
                      icon={<HeartHandshake size={18} />}
                      label="Rescue cases"
                      count={rescueCount}
                      to="/emergency"
                      hint="Cases &amp; emergency dispatch"
                    />
                    <DashboardCard
                      icon={<PiggyBank size={18} />}
                      label="Donations"
                      count={donationsCount}
                      to="/donate"
                      hint="Contributions made"
                    />
                    <DashboardCard
                      icon={<Bell size={18} />}
                      label="Reminders &amp; Alerts"
                      count={(summary as any)?.reminders?.length ?? 0}
                      to="/reminders"
                      hint="Care &amp; medical alerts"
                    />
                  </div>
                )}
              </section>

              {/* Saved dogs */}
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
          )}

          {/* ── TAB 2: PROFILE & SETTINGS ────────────────────────────────────── */}
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Column */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <Card className="p-6 lg:p-8">
                  <div className="flex flex-col gap-6">
                    <div>
                      <h3 className="text-foreground font-bold text-xl">Personal Information</h3>
                      <p className="text-muted-foreground text-xs mt-1">
                        Update your public profile details. Changes are saved to your account.
                      </p>
                    </div>

                    {profileSuccess && (
                      <Alert variant="success">
                        {profileSuccess}
                      </Alert>
                    )}

                    {profileError && (
                      <Alert variant="error">
                        {profileError}
                      </Alert>
                    )}

                    <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
                      <Input
                        label="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                        prefix={<User size={16} />}
                        required
                      />

                      <Input
                        label="Phone Number"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (profilePhoneError) setProfilePhoneError(null);
                        }}
                        placeholder="+91 98765 43210"
                        prefix={<Phone size={16} />}
                        helper="Used for emergency rescue coordination and volunteer contact. Optional."
                        error={profilePhoneError ?? undefined}
                        inputMode="tel"
                        type="tel"
                      />

                      <PhotoUploadInput
                        label="Profile Photo"
                        required={false}
                        value={avatarUrl}
                        onChange={(_file, dataUrl) => setAvatarUrl(dataUrl)}
                      />

                      <div className="flex items-center gap-3 pt-2">
                        <Button
                          type="submit"
                          variant="primary"
                          size="md"
                          disabled={isSavingProfile}
                        >
                          <Save size={15} />
                          {isSavingProfile ? "Saving..." : "Save Changes"}
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          size="md"
                          onClick={handleResetProfile}
                          disabled={isSavingProfile}
                        >
                          <RotateCcw size={15} />
                          Reset
                        </Button>
                      </div>
                    </form>
                  </div>
                </Card>
              </div>

              {/* Read-Only Account Details Column */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <Card className="p-6 lg:p-8 flex flex-col gap-6">
                  <div>
                    <h3 className="text-foreground font-bold text-xl">Account Identity</h3>
                    <p className="text-muted-foreground text-xs mt-1">
                      System credentials and access permissions.
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="text-foreground text-xs font-semibold tracking-wider uppercase font-condensed block mb-1.5">
                        Email Address (Read-Only)
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <Mail size={16} />
                        </div>
                        <input
                          type="email"
                          readOnly
                          value={user?.email ?? ""}
                          className="w-full h-12 bg-muted/60 border border-border rounded-input pl-12 pr-4 text-foreground text-sm font-mono cursor-not-allowed opacity-90"
                        />
                      </div>
                      <p className="text-muted-foreground text-[11px] mt-1.5">
                        Primary email cannot be modified directly via self-service. Contact support for email updates.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground uppercase tracking-wider font-condensed">
                          Verification Status
                        </span>
                        {user?.is_verified ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-bold px-2.5 py-0.5 border border-emerald-500/25">
                            <Check size={12} /> Verified
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-amber-700 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/25">
                            Pending Verification
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground uppercase tracking-wider font-condensed">
                          Account ID
                        </span>
                        <span className="font-mono text-xs text-muted-foreground truncate max-w-[160px]">
                          {user?.id ?? "N/A"}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1.5 pt-2">
                        <span className="text-xs font-semibold text-foreground uppercase tracking-wider font-condensed">
                          Assigned System Roles
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {user?.roles.map((r: string) => (
                            <span key={r} className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
                              {roleLabel(r)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* ── TAB 3: NOTIFICATION SETTINGS ─────────────────────────────────── */}
          {activeTab === "notifications" && (
            <div className="max-w-3xl flex flex-col gap-6">
              <Card className="p-6 lg:p-8">
                <div className="flex flex-col gap-6">
                  <div>
                    <h3 className="text-foreground font-bold text-xl">Notification Preferences</h3>
                    <p className="text-muted-foreground text-xs mt-1">
                      Choose how PawGuard contacts you about adoption applications, vet reminders, and emergency rescue alerts.
                    </p>
                  </div>

                  {prefsSuccess && (
                    <Alert variant="success">
                      {prefsSuccess}
                    </Alert>
                  )}

                  {prefsError && (
                    <Alert variant="error">
                      {prefsError}
                    </Alert>
                  )}

                  {isLoadingPrefs ? (
                    <div className="flex flex-col gap-4 py-4">
                      <div className="h-12 bg-muted rounded-card animate-pulse" />
                      <div className="h-12 bg-muted rounded-card animate-pulse" />
                      <div className="h-12 bg-muted rounded-card animate-pulse" />
                    </div>
                  ) : (
                    <form onSubmit={handleSavePrefs} className="flex flex-col gap-6">
                      <div className="flex flex-col gap-4">
                        <label className="flex items-start gap-3 p-4 bg-background border border-border rounded-card hover:border-primary/40 transition-colors duration-fast cursor-pointer">
                          <input
                            type="checkbox"
                            checked={prefEmail}
                            onChange={(e) => setPrefEmail(e.target.checked)}
                            className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                          />
                          <div>
                            <span className="block text-foreground font-semibold text-sm">Email Notifications</span>
                            <span className="block text-muted-foreground text-xs mt-0.5">
                              Receive application updates, shelter messages, and care reminders via email.
                            </span>
                          </div>
                        </label>

                        <label className="flex items-start gap-3 p-4 bg-background border border-border rounded-card hover:border-primary/40 transition-colors duration-fast cursor-pointer">
                          <input
                            type="checkbox"
                            checked={prefSms}
                            onChange={(e) => setPrefSms(e.target.checked)}
                            className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                          />
                          <div>
                            <span className="block text-foreground font-semibold text-sm">SMS Text Alerts</span>
                            <span className="block text-muted-foreground text-xs mt-0.5">
                              Receive urgent SMS alerts for emergency rescue dispatch and time-sensitive tasks.
                            </span>
                          </div>
                        </label>

                        <label className="flex items-start gap-3 p-4 bg-background border border-border rounded-card hover:border-primary/40 transition-colors duration-fast cursor-pointer">
                          <input
                            type="checkbox"
                            checked={prefPush}
                            onChange={(e) => setPrefPush(e.target.checked)}
                            className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                          />
                          <div>
                            <span className="block text-foreground font-semibold text-sm">Browser Push Notifications</span>
                            <span className="block text-muted-foreground text-xs mt-0.5">
                              Receive real-time push alerts when logged in to PawGuard.
                            </span>
                          </div>
                        </label>
                      </div>

                      <div className="pt-4 border-t border-border flex flex-col gap-4">
                        <h4 className="text-foreground font-semibold text-sm flex items-center gap-2">
                          <Clock size={16} className="text-primary" />
                          Quiet Hours Schedule
                        </h4>
                        <p className="text-muted-foreground text-xs">
                          Suppress non-emergency notification alerts during specified hours.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input
                            label="Quiet Hours Start"
                            type="text"
                            value={quietStart}
                            onChange={(e) => setQuietStart(e.target.value)}
                            placeholder="e.g. 22:00"
                          />
                          <Input
                            label="Quiet Hours End"
                            type="text"
                            value={quietEnd}
                            onChange={(e) => setQuietEnd(e.target.value)}
                            placeholder="e.g. 07:00"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <Button type="submit" variant="primary" size="md" disabled={isSavingPrefs}>
                          <Save size={15} />
                          {isSavingPrefs ? "Saving Preferences..." : "Save Preferences"}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* ── TAB 4: SECURITY & PASSWORD ───────────────────────────────────── */}
          {activeTab === "security" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Password Form */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <Card className="p-6 lg:p-8">
                  <div className="flex flex-col gap-6">
                    <div>
                      <h3 className="text-foreground font-bold text-xl">Change Password</h3>
                      <p className="text-muted-foreground text-xs mt-1">
                        Update your account password. Must be at least 6 characters long.
                      </p>
                    </div>

                    {passwordSuccess && (
                      <Alert variant="success">
                        {passwordSuccess}
                      </Alert>
                    )}

                    {passwordError && (
                      <Alert variant="error">
                        {passwordError}
                      </Alert>
                    )}

                    <form onSubmit={handleSavePassword} className="flex flex-col gap-5">
                      <Input
                        label="Current Password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        prefix={<Lock size={16} />}
                        required
                      />

                      <Input
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        prefix={<Key size={16} />}
                        helper="Minimum 6 characters long."
                        required
                      />

                      <Input
                        label="Confirm New Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        prefix={<Key size={16} />}
                        required
                      />

                      <div className="pt-2">
                        <Button
                          type="submit"
                          variant="primary"
                          size="md"
                          disabled={isSavingPassword}
                        >
                          <Save size={15} />
                          {isSavingPassword ? "Updating Password..." : "Update Password"}
                        </Button>
                      </div>
                    </form>
                  </div>
                </Card>
              </div>

              {/* Security Status Info */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <Card className="p-6 lg:p-8 flex flex-col gap-6">
                  <div>
                    <h3 className="text-foreground font-bold text-xl">Security & Authentication</h3>
                    <p className="text-muted-foreground text-xs mt-1">
                      Account security status & session controls.
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-xs font-semibold text-foreground uppercase tracking-wider font-condensed">
                        Two-Factor Auth (MFA)
                      </span>
                      {user?.mfa_enabled ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-bold px-2.5 py-0.5 border border-emerald-500/25">
                          <Check size={12} /> Enabled
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full border border-border">
                          Disabled
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-xs font-semibold text-foreground uppercase tracking-wider font-condensed">
                        Session Protocol
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">
                        HTTP-Only Cookie Auth
                      </span>
                    </div>

                    <Alert variant="info" title="Session Security Notice">
                      PawGuard uses encrypted authentication tokens. Updating your password automatically revokes active credentials across other devices.
                    </Alert>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </PageShell>
  );
}
