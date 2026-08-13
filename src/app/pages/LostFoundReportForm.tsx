"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, LocateFixed, X, Phone } from "lucide-react";
import { PageShell, Card, Reveal, Alert, Button, Input, Textarea, SuccessState } from "../components/pawguard";
import SectionHeading from "../components/SectionHeading";
import { useApiMutation, useApiErrorMessage, QUERY_KEYS } from "@/lib/api";
import { queryClient } from "@/lib/react-query";
import { lostFoundService } from "@/services/api/lost-found";
import { useGeolocation } from "../hooks/useGeolocation";
import { toApiDateTime } from "@/lib/api";
import { useAuth } from "../providers/auth-provider";
import type { Species } from "@/lib/api";
import type { LostFoundKind } from "@/types";

const SPECIES_OPTIONS: { value: Species; label: string }[] = [
  { value: "dog", label: "Dog" },
  { value: "cat", label: "Cat" },
  { value: "bird", label: "Bird" },
  { value: "rabbit", label: "Rabbit" },
  { value: "other", label: "Other" },
];

const FIELD_LABELS: Record<LostFoundKind, { form: string; place: string; pet: string; id: string }> = {
  lost: {
    form: "Report a Lost Pet",
    place: "Where was the pet last seen?",
    pet: "Pet name",
    id: "Microchip ID (if known)",
  },
  found: {
    form: "Report a Found Animal",
    place: "Where did you find the animal?",
    pet: "Animal type",
    id: "Description",
  },
};

const GPS_STATUS_HINT: Record<string, string> = {
  loading: "Locating…",
  denied: "Location permission was denied — please enter the location manually.",
  unavailable: "Your location is currently unavailable — please enter it manually.",
  timeout: "Location request timed out — please enter it manually or try again.",
  unsupported: "This browser doesn't support geolocation — please enter the location manually.",
  granted: "Using your current location.",
};

export default function LostFoundReportForm({ kind }: { kind: LostFoundKind }) {
  const labels = FIELD_LABELS[kind];
  const { isAuthenticated, openAuthDialog } = useAuth();

  // Lost
  const [petName, setPetName] = useState("");
  const [species, setSpecies] = useState<Species>("dog");
  const [breed, setBreed] = useState("");
  const [color, setColor] = useState("");
  const [microchipId, setMicrochipId] = useState("");
  // Found
  const [breedObserved, setBreedObserved] = useState("");
  const [colorObserved, setColorObserved] = useState("");
  const [description, setDescription] = useState("");
  // Shared
  const [locationAddress, setLocationAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [eventAt, setEventAt] = useState("");
  const [dateError, setDateError] = useState<string | null>(null);

  // Compute the max datetime-local value once per render (local time, no TZ suffix).
  // Format: YYYY-MM-DDTHH:mm  — the exact format datetime-local expects.
  const maxEventAt = useMemo(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59);
    return (
      `${endOfToday.getFullYear()}-${pad(endOfToday.getMonth() + 1)}-${pad(endOfToday.getDate())}` +
      `T${pad(endOfToday.getHours())}:${pad(endOfToday.getMinutes())}`
    );
  }, []);

  const { status: gpsStatus, coords, errorMessage, requestLocation, clearLocation: clearGps } = useGeolocation();

  // Auto-apply GPS coordinates into the form fields the moment the browser
  // grants location — no second click required.
  useEffect(() => {
    if (gpsStatus === "granted" && coords) {
      setLatitude(coords.latitude.toFixed(6));
      setLongitude(coords.longitude.toFixed(6));
    }
  }, [gpsStatus, coords]);

  function clearLocation() {
    clearGps();
    setLatitude("");
    setLongitude("");
  }

  const gpsHint = gpsStatus !== "idle" && gpsStatus !== "granted" ? GPS_STATUS_HINT[gpsStatus] : null;

  const cleanupCoords = useMemo(() => {
    function valid(value: string): number | null {
      if (value.trim() === "") return null;
      const n = Number(value);
      return Number.isFinite(n) ? n : null;
    }
    return {
      latitude: valid(latitude),
      longitude: valid(longitude),
      photo: photoUrl.trim() === "" ? null : photoUrl.trim(),
    };
  }, [latitude, longitude, photoUrl]);

  const losPayload = {
    species,
    pet_name: petName.trim(),
    breed: breed.trim(),
    color: color.trim(),
    microchip_id: microchipId.trim() === "" ? null : microchipId.trim(),
    location_address: locationAddress.trim(),
    latitude: cleanupCoords.latitude,
    longitude: cleanupCoords.longitude,
    lost_at: eventAt ? toApiDateTime(new Date(eventAt)) : "",
    photo_url: cleanupCoords.photo,
  };

  const foundPayload = {
    species,
    breed_observed: breedObserved.trim(),
    color_observed: colorObserved.trim(),
    location_address: locationAddress.trim(),
    latitude: cleanupCoords.latitude,
    longitude: cleanupCoords.longitude,
    found_at: eventAt ? toApiDateTime(new Date(eventAt)) : "",
    photo_url: cleanupCoords.photo,
  };

  const [submittedReport, setSubmittedReport] = useState<{ id: string } | null>(null);

  const mutation = useApiMutation<{ id: string }, void>({
    mutationFn: () =>
      kind === "lost"
        ? lostFoundService.reportLostPet(losPayload)
        : lostFoundService.reportFoundPet(foundPayload),
    onSuccess: async (report) => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lostFound.reports });
      setSubmittedReport(report);
    },
  });

  const errorMessageText = useApiErrorMessage(mutation.error);

  // Once the user signs in after a 401, resubmit automatically.
  useEffect(() => {
    if (mutation.isError && mutation.error?.isUnauthorized && isAuthenticated) {
      mutation.mutate();
    }
  }, [isAuthenticated, mutation.isError]);

  function handleUseMyLocation() {
    requestLocation();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (eventAt) {
      const picked = new Date(eventAt);
      const pickedDate = new Date(picked.getFullYear(), picked.getMonth(), picked.getDate());
      const today = new Date();
      const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      if (pickedDate > todayDate) {
        setDateError("Report date cannot be in the future.");
        return;
      }
    }
    setDateError(null);
    mutation.mutate();
  }

  if (submittedReport) {
    return (
      <PageShell>
        <main id="main-content" className="flex-1 flex items-start justify-center px-6 lg:px-8 pt-[calc(var(--header-height)+2rem)] pb-section-lg">
          <div className="max-w-[560px] w-full">
            <Reveal>
              <SuccessState
                title={kind === "lost" ? "Lost Pet Report Submitted" : "Found Animal Report Submitted"}
                description={
                  kind === "lost"
                    ? "Your missing-pet report is now live in the Lost & Found directory, helping neighbours keep an eye out for your companion."
                    : "Your found-animal report is now live in the Lost & Found directory, helping families locate their companion."
                }
                impact={{ label: "Report number", value: submittedReport.id.slice(0, 8).toUpperCase() }}
                action={{ label: "View Report", to: `/lost-found/${submittedReport.id}` }}
                secondaryAction={{ label: "Browse Lost & Found", to: "/lost-found" }}
              />
            </Reveal>
          </div>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-[calc(var(--header-height)+1.5rem)]">
          <Link
            href="/lost-found"
            className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-primary transition-colors duration-fast group"
          >
            <ArrowLeft size={15} className="transition-transform duration-fast group-hover:-translate-x-0.5" />
            Back to Lost &amp; Found
          </Link>
        </div>

        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-8 lg:py-12">
          <Reveal>
            <div className="max-w-[760px]">
              <SectionHeading eyebrow="Lost & Found">{labels.form}</SectionHeading>
              <p className="text-muted-foreground text-base leading-relaxed mt-3 max-w-[560px]">
                {kind === "lost"
                  ? "Tell us about your missing companion and where they were last seen. Every report helps our community search together."
                  : "Describe the animal you found and where. Your report helps a family recognise their companion and reunite safely."}
              </p>
            </div>
          </Reveal>

          <Reveal>
            <Card className="mt-10 max-w-[760px]">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {mutation.isError && errorMessageText && (
                  <Alert variant="error" title={mutation.error?.isUnauthorized ? "Sign in required" : "We couldn't submit your report"}>
                    {mutation.error?.isUnauthorized
                      ? "Submitting a report requires a PawGuard account. Sign in to continue and we'll resubmit automatically."
                      : `${errorMessageText} `}
                    {mutation.error?.isUnauthorized && (
                      <button
                        onClick={() => openAuthDialog("sign-in")}
                        className="font-semibold text-destructive underline underline-offset-2 hover:opacity-80 transition-opacity"
                      >
                        Sign in now
                      </button>
                    )}
                    {!mutation.error?.isUnauthorized && (
                      <button onClick={() => mutation.mutate()} className="font-semibold text-destructive underline underline-offset-2 hover:opacity-80 transition-opacity">
                        Retry
                      </button>
                    )}
                  </Alert>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    id={`${kind}-pet-name`}
                    label={labels.pet}
                    placeholder={kind === "lost" ? "e.g. Buddy" : "e.g. Dog"}
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    required
                  />

                  <div className="flex flex-col gap-2">
                    <label htmlFor={`${kind}-species`} className="text-foreground text-xs font-semibold tracking-wider uppercase font-condensed">
                      Species
                    </label>
                    <select
                      id={`${kind}-species`}
                      value={species}
                      onChange={(e) => setSpecies(e.target.value as Species)}
                      className="w-full h-12 bg-input-background border border-border rounded-input px-4 text-foreground text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-gentle ease-gentle"
                    >
                      {SPECIES_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <Input
                    id={`${kind}-breed`}
                    label={kind === "lost" ? "Breed" : "Observed breed"}
                    placeholder={kind === "lost" ? "e.g. Beagle mix" : "e.g. Lab mix"}
                    value={kind === "lost" ? breed : breedObserved}
                    onChange={(e) => (kind === "lost" ? setBreed(e.target.value) : setBreedObserved(e.target.value))}
                    required
                  />

                  <Input
                    id={`${kind}-color`}
                    label={kind === "lost" ? "Colour / markings" : "Observed colour"}
                    placeholder={kind === "lost" ? "e.g. Tan/White" : "e.g. Black"}
                    value={kind === "lost" ? color : colorObserved}
                    onChange={(e) => (kind === "lost" ? setColor(e.target.value) : setColorObserved(e.target.value))}
                    required
                  />

                  {kind === "lost" && (
                    <Input
                      id="lost-microchip"
                      label={labels.id}
                      placeholder="e.g. 985141002345678"
                      value={microchipId}
                      onChange={(e) => setMicrochipId(e.target.value)}
                    />
                  )}

                  {kind === "found" && (
                    <Textarea
                      id="found-description"
                      label={labels.id}
                      placeholder="Distinctive features, collar colour, condition…"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  )}

                  <Input
                    id={`${kind}-address`}
                    label="Location"
                    placeholder={labels.place}
                    value={locationAddress}
                    onChange={(e) => setLocationAddress(e.target.value)}
                    required
                  />

                  <Input
                    id={`${kind}-at`}
                    label={kind === "lost" ? "Lost on (date & time)" : "Found on (date & time)"}
                    type="datetime-local"
                    value={eventAt}
                    max={maxEventAt}
                    onChange={(e) => {
                      setEventAt(e.target.value);
                      if (dateError) setDateError(null);
                    }}
                    error={dateError ?? undefined}
                    required
                  />
                </div>

                {/* GPS */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-foreground text-xs font-semibold tracking-wider uppercase font-condensed">Coordinates (optional)</span>
                    {gpsStatus !== "idle" && (
                      <button type="button" onClick={clearLocation} className="inline-flex items-center gap-1.5 text-muted-foreground text-xs hover:text-destructive transition-colors duration-fast">
                        <X size={13} /> Clear
                      </button>
                    )}
                  </div>

                  <Button type="button" variant="outline" size="sm" onClick={handleUseMyLocation} disabled={gpsStatus === "loading"} className="self-start">
                    <LocateFixed size={15} />
                    {gpsStatus === "loading" ? "Locating…" : "Use My Location"}
                  </Button>

                  {gpsStatus === "granted" && latitude && longitude && (
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-emerald-700 text-xs font-semibold">
                      <LocateFixed size={13} className="shrink-0" />
                      GPS pinned — {parseFloat(latitude).toFixed(4)}, {parseFloat(longitude).toFixed(4)}
                    </div>
                  )}

                  {gpsHint && <p className="text-muted-foreground text-xs">{gpsHint}</p>}
                  {errorMessage && gpsStatus !== "granted" && <p className="text-destructive text-xs">{errorMessage}</p>}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input
                      id={`${kind}-lat`}
                      label="Latitude"
                      type="number"
                      step="any"
                      placeholder="e.g. 17.4326"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                    />
                    <Input
                      id={`${kind}-lng`}
                      label="Longitude"
                      type="number"
                      step="any"
                      placeholder="e.g. 78.4071"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                    />
                  </div>
                  <p className="text-muted-foreground text-xs">
                    GPS is optional and never required. If your browser can't provide your location, type the area or coordinates manually.
                  </p>
                </div>

                <Input
                  id={`${kind}-photo`}
                  label="Photo URL (optional)"
                  type="url"
                  placeholder="https://…"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                />

                <div className="flex flex-col gap-3 pt-1">
                  <Button type="submit" variant="primary" size="md" isLoading={mutation.isPending} disabled={mutation.isPending}>
                    {kind === "lost" ? "Submit Lost Pet Report" : "Submit Found Animal Report"}
                  </Button>
                  <p className="text-muted-foreground text-xs flex items-center gap-1.5">
                    <Phone size={12} className="shrink-0" />
                    Need urgent help? Contact your nearest PawGuard rescue team or emergency services directly.
                  </p>
                </div>
              </form>
            </Card>
          </Reveal>
        </div>
      </main>
    </PageShell>
  );
}