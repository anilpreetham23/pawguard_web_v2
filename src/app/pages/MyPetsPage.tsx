"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CalendarClock,
  PawPrint,
  CheckCircle2,
  Stethoscope,
  ArrowRight,
  AlertTriangle,
  Pencil,
  Trash2,
  Plus,
  QrCode,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  Loader2,
  X,
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
  Button,
  Input,
  Textarea,
} from "../components/pawguard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { SafetyTagModal, extractRawToken } from "../components/pawguard/SafetyTagModal";
import { AddCompanionPetButton } from "../components/AddCompanionPetButton";
import { useAuth } from "../providers/auth-provider";
import { useMyPets } from "../hooks/useMyPets";
import { useAdoptionApplicationsAll } from "../hooks/useAdoptionApplicationsAll";
import { useSafetyTag } from "../hooks/useSafetyTag";
import { getErrorMessage, isApiError, useApiMutation, QUERY_KEYS } from "@/lib/api";
import { queryClient } from "@/lib/react-query";
import { companionPetsService } from "@/services/api/pets";
import { safetyTagService } from "@/services/api/safety-tag";
import type {
  AdoptionApplicationResponse,
  CompanionPetCreate,
  CompanionPetResponse,
  CompanionPetUpdate,
  SafetyTagProvisionResponse,
} from "@/lib/api";

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

function CompanionPetCard({
  pet,
  onEdit,
  onDelete,
  onTagSuccess,
}: {
  pet: CompanionPetResponse;
  onEdit: (pet: CompanionPetResponse) => void;
  onDelete: (pet: CompanionPetResponse) => void;
  onTagSuccess: (msg: string) => void;
}) {
  const { data: safetyTag, isLoading: tagLoading, isError: tagError, refetch: refetchTag } = useSafetyTag(pet.id);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [provisionedToken, setProvisionedToken] = useState<string | null>(null);

  const provisionMutation = useApiMutation<SafetyTagProvisionResponse, void>({
    mutationFn: () => safetyTagService.provisionSafetyTag(pet.id),
    onSuccess: async (res) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.safetyTag.petTag(pet.id) }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.companionPets.pets }),
      ]);
      setProvisionedToken(res.raw_token);
      setIsTagModalOpen(true);
      onTagSuccess(`QR Safety Tag provisioned successfully for ${pet.name}. Token prefix: ${res.token_prefix}`);
      refetchTag();
    },
  });

  const provisionError = provisionMutation.error ? getErrorMessage(provisionMutation.error) : null;

  return (
    <Card className="justify-between">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {pet.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={pet.photo_url}
              alt={pet.name}
              className="w-11 h-11 shrink-0 rounded-xl object-cover border border-border"
            />
          ) : (
            <span className="w-11 h-11 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
              <PawPrint size={20} className="text-primary" />
            </span>
          )}
          <div className="min-w-0">
            <p className="text-foreground font-bold text-base truncate">{pet.name}</p>
            <p className="text-muted-foreground text-xs">
              {speciesLabel(pet.species)}
              {pet.breed ? ` · ${pet.breed}` : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(pet)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            title="Edit pet details"
            aria-label={`Edit ${pet.name}`}
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(pet)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Remove pet"
            aria-label={`Remove ${pet.name}`}
          >
            <Trash2 size={15} />
          </button>
          <Badge variant="neutral">My Pet</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
        {sexLabel(pet.sex) && <span>Sex: <span className="text-foreground font-medium">{sexLabel(pet.sex)}</span></span>}
        {formatBirthDate(pet.birth_date) && (
          <span>Born: <span className="text-foreground font-medium">{formatBirthDate(pet.birth_date)}</span></span>
        )}
        {pet.breed && <span>Breed: <span className="text-foreground font-medium">{pet.breed}</span></span>}
        {pet.color && <span>Color: <span className="text-foreground font-medium">{pet.color}</span></span>}
        {pet.microchip_id && (
          <span>Microchip: <span className="text-foreground font-medium font-mono text-xs">{pet.microchip_id}</span></span>
        )}
        <span>
          {pet.is_scan_enabled ? "QR safety tag: On" : "QR safety tag: Off"}
        </span>
      </div>

      {pet.emergency_notes && (
        <div className="text-xs text-muted-foreground bg-secondary/50 p-2.5 rounded-lg border border-border/50">
          <span className="font-semibold text-foreground block mb-0.5">Emergency / Care Notes</span>
          <p className="line-clamp-2">{pet.emergency_notes}</p>
        </div>
      )}

      {pet.is_scan_enabled && (
        <div className="flex flex-col gap-2 border-t border-border pt-4">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wider font-condensed">Safety Tag</p>
          {tagLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <span className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              Loading safety tag…
            </div>
          ) : tagError || !safetyTag ? (
            <div className="flex flex-col items-start gap-2 bg-secondary/40 p-3 rounded-lg border border-border/60">
              <p className="text-xs text-muted-foreground">
                {isApiError(tagError) && tagError.isNotFound
                  ? "No QR Safety Tag provisioned yet."
                  : "Safety Tag is not active."}
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                isLoading={provisionMutation.isPending}
                onClick={() => provisionMutation.mutate()}
                className="gap-1.5"
              >
                <QrCode size={14} className="text-primary" />
                Generate QR Safety Tag
              </Button>
              {provisionError && (
                <span className="text-xs text-destructive">{provisionError}</span>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 bg-secondary/40 p-3 rounded-lg border border-border/60">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${safetyTag.is_active ? "text-emerald-700" : "text-muted-foreground"}`}>
                  <span className={`h-2 w-2 rounded-full ${safetyTag.is_active ? "bg-emerald-500" : "bg-muted-foreground/50"}`} />
                  {safetyTag.is_active ? "Tag Active" : "Inactive"}
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">
                  Prefix: <span className="text-foreground font-semibold">{safetyTag.token_prefix}</span>
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Scans: <span className="font-semibold text-foreground">{safetyTag.scan_count}</span> · Last scanned: {safetyTag.last_scanned_at ? new Date(safetyTag.last_scanned_at).toLocaleString() : "Never"}
              </p>
              <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-border/50">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setIsTagModalOpen(true)}
                  className="gap-1.5 text-xs"
                >
                  <QrCode size={14} className="text-primary" />
                  View QR Safety Tag
                </Button>
                <Link
                  href={`/scan?token=${encodeURIComponent(extractRawToken((safetyTag as any)?.raw_token || (safetyTag as any)?.token || safetyTag.token_prefix))}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary hover:underline"
                >
                  <ExternalLink size={12} />
                  Test Scanner
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      <SafetyTagModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        pet={pet}
        safetyTag={safetyTag}
        provisionedToken={provisionedToken}
      />

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

function RegisterPersonalPetModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}) {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("dog");
  const [breed, setBreed] = useState("");
  const [sex, setSex] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [color, setColor] = useState("");
  const [microchipId, setMicrochipId] = useState("");
  const [emergencyNotes, setEmergencyNotes] = useState("");
  const [isScanEnabled, setIsScanEnabled] = useState(true);

  // Photo Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please select a valid image file (.jpg, .png, .webp).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setPhotoError("Image file size must be under 10MB.");
      return;
    }

    setPhotoError(null);
    setSelectedFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleClearPhoto = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPhotoError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setValidationError("Pet name is required.");
      return;
    }
    setValidationError(null);
    setPhotoError(null);
    setIsSubmitting(true);

    try {
      // 1. Create Pet record first
      const payload: CompanionPetCreate = {
        name: name.trim(),
        species: species.trim() || "dog",
        breed: breed.trim() || null,
        sex: sex || null,
        birth_date: birthDate ? new Date(birthDate).toISOString() : null,
        color: color.trim() || null,
        microchip_id: microchipId.trim() || null,
        emergency_notes: emergencyNotes.trim() || null,
        is_scan_enabled: isScanEnabled,
      };

      const newPet = await companionPetsService.createPet(payload);

      // 2. Upload photo via S3 presigned URL architecture if selected
      let photoUploaded = false;
      if (selectedFile) {
        try {
          await companionPetsService.uploadPetPhoto(newPet.id, selectedFile);
          photoUploaded = true;
        } catch (uploadErr) {
          console.error("Photo upload failed:", uploadErr);
        }
      }

      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.companionPets.pets,
      });

      if (selectedFile && !photoUploaded) {
        onSuccess(`${newPet.name} was registered, but photo upload failed. You can re-upload the photo by editing the pet.`);
      } else {
        onSuccess(`${newPet.name} was registered successfully as your personal pet.`);
      }

      // Reset form
      setName("");
      setSpecies("dog");
      setBreed("");
      setSex("");
      setBirthDate("");
      setColor("");
      setMicrochipId("");
      setEmergencyNotes("");
      handleClearPhoto();
      setIsScanEnabled(true);
      onClose();
    } catch (err) {
      setValidationError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent className="max-w-[600px] w-full p-6 sm:p-8 rounded-card border-border bg-card shadow-2xl gap-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left gap-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="neutral">External / Personal Pet</Badge>
          </div>
          <DialogTitle className="font-serif font-bold text-2xl text-foreground">
            Register My Personal Pet
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Register a pet you already own outside PawGuard to use PawGuard veterinary, reminders, and QR Safety Tag features.
          </DialogDescription>
        </DialogHeader>

        {validationError && (
          <Alert variant="error" title="Could not register pet">
            {validationError}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Pet Photo Section */}
          <div className="flex flex-col gap-2 p-3 bg-secondary/30 rounded-xl border border-border">
            <label className="block text-xs font-semibold text-foreground uppercase tracking-wider font-condensed">
              Pet Photo (Optional)
            </label>
            <div className="flex items-center gap-3">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Pet photo preview"
                  className="w-14 h-14 rounded-xl object-cover border border-border shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                  <ImageIcon size={22} />
                </div>
              )}
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 bg-card border border-border text-foreground hover:bg-muted text-xs font-semibold px-3 py-2 rounded-btn transition-colors">
                    <Upload size={14} className="text-primary" />
                    {selectedFile ? "Change Photo" : "Choose Photo"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                  </label>
                  {selectedFile && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleClearPhoto}
                      disabled={isSubmitting}
                      className="text-xs text-destructive hover:bg-destructive/10"
                    >
                      Remove Selection
                    </Button>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                  {selectedFile ? selectedFile.name : "JPEG, PNG, WebP or GIF up to 10MB."}
                </p>
              </div>
            </div>
            {photoError && <span className="text-xs text-destructive">{photoError}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Pet Name <span className="text-destructive">*</span>
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Max"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Species
              </label>
              <Input
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                placeholder="e.g. dog, cat"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Breed
              </label>
              <Input
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="e.g. Golden Retriever"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Sex
              </label>
              <select
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                disabled={isSubmitting}
                className="w-full h-11 px-3 rounded-btn border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Birth Date
              </label>
              <Input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Color / Markings
              </label>
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Brown and white"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Microchip ID
            </label>
            <Input
              value={microchipId}
              onChange={(e) => setMicrochipId(e.target.value)}
              placeholder="e.g. 985141000123456"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Emergency & Care Notes
            </label>
            <Textarea
              value={emergencyNotes}
              onChange={(e) => setEmergencyNotes(e.target.value)}
              placeholder="Allergies, medications, special care instructions..."
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="reg_is_scan_enabled"
              checked={isScanEnabled}
              onChange={(e) => setIsScanEnabled(e.target.checked)}
              disabled={isSubmitting}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
            />
            <label htmlFor="reg_is_scan_enabled" className="text-xs font-semibold text-foreground cursor-pointer">
              Enable QR Safety Tag scanning for this pet
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              Register Pet
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditPetModal({
  pet,
  onClose,
  onSuccess,
}: {
  pet: CompanionPetResponse | null;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}) {
  const [name, setName] = useState(pet?.name ?? "");
  const [species, setSpecies] = useState(pet?.species ?? "dog");
  const [breed, setBreed] = useState(pet?.breed ?? "");
  const [sex, setSex] = useState(pet?.sex ?? "");
  const [birthDate, setBirthDate] = useState(
    pet?.birth_date ? pet.birth_date.split("T")[0] : ""
  );
  const [color, setColor] = useState(pet?.color ?? "");
  const [microchipId, setMicrochipId] = useState(pet?.microchip_id ?? "");
  const [emergencyNotes, setEmergencyNotes] = useState(pet?.emergency_notes ?? "");
  const [isScanEnabled, setIsScanEnabled] = useState(pet?.is_scan_enabled ?? true);

  // Photo Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!pet) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please select a valid image file (.jpg, .png, .webp).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setPhotoError("Image file size must be less than 10MB.");
      return;
    }

    setPhotoError(null);
    setSelectedFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleClearPhoto = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPhotoError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setValidationError("Pet name is required.");
      return;
    }
    setValidationError(null);
    setPhotoError(null);
    setIsSubmitting(true);

    try {
      // 1. Update text/data fields
      const payload: CompanionPetUpdate = {
        name: name.trim(),
        species: species.trim() || "dog",
        breed: breed.trim() || null,
        sex: sex || null,
        birth_date: birthDate ? new Date(birthDate).toISOString() : null,
        color: color.trim() || null,
        microchip_id: microchipId.trim() || null,
        emergency_notes: emergencyNotes.trim() || null,
        is_scan_enabled: isScanEnabled,
      };

      await companionPetsService.updatePet(pet.id, payload);

      // 2. Upload replacement photo via S3 presigned URL architecture if selected
      let photoUploaded = false;
      if (selectedFile) {
        try {
          await companionPetsService.uploadPetPhoto(pet.id, selectedFile);
          photoUploaded = true;
        } catch (uploadErr) {
          console.error("Photo upload failed:", uploadErr);
        }
      }

      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.companionPets.pets,
      });

      if (selectedFile && !photoUploaded) {
        onSuccess(`${name}'s profile was updated, but photo upload failed. Please try again.`);
      } else {
        onSuccess(`${name}'s profile was updated successfully.`);
      }

      handleClearPhoto();
      onClose();
    } catch (err) {
      setValidationError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={Boolean(pet)} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent className="max-w-[600px] w-full p-6 sm:p-8 rounded-card border-border bg-card shadow-2xl gap-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left gap-1">
          <DialogTitle className="font-serif font-bold text-2xl text-foreground">
            Edit Pet Profile
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Update details for <span className="font-semibold text-foreground">{pet.name}</span>.
          </DialogDescription>
        </DialogHeader>

        {validationError && (
          <Alert variant="error" title="Could not update pet">
            {validationError}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Pet Photo Section */}
          <div className="flex flex-col gap-2 p-3 bg-secondary/30 rounded-xl border border-border">
            <label className="block text-xs font-semibold text-foreground uppercase tracking-wider font-condensed">
              Pet Photo
            </label>
            <div className="flex items-center gap-3">
              {previewUrl || pet.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl || pet.photo_url || ""}
                  alt={`${pet.name} photo`}
                  className="w-14 h-14 rounded-xl object-cover border border-border shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                  <ImageIcon size={22} />
                </div>
              )}
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 bg-card border border-border text-foreground hover:bg-muted text-xs font-semibold px-3 py-2 rounded-btn transition-colors">
                    <Upload size={14} className="text-primary" />
                    {selectedFile ? "Replace Photo" : pet.photo_url ? "Change Photo" : "Upload Photo"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                  </label>
                  {selectedFile && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleClearPhoto}
                      disabled={isSubmitting}
                      className="text-xs text-destructive hover:bg-destructive/10"
                    >
                      Cancel Selection
                    </Button>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                  {selectedFile ? selectedFile.name : pet.photo_url ? "Current photo stored on PawGuard backend." : "Select JPEG, PNG, WebP or GIF up to 10MB."}
                </p>
              </div>
            </div>
            {photoError && <span className="text-xs text-destructive">{photoError}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Pet Name <span className="text-destructive">*</span>
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Max"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Species
              </label>
              <Input
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                placeholder="e.g. dog, cat"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Breed
              </label>
              <Input
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="e.g. Golden Retriever"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Sex
              </label>
              <select
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                disabled={isSubmitting}
                className="w-full h-11 px-3 rounded-btn border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Birth Date
              </label>
              <Input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Color / Markings
              </label>
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Brown and white"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Microchip ID
            </label>
            <Input
              value={microchipId}
              onChange={(e) => setMicrochipId(e.target.value)}
              placeholder="e.g. 985141000123456"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Emergency & Medical Notes
            </label>
            <Textarea
              value={emergencyNotes}
              onChange={(e) => setEmergencyNotes(e.target.value)}
              placeholder="Allergies, medications, special care instructions..."
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="edit_is_scan_enabled"
              checked={isScanEnabled}
              onChange={(e) => setIsScanEnabled(e.target.checked)}
              disabled={isSubmitting}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
            />
            <label htmlFor="edit_is_scan_enabled" className="text-xs font-semibold text-foreground cursor-pointer">
              Enable QR Safety Tag scanning for this pet
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeletePetDialog({
  pet,
  onClose,
  onSuccess,
}: {
  pet: CompanionPetResponse | null;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}) {
  const mutation = useApiMutation<void, void>({
    mutationFn: () => {
      if (!pet) throw new Error("No pet specified");
      return companionPetsService.deletePet(pet.id);
    },
    onSuccess: async () => {
      const removedName = pet?.name ?? "Pet";
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.companionPets.pets,
      });
      onSuccess(`${removedName} was removed from your pets.`);
      onClose();
    },
  });

  if (!pet) return null;

  const apiError = mutation.error ? getErrorMessage(mutation.error) : null;

  return (
    <Dialog open={Boolean(pet)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[480px] w-full p-6 sm:p-8 rounded-card border-border bg-card shadow-2xl gap-6">
        <DialogHeader className="text-left gap-1">
          <DialogTitle className="font-serif font-bold text-2xl text-foreground">
            Remove Pet Profile?
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Are you sure you want to remove <span className="font-semibold text-foreground">{pet.name}</span> from your pets? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {apiError && (
          <Alert variant="error" title="Could not remove pet">
            {apiError}
          </Alert>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            isLoading={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            Remove Pet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function MyPetsPage() {
  const { isAuthenticated, status: authStatus, openAuthDialog } = useAuth();
  const isAuthReady = authStatus !== "loading";

  const [editingPet, setEditingPet] = useState<CompanionPetResponse | null>(null);
  const [deletingPet, setDeletingPet] = useState<CompanionPetResponse | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

        <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-section-md lg:py-section-lg flex flex-col gap-12">
          {toastMessage && (
            <Alert variant="success" title="Success">
              <div className="flex items-center justify-between gap-4">
                <span>{toastMessage}</span>
                <button
                  type="button"
                  onClick={() => setToastMessage(null)}
                  className="p-1 text-emerald-800 hover:text-emerald-950 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </Alert>
          )}

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
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
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
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => setIsRegisterModalOpen(true)}
                    className="shrink-0 gap-1.5"
                  >
                    <Plus size={15} />
                    Register My Personal Pet
                  </Button>
                </div>

                {petsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-grid-md">
                    {[0, 1, 2].map((i) => <Skeleton key={i} className="h-56" />)}
                  </div>
                ) : pets.length === 0 ? (
                  <Card>
                    <EmptyState
                      icon="heart"
                      title="No registered pets yet"
                      description="Register a dog you already own outside PawGuard or add your pet from an approved adoption."
                      action={{
                        label: "+ Register My Personal Pet",
                        onClick: () => setIsRegisterModalOpen(true),
                      }}
                    />
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-grid-md">
                    {pets.map((pet) => (
                      <CompanionPetCard
                        key={pet.id}
                        pet={pet}
                        onEdit={(p) => setEditingPet(p)}
                        onDelete={(p) => setDeletingPet(p)}
                        onTagSuccess={(msg) => setToastMessage(msg)}
                      />
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>

      {/* Register Personal Pet Modal */}
      <RegisterPersonalPetModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={(msg) => setToastMessage(msg)}
      />

      {/* Edit Pet Modal */}
      <EditPetModal
        key={editingPet?.id ?? "edit-modal"}
        pet={editingPet}
        onClose={() => setEditingPet(null)}
        onSuccess={(msg) => setToastMessage(msg)}
      />

      {/* Delete Pet Dialog */}
      <DeletePetDialog
        key={deletingPet?.id ?? "delete-dialog"}
        pet={deletingPet}
        onClose={() => setDeletingPet(null)}
        onSuccess={(msg) => setToastMessage(msg)}
      />
    </PageShell>
  );
}
