"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  FileCheck,
  ShieldAlert,
  Award,
  AlertCircle,
  ChevronRight,
  MapPin,
  Users,
} from "lucide-react";
import {
  PageShell,
  Section,
  Card,
  Reveal,
  Button,
  Badge,
  Alert,
  EmptyState,
  Skeleton,
} from "../components/pawguard";
import SectionHeading from "../components/SectionHeading";
import { useAuth } from "../providers/auth-provider";
import { useDashboardSummary } from "../hooks/useDashboardSummary";
import { useApiQuery, getErrorMessage, QUERY_KEYS } from "@/lib/api";
import { communityService } from "@/services/api/community";
import type { VolunteerProfileResponse, VolunteerShiftResponse } from "@/lib/api";

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  applied: { label: "Pending Review", cls: "bg-amber-500/10 text-amber-700 border-amber-500/20" },
  pending: { label: "Pending Review", cls: "bg-amber-500/10 text-amber-700 border-amber-500/20" },
  onboarded: { label: "Orientation Ready", cls: "bg-sky-500/10 text-sky-700 border-sky-500/20" },
  active: { label: "Active Volunteer", cls: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" },
  inactive: { label: "Inactive", cls: "bg-muted text-muted-foreground border-border" },
};

export default function VolunteerDashboardPage() {
  const { isAuthenticated, openAuthDialog } = useAuth();
  const { summary, isLoading: isSummaryLoading } = useDashboardSummary();

  const volunteerProfile = summary?.volunteer_profile
    ? (summary.volunteer_profile as unknown as VolunteerProfileResponse)
    : null;

  const profileId = volunteerProfile?.id;

  // Query shifts if signed in
  const {
    data: shiftsPage,
    isLoading: isShiftsLoading,
    refetch: refetchShifts,
  } = useApiQuery({
    queryKey: QUERY_KEYS.community.volunteerShifts,
    queryFn: () => communityService.listVolunteerShifts({ page_size: 10 }),
    enabled: isAuthenticated && Boolean(volunteerProfile),
  });

  // Query service summary if volunteer profile exists
  const { data: serviceSummary } = useApiQuery({
    queryKey: QUERY_KEYS.community.volunteerServiceSummary(profileId ?? ""),
    queryFn: () => communityService.getVolunteerServiceSummary(profileId!),
    enabled: Boolean(profileId),
  });

  // Query certificate URL if active
  const { data: certData } = useApiQuery({
    queryKey: QUERY_KEYS.community.volunteerCertificate(profileId ?? ""),
    queryFn: () => communityService.getVolunteerCertificate(profileId!),
    enabled: Boolean(profileId) && (volunteerProfile?.status as string) === "active",
  });

  const [joiningShiftId, setJoiningShiftId] = useState<string | null>(null);
  const [shiftError, setShiftError] = useState<string | null>(null);
  const [shiftNotice, setShiftNotice] = useState<string | null>(null);

  async function handleJoinShift(shiftId: string) {
    setJoiningShiftId(shiftId);
    setShiftError(null);
    setShiftNotice(null);
    try {
      await communityService.joinVolunteerShift(shiftId);
      setShiftNotice("Successfully signed up for this shift!");
      refetchShifts();
    } catch (err) {
      setShiftError(getErrorMessage(err));
    } finally {
      setJoiningShiftId(null);
    }
  }

  // 1. Unauthenticated state
  if (!isAuthenticated) {
    return (
      <PageShell>
        <main id="main-content" className="flex-1">
          <Section bg="default" className="min-h-[65vh] flex items-center justify-center">
            <div className="max-w-md w-full mx-auto">
              <EmptyState
                icon="users"
                title="Volunteer Dashboard"
                description="Sign in to view your volunteer status, assigned shifts, skills profile, and service record."
                action={{
                  label: "Sign In",
                  onClick: () => openAuthDialog("sign-in"),
                }}
              />
              <div className="mt-4 text-center">
                <Link href="/volunteer" className="text-xs text-primary font-semibold hover:underline">
                  Don't have an application? Apply to become a volunteer →
                </Link>
              </div>
            </div>
          </Section>
        </main>
      </PageShell>
    );
  }

  // 2. Loading state
  if (isSummaryLoading) {
    return (
      <PageShell>
        <main id="main-content" className="flex-1 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-height)+2rem)] pb-12">
          <Skeleton className="h-10 w-64 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-48 rounded-card lg:col-span-2" />
            <Skeleton className="h-48 rounded-card" />
          </div>
        </main>
      </PageShell>
    );
  }

  // 3. Authenticated without an application
  if (!volunteerProfile) {
    return (
      <PageShell>
        <main id="main-content" className="flex-1">
          <Section bg="default" className="min-h-[60vh] flex items-center justify-center">
            <div className="max-w-md w-full mx-auto text-center flex flex-col gap-6">
              <EmptyState
                icon="search"
                title="No Active Volunteer Profile"
                description="You haven't submitted a PawGuard volunteer application yet. Join our team of animal rescuers, fosters, and shelter supporters."
                action={{
                  label: "Apply Now",
                  to: "/volunteer",
                }}
              />
            </div>
          </Section>
        </main>
      </PageShell>
    );
  }

  const badgeInfo = STATUS_BADGE[volunteerProfile.status] ?? STATUS_BADGE.applied;
  const shifts = shiftsPage?.items ?? [];

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-height)+2rem)] pb-16 flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                  Volunteer Hub
                </h1>
                <span className={`px-3 py-1 text-2xs font-semibold uppercase tracking-wider rounded-full border ${badgeInfo.cls}`}>
                  {badgeInfo.label}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                Track your volunteer journey, upcoming shelter shifts, and service records.
              </p>
            </div>
            <Link href="/account" className="text-xs font-semibold text-primary hover:underline self-start md:self-auto">
              ← Back to Account Overview
            </Link>
          </div>

          {/* Quick Metrics (Only if returned by backend service summary) */}
          {serviceSummary && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card variant="default" className="p-4 flex flex-col gap-1">
                <span className="text-muted-foreground text-2xs uppercase font-condensed font-semibold tracking-wider">
                  Total Hours
                </span>
                <span className="text-2xl font-bold text-foreground font-serif">
                  {(serviceSummary as any).total_hours ?? (serviceSummary as any).hours_contributed ?? 0} hrs
                </span>
              </Card>
              <Card variant="default" className="p-4 flex flex-col gap-1">
                <span className="text-muted-foreground text-2xs uppercase font-condensed font-semibold tracking-wider">
                  Shifts Completed
                </span>
                <span className="text-2xl font-bold text-foreground font-serif">
                  {(serviceSummary as any).shifts_completed ?? (serviceSummary as any).total_shifts ?? 0}
                </span>
              </Card>
              <Card variant="default" className="p-4 flex flex-col gap-1">
                <span className="text-muted-foreground text-2xs uppercase font-condensed font-semibold tracking-wider">
                  Background Check
                </span>
                <span className="text-sm font-bold text-foreground mt-1 flex items-center gap-1.5">
                  {volunteerProfile.background_check_completed ? (
                    <><CheckCircle2 size={14} className="text-emerald-600" /> Completed</>
                  ) : (
                    <><Clock size={14} className="text-amber-600" /> Pending</>
                  )}
                </span>
              </Card>
              <Card variant="default" className="p-4 flex flex-col gap-1">
                <span className="text-muted-foreground text-2xs uppercase font-condensed font-semibold tracking-wider">
                  Certificate Status
                </span>
                <span className="text-sm font-bold text-foreground mt-1 flex items-center gap-1.5">
                  {certData?.download_url ? (
                    <a href={certData.download_url} target="_blank" rel="noreferrer" className="text-primary underline flex items-center gap-1">
                      <Award size={14} /> Download
                    </a>
                  ) : (
                    <span className="text-muted-foreground font-normal">Available on active</span>
                  )}
                </span>
              </Card>
            </div>
          )}

          {/* Pending Application Banner */}
          {((volunteerProfile.status as string) === "applied" || (volunteerProfile.status as string) === "pending") && (
            <Alert variant="warning" title="Application Under Review">
              Your volunteer application was submitted on{" "}
              {new Date(volunteerProfile.created_at).toLocaleDateString()}. Our shelter coordinator reviews applications within 5 business days.
            </Alert>
          )}

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column — Shifts & Activities */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <Reveal>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif font-bold text-2xl text-foreground">
                      Upcoming Shelter Shifts
                    </h2>
                    <span className="text-xs text-muted-foreground">Available to join</span>
                  </div>

                  {shiftNotice && (
                    <Alert variant="info" title="Shift Notice">{shiftNotice}</Alert>
                  )}
                  {shiftError && (
                    <Alert variant="error" title="Shift Error">{shiftError}</Alert>
                  )}

                  {isShiftsLoading ? (
                    <div className="flex flex-col gap-3">
                      <Skeleton className="h-20 w-full rounded-card" />
                      <Skeleton className="h-20 w-full rounded-card" />
                    </div>
                  ) : shifts.length === 0 ? (
                    <Card variant="default" className="p-6 text-center text-muted-foreground text-sm">
                      No upcoming shifts currently scheduled. Check back soon for new opportunities.
                    </Card>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {shifts.map((shift) => (
                        <Card key={shift.id} variant="default" className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/40 transition-colors">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground text-base">
                                {shift.role_name}
                              </span>
                              <span className="text-2xs bg-primary/10 text-primary px-2 py-0.5 rounded font-semibold uppercase">
                                {shift.capacity} spots
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar size={13} />
                                {new Date(shift.start_at).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={13} />
                                {new Date(shift.start_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - {new Date(shift.end_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                          </div>

                          <Button
                            variant="primary"
                            size="sm"
                            disabled={joiningShiftId === shift.id || volunteerProfile.status !== "active"}
                            onClick={() => handleJoinShift(shift.id)}
                            className="shrink-0"
                          >
                            {joiningShiftId === shift.id ? "Signing Up..." : "Sign Up"}
                          </Button>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            </div>

            {/* Right Column — Volunteer Profile Details */}
            <div className="flex flex-col gap-6">
              <Reveal>
                <Card variant="default" className="p-6 flex flex-col gap-5">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <h3 className="font-bold text-foreground text-lg">Volunteer Profile</h3>
                    <User size={18} className="text-primary" />
                  </div>

                  <div className="flex flex-col gap-4 text-sm">
                    <div className="flex flex-col gap-1">
                      <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground font-condensed">
                        Emergency Contact
                      </span>
                      <span className="font-medium text-foreground">
                        {volunteerProfile.emergency_contact_name || "Not provided"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {volunteerProfile.emergency_contact_phone || ""}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground font-condensed">
                        Skills & Specialties
                      </span>
                      <span className="font-medium text-foreground">
                        {volunteerProfile.skills || "General support"}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground font-condensed">
                        Availability
                      </span>
                      <span className="font-medium text-foreground">
                        {volunteerProfile.availability || "Flexible"}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground font-condensed">
                        Animal Experience
                      </span>
                      <span className="text-xs text-muted-foreground leading-relaxed">
                        {volunteerProfile.animal_handling_experience || "None specified"}
                      </span>
                    </div>

                    {volunteerProfile.notes && (
                      <div className="flex flex-col gap-1">
                        <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground font-condensed">
                          Notes / Remarks
                        </span>
                        <span className="text-xs text-muted-foreground leading-relaxed">
                          {volunteerProfile.notes}
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              </Reveal>
            </div>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
