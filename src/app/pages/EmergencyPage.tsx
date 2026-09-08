"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Phone,
  Upload,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  ArrowRight,
  Timer,
  Navigation,
  LocateFixed,
  Loader2,
  RefreshCw,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useFocusOnError } from "../hooks/useFocusOnError";
import { useGeolocation } from "../hooks/useGeolocation";
import {
  Button,
  Input,
  Textarea,
  Card,
  Skeleton,
  RescueTimelineGSAP,
  normalizePublicStatus,
  type PublicTrackingStatus,
  DispatchReveal,
  PageShell,
  PhoneInput,
  MediaUpload,
  type MediaItem,
} from "../components/pawguard";
import { rescueService } from "@/services/api/rescue";
import { getErrorMessage, isApiError } from "@/lib/api";
import type {
  PublicRescueTrackResponse,
  RescuePhysicalCondition,
  RescueSeverity,
} from "@/lib/api";
import {
  validatePhone,
  getCountryByCode,
  normalizePhonePayload,
} from "@/lib/utils/validation";

type FormStep = "situation" | "details" | "review";

const PHYSICAL_CONDITIONS: { value: RescuePhysicalCondition; label: string }[] = [
  { value: "critical_life_threatening", label: "Critical — life threatening" },
  { value: "fractured_injured", label: "Fractured / injured" },
  { value: "contagious_sick", label: "Contagious / sick" },
  { value: "malnourished", label: "Malnourished" },
  { value: "abandoned_stray", label: "Abandoned / stray" },
  { value: "unknown", label: "Unknown" },
];

const RESCUE_STATUS_DISPLAY: Record<PublicTrackingStatus, string> = {
  REPORTED: "Reported",
  VERIFIED: "Verified",
  DISPATCHED: "Dispatched",
  LOCATED: "Located",
  RESOLVED: "Resolved",
  CANCELLED: "Cancelled",
};

interface ReportTrackerProps {
  initialTicket?: string | null;
  initialPhone?: string | null;
}

function ReportTracker({ initialTicket, initialPhone }: ReportTrackerProps) {
  const [ticket, setTicket] = useState(initialTicket || "");
  const [phone, setPhone] = useState(initialPhone || "");
  const [result, setResult] = useState<PublicRescueTrackResponse | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "done">("idle");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (initialTicket) setTicket(initialTicket);
    if (initialPhone) setPhone(initialPhone);
  }, [initialTicket, initialPhone]);

  const doLookup = useCallback(async (tNum: string) => {
    if (!tNum.trim()) return;
    setStatus("loading");
    setErrMsg("");
    setResult(null);
    try {
      const res = await rescueService.trackPublicReport(tNum.trim());
      setResult(res);
      setStatus("done");
    } catch (err) {
      setErrMsg(
        "Report received. We couldn't refresh the latest status right now. Please try again."
      );
      setStatus("error");
    }
  }, []);

  function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    void doLookup(ticket);
  }

  const normResultStatus = result ? normalizePublicStatus(result.status) : null;

  return (
    <div className="bg-card border border-border rounded-card p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
          <Timer size={16} />
        </span>
        <div>
          <p className="text-foreground font-bold text-sm">Track a report</p>
          <p className="text-muted-foreground text-xs">Authoritative status lookup</p>
        </div>
      </div>

      <form onSubmit={handleLookup} className="flex flex-col gap-3">
        <input
          type="text"
          value={ticket}
          onChange={(e) => {
            setTicket(e.target.value);
            setErrMsg("");
          }}
          placeholder="Ticket number (RES-…)"
          aria-label="Ticket number"
          className="w-full bg-background border border-border rounded-btn px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-standard"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            setErrMsg("");
          }}
          placeholder="Phone used to report (optional)"
          aria-label="Phone number"
          className="w-full bg-background border border-border rounded-btn px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-standard"
        />
        <Button type="submit" variant="primary" size="sm" isLoading={status === "loading"}>
          Check Status
        </Button>
      </form>

      {status === "error" && (
        <div className="mt-3 flex flex-col gap-2">
          <p className="text-xs text-destructive" role="alert">
            {errMsg}
          </p>
          <button
            type="button"
            onClick={() => void doLookup(ticket)}
            className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
          >
            <RefreshCw size={12} /> Retry Status Check
          </button>
        </div>
      )}

      {status === "done" && result && normResultStatus && (
        <div className="mt-4 bg-secondary rounded-xl p-4" role="status">
          <div className="flex items-center justify-between">
            <span className="font-mono text-foreground font-semibold text-sm tracking-wide">
              {result.ticket_number}
            </span>
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5">
              {RESCUE_STATUS_DISPLAY[normResultStatus]}
            </span>
          </div>
          <p className="text-muted-foreground text-xs mt-2">
            Registered:{" "}
            {new Date(result.created_at).toLocaleString(undefined, {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          {(normResultStatus === "DISPATCHED" || normResultStatus === "LOCATED") &&
            (result.eta_display || result.estimated_arrival_minutes) && (
              <p className="text-xs text-primary font-bold mt-2 flex items-center gap-1">
                <Clock size={12} />
                ETA: {result.eta_display || `${result.estimated_arrival_minutes} minutes`}
              </p>
            )}
        </div>
      )}
    </div>
  );
}

export default function EmergencyPage() {
  const [pageReady, setPageReady] = useState(false);
  const [step, setStep] = useState<FormStep>("situation");
  const [severity, setSeverity] = useState<"critical" | "non-critical">("critical");
  const [physicalCondition, setPhysicalCondition] =
    useState<RescuePhysicalCondition>("unknown");
  const [reporterName, setReporterName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [contactCountry, setContactCountry] = useState("IN");
  const [submitted, setSubmitted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [mediaPhotos, setMediaPhotos] = useState<MediaItem[]>([]);
  const [mediaVideo, setMediaVideo] = useState<MediaItem | null>(null);
  const { setRef } = useFocusOnError(errors);
  const geo = useGeolocation();

  // Authoritative tracking states
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);
  const [reporterPhone, setReporterPhone] = useState<string>("");
  const [activeStatus, setActiveStatus] = useState<PublicRescueTrackResponse | null>(null);
  const [trackingError, setTrackingError] = useState<string | null>(null);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  /**
   * Set when the backend returns HTTP 409 for a duplicate emergency submission.
   * Contains the existing case ticket number so the user can track it.
   * `ticketNum` may be `null` if the backend body did not include the ticket.
   */
  const [duplicateEmergency, setDuplicateEmergency] = useState<{ ticketNum: string | null } | null>(null);

  const draftNotified = useRef(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Stop active polling
  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  // Authoritative tracking fetch function
  const fetchStatus = useCallback(
    async (tNum: string) => {
      if (!tNum) return;
      setIsTrackingLoading(true);
      try {
        const data = await rescueService.trackPublicReport(tNum);
        setActiveStatus(data);
        setTrackingError(null);

        const norm = normalizePublicStatus(data.status);
        // Stop polling ONLY for terminal statuses: RESOLVED and CANCELLED
        if (norm === "RESOLVED" || norm === "CANCELLED") {
          stopPolling();
        }
      } catch (err) {
        setTrackingError(
          "Report received. We couldn't refresh the latest status right now. Please try again."
        );
      } finally {
        setIsTrackingLoading(false);
      }
    },
    [stopPolling]
  );

  // Live polling effect (12 seconds)
  useEffect(() => {
    if (!submitted || !ticketNumber) {
      stopPolling();
      return;
    }

    void fetchStatus(ticketNumber);

    pollingRef.current = setInterval(() => {
      void fetchStatus(ticketNumber);
    }, 12_000);

    return () => {
      stopPolling();
    };
  }, [submitted, ticketNumber, fetchStatus, stopPolling]);

  // When GPS coords arrive, store them & update location display text
  useEffect(() => {
    if (geo.status === "granted" && geo.coords) {
      setLat(geo.coords.latitude);
      setLng(geo.coords.longitude);
      setLocation((prev) => (prev.trim() ? prev : "Current location detected"));
      setErrors((prev) => ({ ...prev, location: "" }));
    }
  }, [geo.status, geo.coords]);

  useEffect(() => {
    const t = setTimeout(() => setPageReady(true), 400);
    return () => clearTimeout(t);
  }, []);

  // Restore local draft
  useEffect(() => {
    const saved = localStorage.getItem("pawguard-emergency-draft");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.severity) setSeverity(data.severity);
        if (data.physicalCondition) setPhysicalCondition(data.physicalCondition);
        if (data.reporterName) setReporterName(data.reporterName);
        if (data.location) setLocation(data.location);
        if (data.description) setDescription(data.description);
        if (data.contact) setContact(data.contact);
        if (data.lat) setLat(data.lat);
        if (data.lng) setLng(data.lng);
        if (data.photoUrl) setPhotoUrl(data.photoUrl);
      } catch {}
    }
  }, []);

  // Auto-save draft
  useEffect(() => {
    if (submitted) return;
    localStorage.setItem(
      "pawguard-emergency-draft",
      JSON.stringify({
        severity,
        physicalCondition,
        reporterName,
        location,
        description,
        contact,
        step,
        lat,
        lng,
        photoUrl,
      })
    );
    if (!draftNotified.current && (location || description || contact)) {
      draftNotified.current = true;
      toast.info("Draft saved locally", {
        description: "Your progress is saved. You can close this page and come back.",
      });
    }
  }, [
    severity,
    physicalCondition,
    reporterName,
    location,
    description,
    contact,
    step,
    lat,
    lng,
    photoUrl,
    submitted,
  ]);

  function validate(advancingTo: FormStep) {
    const e: Record<string, string> = {};
    if (advancingTo === "details" && !severity)
      e.severity = "Select the situation type";
    if (advancingTo === "review") {
      if (!reporterName.trim()) e.reporterName = "Your name is required";
      const phoneError = validatePhone(contact, contactCountry, true);
      if (phoneError) e.contact = phoneError;
      if (!location.trim() && lat === null)
        e.location = "Location is required";
      if (!description.trim()) e.description = "Description is required";
      if (!photoUrl || !photoUrl.trim())
        e.photoUrl = "Please upload a photo before submitting the report.";

      // ---- Emergency-specific combined media limits ----
      // Client requirement: max 5 files total, max 50 MB combined.
      // This is enforced here (pre-upload) so we never waste presigned URL
      // requests on files the backend would reject.
      const EMERGENCY_MAX_FILES = 5;
      const EMERGENCY_MAX_BYTES = 50 * 1024 * 1024; // 50 MB
      const totalFiles = mediaPhotos.length + (mediaVideo ? 1 : 0);
      const totalBytes =
        mediaPhotos.reduce((sum, p) => sum + p.sizeBytes, 0) +
        (mediaVideo ? mediaVideo.sizeBytes : 0);
      if (totalFiles > EMERGENCY_MAX_FILES) {
        e.photoUrl = `Emergency reports allow a maximum of ${EMERGENCY_MAX_FILES} files (photos + video combined). Please remove ${totalFiles - EMERGENCY_MAX_FILES} file(s).`;
      } else if (totalBytes > EMERGENCY_MAX_BYTES) {
        const overMb = ((totalBytes - EMERGENCY_MAX_BYTES) / (1024 * 1024)).toFixed(1);
        e.photoUrl = `Combined media size exceeds 50 MB (over by ${overMb} MB). Please remove or reduce the size of some files.`;
      }
      // ---- End emergency media limits ----
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLoading || submitted) return;
    if (!validate("review")) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setHasError(false);

    try {
      // Step 1: Upload photos
      const uploadedPhotoKeys: string[] = [];
      for (const photo of mediaPhotos) {
        const uploadData = await rescueService.getMediaUploadUrl({
          filename: photo.name,
          mime_type: photo.file.type,
          file_size: photo.sizeBytes,
        });
        if (!uploadData || !uploadData.upload_url || !uploadData.object_key) {
          throw new Error("Failed to obtain media upload URL for photo.");
        }
        await rescueService.uploadMediaFile(uploadData.upload_url, photo.file);
        uploadedPhotoKeys.push(uploadData.object_key);
      }

      // Step 2: Upload video
      let uploadedVideoKey: string | null = null;
      if (mediaVideo) {
        const uploadData = await rescueService.getMediaUploadUrl({
          filename: mediaVideo.name,
          mime_type: mediaVideo.file.type,
          file_size: mediaVideo.sizeBytes,
        });
        if (!uploadData || !uploadData.upload_url || !uploadData.object_key) {
          throw new Error("Failed to obtain media upload URL for video.");
        }
        await rescueService.uploadMediaFile(uploadData.upload_url, mediaVideo.file);
        uploadedVideoKey = uploadData.object_key;
      }

      // Step 3: POST public rescue report
      const severityValue: RescueSeverity =
        severity === "critical" ? "critical" : "medium";
      const normalizedPhone = normalizePhonePayload(contact.trim(), contactCountry);

      const res = await rescueService.reportPublicCase({
        reporter_name: reporterName.trim(),
        reporter_phone: normalizedPhone,
        location_address: location.trim(),
        latitude: lat,
        longitude: lng,
        animal_count: 1,
        physical_condition: physicalCondition,
        severity: severityValue,
        is_urgent: severity === "critical",
        reporter_notes: description.trim(),
        photo_object_keys:
          uploadedPhotoKeys.length > 0 ? uploadedPhotoKeys : undefined,
        video_object_key: uploadedVideoKey,
      });

      const assignedTicket =
        res?.ticket_number ||
        (res as unknown as Record<string, string>)?.ticketNumber ||
        res?.id ||
        "RES-SUBMITTED";

      setTicketNumber(assignedTicket);
      setReporterPhone(normalizedPhone);
      setSubmitted(true);
      localStorage.removeItem("pawguard-emergency-draft");
    } catch (err) {
      // 409 Conflict: backend detected a duplicate emergency submission.
      // Show a dedicated duplicate view instead of the generic error panel.
      if (isApiError(err) && err.status === 409) {
        let existingTicket: string | null = null;
        try {
          const rawData = (err.originalError as any)?.response?.data;
          // Backend shape: { success: false, error: {...}, data: { ticket_number: "..." } }
          if (rawData?.data?.ticket_number && typeof rawData.data.ticket_number === "string") {
            existingTicket = rawData.data.ticket_number;
          } else if (
            err.detail &&
            typeof err.detail === "object" &&
            !Array.isArray(err.detail) &&
            typeof (err.detail as Record<string, unknown>).ticket_number === "string"
          ) {
            existingTicket = (err.detail as Record<string, unknown>).ticket_number as string;
          }
        } catch {
          // Parsing failed — show duplicate view without a ticket number
        }
        setDuplicateEmergency({ ticketNum: existingTicket });
      } else {
        setHasError(true);
        toast.error("Report failed to submit", { description: getErrorMessage(err) });
      }
    } finally {
      setIsLoading(false);
    }
  }

  const normStatus = normalizePublicStatus(activeStatus?.status);

  const showEtaInCard =
    (normStatus === "DISPATCHED" || normStatus === "LOCATED") &&
    Boolean(
      activeStatus?.eta_display ||
        (typeof activeStatus?.estimated_arrival_minutes === "number" &&
        activeStatus.estimated_arrival_minutes > 0)
    );

  const formattedEta = showEtaInCard
    ? activeStatus?.eta_display || `${activeStatus?.estimated_arrival_minutes} minutes`
    : null;

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EmergencyService",
              name: "PawGuard 24/7 Emergency Dog Rescue",
              description:
                "Rapid response dog rescue dispatch for dogs in crisis, medical emergency, or severe distress.",
              url: "https://pawguard-public-web.vercel.app/emergency",
              telephone: "+91-9876543210",
              areaServed: "IN",
              availableLanguage: ["en", "hi"],
            }),
          }}
        />
        <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-[calc(var(--header-height)+1rem)] lg:pt-[calc(var(--header-height)+2rem)] pb-20 lg:pb-28">
          {!pageReady ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--space-12)] lg:gap-[var(--space-16)]">
              <div className="lg:col-span-8 flex flex-col gap-12">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-12 w-72" />
                <Skeleton className="h-6 w-96" />
                <Skeleton className="h-14 w-full rounded-btn" />
                <Skeleton className="h-14 w-full rounded-input" />
                <Skeleton className="h-32 w-full rounded-input" />
                <Skeleton className="h-36 w-full rounded-card" />
                <Skeleton className="h-14 w-full rounded-btn" />
              </div>
              <aside className="lg:col-span-4 flex flex-col gap-5">
                <Skeleton className="h-48 w-full rounded-card" />
                <Skeleton className="h-40 w-full rounded-card" />
                <Skeleton className="h-44 w-full rounded-card" />
              </aside>
            </div>
          ) : (
            <DispatchReveal>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--space-12)] lg:gap-[var(--space-16)]">
                <div className="lg:col-span-8 flex flex-col gap-12">
                  <div className="border-l-4 border-primary pl-6 py-2 flex flex-col gap-3">
                    <p className="text-primary text-xs font-semibold tracking-widest uppercase">
                      Emergency Report
                    </p>
                    <h1 className="font-serif font-bold text-4xl lg:text-5xl leading-tight tracking-tight text-foreground">
                      Help is on the way.
                    </h1>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-[480px]">
                      Tell us what you see. We will dispatch the nearest available unit.
                      Every field you complete helps us respond faster.
                    </p>
                  </div>

                  {duplicateEmergency ? (
                    <div className="flex flex-col gap-6" role="alert">
                      <div className="bg-card border border-border rounded-card p-6 lg:p-8 shadow-lg flex flex-col items-center gap-5 text-center">
                        <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center">
                          <AlertTriangle size={28} className="text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <h2 className="text-foreground font-bold text-xl">
                            Emergency Case Already Reported
                          </h2>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            It looks like this emergency incident has already been reported.<br />
                            An active rescue case matching your submission already exists.
                          </p>
                          {duplicateEmergency.ticketNum && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Case / Ticket:{" "}
                              <span className="font-mono font-semibold text-foreground tracking-wider">
                                {duplicateEmergency.ticketNum}
                              </span>
                            </p>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          You do not need to submit the same emergency again.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                          {duplicateEmergency.ticketNum && (
                            <a
                              href={`/emergency?ticket=${encodeURIComponent(duplicateEmergency.ticketNum)}`}
                              className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-6 rounded-btn bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                            >
                              Track Existing Case
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => setDuplicateEmergency(null)}
                            className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-6 rounded-btn border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-colors"
                          >
                            Back to Emergency
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : hasError ? (
                    <div className="flex flex-col gap-6" role="alert">
                      <div className="bg-card border border-border rounded-card p-6 lg:p-8 shadow-lg flex flex-col gap-5">
                        <div className="w-14 h-14 bg-destructive/10 rounded-2xl flex items-center justify-center">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-destructive"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                        </div>
                        <div className="flex flex-col gap-2">
                          <h2 className="text-foreground font-bold text-xl">
                            Report failed to submit
                          </h2>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            Your emergency report could not be submitted. Please call our
                            emergency line immediately.
                          </p>
                        </div>
                        <div className="bg-destructive/5 border border-destructive/10 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Phone size={14} className="text-destructive" />
                            <span className="text-foreground font-bold text-base">
                              +91 98765 43210
                            </span>
                          </div>
                          <p className="text-muted-foreground text-xs">
                            Available 24/7 for emergencies.
                          </p>
                        </div>
                        <Button
                          variant="primary"
                          size="md"
                          onClick={() => setHasError(false)}
                        >
                          Try Again
                        </Button>
                      </div>
                    </div>
                  ) : submitted ? (
                    <div
                      className="flex flex-col gap-6 animate-fade-in"
                      role="status"
                      aria-live="polite"
                    >
                      {/* Post-Submission Status Card */}
                      <div className="bg-card border border-border rounded-card p-6 lg:p-8 shadow-lg">
                        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
                              <CheckCircle2 size={28} className="text-emerald-600" />
                            </div>
                            <div>
                              <h2 className="text-foreground font-bold text-2xl">
                                Report Received
                              </h2>
                              <p className="text-muted-foreground text-sm mt-0.5">
                                Ticket Number:{" "}
                                <span className="font-mono text-foreground font-bold tracking-wider">
                                  {ticketNumber ?? "RES-SUBMITTED"}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 text-xs font-bold tracking-wider uppercase px-3 py-1 font-mono">
                              {RESCUE_STATUS_DISPLAY[normStatus]}
                            </span>
                            <span
                              className={`inline-flex items-center rounded-full text-xs font-bold tracking-wider uppercase px-3 py-1 border ${
                                severity === "critical"
                                  ? "bg-destructive/10 text-destructive border-destructive/20"
                                  : "bg-primary/10 text-primary border-primary/20"
                              }`}
                            >
                              {severity === "critical" ? "Critical" : "Non-Critical"}
                            </span>
                          </div>
                        </div>

                        {/* Status Notice */}
                        <div className="bg-secondary rounded-xl p-5 mb-6">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <ShieldCheck size={18} className="text-primary" />
                              <span className="text-foreground font-semibold text-sm">
                                Status Confirmation
                              </span>
                            </div>
                            {isTrackingLoading && (
                              <Loader2 size={14} className="animate-spin text-primary" />
                            )}
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {severity === "critical"
                              ? "Your emergency report has been successfully registered. Priority case registered. Awaiting coordinator verification."
                              : "Your emergency report has been successfully registered. Case registered. Awaiting coordinator review."}
                          </p>

                          {/* ETA Section */}
                          <div className="mt-4 pt-3 border-t border-border/50">
                            {showEtaInCard && formattedEta ? (
                              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                                <Clock size={16} className="animate-pulse" />
                                <span>Estimated arrival: {formattedEta}</span>
                              </div>
                            ) : (
                              <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                                <Clock
                                  size={14}
                                  className="shrink-0 text-muted-foreground/70"
                                />
                                <span>
                                  ETA will appear after a rescue unit has been
                                  dispatched.
                                </span>
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Location Summary */}
                        <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mb-6">
                          <div className="flex items-start gap-3">
                            <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="text-foreground font-semibold text-sm">
                                Incident location
                              </p>
                              <p className="text-muted-foreground text-sm mt-0.5">
                                {location || "Coordinates registered"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Tracking Error Banner if refresh fails */}
                        {trackingError && (
                          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-6 flex items-center justify-between flex-wrap gap-3">
                            <p className="text-xs text-destructive font-medium">
                              {trackingError}
                            </p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                ticketNumber && void fetchStatus(ticketNumber)
                              }
                            >
                              <RefreshCw size={12} /> Refresh Status
                            </Button>
                          </div>
                        )}

                        <div>
                          <p className="text-foreground font-semibold text-sm mb-3">
                            While waiting
                          </p>
                          <ul className="flex flex-col gap-2.5">
                            {[
                              "Keep a safe distance from the dog",
                              "Do not attempt to move or feed the dog",
                              "Keep other people and pets away from the area",
                              "If safe, keep the dog in sight from a distance",
                              "An operator may call you — answer if you can",
                            ].map((tip, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2.5 text-muted-foreground text-sm leading-relaxed"
                              >
                                <CheckCircle2
                                  size={14}
                                  className="text-primary shrink-0 mt-0.5"
                                />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="md"
                        onClick={() => {
                          stopPolling();
                          setSubmitted(false);
                          setLocation("");
                          setDescription("");
                          setContact("");
                          setReporterName("");
                          setPhysicalCondition("unknown");
                          setErrors({});
                          setLat(null);
                          setLng(null);
                          setTicketNumber(null);
                          setActiveStatus(null);
                          setTrackingError(null);
                          geo.clearLocation();
                          localStorage.removeItem("pawguard-emergency-draft");
                        }}
                      >
                        Submit Another Report
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                      {/* Step indicator */}
                      <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase font-condensed">
                        {(["situation", "details", "review"] as const).map((s, i) => (
                          <div key={s} className="flex items-center gap-2">
                            <span
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-ui ${
                                step === s
                                  ? "bg-primary text-primary-foreground shadow-sm scale-110"
                                  : (step === "details" && s === "situation") ||
                                      (step === "review" && s !== "review")
                                    ? "bg-primary/20 text-primary"
                                    : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {(step === "details" && s === "situation") ||
                              (step === "review" && s !== "review") ? (
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              ) : (
                                i + 1
                              )}
                            </span>
                            <span
                              className={
                                step === s ? "text-foreground" : "text-muted-foreground"
                              }
                            >
                              {s === "situation"
                                ? "Situation"
                                : s === "details"
                                  ? "Details"
                                  : "Review"}
                            </span>
                            {i < 2 && <span className="w-6 h-px bg-border" />}
                          </div>
                        ))}
                      </div>

                      {step === "situation" && (
                        <div className="flex flex-col gap-3 animate-fade-in">
                          <label className="text-foreground text-xs font-semibold tracking-wider uppercase font-condensed">
                            Situation Type
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => setSeverity("critical")}
                              className={`py-5 text-center font-bold text-base tracking-wider uppercase border-2 rounded-btn transition-all duration-ui ${
                                severity === "critical"
                                  ? "bg-destructive text-white border-destructive shadow-btn-glow-destructive scale-[1.02]"
                                  : "bg-white text-muted-foreground border-border hover:border-destructive hover:shadow-sm"
                              }`}
                            >
                              <AlertTriangle
                                size={16}
                                className={`inline mr-2 -mt-0.5 ${
                                  severity === "critical" ? "animate-pulse-soft" : ""
                                }`}
                              />
                              Critical
                            </button>
                            <button
                              type="button"
                              onClick={() => setSeverity("non-critical")}
                              className={`py-5 text-center font-bold text-base tracking-wider uppercase border-2 rounded-btn transition-all duration-ui ${
                                severity === "non-critical"
                                  ? "bg-primary text-primary-foreground border-primary shadow-btn-glow-primary scale-[1.02]"
                                  : "bg-white text-muted-foreground border-border hover:border-primary hover:shadow-sm"
                              }`}
                            >
                              Non-Critical
                            </button>
                          </div>
                          {severity === "critical" && (
                            <p className="text-destructive text-sm font-medium flex items-center gap-1.5 mt-1 animate-fade-in">
                              <AlertTriangle size={14} /> Priority case registration
                            </p>
                          )}
                          <div className="mt-4">
                            <Button
                              type="button"
                              variant="primary"
                              size="md"
                              onClick={() => {
                                if (validate("details")) setStep("details");
                              }}
                            >
                              Continue
                              <ArrowRight size={14} />
                            </Button>
                          </div>
                        </div>
                      )}

                      {step === "details" && (
                        <div className="flex flex-col gap-5 animate-fade-in">
                          <div className="flex flex-col gap-2">
                            <Input
                              label="Your Name *"
                              placeholder="Full name of the person reporting"
                              ref={setRef("reporterName")}
                              value={reporterName}
                              required
                              aria-required="true"
                              onChange={(e) => {
                                setReporterName(e.target.value);
                                if (errors.reporterName)
                                  setErrors((prev) => ({ ...prev, reporterName: "" }));
                              }}
                              error={errors.reporterName}
                              autoComplete="name"
                            />
                            <PhoneInput
                              label="Your Contact Number *"
                              ref={setRef("contact")}
                              value={contact}
                              countryCode={contactCountry}
                              onCountryChange={(code) => {
                                setContactCountry(code);
                                if (errors.contact)
                                  setErrors((prev) => ({ ...prev, contact: "" }));
                              }}
                              onValueChange={(val, code) => {
                                setContact(val);
                                if (errors.contact)
                                  setErrors((prev) => ({ ...prev, contact: "" }));
                                const c = getCountryByCode(code);
                                if (val.length === c.maxLength) {
                                  const err = validatePhone(val, code, true);
                                  if (err)
                                    setErrors((prev) => ({ ...prev, contact: err }));
                                }
                              }}
                              error={errors.contact}
                              required
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <span className="text-foreground text-xs font-semibold tracking-wider uppercase font-condensed">
                              Dog's Condition
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {PHYSICAL_CONDITIONS.map((opt) => (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => setPhysicalCondition(opt.value)}
                                  aria-pressed={physicalCondition === opt.value}
                                  className={`py-3 px-4 text-left text-sm font-semibold border-2 rounded-btn transition-all duration-ui focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring/60 ${
                                    physicalCondition === opt.value
                                      ? "bg-primary/10 text-primary border-primary"
                                      : "bg-white text-muted-foreground border-border hover:border-primary/50"
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <Input
                              label="Location *"
                              placeholder="Current address or coordinates"
                              ref={setRef("location")}
                              value={location}
                              required
                              aria-required="true"
                              onChange={(e) => {
                                setLocation(e.target.value);
                                if (errors.location)
                                  setErrors((prev) => ({ ...prev, location: "" }));
                              }}
                              error={errors.location}
                              prefix={<MapPin size={16} />}
                              autoComplete="street-address"
                            />
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => {
                                  geo.requestLocation();
                                }}
                                disabled={geo.status === "loading"}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-fast"
                              >
                                {geo.status === "loading" ? (
                                  <Loader2 size={13} className="animate-spin" />
                                ) : (
                                  <LocateFixed size={13} />
                                )}
                                Use My Location
                              </button>
                              {geo.status === "granted" &&
                                lat !== null &&
                                lng !== null && (
                                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                                    <CheckCircle2 size={12} />
                                    GPS pinned
                                  </span>
                                )}
                            </div>
                            {geo.errorMessage && (
                              <p className="text-muted-foreground text-xs" role="status">
                                {geo.errorMessage}
                              </p>
                            )}
                          </div>

                          <Textarea
                            label="Dog Description"
                            placeholder="Breed, size, condition — describe the situation clearly"
                            ref={setRef("description")}
                            value={description}
                            onChange={(e) => {
                              setDescription(e.target.value);
                              if (errors.description)
                                setErrors((prev) => ({ ...prev, description: "" }));
                            }}
                            error={errors.description}
                            rows={5}
                          />

                          <MediaUpload
                            label="Visual Evidence Photos & Video"
                            required
                            photos={mediaPhotos}
                            video={mediaVideo}
                            onChangePhotos={(photos) => {
                              setMediaPhotos(photos);
                              if (photos.length > 0 && errors.photoUrl) {
                                setErrors((prev) => ({ ...prev, photoUrl: "" }));
                              }
                            }}
                            onChangeVideo={(vid) => setMediaVideo(vid)}
                            onPrimaryPhotoChange={(_file, dataUrl) => {
                              setPhotoUrl(dataUrl);
                              if (dataUrl && errors.photoUrl) {
                                setErrors((prev) => ({ ...prev, photoUrl: "" }));
                              }
                            }}
                            error={errors.photoUrl}
                          />

                          <div className="flex gap-3 pt-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="md"
                              onClick={() => setStep("situation")}
                            >
                              Back
                            </Button>
                            <Button
                              type="button"
                              variant="primary"
                              size="md"
                              onClick={() => {
                                if (validate("review")) setStep("review");
                              }}
                            >
                              Review Report
                              <ArrowRight size={14} />
                            </Button>
                          </div>
                        </div>
                      )}

                      {step === "review" && (
                        <div className="flex flex-col gap-5 animate-fade-in">
                          <div className="bg-card border border-border rounded-card p-5 flex flex-col gap-4 shadow-sm">
                            <h3 className="text-foreground font-bold text-sm tracking-wider uppercase">
                              Report Summary
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="flex flex-col gap-1">
                                <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase font-condensed">
                                  Situation
                                </span>
                                <span
                                  className={`font-bold text-sm ${
                                    severity === "critical"
                                      ? "text-destructive"
                                      : "text-primary"
                                  }`}
                                >
                                  {severity === "critical"
                                    ? "Critical — Priority Case"
                                    : "Non-Critical — Scheduled Case"}
                                </span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase font-condensed">
                                  Location
                                </span>
                                <span className="text-foreground text-sm font-medium">
                                  {location || "Not provided"}
                                </span>
                              </div>
                              <div className="flex flex-col gap-1 sm:col-span-2">
                                <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase font-condensed">
                                  Condition
                                </span>
                                <span className="text-foreground text-sm font-medium">
                                  {PHYSICAL_CONDITIONS.find(
                                    (c) => c.value === physicalCondition
                                  )?.label ?? physicalCondition}
                                </span>
                              </div>
                              <div className="flex flex-col gap-1 sm:col-span-2">
                                <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase font-condensed">
                                  Description
                                </span>
                                <span className="text-foreground text-sm">
                                  {description || "Not provided"}
                                </span>
                              </div>
                              {contact && (
                                <div className="flex flex-col gap-1 sm:col-span-2">
                                  <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase font-condensed">
                                    Reporter
                                  </span>
                                  <span className="text-foreground text-sm">
                                    {reporterName || "—"} · {contact}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <Button
                              type="button"
                              variant="ghost"
                              size="md"
                              onClick={() => setStep("details")}
                            >
                              Edit
                            </Button>
                            <Button
                              type="submit"
                              variant="destructive"
                              size="lg"
                              isLoading={isLoading}
                              disabled={isLoading || submitted}
                              context="emergency"
                              className={`flex-1 ${hasErrors ? "animate-shake" : ""}`}
                            >
                              Submit Report
                            </Button>
                          </div>
                        </div>
                      )}
                    </form>
                  )}

                  <div className="bg-card border border-border rounded-card overflow-hidden shadow-sm">
                    <div className="px-5 py-4">
                      <p className="text-xs font-semibold tracking-wider uppercase font-condensed text-foreground mb-3">
                        Emergency Contacts
                      </p>
                      <div className="flex flex-col gap-3">
                        {[
                          { label: "PawGuard Emergency", number: "+91 98765 43210" },
                          { label: "Animal Control", number: "+91 80 1234 5678" },
                          { label: "Veterinary Helpline", number: "+91 80 8765 4321" },
                        ].map((c) => (
                          <div key={c.label} className="flex items-center justify-between">
                            <span className="text-muted-foreground text-xs">
                              {c.label}
                            </span>
                            <a
                              href={`tel:${c.number}`}
                              className="text-primary font-bold text-sm hover:underline font-mono tracking-tight"
                            >
                              {c.number}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <aside className="lg:col-span-4 flex flex-col gap-5">
                  <RescueTimelineGSAP
                    status={activeStatus?.status}
                    severity={severity}
                    etaDisplay={activeStatus?.eta_display}
                    estimatedArrivalMinutes={activeStatus?.estimated_arrival_minutes}
                  />
                  <ReportTracker
                    initialTicket={ticketNumber}
                    initialPhone={reporterPhone}
                  />
                  <div className="bg-card border border-border rounded-card p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emergency/10 rounded-lg flex items-center justify-center">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-[18px] h-[18px] text-emergency"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-foreground font-bold text-lg font-mono tracking-tight">
                          Priority Response
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Priority triage for emergency reports
                        </p>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </DispatchReveal>
          )}
        </div>
      </main>
    </PageShell>
  );
}
