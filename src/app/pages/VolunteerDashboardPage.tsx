"use client";

import { useState, useMemo } from "react";
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
  Briefcase,
  CheckSquare,
  LogIn,
  LogOut,
  FileText,
  History,
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
import { useAuth } from "../providers/auth-provider";
import { useDashboardSummary } from "../hooks/useDashboardSummary";
import { useVolunteerStatus } from "../hooks/useVolunteerStatus";
import { useApiQuery, getErrorMessage, QUERY_KEYS } from "@/lib/api";
import { communityService } from "@/services/api/community";
import { queryClient } from "@/lib/react-query";
import type {
  VolunteerProfileResponse,
  VolunteerShiftResponse,
  ShiftAttendanceResponse,
  Page,
} from "@/lib/api";

const STATUS_BADGE: Record<string, { label: string; cls: string; hint: string }> = {
  NOT_APPLIED: {
    label: "Not Applied",
    cls: "bg-muted text-muted-foreground border-border",
    hint: "You have not submitted a volunteer application yet.",
  },
  PENDING: {
    label: "Pending Review",
    cls: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    hint: "Your application is currently being reviewed by our shelter team.",
  },
  applied: {
    label: "Pending Review",
    cls: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    hint: "Your application is currently being reviewed by our shelter team.",
  },
  pending: {
    label: "Pending Review",
    cls: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    hint: "Your application is under review.",
  },
  onboarded: {
    label: "Orientation Ready",
    cls: "bg-sky-500/10 text-sky-700 border-sky-500/20",
    hint: "Your application was accepted! Complete orientation to activate your profile.",
  },
  ACTIVE: {
    label: "Active Volunteer",
    cls: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    hint: "You are an active PawGuard volunteer.",
  },
  active: {
    label: "Active Volunteer",
    cls: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    hint: "You are an active PawGuard volunteer.",
  },
  REJECTED: {
    label: "Application Declined",
    cls: "bg-destructive/10 text-destructive border-destructive/20",
    hint: "Your volunteer application was not approved at this time.",
  },
  rejected: {
    label: "Application Declined",
    cls: "bg-destructive/10 text-destructive border-destructive/20",
    hint: "Your volunteer application was not approved at this time.",
  },
  INACTIVE: {
    label: "Inactive Profile",
    cls: "bg-muted text-muted-foreground border-border",
    hint: "Your volunteer profile is currently inactive.",
  },
  inactive: {
    label: "Inactive Profile",
    cls: "bg-muted text-muted-foreground border-border",
    hint: "Your volunteer profile is currently inactive.",
  },
};

/**
 * Extract and normalize volunteer skills and applied roles into a lowercase Set.
 * Supports comma-separated strings (e.g. "Grooming, Transport, Photography")
 * and "Role: <Name>" prefixes.
 */
function parseVolunteerSkills(
  rawSkills: string | null | undefined,
  roleApplied?: string | null | undefined
): Set<string> {
  const normalized = new Set<string>();
  const stringsToParse = [rawSkills, roleApplied].filter(Boolean) as string[];

  for (const raw of stringsToParse) {
    const cleaned = raw.replace(/^Role:\s*/i, "");
    const parts = cleaned.split(",");
    for (const part of parts) {
      const trimmed = part.trim().toLowerCase();
      if (trimmed) {
        normalized.add(trimmed);
      }
    }
  }

  return normalized;
}

/**
 * Determines if a shift is eligible for a volunteer based on their approved skills.
 * Shifts that the user has already joined (My Shifts) are always visible regardless of skills.
 */
function isShiftEligible(
  shiftRoleName: string,
  userSkills: Set<string>,
  isAlreadyJoined: boolean
): boolean {
  // Requirement 6: Do NOT filter My Shifts (shifts already claimed by the volunteer)
  if (isAlreadyJoined) return true;

  // If user has no skills specified, do not block open shifts
  if (userSkills.size === 0) return true;

  const normalizedRole = shiftRoleName.trim().toLowerCase();

  // Exact match
  if (userSkills.has(normalizedRole)) return true;

  // Partial / substring match (e.g. "shelter support" in "shelter support & dog walking")
  for (const skill of userSkills) {
    if (normalizedRole.includes(skill) || skill.includes(normalizedRole)) {
      return true;
    }
  }

  return false;
}

function formatDistance(meters: number): string {
  if (meters >= 1000) {
    const km = (meters / 1000).toFixed(2).replace(/\.?0+$/, "");
    return `${km} km`;
  }
  return `${Math.round(meters)} m`;
}

function formatGeofenceErrorMessage(rawMsg: string): string {
  const distMatch =
    rawMsg.match(/(\d+(?:\.\d+)?)\s*(?:meters|meter|m|km)\s*(?:away|from)/i) ||
    rawMsg.match(/(\d+(?:\.\d+)?)\s*(?:meters|meter|m)\b/i);

  const radMatch =
    rawMsg.match(/(?:radius|allowed|geofence)[^0-9]*(\d+(?:\.\d+)?)\s*(?:meters|meter|m|km)/i) ||
    rawMsg.match(/exceeds[^0-9]*(\d+(?:\.\d+)?)\s*(?:meters|meter|m|km)/i);

  if (distMatch && radMatch) {
    let distVal = parseFloat(distMatch[1]);
    if (distMatch[0].toLowerCase().includes("km")) distVal *= 1000;

    let radVal = parseFloat(radMatch[1]);
    if (radMatch[0].toLowerCase().includes("km")) radVal *= 1000;

    return `You're outside the allowed location for this shift.\n\nYou are approximately ${formatDistance(distVal)} away from the assigned location.\nAllowed radius: ${formatDistance(radVal)}.\n\nPlease move closer to the shift location and try again.`;
  }

  if (distMatch) {
    let distVal = parseFloat(distMatch[1]);
    if (distMatch[0].toLowerCase().includes("km")) distVal *= 1000;
    return `You're outside the allowed location for this shift.\n\nYou are approximately ${formatDistance(distVal)} away from the assigned location.\n\nPlease move closer to the shift location and try again.`;
  }

  if (rawMsg && rawMsg !== "Error") {
    return rawMsg;
  }

  return "You're outside the allowed location for this shift. Please move closer to the shift location and try again.";
}

interface GPSCoordinates {
  latitude: number;
  longitude: number;
}

/**
 * Obtains current GPS coordinates from the browser's Geolocation API.
 * Maps permissions, timeouts, and availability errors into clean user messages.
 */
function getCurrentGPSLocation(): Promise<GPSCoordinates> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      return reject(
        new Error("Geolocation is not supported by your browser.")
      );
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(
              new Error(
                "Location permission was denied. Please allow location access in your browser settings to verify your shift location."
              )
            );
            break;
          case error.POSITION_UNAVAILABLE:
            reject(
              new Error(
                "GPS location is unavailable. Please ensure location services are enabled on your device and try again."
              )
            );
            break;
          case error.TIMEOUT:
            reject(
              new Error(
                "GPS location request timed out. Please try again."
              )
            );
            break;
          default:
            reject(
              new Error(
                "Unable to obtain GPS location. Please try again."
              )
            );
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

export default function VolunteerDashboardPage() {
  const { user, isAuthenticated, status: authStatus, openAuthDialog } = useAuth();
  const {
    summary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
    error: summaryError,
    refetch: refetchSummary,
  } = useDashboardSummary();

  const {
    volunteerStatus,
    isLoading: isStatusLoading,
    isError: isStatusError,
    error: statusError,
    refetch: refetchStatus,
  } = useVolunteerStatus();

  const volunteerProfile =
    volunteerStatus?.profile ??
    (summary?.volunteer_profile as VolunteerProfileResponse | null);

  const applicationInfo = volunteerStatus?.application;
  const vLifecycleStatus =
    volunteerStatus?.status ??
    (volunteerProfile
      ? volunteerProfile.status === "active"
        ? "ACTIVE"
        : volunteerProfile.status === "rejected"
        ? "REJECTED"
        : volunteerProfile.status === "inactive"
        ? "INACTIVE"
        : "PENDING"
      : "NOT_APPLIED");

  const canApply = volunteerStatus ? volunteerStatus.can_apply : !volunteerProfile;
  const canReapply = volunteerStatus ? volunteerStatus.can_reapply : false;
  const profileId = volunteerProfile?.id;

  // Query shifts if signed in
  const {
    data: shiftsPage,
    isLoading: isShiftsLoading,
    refetch: refetchShifts,
  } = useApiQuery({
    queryKey: QUERY_KEYS.community.volunteerShifts,
    queryFn: () => communityService.listVolunteerShifts({ page_size: 10 }),
    enabled: isAuthenticated && Boolean(volunteerProfile) && vLifecycleStatus === "ACTIVE",
  });

  // Query attendance / claimed shifts for the current volunteer
  const {
    data: rawAttendanceData,
    isLoading: isAttendanceLoading,
    refetch: refetchAttendance,
  } = useApiQuery({
    queryKey: QUERY_KEYS.community.myAttendance,
    queryFn: () => communityService.getMyAttendance(),
    enabled: isAuthenticated && Boolean(volunteerProfile) && vLifecycleStatus === "ACTIVE",
  });

  const attendanceItems = useMemo(() => {
    if (!rawAttendanceData) return [];
    if (Array.isArray(rawAttendanceData)) return rawAttendanceData;
    return (rawAttendanceData as Page<ShiftAttendanceResponse>).items ?? [];
  }, [rawAttendanceData]);

  // Build a reliable map of shift_id -> attendance record
  const attendanceByShiftId = useMemo(() => {
    const map = new Map<string, ShiftAttendanceResponse>();
    for (const att of attendanceItems) {
      if (att.shift_id) {
        map.set(att.shift_id, att);
      }
      if (att.shift?.id) {
        map.set(att.shift.id, att);
      }
    }
    return map;
  }, [attendanceItems]);

  const completedAttendanceItems = useMemo(() => {
    return attendanceItems.filter((att) => {
      const status = (att.status ?? "").toLowerCase();
      return (
        Boolean(att.check_out_at) ||
        status === "completed" ||
        status === "checked_out"
      );
    });
  }, [attendanceItems]);

  // Query service summary if volunteer profile exists
  const { data: serviceSummary, refetch: refetchSummaryData } = useApiQuery({
    queryKey: QUERY_KEYS.community.volunteerServiceSummary(profileId ?? ""),
    queryFn: () => communityService.getVolunteerServiceSummary(profileId!),
    enabled: Boolean(profileId),
  });

  // Query certificate URL if active
  const { data: certData } = useApiQuery({
    queryKey: QUERY_KEYS.community.volunteerCertificate(profileId ?? ""),
    queryFn: () => communityService.getVolunteerCertificate(profileId!),
    enabled: Boolean(profileId) && vLifecycleStatus === "ACTIVE",
  });

  const [joiningShiftId, setJoiningShiftId] = useState<string | null>(null);
  const [checkingInId, setCheckingInId] = useState<string | null>(null);
  const [checkingOutId, setCheckingOutId] = useState<string | null>(null);
  const [shiftError, setShiftError] = useState<string | null>(null);
  const [shiftNotice, setShiftNotice] = useState<string | null>(null);
  const [showShiftHistory, setShowShiftHistory] = useState(false);

  const refetchAllQueries = () => {
    void refetchShifts();
    void refetchAttendance();
    void refetchSummaryData();
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.community.myAttendance });
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.community.volunteerShifts });
    if (profileId) {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.community.volunteerServiceSummary(profileId),
      });
    }
  };

  async function handleJoinShift(shiftId: string) {
    setJoiningShiftId(shiftId);
    setShiftError(null);
    setShiftNotice(null);
    try {
      await communityService.joinVolunteerShift(shiftId);
      setShiftNotice("Successfully signed up for this shift!");
      refetchAllQueries();
    } catch (err) {
      setShiftError(getErrorMessage(err));
    } finally {
      setJoiningShiftId(null);
    }
  }

  async function handleCheckIn(attendanceId: string) {
    setCheckingInId(attendanceId);
    setShiftError(null);
    setShiftNotice(null);
    try {
      let coords: GPSCoordinates | undefined;
      try {
        coords = await getCurrentGPSLocation();
      } catch (gpsErr) {
        setShiftError(
          gpsErr instanceof Error ? gpsErr.message : "Unable to acquire location."
        );
        setCheckingInId(null);
        return;
      }

      await communityService.checkInShift(attendanceId, {
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      setShiftNotice("Checked in successfully! Thank you for your service.");
      refetchAllQueries();
    } catch (err) {
      const rawMsg = getErrorMessage(err);
      const isLocationError =
        rawMsg.toLowerCase().includes("location") ||
        rawMsg.toLowerCase().includes("geofence") ||
        rawMsg.toLowerCase().includes("distance") ||
        rawMsg.toLowerCase().includes("outside") ||
        rawMsg.toLowerCase().includes("coordinate") ||
        rawMsg.toLowerCase().includes("meters");

      if (isLocationError) {
        setShiftError(formatGeofenceErrorMessage(rawMsg));
      } else {
        setShiftError(rawMsg);
      }
    } finally {
      setCheckingInId(null);
    }
  }

  async function handleCheckOut(attendanceId: string) {
    setCheckingOutId(attendanceId);
    setShiftError(null);
    setShiftNotice(null);
    try {
      let coords: GPSCoordinates | undefined;
      try {
        coords = await getCurrentGPSLocation();
      } catch (gpsErr) {
        setShiftError(
          gpsErr instanceof Error ? gpsErr.message : "Unable to acquire location."
        );
        setCheckingOutId(null);
        return;
      }

      await communityService.checkOutShift(attendanceId, {
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      setShiftNotice("Checked out successfully! Hours logged.");
      refetchAllQueries();
    } catch (err) {
      const rawMsg = getErrorMessage(err);
      const isLocationError =
        rawMsg.toLowerCase().includes("location") ||
        rawMsg.toLowerCase().includes("geofence") ||
        rawMsg.toLowerCase().includes("distance") ||
        rawMsg.toLowerCase().includes("outside") ||
        rawMsg.toLowerCase().includes("coordinate") ||
        rawMsg.toLowerCase().includes("meters");

      if (isLocationError) {
        setShiftError(formatGeofenceErrorMessage(rawMsg));
      } else {
        setShiftError(rawMsg);
      }
    } finally {
      setCheckingOutId(null);
    }
  }

  // 1. Auth loading state
  if (authStatus === "loading") {
    return (
      <PageShell>
        <main id="main-content" className="flex-1 max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-[calc(var(--header-height)+2rem)] pb-12">
          <Skeleton className="h-10 w-64 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-48 rounded-card lg:col-span-2" />
            <Skeleton className="h-48 rounded-card" />
          </div>
        </main>
      </PageShell>
    );
  }

  // 2. Unauthenticated state
  if (!isAuthenticated || authStatus === "unauthenticated") {
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

  // 3. Dashboard summary & status loading state
  if (isSummaryLoading && isStatusLoading) {
    return (
      <PageShell>
        <main id="main-content" className="flex-1 max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-[calc(var(--header-height)+2rem)] pb-12">
          <Skeleton className="h-10 w-64 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-48 rounded-card lg:col-span-2" />
            <Skeleton className="h-48 rounded-card" />
          </div>
        </main>
      </PageShell>
    );
  }

  // 4. API Error state (e.g. HTTP 500 database error)
  if (isSummaryError && isStatusError) {
    const errorObj = summaryError || statusError;
    return (
      <PageShell>
        <main id="main-content" className="flex-1 max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-[calc(var(--header-height)+2rem)] pb-12">
          <Alert variant="error" title="Unable to load your volunteer dashboard">
            {getErrorMessage(errorObj)}{" "}
            <button
              onClick={() => {
                refetchSummary();
                refetchStatus();
              }}
              className="font-semibold text-destructive underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              Retry
            </button>
          </Alert>
        </main>
      </PageShell>
    );
  }

  // 5. NOT_APPLIED State
  if (vLifecycleStatus === "NOT_APPLIED" && !volunteerProfile) {
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
                  label: "Apply to Volunteer",
                  to: "/volunteer",
                }}
              />
            </div>
          </Section>
        </main>
      </PageShell>
    );
  }

  const badgeInfo = STATUS_BADGE[vLifecycleStatus] ?? STATUS_BADGE.PENDING;
  const userSkills = parseVolunteerSkills(
    volunteerProfile?.skills,
    applicationInfo?.role_applied
  );
  const allShifts = shiftsPage?.items ?? [];
  const eligibleShifts = allShifts.filter((shift) => {
    const attendanceId =
      (shift as any).user_attendance_id || (shift as any).attendance_id;
    return isShiftEligible(shift.role_name, userSkills, Boolean(attendanceId));
  });

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-[calc(var(--header-height)+2rem)] pb-16 flex flex-col gap-8">
          {/* 1. Welcome & Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                  Welcome, {(user as any)?.name || (user as any)?.full_name || "Volunteer"}
                </h1>
                <span className={`px-3 py-1 text-2xs font-semibold uppercase tracking-wider rounded-full border ${badgeInfo.cls}`}>
                  {badgeInfo.label}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                Role: <span className="font-semibold text-foreground">{applicationInfo?.role_applied || volunteerProfile?.skills || "General Supporter"}</span> — {badgeInfo.hint}
              </p>
            </div>
            <Link href="/account" className="text-xs font-semibold text-primary hover:underline self-start md:self-auto">
              ← Back to Account Overview
            </Link>
          </div>

          {/* 2. Volunteer Lifecycle Status Banner */}
          {vLifecycleStatus === "PENDING" && (
            <Alert variant="warning" title="Application Submitted & Under Review">
              Your application was submitted on{" "}
              {applicationInfo?.submitted_at
                ? new Date(applicationInfo.submitted_at).toLocaleDateString()
                : volunteerProfile?.created_at
                ? new Date(volunteerProfile.created_at).toLocaleDateString()
                : "recently"}. Our shelter coordinator reviews all applications within 5 business days. Shift scheduling will unlock automatically upon approval.
            </Alert>
          )}

          {vLifecycleStatus === "REJECTED" && (
            <Alert variant="error" title="Application Status Update">
              Thank you for your application. At this time, our shelter team is unable to approve your volunteer application.
              {applicationInfo?.rejection_reason && (
                <div className="mt-1 font-normal text-xs">Reason: {applicationInfo.rejection_reason}</div>
              )}
              {canReapply && (
                <div className="mt-2">
                  <Link href="/volunteer" className="font-semibold text-xs text-destructive underline">
                    Submit a new re-application →
                  </Link>
                </div>
              )}
            </Alert>
          )}

          {vLifecycleStatus === "INACTIVE" && (
            <Alert variant="info" title="Profile Inactive">
              Your volunteer profile is currently inactive. Active shift scheduling and new assignments are unavailable. Historical service records remain accessible below.
            </Alert>
          )}

          {/* 3 & 4. Summary Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card variant="default" className="p-4 flex flex-col gap-1">
              <span className="text-muted-foreground text-2xs uppercase font-condensed font-semibold tracking-wider">
                Total Hours
              </span>
              <span className="text-2xl font-bold text-foreground font-serif">
                {(serviceSummary as any)?.total_hours ?? (serviceSummary as any)?.hours_contributed ?? 0} hrs
              </span>
            </Card>
            <Card variant="default" className="p-4 flex flex-col justify-between gap-1">
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-2xs uppercase font-condensed font-semibold tracking-wider">
                  Completed Assignments
                </span>
                <span className="text-2xl font-bold text-foreground font-serif">
                  {serviceSummary?.shifts_count ?? completedAttendanceItems.length ?? 0}
                </span>
              </div>
              <button
                type="button"
                aria-expanded={showShiftHistory}
                aria-controls="shift-history"
                onClick={() => {
                  setShowShiftHistory((prev) => !prev);
                  if (!showShiftHistory) {
                    setTimeout(() => {
                      document.getElementById("shift-history")?.scrollIntoView({ behavior: "smooth" });
                    }, 50);
                  }
                }}
                className="text-2xs font-semibold text-primary hover:underline text-left mt-0.5"
              >
                {showShiftHistory ? "Hide Shift History ↑" : "View Shift History →"}
              </button>
            </Card>
            <Card variant="default" className="p-4 flex flex-col gap-1">
              <span className="text-muted-foreground text-2xs uppercase font-condensed font-semibold tracking-wider">
                Background Check
              </span>
              <span className="text-sm font-bold text-foreground mt-1 flex items-center gap-1.5">
                {volunteerProfile?.background_check_completed ? (
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
                    <Award size={14} /> Certificate Available
                  </a>
                ) : (
                  <span className="text-amber-600 font-medium text-xs flex items-center gap-1">
                    <Clock size={14} /> Pending Admin Verification
                  </span>
                )}
              </span>
            </Card>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column — Shifts, Assignments, History */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              {/* 5, 7, 9, 10, 11. Shifts & Attendance */}
              <Reveal>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif font-bold text-2xl text-foreground flex items-center gap-2">
                      <Calendar size={20} className="text-primary" />
                      Upcoming Shelter Shifts &amp; Attendance
                    </h2>
                    <span className="text-xs text-muted-foreground">
                      {vLifecycleStatus === "ACTIVE" ? "Available to join" : "Active status required"}
                    </span>
                  </div>

                  {shiftNotice && (
                    <Alert variant="info" title="Notice">{shiftNotice}</Alert>
                  )}
                  {shiftError && (
                    <Alert variant="error" title="Shift Error">{shiftError}</Alert>
                  )}

                  {vLifecycleStatus !== "ACTIVE" ? (
                    <Card variant="default" className="p-6 text-center text-muted-foreground text-sm">
                      {vLifecycleStatus === "PENDING"
                        ? "Shift scheduling will unlock automatically once your application is approved by the shelter coordinator."
                        : vLifecycleStatus === "REJECTED"
                        ? "Shift signup is not available for declined applications."
                        : "Shift signup is not available while profile is inactive."}
                    </Card>
                  ) : isShiftsLoading ? (
                    <div className="flex flex-col gap-3">
                      <Skeleton className="h-20 w-full rounded-card" />
                      <Skeleton className="h-20 w-full rounded-card" />
                    </div>
                  ) : allShifts.length === 0 ? (
                    <Card variant="default" className="p-6 text-center text-muted-foreground text-sm">
                      No upcoming shifts currently scheduled. Check back soon for new opportunities.
                    </Card>
                  ) : eligibleShifts.length === 0 ? (
                    <Card variant="default" className="p-6 text-center text-muted-foreground text-sm">
                      No volunteer opportunities currently match your skills.
                    </Card>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {eligibleShifts.map((shift) => {
                        const att =
                          attendanceByShiftId.get(shift.id) ||
                          (shift as any).attendance ||
                          (shift as any).user_attendance;

                        const attendanceId =
                          att?.id ||
                          (shift as any).user_attendance_id ||
                          (shift as any).attendance_id;

                        const attStatus = (att?.status ?? "").toLowerCase();

                        const isCompleted =
                          Boolean(att?.check_out_at) ||
                          attStatus === "completed" ||
                          attStatus === "checked_out";

                        const isCheckedIn =
                          !isCompleted &&
                          (Boolean(att?.check_in_at) ||
                            attStatus === "checked_in" ||
                            Boolean((shift as any).is_checked_in));

                        const isClaimed =
                          Boolean(att) ||
                          Boolean(attendanceId) ||
                          ["claimed", "registered", "joined"].includes(attStatus);

                        return (
                          <Card key={shift.id} variant="default" className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/40 transition-colors">
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-foreground text-base">
                                  {shift.role_name}
                                </span>
                                <span className="text-2xs bg-primary/10 text-primary px-2 py-0.5 rounded font-semibold uppercase">
                                  {shift.capacity} spots
                                </span>
                                {isClaimed && (
                                  <span className="text-2xs bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 px-2 py-0.5 rounded font-semibold uppercase">
                                    {isCompleted ? "Completed" : isCheckedIn ? "Checked In" : "Claimed"}
                                  </span>
                                )}
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

                            <div className="flex items-center gap-2 shrink-0">
                              {isCompleted ? (
                                <Badge variant="neutral" className="bg-muted text-muted-foreground border-border px-3 py-1 text-xs font-semibold uppercase">
                                  <CheckCircle2 size={13} className="mr-1 inline text-emerald-600" />
                                  Completed
                                </Badge>
                              ) : isCheckedIn ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={checkingOutId === attendanceId}
                                  onClick={() => handleCheckOut(attendanceId!)}
                                >
                                  <LogOut size={13} className="mr-1" />
                                  {checkingOutId === attendanceId ? "Checking Out..." : "Check Out"}
                                </Button>
                              ) : isClaimed ? (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  disabled={checkingInId === attendanceId}
                                  onClick={() => handleCheckIn(attendanceId!)}
                                >
                                  <LogIn size={13} className="mr-1" />
                                  {checkingInId === attendanceId ? "Checking In..." : "Check In"}
                                </Button>
                              ) : (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  disabled={joiningShiftId === shift.id}
                                  onClick={() => handleJoinShift(shift.id)}
                                >
                                  {joiningShiftId === shift.id ? "Signing Up..." : "Sign Up"}
                                </Button>
                              )}
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              </Reveal>

              {/* 8. My Assignments Section */}
              <Reveal>
                <Card variant="default" className="p-6 flex flex-col gap-4">
                  <h3 className="font-serif font-bold text-xl text-foreground flex items-center gap-2">
                    <Briefcase size={18} className="text-primary" />
                    My Active Volunteer Duties &amp; Assignments
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="border border-border rounded-card p-3.5 flex flex-col gap-1 bg-card">
                      <span className="font-semibold text-foreground text-sm">Primary Role / Assignment</span>
                      <span className="text-xs text-muted-foreground">{applicationInfo?.role_applied || volunteerProfile?.skills || "Shelter Support & Dog Walking"}</span>
                    </div>
                    <div className="border border-border rounded-card p-3.5 flex flex-col gap-1 bg-card">
                      <span className="font-semibold text-foreground text-sm">Schedule Preference</span>
                      <span className="text-xs text-muted-foreground">{volunteerProfile?.availability || "Flexible weekend availability"}</span>
                    </div>
                  </div>
                </Card>
              </Reveal>

              {/* 12. Shift History & Service Records */}
              {showShiftHistory && (
                <Reveal>
                  <div id="shift-history" className="scroll-mt-24">
                    <Card variant="default" className="p-6 flex flex-col gap-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                        <div className="flex flex-col gap-1">
                          <h3 className="font-serif font-bold text-xl text-foreground flex items-center gap-2">
                            <History size={18} className="text-primary" />
                            Shift History &amp; Service Records
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Detailed log of your completed volunteer assignments and verified service hours.
                          </p>
                        </div>
                        {certData?.download_url && (
                          <a
                            href={certData.download_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline shrink-0"
                          >
                            <Award size={14} /> Download Certificate
                          </a>
                        )}
                      </div>

                      {completedAttendanceItems.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground text-sm bg-muted/30 rounded-card border border-border/50">
                          No completed volunteer shifts recorded yet. Complete your first scheduled shift to view your detailed service log here.
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {completedAttendanceItems.map((att) => {
                            const shiftRole = att.shift?.role_name || "Volunteer Shift";
                            const checkInTime = att.check_in_at
                              ? new Date(att.check_in_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                              : "N/A";
                            const checkOutTime = att.check_out_at
                              ? new Date(att.check_out_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                              : "N/A";
                            const shiftDate = att.check_in_at
                              ? new Date(att.check_in_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                              : att.shift?.start_at
                              ? new Date(att.shift.start_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                              : "Completed Shift";
                            const hoursText = att.hours_logged
                              ? `${att.hours_logged.toFixed(2)} hours`
                              : "0.00 hours";
                            const locationText =
                              (att.shift as any)?.location_name ||
                              (att.shift as any)?.shelter_name ||
                              "PawGuard Main Shelter";
                            const scheduledTime =
                              att.shift?.start_at && att.shift?.end_at
                                ? `${new Date(att.shift.start_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – ${new Date(att.shift.end_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                                : "Scheduled Shift";

                            return (
                              <div
                                key={att.id}
                                className="border border-border rounded-card p-4 flex flex-col gap-3 bg-card/60 hover:border-primary/30 transition-colors"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-2.5">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-foreground text-base">
                                      {shiftRole}
                                    </span>
                                    <span className="text-2xs bg-primary/10 text-primary px-2 py-0.5 rounded font-semibold uppercase">
                                      {applicationInfo?.role_applied || volunteerProfile?.skills || "Transport"}
                                    </span>
                                  </div>
                                  <Badge variant="neutral" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20 text-2xs font-semibold uppercase self-start sm:self-auto">
                                    <CheckCircle2 size={12} className="mr-1 inline text-emerald-600" />
                                    COMPLETED
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-muted-foreground">
                                  <div>
                                    <span className="font-semibold text-foreground block text-2xs uppercase tracking-wider mb-0.5">Date &amp; Location</span>
                                    <span className="text-foreground font-medium">{shiftDate}</span>
                                    <span className="block text-2xs">{locationText}</span>
                                  </div>
                                  <div>
                                    <span className="font-semibold text-foreground block text-2xs uppercase tracking-wider mb-0.5">Scheduled</span>
                                    <span>{scheduledTime}</span>
                                  </div>
                                  <div>
                                    <span className="font-semibold text-foreground block text-2xs uppercase tracking-wider mb-0.5">Check In / Out</span>
                                    <span>{checkInTime} – {checkOutTime}</span>
                                  </div>
                                  <div>
                                    <span className="font-semibold text-foreground block text-2xs uppercase tracking-wider mb-0.5">Service Hours</span>
                                    <span className="font-semibold text-foreground">{hoursText}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </Card>
                  </div>
                </Reveal>
              )}

              {/* 13. Official Service Certificate */}
              <Reveal>
                <Card variant="default" className="p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-xl text-foreground flex items-center gap-2">
                      <FileText size={18} className="text-primary" />
                      Official Service Certificate
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Official volunteer service certificates are issued directly by the Admin / Volunteer Coordinator upon verification of your completed service shifts and logged hours.
                  </p>
                  {certData?.download_url ? (
                    <div className="flex flex-col gap-2.5 items-start">
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded">
                        Status: Certificate Available
                      </span>
                      <a
                        href={certData.download_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-xs tracking-wider uppercase px-5 py-2.5 rounded-btn hover:bg-primary-hover transition-colors"
                      >
                        <Award size={16} />
                        Download Verified Certificate
                      </a>
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground bg-muted/40 p-3.5 rounded-card border border-border flex items-center gap-2">
                      <Clock size={15} className="text-amber-600 shrink-0" />
                      <span>
                        Status: <strong className="text-foreground font-semibold">Certificate Pending Admin Verification</strong>. Once approved by the shelter coordinator, your certificate will appear here for download.
                      </span>
                    </div>
                  )}
                </Card>
              </Reveal>
            </div>

            {/* Right Column — 14, 15, 16, 17. Volunteer Profile & Contact Info */}
            <div className="flex flex-col gap-6">
              <Reveal>
                <Card variant="default" className="p-6 flex flex-col gap-5">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
                      <User size={18} className="text-primary" />
                      Volunteer Information
                    </h3>
                  </div>

                  <div className="flex flex-col gap-4 text-sm">
                    <div className="flex flex-col gap-1">
                      <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground font-condensed">
                        Emergency Contact
                      </span>
                      <span className="font-medium text-foreground">
                        {volunteerProfile?.emergency_contact_name || "Not provided"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {volunteerProfile?.emergency_contact_phone || ""}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground font-condensed">
                        Skills &amp; Role Specialty
                      </span>
                      <span className="font-medium text-foreground">
                        {applicationInfo?.role_applied || volunteerProfile?.skills || "General support"}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground font-condensed">
                        Availability
                      </span>
                      <span className="font-medium text-foreground">
                        {volunteerProfile?.availability || "Flexible"}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground font-condensed">
                        Animal Handling Experience
                      </span>
                      <span className="text-xs text-muted-foreground leading-relaxed">
                        {volunteerProfile?.animal_handling_experience || "None specified"}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground font-condensed">
                        Medical Conditions / Allergies
                      </span>
                      <span className="text-xs text-muted-foreground leading-relaxed">
                        {volunteerProfile?.medical_conditions || "Not provided"}
                      </span>
                    </div>

                    {volunteerProfile?.notes && (
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
