"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Heart, Lock, Sparkles, UploadCloud } from "lucide-react";
import PageHeader from "../components/PageHeader";
import {
  PageShell,
  Section,
  Card,
  Button,
  Input,
  Textarea,
  Alert,
  Reveal,
  Skeleton,
} from "../components/pawguard";
import { PhotoUploadInput } from "../components/PhotoUploadInput";
import { useAuth } from "../providers/auth-provider";
import { useMyApplications } from "../hooks/useMyApplications";
import { useSubmitStory } from "../hooks/useSubmitStory";
import { lostFoundService } from "@/services/api/lost-found";
import { getErrorMessage } from "@/lib/api";

function ShareSuccessStoryContent() {
  const searchParams = useSearchParams();
  const rawDogIdParam = searchParams.get("dog_id");

  const { isAuthenticated, status: authStatus, openAuthDialog } = useAuth();
  const { applications, isLoading: appsLoading } = useMyApplications(1, 50);
  const submitStoryMutation = useSubmitStory();

  // Filter only user's verified completed adoptions
  const completedAdoptions = useMemo(() => {
    return (applications ?? []).filter((app) => app.status === "completed");
  }, [applications]);

  // Form state
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [selectedDogId, setSelectedDogId] = useState<string>("");
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImageUrl, setHeroImageUrl] = useState<string>("");
  const [hasConsent, setHasConsent] = useState(true);

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Validate URL dog_id parameter: only accept if it actually belongs to the user's completed adoptions
  useEffect(() => {
    if (rawDogIdParam && completedAdoptions.length > 0) {
      const match = completedAdoptions.find((app) => app.dog_id === rawDogIdParam);
      if (match) {
        setSelectedDogId(match.dog_id);
      }
    }
  }, [rawDogIdParam, completedAdoptions]);

  const handlePhotoChange = async (file: File | null) => {
    setPhotoUploadError(null);
    setHeroImageFile(file);

    if (!file) {
      setHeroImageUrl("");
      return;
    }

    try {
      setIsUploadingPhoto(true);
      const uploadData = await lostFoundService.getPhotoUploadUrl({
        filename: file.name,
        mime_type: file.type,
        file_size: file.size,
      });

      await lostFoundService.uploadPhotoFile(uploadData.upload_url, file);
      setHeroImageUrl(uploadData.object_key);
    } catch (err) {
      console.error("Story photo upload failed:", err);
      setPhotoUploadError(getErrorMessage(err) || "Failed to upload photo. Please try again.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  function validate(): boolean {
    const e: Record<string, string> = {};

    if (!title.trim()) {
      e.title = "Please enter a story title.";
    } else if (title.trim().length > 255) {
      e.title = "Title must be 255 characters or fewer.";
    }

    if (!summary.trim()) {
      e.summary = "Please provide a short summary.";
    } else if (summary.trim().length > 500) {
      e.summary = "Summary must be 500 characters or fewer.";
    }

    if (!body.trim()) {
      e.body = "Please write your adoption story.";
    } else if (body.trim().length < 20) {
      e.body = "Story must be at least 20 characters long.";
    }

    if (!hasConsent) {
      e.consent = "You must give consent to publish this story.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (isUploadingPhoto) return;

    // Verify dog_id: if supplied, MUST match an adoption in the user's completed list
    let validatedDogId: string | null = null;
    if (selectedDogId) {
      const isValid = completedAdoptions.some((app) => app.dog_id === selectedDogId);
      if (isValid) {
        validatedDogId = selectedDogId;
      }
    }

    submitStoryMutation.mutate(
      {
        title: title.trim(),
        summary: summary.trim(),
        body: body.trim(),
        hero_image_url: heroImageUrl || null,
        dog_id: validatedDogId,
        has_consent: true,
      },
      {
        onSuccess: () => {
          setIsSubmittedSuccess(true);
        },
      }
    );
  };

  // Auth Loading State
  if (authStatus === "loading") {
    return (
      <PageShell>
        <main id="main-content" className="flex-1 max-w-[900px] mx-auto px-4 py-20">
          <Skeleton className="h-10 w-2/3 mb-6" />
          <Skeleton className="h-4 w-1/2 mb-12" />
          <Skeleton className="h-64 w-full" />
        </main>
      </PageShell>
    );
  }

  // Unauthenticated State — Friendly Auth Guard
  if (!isAuthenticated) {
    return (
      <PageShell>
        <main id="main-content" className="flex-1">
          <PageHeader
            eyebrow="Adopter Stories"
            title="Share Your Success Story"
            subtitle="Inspire other families by sharing your rescue adoption journey."
          />
          <Section bg="default" containerWidth="narrow">
            <Card className="p-8 sm:p-10 text-center flex flex-col items-center gap-6 border-dashed border-2">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Lock size={28} />
              </div>
              <div className="max-w-md flex flex-col gap-2">
                <h2 className="text-foreground font-bold text-2xl">Sign In Required</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Success stories are shared by verified PawGuard adopters. Please sign in to your
                  account to share your happy tail with our community.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button variant="primary" size="lg" onClick={() => openAuthDialog("sign-in")}>
                  Sign In to Continue
                </Button>
                <Button variant="outline" size="lg" asLink={{ href: "/stories" }}>
                  Browse Stories
                </Button>
              </div>
            </Card>
          </Section>
        </main>
      </PageShell>
    );
  }

  // Success State
  if (isSubmittedSuccess) {
    return (
      <PageShell>
        <main id="main-content" className="flex-1">
          <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600 animate-celebration-pop">
              <Sparkles size={36} />
            </div>
            <div className="flex flex-col gap-3 max-w-lg">
              <h1 className="text-foreground font-serif font-bold text-3xl sm:text-4xl tracking-tight">
                Story Submitted for Review!
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed">
                Thank you for sharing your adoption experience! Your story has been submitted and is currently{" "}
                <span className="font-semibold text-foreground">Under Review</span> by our editorial team.
                Once approved, it will be published to the community showcase.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              <Button variant="primary" size="md" asLink={{ href: "/account/stories" }}>
                View in My Stories
              </Button>
              <Button variant="outline" size="md" asLink={{ href: "/stories" }}>
                Browse Community Stories
              </Button>
            </div>
          </div>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-height)+1.5rem)]">
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-primary transition-colors duration-fast group mb-6"
          >
            <ArrowLeft size={15} className="transition-transform duration-fast group-hover:-translate-x-0.5" />
            Back to Success Stories
          </Link>
        </div>

        <PageHeader
          eyebrow="Community Stories"
          title="Share Your Adoption Journey"
          subtitle="Every adopted dog has a story. Tell us how your rescue found their forever home and became family."
        />

        <Section bg="default" containerWidth="narrow">
          <Reveal>
            <Card className="p-6 sm:p-10 shadow-sm border border-border">
              {submitStoryMutation.isError && (
                <div className="mb-6">
                  <Alert variant="error" title="Submission Failed">
                    {getErrorMessage(submitStoryMutation.error) || "Could not submit your story. Please check your inputs and try again."}
                  </Alert>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Title */}
                <Input
                  label="Story Title *"
                  placeholder="e.g., Max's New Forever Home"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors({ ...errors, title: "" });
                  }}
                  error={errors.title}
                  maxLength={255}
                />

                {/* Summary */}
                <Textarea
                  label="Short Hook / Summary *"
                  placeholder="A one- or two-sentence preview of your story (e.g., From timid shelter pup to our sweetest weekend hiking buddy)."
                  value={summary}
                  onChange={(e) => {
                    setSummary(e.target.value);
                    if (errors.summary) setErrors({ ...errors, summary: "" });
                  }}
                  error={errors.summary}
                  maxLength={500}
                  rows={2}
                />

                {/* Adopted Dog Selection (Optional) */}
                <div className="flex flex-col gap-2">
                  <label className="text-foreground text-xs font-semibold tracking-wider uppercase font-condensed flex items-center justify-between">
                    <span>Associated Adopted Dog (Optional)</span>
                    <span className="text-muted-foreground font-normal lowercase font-sans text-xs">
                      from your completed adoptions
                    </span>
                  </label>
                  {appsLoading ? (
                    <div className="h-12 bg-muted/30 rounded-input animate-pulse" />
                  ) : (
                    <select
                      value={selectedDogId}
                      onChange={(e) => setSelectedDogId(e.target.value)}
                      className="w-full h-12 bg-input-background border border-border rounded-input px-4 text-foreground text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-standard"
                    >
                      <option value="">No specific dog / General adoption reflection</option>
                      {completedAdoptions.map((app) => (
                        <option key={app.dog_id} value={app.dog_id}>
                          {app.dog?.name ?? "Adopted Pet"}{" "}
                          {app.dog?.breed ? `(${app.dog.breed})` : ""}
                        </option>
                      ))}
                    </select>
                  )}
                  {completedAdoptions.length === 0 && !appsLoading && (
                    <p className="text-2xs text-muted-foreground">
                      No completed adoption records found on your account. You can still share a general story!
                    </p>
                  )}
                </div>

                {/* Hero Image Upload */}
                <div className="flex flex-col gap-2">
                  <PhotoUploadInput
                    label="Cover Photo (Optional)"
                    required={false}
                    value={heroImageUrl}
                    isUploading={isUploadingPhoto}
                    isUploaded={Boolean(heroImageUrl && !isUploadingPhoto)}
                    onChange={handlePhotoChange}
                    error={photoUploadError || undefined}
                  />
                  {heroImageUrl && (
                    <span className="text-xs text-emerald-700 font-medium inline-flex items-center gap-1.5">
                      <CheckCircle2 size={13} /> Photo uploaded and ready for submission
                    </span>
                  )}
                </div>

                {/* Story Body */}
                <Textarea
                  label="Full Story *"
                  placeholder="Share how you met, the first week at home, favourite quirks, transformations, and words of encouragement for prospective adopters..."
                  value={body}
                  onChange={(e) => {
                    setBody(e.target.value);
                    if (errors.body) setErrors({ ...errors, body: "" });
                  }}
                  error={errors.body}
                  maxLength={10000}
                  rows={8}
                />

                {/* Consent Checkbox */}
                <div className="pt-2 border-t border-border flex flex-col gap-2">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={hasConsent}
                      onChange={(e) => {
                        setHasConsent(e.target.checked);
                        if (errors.consent) setErrors({ ...errors, consent: "" });
                      }}
                      className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-xs text-muted-foreground leading-relaxed">
                      I confirm that I am the adopter of this pet and grant PawGuard permission to publish
                      this story, quotes, and accompanying photographs across the PawGuard website and
                      educational materials.
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="text-xs text-destructive font-medium">{errors.consent}</p>
                  )}
                </div>

                {/* Submit Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    Initial status will be <strong>Under Review</strong> until verified by our shelter coordinators.
                  </span>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={submitStoryMutation.isPending || isUploadingPhoto}
                    disabled={isUploadingPhoto}
                    className="sm:self-end"
                  >
                    <Heart size={16} className="mr-1.5 fill-current" />
                    Submit Success Story
                  </Button>
                </div>
              </form>
            </Card>
          </Reveal>
        </Section>
      </main>
    </PageShell>
  );
}

export default function ShareSuccessStoryPage() {
  return (
    <Suspense
      fallback={
        <PageShell>
          <main id="main-content" className="flex-1 max-w-[900px] mx-auto px-4 py-20">
            <Skeleton className="h-10 w-2/3 mb-6" />
            <Skeleton className="h-64 w-full" />
          </main>
        </PageShell>
      }
    >
      <ShareSuccessStoryContent />
    </Suspense>
  );
}
