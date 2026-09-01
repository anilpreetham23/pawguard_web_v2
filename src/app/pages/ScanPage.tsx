"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  QrCode,
  ScanLine,
  KeyRound,
  PawPrint,
  AlertTriangle,
  ShieldCheck,
  RotateCcw,
  Phone,
  MapPin,
  Crosshair,
  Send,
  CheckCircle2,
  Calendar,
  Hash,
  User,
  MessageSquare,
} from "lucide-react";
import {
  PageShell,
  Card,
  Reveal,
  Alert,
  Button,
  Input,
  Textarea,
  Badge,
  Skeleton,
  PhoneInput,
} from "../components/pawguard";
import SectionHeading from "../components/SectionHeading";
import QrScanner from "../components/scan/QrScanner";
import {
  useApiMutation,
  useApiErrorMessage,
  isRetryableError,
  isApiError,
} from "@/lib/api";
import { safetyTagService } from "@/services/api/safety-tag";
import { lostFoundService } from "@/services/api/lost-found";
import type {
  PublicDogScanResponse,
  SafetyTagScanResponse,
  PetSightingCreate,
} from "@/lib/api";
import { validatePhone, getCountryByCode, normalizePhonePayload } from "@/lib/utils/validation";

type ScanState =
  | { status: "idle" }
  | { status: "loading"; token: string }
  | { status: "success"; pet: SafetyTagScanResponse }
  | { status: "success-dog"; dog: PublicDogScanResponse }
  | { status: "error"; token: string };

const SPECIES_LABEL: Record<string, string> = {
  dog: "Dog",
  cat: "Cat",
  bird: "Bird",
  rabbit: "Rabbit",
  other: "Other",
};

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value.trim()
  );
}

function formatDate(isoString: string | null | undefined): string {
  if (!isoString) return "N/A";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return isoString;
  }
}

export function sanitizeScanToken(input: string): string {
  if (!input) return "";
  let clean = input.trim();
  clean = clean.replace(/^["']|["']$/g, "").trim();

  if (clean.startsWith("http://") || clean.startsWith("https://") || clean.includes("/scan")) {
    try {
      const parsedUrl = new URL(
        clean.startsWith("http")
          ? clean
          : `https://pawguard-public-web.vercel.app${clean.startsWith("/") ? "" : "/"}${clean}`
      );
      const tokenParam =
        parsedUrl.searchParams.get("token") ||
        parsedUrl.searchParams.get("raw_token") ||
        parsedUrl.searchParams.get("code") ||
        parsedUrl.searchParams.get("tag");
      if (tokenParam) {
        clean = tokenParam.trim();
      } else {
        const parts = parsedUrl.pathname.split("/").filter(Boolean);
        const lastPart = parts[parts.length - 1];
        if (lastPart && lastPart !== "scan" && lastPart !== "scan-pet") {
          clean = lastPart.trim();
        }
      }
    } catch {
      // keep original string if parsing fails
    }
  }

  if (clean.startsWith("token=")) {
    clean = clean.substring(6).trim();
  }

  clean = clean.replace(/["'&?#].*$/, "").trim();
  return clean;
}

export default function ScanPage() {
  const [state, setState] = useState<ScanState>({ status: "idle" });
  const [manualToken, setManualToken] = useState("");
  const [scanNotice, setScanNotice] = useState<string | null>(null);

  // Citizen Sighting Form State
  const [finderName, setFinderName] = useState("");
  const [finderPhone, setFinderPhone] = useState("");
  const [finderPhoneCountry, setFinderPhoneCountry] = useState("IN");
  const [locationAddress, setLocationAddress] = useState("");
  const [finderAddress, setFinderAddress] = useState("");
  const [message, setMessage] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [sightingLoading, setSightingLoading] = useState(false);
  const [sightingSubmitted, setSightingSubmitted] = useState(false);
  const [sightingError, setSightingError] = useState<string | null>(null);
  const [sightingFieldErrors, setSightingFieldErrors] = useState<{ phone?: string; location?: string }>({});

  const scan = useApiMutation<SafetyTagScanResponse, string>({
    mutationFn: (token: string) => safetyTagService.scanToken(token),
    onSuccess: (pet) => {
      setState({ status: "success", pet });
      resetSightingForm();
      if (pet.status?.toLowerCase() === "lost" && pet.lost_location) {
        setLocationAddress(pet.lost_location);
      }
    },
    onError: (_err, token) => setState({ status: "error", token }),
  });

  const errorText = useApiErrorMessage(scan.error);

  const resetSightingForm = () => {
    setFinderName("");
    setFinderPhone("");
    setLocationAddress("");
    setFinderAddress("");
    setMessage("");
    setLatitude(null);
    setLongitude(null);
    setIsLocating(false);
    setLocationStatus(null);
    setLocationError(null);
    setSightingLoading(false);
    setSightingSubmitted(false);
    setSightingError(null);
    setSightingFieldErrors({});
  };

  const submitToken = useCallback(
    async (token: string) => {
      const clean = sanitizeScanToken(token);
      if (clean.length === 0) {
        setScanNotice(
          "Please enter the safety-tag token from the back of the tag."
        );
        return;
      }

      if (typeof window !== "undefined") {
        console.log("[PawGuard SafetyTag Scan Diagnostic]", {
          tokenExists: Boolean(clean),
          tokenLength: clean.length,
          tokenPrefix: `${clean.substring(0, 8)}...`,
          requestEndpoint: "/api/v1/companion-pets/safety-tag/scan",
        });
      }

      setScanNotice(null);
      setState({ status: "loading", token: clean });
      scan.reset();
      resetSightingForm();

      try {
        const pet = await safetyTagService.scanToken(clean);
        if (typeof window !== "undefined") {
          console.log("[PawGuard SafetyTag Scan Success]", {
            petId: pet.pet_id || pet.id,
            petName: pet.name,
            status: pet.status,
          });
        }
        setState({ status: "success", pet });
        if (pet.status?.toLowerCase() === "lost" && pet.lost_location) {
          setLocationAddress(pet.lost_location);
        }
      } catch (err) {
        if (typeof window !== "undefined") {
          console.error("[PawGuard SafetyTag Scan Error]", {
            tokenPrefix: `${clean.substring(0, 8)}...`,
            status: isApiError(err) ? err.status : "NETWORK_OR_UNKNOWN",
            code: isApiError(err) ? err.code : undefined,
            message: isApiError(err) ? err.message : (err as Error)?.message,
          });
        }
        if (isUuid(clean)) {
          try {
            const dog = await safetyTagService.getDogPublicScan(clean);
            setState({ status: "success-dog", dog });
            return;
          } catch {
            // fall through to error state
          }
        }
        setState({ status: "error", token: clean });
      }
    },
    [scan]
  );

  // Auto-scan token from URL query params (e.g. /scan?token=st_raw_token_xyz) on page load
  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlParams = new URLSearchParams(window.location.search);
    const rawParam =
      urlParams.get("token") ||
      urlParams.get("raw_token") ||
      urlParams.get("code") ||
      urlParams.get("tag");
    if (rawParam && rawParam.trim()) {
      submitToken(rawParam.trim());
    }
  }, [submitToken]);

  const handleDetected = useCallback(
    (token: string) => {
      submitToken(token);
    },
    [submitToken]
  );

  const reset = useCallback(() => {
    setState({ status: "idle" });
    setScanNotice(null);
    scan.reset();
    resetSightingForm();
  }, [scan]);

  // Geolocation Handler (Part 5)
  const handleGetLocation = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setLocationError(
        "Geolocation is not supported by your browser. Please enter your address manually."
      );
      return;
    }

    setIsLocating(true);
    setLocationError(null);
    setLocationStatus(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude.toFixed(6));
        const lng = Number(position.coords.longitude.toFixed(6));
        setLatitude(lat);
        setLongitude(lng);
        setLocationStatus(`Coordinates captured: Lat ${lat}, Lng ${lng}`);
        setIsLocating(false);
        if (!locationAddress) {
          setLocationAddress(`GPS Location (${lat}, ${lng})`);
        }
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(
              "GPS permission denied. Please enter the location address manually."
            );
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError(
              "GPS location unavailable. Please enter the location address manually."
            );
            break;
          case error.TIMEOUT:
            setLocationError(
              "GPS request timed out. Please enter the location address manually."
            );
            break;
          default:
            setLocationError(
              "Could not determine GPS location. Please enter address manually."
            );
            break;
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, [locationAddress]);

  // Citizen Sighting Submission (Part 4)
  const handleSightingSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (state.status !== "success") return;
      const pet = state.pet;

      // Validate all required fields before API call
      const fieldErrs: { phone?: string; location?: string } = {};
      const phoneErr = validatePhone(finderPhone, finderPhoneCountry, true);
      if (phoneErr) fieldErrs.phone = phoneErr;
      if (!locationAddress.trim()) fieldErrs.location = "Location address is required.";
      setSightingFieldErrors(fieldErrs);

      const nameErr = !finderName.trim() ? "Your name is required." : null;
      setSightingError(nameErr);

      if (nameErr || Object.keys(fieldErrs).length > 0) return;

      setSightingError(null);
      setSightingLoading(true);

      const payload: PetSightingCreate = {
        pet_id: pet.pet_id || undefined,
        lost_report_id: pet.lost_report_id || undefined,
        finder_name: finderName.trim(),
        finder_phone: normalizePhonePayload(finderPhone.trim(), finderPhoneCountry),
        location_address: locationAddress.trim(),
        finder_address: finderAddress.trim() || undefined,
        latitude: latitude ?? undefined,
        longitude: longitude ?? undefined,
        message: message.trim() || undefined,
      };

      try {
        await lostFoundService.reportSighting(payload);
        setSightingSubmitted(true);
        setSightingLoading(false);
      } catch (err) {
        setSightingLoading(false);
        if (isApiError(err)) {
          setSightingError(
            err.message ||
              "Failed to submit sighting. Please check your connection and try again."
          );
        } else {
          setSightingError(
            "An unexpected error occurred while submitting your sighting report."
          );
        }
      }
    },
    [
      state,
      finderName,
      finderPhone,
      locationAddress,
      finderAddress,
      latitude,
      longitude,
      message,
    ]
  );

  const isError = state.status === "error";

  const resultView = useMemo(() => {
    if (state.status !== "success" && state.status !== "success-dog") return null;

    if (state.status === "success") {
      const pet = state.pet;
      const rawSpecies = pet.species ? String(pet.species).toLowerCase() : "";
      const speciesLabel =
        rawSpecies && SPECIES_LABEL[rawSpecies]
          ? SPECIES_LABEL[rawSpecies]
          : pet.species || "Pet";
      const normalizedStatus = pet.status ? String(pet.status).toLowerCase() : "safe";
      const isLost = normalizedStatus === "lost";
      const isFound = normalizedStatus === "found";
      const isReunited = normalizedStatus === "reunited";
      const isFoster = normalizedStatus === "foster" || normalizedStatus === "fostered";
      const isVet = normalizedStatus === "veterinary";
      const isMedical = normalizedStatus === "medical";
      const isAdopted = normalizedStatus === "adopted";
      const isTransferred = normalizedStatus === "transferred" || normalizedStatus === "ownership_transfer";
      const isShelter = normalizedStatus === "admitted" || normalizedStatus === "in_shelter" || normalizedStatus === "shelter";

      return (
        <Reveal>
          <div className="flex flex-col gap-8 w-full max-w-[920px] mx-auto">
            {/* Main Pet Safety Profile Card */}
            <Card className="overflow-hidden border border-border shadow-lg">
              <div className="aspect-[16/9] sm:aspect-[21/9] w-full bg-gradient-to-br from-primary/10 via-background to-amber-100/40 relative flex items-center justify-center overflow-hidden">
                {pet.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={pet.photo_url}
                    alt={`${pet.name}${speciesLabel ? `, a ${speciesLabel.toLowerCase()}` : ""}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-muted-foreground p-6 text-center">
                    <PawPrint size={48} strokeWidth={1.2} />
                    <span className="text-xs font-semibold tracking-widest uppercase font-condensed text-muted-foreground/80">
                      Photo not available
                    </span>
                  </div>
                )}
                {/* Status Overlay Badge */}
                <div className="absolute top-4 right-4 z-10">
                  {isLost ? (
                    <Badge variant="urgent" className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider animate-pulse shadow-md">
                      <AlertTriangle size={14} className="mr-1.5 inline" />
                      Status: LOST
                    </Badge>
                  ) : isFound ? (
                    <Badge variant="special" className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider shadow-md">
                      <CheckCircle2 size={14} className="mr-1.5 inline" />
                      Status: FOUND
                    </Badge>
                  ) : isReunited ? (
                    <Badge variant="success" className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider shadow-md">
                      <ShieldCheck size={14} className="mr-1.5 inline" />
                      Status: REUNITED
                    </Badge>
                  ) : isFoster ? (
                    <Badge variant="special" className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider shadow-md">
                      <PawPrint size={14} className="mr-1.5 inline" />
                      Status: IN FOSTER CARE
                    </Badge>
                  ) : isVet ? (
                    <Badge variant="neutral" className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider shadow-md">
                      <ShieldCheck size={14} className="mr-1.5 inline" />
                      Status: UNDER VET CARE
                    </Badge>
                  ) : isMedical ? (
                    <Badge variant="neutral" className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider shadow-md">
                      <AlertTriangle size={14} className="mr-1.5 inline" />
                      Status: UNDER MEDICAL CARE
                    </Badge>
                  ) : isAdopted ? (
                    <Badge variant="success" className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider shadow-md">
                      <ShieldCheck size={14} className="mr-1.5 inline" />
                      Status: ADOPTED
                    </Badge>
                  ) : isTransferred ? (
                    <Badge variant="neutral" className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider shadow-md">
                      <ShieldCheck size={14} className="mr-1.5 inline" />
                      Status: OWNERSHIP TRANSFERRED
                    </Badge>
                  ) : isShelter ? (
                    <Badge variant="neutral" className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider shadow-md">
                      <ShieldCheck size={14} className="mr-1.5 inline" />
                      Status: IN SHELTER
                    </Badge>
                  ) : (
                    <Badge variant="success" className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider shadow-md">
                      <ShieldCheck size={14} className="mr-1.5 inline" />
                      Status: SAFE
                    </Badge>
                  )}
                </div>
              </div>

              <div className="p-6 lg:p-8 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="success">PawGuard Verified Tag</Badge>
                    {speciesLabel && <Badge variant="neutral">{speciesLabel}</Badge>}
                    {pet.breed && <Badge variant="neutral">{pet.breed}</Badge>}
                  </div>
                  <h2 className="text-foreground font-serif font-bold text-3xl sm:text-4xl leading-tight">
                    {pet.name}
                  </h2>
                  <p className="text-muted-foreground text-sm font-medium">
                    {[pet.breed, pet.color].filter(Boolean).join(" · ") ||
                      "Details registered on PawGuard network"}
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-muted/40 border border-border/60 rounded-card">
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-2xs font-semibold uppercase tracking-wider font-condensed">
                      Species
                    </span>
                    <span className="text-foreground font-semibold text-sm">
                      {speciesLabel}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-2xs font-semibold uppercase tracking-wider font-condensed">
                      Breed
                    </span>
                    <span className="text-foreground font-semibold text-sm">
                      {pet.breed || "Not specified"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-2xs font-semibold uppercase tracking-wider font-condensed">
                      Colour
                    </span>
                    <span className="text-foreground font-semibold text-sm">
                      {pet.color || "Registered"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-2xs font-semibold uppercase tracking-wider font-condensed">
                      Tag Verification
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm flex items-center gap-1">
                      <ShieldCheck size={14} /> Active &amp; Valid
                    </span>
                  </div>
                </div>

                {/* Emergency Notes Banner */}
                {pet.emergency_notes && (
                  <Alert variant="error" title="Critical Emergency & Medical Notes">
                    <p className="text-sm font-medium leading-relaxed">
                      {pet.emergency_notes}
                    </p>
                  </Alert>
                )}

                {/* Guidance Message */}
                {pet.message && !pet.emergency_notes && (
                  <Alert variant="info" title="Safety Guidance">
                    {pet.message}
                  </Alert>
                )}

                {/* Section 2: Detailed Lifecycle State Presentation */}
                {isFoster && (
                  <div className="p-5 rounded-card bg-primary/5 border border-primary/20 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider font-condensed">
                      <PawPrint size={16} /> Foster Program Status
                    </div>
                    <p className="text-foreground font-serif font-bold text-lg">
                      Currently Placed in Verified Foster Care
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {pet.name} is residing with an approved PawGuard foster family while awaiting permanent placement or owner return.
                    </p>
                  </div>
                )}

                {(isVet || isMedical) && (
                  <div className="p-5 rounded-card bg-amber-500/10 border border-amber-500/25 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-sm uppercase tracking-wider font-condensed">
                      <AlertTriangle size={16} /> Veterinary &amp; Medical Care Status
                    </div>
                    <p className="text-foreground font-serif font-bold text-lg">
                      Under Active Clinical Care Supervision
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      This animal is receiving professional veterinary/medical care. Refer to emergency notes above for care instructions.
                    </p>
                  </div>
                )}

                {(isAdopted || isTransferred) && (
                  <div className="p-5 rounded-card bg-emerald-500/10 border border-emerald-500/25 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold text-sm uppercase tracking-wider font-condensed">
                      <ShieldCheck size={16} /> Ownership Status
                    </div>
                    <p className="text-foreground font-serif font-bold text-lg">
                      {isTransferred ? "Ownership Transferred & Registered" : "Adopted Companion"}
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {pet.name} is a registered companion pet in an active family home on the PawGuard safety network.
                    </p>
                  </div>
                )}

                {isFound && (
                  <div className="p-5 rounded-card bg-sky-500/10 border border-sky-500/25 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400 font-semibold text-sm uppercase tracking-wider font-condensed">
                      <CheckCircle2 size={16} /> Animal Found Status
                    </div>
                    <p className="text-foreground font-serif font-bold text-lg">
                      Animal Reported Found — Reunification in Progress
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      A member of the community has reported finding {pet.name}. PawGuard coordinators are coordinating safe return to the owner.
                    </p>
                  </div>
                )}

                {isReunited && (
                  <div className="p-5 rounded-card bg-emerald-500/10 border border-emerald-500/25 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold text-sm uppercase tracking-wider font-condensed">
                      <ShieldCheck size={16} /> Reunited Status
                    </div>
                    <p className="text-foreground font-serif font-bold text-lg">
                      Successfully Reunited with Family!
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      This companion pet was reported missing and has been safely reconnected with their family.
                    </p>
                  </div>
                )}

                {isShelter && (
                  <div className="p-5 rounded-card bg-slate-500/10 border border-slate-500/25 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-400 font-semibold text-sm uppercase tracking-wider font-condensed">
                      <ShieldCheck size={16} /> Shelter Intake Status
                    </div>
                    <p className="text-foreground font-serif font-bold text-lg">
                      Admitted to PawGuard Shelter Care
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {pet.name} is under intake, health assessment, and sheltering with PawGuard shelter partners.
                    </p>
                  </div>
                )}

                {/* Section 3: Lost State Details & Owner Info */}
                {isLost && (
                  <div className="flex flex-col gap-6 p-6 rounded-card bg-destructive/5 border border-destructive/20 mt-2">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="text-destructive shrink-0 mt-0.5" size={22} />
                      <div className="flex flex-col gap-1">
                        <h3 className="text-foreground font-serif font-bold text-lg">
                          This Pet is Currently Reported Lost
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          The owner has reported {pet.name} missing. If you have seen or found this pet, please use the sighting form below or call the hotline immediately.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-destructive/15">
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground text-2xs font-semibold uppercase tracking-wider font-condensed flex items-center gap-1">
                          <MapPin size={12} /> Lost Location
                        </span>
                        <span className="text-foreground font-semibold text-sm">
                          {pet.lost_location || "Not specified"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground text-2xs font-semibold uppercase tracking-wider font-condensed flex items-center gap-1">
                          <Calendar size={12} /> Reported Date / Time
                        </span>
                        <span className="text-foreground font-semibold text-sm">
                          {formatDate(pet.lost_at)}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground text-2xs font-semibold uppercase tracking-wider font-condensed flex items-center gap-1">
                          <Hash size={12} /> Lost Report ID
                        </span>
                        <span className="text-foreground font-mono font-semibold text-xs truncate">
                          {pet.lost_report_id || "Active"}
                        </span>
                      </div>
                    </div>

                    {/* Owner Contact Information Guidance */}
                    <div className="flex flex-col gap-2 pt-4 border-t border-destructive/15">
                      <span className="text-xs font-semibold tracking-wider uppercase font-condensed text-muted-foreground flex items-center gap-1.5">
                        <User size={14} className="text-primary" /> Owner Notification &amp; Privacy
                      </span>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        To protect owner privacy, sensitive direct contact information is secured by default. Scanning this tag has automatically notified the owner that {pet.name}&apos;s tag was scanned. Please submit a sighting report below so the owner can reach out directly.
                      </p>
                    </div>
                  </div>
                )}

                {/* Section 4: What To Do Guidance & Action Buttons */}
                <div className="flex flex-col gap-4 pt-2 border-t border-border">
                  <div className="flex items-center gap-3 text-muted-foreground text-sm">
                    <ShieldCheck size={18} className="shrink-0 text-primary" />
                    Verified PawGuard Safety Tag (Pet ID: {(pet.pet_id || pet.dog_id || pet.id || "").slice(0, 8)}…)
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <a
                      href="tel:+919876543210"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-button bg-destructive text-destructive-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm w-full sm:w-auto text-center"
                    >
                      <Phone size={16} />
                      Emergency Hotline: Call PawGuard
                    </a>
                    <Button type="button" variant="outline" size="md" onClick={reset} className="w-full sm:w-auto">
                      <RotateCcw size={15} />
                      Scan Another Tag
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Part 4 & 5: Citizen / Finder Sighting Form */}
            <Card className="p-6 lg:p-8 flex flex-col gap-6 border border-border shadow-md">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-primary">
                  <MapPin size={20} />
                  <span className="text-xs font-semibold tracking-widest uppercase font-condensed">
                    Citizen Sighting Report
                  </span>
                </div>
                <h3 className="text-foreground font-serif font-bold text-xl sm:text-2xl">
                  Have you found or spotted {pet.name}?
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Submit a sighting report to automatically notify the owner with your exact location and contact details.
                </p>
              </div>

              {sightingSubmitted ? (
                <div className="p-6 rounded-card bg-emerald-500/10 border border-emerald-500/30 flex flex-col items-center text-center gap-3 py-8">
                  <CheckCircle2 size={44} className="text-emerald-600 dark:text-emerald-400" />
                  <h4 className="text-foreground font-serif font-bold text-xl">
                    Thank You! Your Sighting Has Been Reported.
                  </h4>
                  <p className="text-muted-foreground text-sm max-w-[500px] leading-relaxed">
                    The pet owner has been automatically notified with your report details and location. They will contact you shortly.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={() => setSightingSubmitted(false)}
                    className="mt-2"
                  >
                    Submit another update
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSightingSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      id="finder-name"
                      label="Your Name *"
                      placeholder="e.g. Jane Doe"
                      value={finderName}
                      onChange={(e) => setFinderName(e.target.value)}
                      required
                    />
                    <PhoneInput
                      id="finder-phone"
                      label="Your Mobile Number *"
                      value={finderPhone}
                      countryCode={finderPhoneCountry}
                      onCountryChange={(code) => {
                        setFinderPhoneCountry(code);
                        if (sightingFieldErrors.phone) setSightingFieldErrors((prev) => ({ ...prev, phone: undefined }));
                      }}
                      onValueChange={(val, code) => {
                        setFinderPhone(val);
                        if (sightingFieldErrors.phone) setSightingFieldErrors((prev) => ({ ...prev, phone: undefined }));
                        const c = getCountryByCode(code);
                        if (val.length === c.maxLength) {
                          const err = validatePhone(val, code, true);
                          if (err) setSightingFieldErrors((prev) => ({ ...prev, phone: err }));
                        }
                      }}
                      error={sightingFieldErrors.phone}
                      required
                    />
                  </div>

                  {/* Part 5: Location Input & GPS Geolocation Button */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <label htmlFor="location-address" className="text-xs font-semibold uppercase tracking-wider font-condensed text-foreground">
                        Reported Location Address *
                      </label>
                      <button
                        type="button"
                        onClick={handleGetLocation}
                        disabled={isLocating}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline disabled:opacity-50 transition-opacity"
                      >
                        <Crosshair size={14} className={isLocating ? "animate-spin" : ""} />
                        {isLocating ? "Fetching GPS..." : "Use My Current Location"}
                      </button>
                    </div>
                    <Input
                      id="location-address"
                      placeholder="Street, area, landmark or landmark details…"
                      value={locationAddress}
                      required
                      aria-required="true"
                      onChange={(e) => {
                        setLocationAddress(e.target.value);
                        if (sightingFieldErrors.location) setSightingFieldErrors((prev) => ({ ...prev, location: undefined }));
                      }}
                      error={sightingFieldErrors.location}
                    />
                    {locationStatus && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 size={13} /> {locationStatus}
                      </p>
                    )}
                    {locationError && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                        <AlertTriangle size={13} /> {locationError}
                      </p>
                    )}
                  </div>

                  <Input
                    id="finder-address"
                    label="Your Address (Optional)"
                    placeholder="Your residential / work address if pet is safe with you"
                    value={finderAddress}
                    onChange={(e) => setFinderAddress(e.target.value)}
                  />

                  <Textarea
                    id="sighting-message"
                    label="Additional Notes / Message (Optional)"
                    placeholder="e.g. Pet is currently safe with me at the coffee shop, wearing blue collar…"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                  />

                  {sightingError && <Alert variant="error">{sightingError}</Alert>}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={sightingLoading}
                    disabled={sightingLoading}
                    className="w-full sm:w-auto self-start"
                  >
                    <Send size={16} />
                    Submit Sighting Report
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </Reveal>
      );
    }

    const dog = state.dog;
    const rawStatus = dog.current_status
      ? String(dog.current_status).toLowerCase()
      : "";
    const speciesLabel =
      rawStatus && SPECIES_LABEL[rawStatus]
        ? SPECIES_LABEL[rawStatus]
        : dog.current_status || "Rescue Dog";

    return (
      <Reveal>
        <Card className="overflow-hidden max-w-[920px] mx-auto border border-border shadow-lg">
          <div className="aspect-[16/9] sm:aspect-[21/9] w-full bg-gradient-to-br from-primary/10 via-background to-amber-100/40 relative flex items-center justify-center overflow-hidden">
            {dog.photo_gallery_urls && dog.photo_gallery_urls.length > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={dog.photo_gallery_urls[0]}
                alt={`${dog.name}${speciesLabel ? `, a ${speciesLabel.toLowerCase()}` : ""}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-muted-foreground p-6 text-center">
                <PawPrint size={48} strokeWidth={1.2} />
                <span className="text-xs font-semibold tracking-widest uppercase font-condensed text-muted-foreground/80">
                  Photo not available
                </span>
              </div>
            )}
          </div>

          <div className="p-6 lg:p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="success">Public Profile Verified</Badge>
                <Badge variant="neutral">{dog.breed}</Badge>
                <Badge variant="neutral">{speciesLabel}</Badge>
              </div>
              <h2 className="text-foreground font-serif font-bold text-3xl sm:text-4xl leading-tight">
                {dog.name}
              </h2>
              <p className="text-muted-foreground text-sm font-medium">
                Reg No: {dog.registration_number}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-5 bg-card border border-border rounded-card">
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground text-2xs font-semibold tracking-wider uppercase font-condensed">
                  Status
                </span>
                <span className="text-foreground font-semibold text-sm capitalize">
                  {dog.current_status.replace(/_/g, " ")}
                </span>
              </div>
              {dog.gender && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-muted-foreground text-2xs font-semibold tracking-wider uppercase font-condensed">
                    Sex
                  </span>
                  <span className="text-foreground font-semibold text-sm capitalize">
                    {dog.gender}
                  </span>
                </div>
              )}
              {dog.estimated_age && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-muted-foreground text-2xs font-semibold tracking-wider uppercase font-condensed">
                    Age
                  </span>
                  <span className="text-foreground font-semibold text-sm">
                    {dog.estimated_age}
                  </span>
                </div>
              )}
              {dog.weight_kg !== null && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-muted-foreground text-2xs font-semibold tracking-wider uppercase font-condensed">
                    Weight
                  </span>
                  <span className="text-foreground font-semibold text-sm">
                    {dog.weight_kg} kg
                  </span>
                </div>
              )}
              {dog.color && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-muted-foreground text-2xs font-semibold tracking-wider uppercase font-condensed">
                    Colour
                  </span>
                  <span className="text-foreground font-semibold text-sm">
                    {dog.color}
                  </span>
                </div>
              )}
              {dog.temperament && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-muted-foreground text-2xs font-semibold tracking-wider uppercase font-condensed">
                    Temperament
                  </span>
                  <span className="text-foreground font-semibold text-sm capitalize">
                    {dog.temperament.replace(/_/g, " ")}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-1">
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <ShieldCheck size={18} className="shrink-0 text-primary" />
                Verified PawGuard Public Profile.
                {dog.is_adoptable && " This dog is currently adoptable."}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="primary" size="md" onClick={reset}>
                <RotateCcw size={15} />
                Scan another tag
              </Button>
              {dog.is_adoptable && (
                <Button
                  variant="outline"
                  size="md"
                  asLink={{ href: `/adopt/${dog.registration_number}` }}
                >
                  View adoption profile
                </Button>
              )}
            </div>
          </div>
        </Card>
      </Reveal>
    );
  }, [
    state,
    reset,
    finderName,
    finderPhone,
    locationAddress,
    finderAddress,
    message,
    isLocating,
    locationStatus,
    locationError,
    sightingSubmitted,
    sightingLoading,
    sightingError,
    handleGetLocation,
    handleSightingSubmit,
  ]);

  return (
    <PageShell>
      <main id="main-content" className="flex-1 pb-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-height)+1.5rem)]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-primary transition-colors duration-fast group"
          >
            <ArrowLeft
              size={15}
              className="transition-transform duration-fast group-hover:-translate-x-0.5"
            />
            Back to home
          </Link>
        </div>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <Reveal>
            <div className="max-w-[760px]">
              <SectionHeading eyebrow="Safety Tags">
                Scan Safety Tag
              </SectionHeading>
              <p className="text-muted-foreground text-base leading-relaxed mt-3 max-w-[620px]">
                Found a pet with a PawGuard Safety Tag? Scan the QR code with your camera or enter the unique Safety Tag token below to view verified pet information and report a sighting — no account required.
              </p>
            </div>
          </Reveal>

          {/* Scanner & Manual Input Grid (when not showing result) */}
          {state.status !== "success" && state.status !== "success-dog" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-10">
              {/* Part 1: QR Camera Scanner */}
              <Reveal>
                <Card className="p-6 lg:p-8 flex flex-col gap-6 shadow-sm border border-border">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-primary">
                      <QrCode size={20} />
                      <span className="text-xs font-semibold tracking-widest uppercase font-condensed">
                        Scan QR Code with Camera
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Point your device camera at the QR code on the Safety Tag. Camera permissions are requested only when you start scanning.
                    </p>
                  </div>

                  <QrScanner onDetected={handleDetected} />
                </Card>
              </Reveal>

              {/* Part 1: Manual Token Entry */}
              <Reveal>
                <Card className="p-6 lg:p-8 flex flex-col gap-6 shadow-sm border border-border">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-primary">
                      <KeyRound size={20} />
                      <span className="text-xs font-semibold tracking-widest uppercase font-condensed">
                        Enter Safety Tag Token Manually
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      If camera scanning is unavailable, type or paste the Safety Tag token located under the QR code on the physical tag.
                    </p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      submitToken(manualToken);
                    }}
                    className="flex flex-col gap-4"
                  >
                    <Input
                      id="safety-tag-token"
                      label="Safety Tag Token"
                      placeholder="Paste or type raw token string…"
                      value={manualToken}
                      onChange={(e) => setManualToken(e.target.value)}
                      autoComplete="off"
                      spellCheck={false}
                      className="font-mono text-sm"
                    />

                    {scanNotice && state.status !== "loading" && (
                      <Alert variant="info">{scanNotice}</Alert>
                    )}

                    {state.status === "loading" && (
                      <div className="flex flex-col gap-3 py-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-full max-w-[480px]" />
                        <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                          <span className="h-3.5 w-3.5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                          Verifying Safety Tag with PawGuard network…
                        </div>
                      </div>
                    )}

                    {/* Part 7: Error States */}
                    {isError && (
                      <Alert
                        variant="error"
                        title="Safety Tag Verification Failed"
                      >
                        {formatScanError(errorText)}
                      </Alert>
                    )}

                    <div className="flex flex-col gap-3 pt-1">
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        isLoading={state.status === "loading"}
                        disabled={state.status === "loading"}
                      >
                        <ScanLine size={16} />
                        Verify Safety Tag
                      </Button>
                      {isError && isRetryableError(scan.error) && (
                        <button
                          type="button"
                          onClick={() => submitToken(state.token)}
                          className="self-start text-xs font-semibold text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
                        >
                          Retry verification
                        </button>
                      )}
                    </div>
                  </form>
                </Card>
              </Reveal>
            </div>
          )}

          {/* Success Result Views */}
          {state.status === "success" && <div className="mt-10">{resultView}</div>}
          {state.status === "success-dog" && (
            <div className="mt-10">{resultView}</div>
          )}
        </div>
      </main>
    </PageShell>
  );
}

function formatScanError(errorText: string | null): string {
  if (!errorText) {
    return "Could not verify this Safety Tag. Please double-check the token and try again.";
  }
  if (/not found|404/i.test(errorText)) {
    return "Safety Tag not found. The token may be invalid or expired. Please check the code printed on the physical tag.";
  }
  if (/validation|422|short|length/i.test(errorText)) {
    return "Invalid Safety Tag token format. PawGuard tokens are between 20 and 256 characters long.";
  }
  if (/disabled|inactive|revoked/i.test(errorText)) {
    return "This Safety Tag is currently disabled or inactive.";
  }
  if (/network|fetch|timeout/i.test(errorText)) {
    return "Unable to connect to PawGuard network servers. Please check your internet connection and retry.";
  }
  return errorText;
}