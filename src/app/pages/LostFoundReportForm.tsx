"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, LocateFixed, X, Phone, PawPrint, CheckCircle2 } from "lucide-react";
import { PageShell, Card, Reveal, Alert, Button, Input, Textarea, SuccessState, Badge } from "../components/pawguard";
import SectionHeading from "../components/SectionHeading";
import { useApiMutation, useApiErrorMessage, QUERY_KEYS, toApiDateTime, getErrorMessage } from "@/lib/api";
import { queryClient } from "@/lib/react-query";
import { lostFoundService } from "@/services/api/lost-found";
import { useGeolocation } from "../hooks/useGeolocation";
import { useAuth } from "../providers/auth-provider";
import { useMyPets } from "../hooks/useMyPets";
import { PhotoUploadInput } from "../components/PhotoUploadInput";
import { LocationMapPicker } from "../components/LocationMapPicker";
import type { Species, LostReportCreate, FoundReportCreate } from "@/lib/api";
import type { LostFoundKind } from "@/types";

const SPECIES_OPTIONS: { value: Species; label: string }[] = [
  { value: "dog", label: "Dog" },
];

const FIELD_LABELS: Record<LostFoundKind, { form: string; subtitle: string; place: string; pet: string; id: string }> = {
  lost: {
    form: "Report a Lost Dog",
    subtitle: "Tell us about your missing dog and where they were last seen. Every report helps our community bring them home safely.",
    place: "Where was your dog last seen?",
    pet: "Dog name",
    id: "Microchip ID (if known)",
  },
  found: {
    form: "Report a Found Dog",
    subtitle: "Describe the dog you found and where you found them. Your report can help reunite them safely with their family.",
    place: "Where did you find the dog?",
    pet: "Dog details",
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
  const searchParams = useSearchParams();
  const urlPetId = searchParams ? searchParams.get("pet_id") : null;

  const labels = FIELD_LABELS[kind];
  const { isAuthenticated, openAuthDialog } = useAuth();
  const { pets, isLoading: petsLoading } = useMyPets(kind === "lost" && isAuthenticated);

  // Lost
  const [companionPetId, setCompanionPetId] = useState("");
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
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [photoObjectKey, setPhotoObjectKey] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "uploaded" | "error">("idle");
  const [eventAt, setEventAt] = useState("");
  const [dateError, setDateError] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  // Auto-select pet matching urlPetId parameter when pets load
  useEffect(() => {
    if (kind === "lost" && urlPetId && pets.length > 0) {
      const matched = pets.find((p) => p.id === urlPetId);
      if (matched) {
        setCompanionPetId(matched.id);
        setPetName(matched.name);
        if (matched.species) setSpecies(matched.species as Species);
        if (matched.breed) setBreed(matched.breed);
        if (matched.color) setColor(matched.color);
        if (matched.microchip_id) setMicrochipId(matched.microchip_id);
      }
    }
  }, [kind, urlPetId, pets]);

  const handleSelectPet = (selectedId: string) => {
    setCompanionPetId(selectedId);
    if (!selectedId) return;
    const matched = pets.find((p) => p.id === selectedId);
    if (matched) {
      setPetName(matched.name);
      if (matched.species) setSpecies(matched.species as Species);
      if (matched.breed) setBreed(matched.breed);
      if (matched.color) setColor(matched.color);
      if (matched.microchip_id) setMicrochipId(matched.microchip_id);
    }
  };

  const handlePhotoChange = (file: File | null, dataUrl: string) => {
    setSelectedPhotoFile(file);
    setPhotoUrl(dataUrl);
    setPhotoObjectKey(null);
    setUploadState("idle");
    if (photoError) setPhotoError(null);
  };

  // Compute the max datetime-local value once per render
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

  useEffect(() => {
    if (gpsStatus === "granted" && coords) {
      setLatitude(coords.latitude.toFixed(6));
      setLongitude(coords.longitude.toFixed(6));
    }
  }, [gpsStatus, coords]);

  function handleClearLocation() {
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
    };
  }, [latitude, longitude]);

  const [submittedReport, setSubmittedReport] = useState<{ id: string } | null>(null);

  const mutation = useApiMutation<{ id: string }, LostReportCreate | FoundReportCreate>({
    mutationFn: (payload) =>
      kind === "lost"
        ? lostFoundService.reportLostPet(payload as LostReportCreate)
        : lostFoundService.reportFoundPet(payload as FoundReportCreate),
    onSuccess: async (report) => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lostFound.reports });
      setSubmittedReport(report);
    },
  });

  const errorMessageText = useApiErrorMessage(mutation.error);

  function handleUseMyLocation() {
    requestLocation();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isAuthenticated) {
      openAuthDialog("sign-in");
      return;
    }

    if (!selectedPhotoFile && !photoObjectKey) {
      setPhotoError("Please upload a photo before submitting the report.");
      return;
    }
    setPhotoError(null);

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

    let activeObjectKey = photoObjectKey;

    // Step 1: Upload photo if file is selected and not yet uploaded
    if (selectedPhotoFile && !activeObjectKey) {
      setIsUploadingPhoto(true);
      setUploadState("uploading");
      try {
        const uploadData = await lostFoundService.getPhotoUploadUrl({
          filename: selectedPhotoFile.name,
          mime_type: selectedPhotoFile.type || "image/jpeg",
          file_size: selectedPhotoFile.size,
        });

        if (!uploadData || !uploadData.upload_url || !uploadData.object_key) {
          throw new Error("Failed to get photo upload URL from storage server.");
        }

        await lostFoundService.uploadPhotoFile(uploadData.upload_url, selectedPhotoFile);
        activeObjectKey = uploadData.object_key;
        setPhotoObjectKey(activeObjectKey);
        setUploadState("uploaded");
      } catch (err: any) {
        console.error("Photo upload error:", err);
        setUploadState("error");
        setPhotoError(getErrorMessage(err) || "Photo upload failed. Please try again.");
        setIsUploadingPhoto(false);
        return;
      } finally {
        setIsUploadingPhoto(false);
      }
    }

    // Step 2: Submit report with photo_object_key
    if (kind === "lost") {
      mutation.mutate({
        species,
        pet_name: petName.trim(),
        breed: breed.trim(),
        color: color.trim(),
        microchip_id: microchipId.trim() === "" ? null : microchipId.trim(),
        location_address: locationAddress.trim(),
        latitude: cleanupCoords.latitude,
        longitude: cleanupCoords.longitude,
        lost_at: eventAt ? toApiDateTime(new Date(eventAt)) : "",
        photo_object_key: activeObjectKey,
        companion_pet_id: companionPetId.trim() === "" ? null : companionPetId.trim(),
      });
    } else {
      mutation.mutate({
        species,
        breed_observed: breedObserved.trim(),
        color_observed: colorObserved.trim(),
        location_address: locationAddress.trim(),
        latitude: cleanupCoords.latitude,
        longitude: cleanupCoords.longitude,
        found_at: eventAt ? toApiDateTime(new Date(eventAt)) : "",
        photo_object_key: activeObjectKey,
      });
    }
  }

  if (submittedReport) {
    return (
      <PageShell>
        <main id="main-content" className="flex-1 flex items-start justify-center px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-height)+2rem)] pb-section-lg">
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

  const selectedPetObject = pets.find((p) => p.id === companionPetId);

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-[calc(var(--header-height)+1.5rem)]">
          <Link
            href="/lost-found"
            className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-primary transition-colors duration-fast group"
          >
            <ArrowLeft size={15} className="transition-transform duration-fast group-hover:-translate-x-0.5" />
            Back to Lost &amp; Found
          </Link>
        </div>

        <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 lg:py-12">
          <Reveal>
            <div className="max-w-[960px]">
              <SectionHeading eyebrow="Lost & Found">{labels.form}</SectionHeading>
              <p className="text-muted-foreground text-base leading-relaxed mt-3 max-w-[720px]">
                {labels.subtitle}
              </p>
            </div>
          </Reveal>

          <Reveal>
            <Card className="mt-10 w-full max-w-[1440px] 2xl:max-w-[1536px] p-6 sm:p-8 lg:p-10">
              <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full">
                {kind === "lost" && isAuthenticated && (
                  <div className="flex flex-col gap-2 p-4 rounded-card bg-primary/5 border border-primary/20 w-full">
                    <label htmlFor="select-my-pet" className="text-foreground text-xs font-semibold tracking-wider uppercase font-condensed flex items-center gap-1.5">
                      <PawPrint size={14} className="text-primary" /> Select Registered Dog (Optional)
                    </label>
                    <select
                      id="select-my-pet"
                      value={companionPetId}
                      onChange={(e) => handleSelectPet(e.target.value)}
                      disabled={petsLoading}
                      className="w-full h-12 bg-input-background border border-border rounded-input px-4 text-foreground text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-gentle ease-gentle"
                    >
                      <option value="">-- Enter dog details manually --</option>
                      {pets.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} {p.breed ? `(${p.breed})` : ""}
                        </option>
                      ))}
                    </select>
                    {selectedPetObject && (
                      <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium mt-1">
                        <CheckCircle2 size={13} /> Selected dog details pre-filled from My Pets.
                      </div>
                    )}
                  </div>
                )}

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
                      <button onClick={(e) => handleSubmit(e)} className="font-semibold text-destructive underline underline-offset-2 hover:opacity-80 transition-opacity">
                        Retry
                      </button>
                    )}
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                  <Input
                    id={`${kind}-pet-name`}
                    label={labels.pet}
                    placeholder={kind === "lost" ? "e.g. Buddy" : "e.g. Dog"}
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    required
                  />

                  <Input
                    id={`${kind}-species`}
                    label="Species"
                    value="Dog (PawGuard is Dog-Only)"
                    readOnly
                    disabled
                    helper="PawGuard Lost & Found is dedicated exclusively to dogs."
                  />

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

                <div className="h-px bg-border my-1" />

                <LocationMapPicker
                  kind={kind}
                  locationAddress={locationAddress}
                  latitude={latitude}
                  longitude={longitude}
                  onChange={({ locationAddress, latitude, longitude }) => {
                    setLocationAddress(locationAddress);
                    setLatitude(latitude);
                    setLongitude(longitude);
                  }}
                />

                <PhotoUploadInput
                  label="Photo of Animal"
                  required
                  value={photoUrl}
                  isUploading={isUploadingPhoto}
                  isUploaded={uploadState === "uploaded"}
                  onChange={handlePhotoChange}
                  error={photoError ?? undefined}
                />

                {kind === "found" && (
                  <Textarea
                    id="found-description"
                    label={labels.id}
                    placeholder="Distinctive features, collar colour, condition…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full min-h-[100px]"
                  />
                )}

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/60 w-full">
                  <p className="text-muted-foreground text-xs flex items-center gap-1.5">
                    <Phone size={14} className="shrink-0 text-primary" />
                    Need urgent help? Contact your nearest PawGuard rescue team directly.
                  </p>
                  <Button type="submit" variant="primary" size="md" isLoading={mutation.isPending} disabled={mutation.isPending} className="w-full sm:w-auto px-8 shrink-0 self-end">
                    {kind === "lost" ? "Submit Lost Pet Report" : "Submit Found Animal Report"}
                  </Button>
                </div>
              </form>
            </Card>
          </Reveal>
        </div>
      </main>
    </PageShell>
  );
}