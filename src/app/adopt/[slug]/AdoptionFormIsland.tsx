"use client";

import { useState } from "react";
import { Check, CheckCircle2, Heart, ShieldCheck } from "lucide-react";
import { Button, Alert, Badge, SuccessState } from "@/components/ui/pawguard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/pawguard";
import { useAuth } from "@/app/providers/auth-provider";
import { adoptionService } from "@/services/api/adoption";
import { useQueryClient } from "@tanstack/react-query";
import { getErrorMessage, QUERY_KEYS } from "@/lib/api";
import { cn } from "@/components/ui/utils";
import AdoptionIdentityVerification, { type AdoptionIdentityData } from "@/features/adoption/AdoptionIdentityVerification";

interface AdoptionFormIslandProps {
  petName: string;
  dogId?: string;
  isAvailable?: boolean;
}

export default function AdoptionFormIsland({
  petName,
  dogId,
  isAvailable = true,
}: AdoptionFormIslandProps) {
  const { isAuthenticated, openAuthDialog } = useAuth();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [form, setForm] = useState({
    residentialStatus: "owned",
    hasLandlordApproval: true,
    hasYardFence: true,
    householdMembersCount: "1",
    existingPetsMedicalDetails: "",
    petCareExperience: "",
  });

  const [identityData, setIdentityData] = useState<AdoptionIdentityData>({
    aadhaarStatus: "NOT_STARTED",
    maskedAadhaar: undefined,
    primaryDocument: null,
    secondaryDocument: null,
    isIdentityVerified: false,
  });

  function handleOpen() {
    if (!isAvailable) return;
    if (!isAuthenticated) {
      openAuthDialog("sign-in");
      return;
    }
    setIsOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);

    const promise = dogId
      ? adoptionService.submitApplication({
          dog_id: dogId,
          residential_status: form.residentialStatus,
          has_landlord_approval: form.residentialStatus === "rented" ? form.hasLandlordApproval : undefined,
          has_yard_fence: form.hasYardFence,
          household_members_count: Math.min(20, Math.max(1, parseInt(String(form.householdMembersCount), 10) || 1)),
          existing_pets_medical_details: form.existingPetsMedicalDetails.trim() || null,
          pet_care_experience: form.petCareExperience.trim() || null,
        })
      : new Promise((resolve) => setTimeout(resolve, 600));

    promise
      .then(() => {
        if (dogId) {
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adoption.applications });
        }
        setSubmitted(true);
        setIsOpen(false);
      })
      .catch((err) => setSubmitError(getErrorMessage(err)))
      .finally(() => setSubmitting(false));
  }

  if (submitted) {
    return (
      <SuccessState
        icon={Heart}
        title={`Application received for ${petName}`}
        description="Our adoption team will review your details and get back to you within 2 business days to arrange a meet & greet."
        action={{ label: "Browse more dogs", to: "/adopt" }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {!isAuthenticated && (
        <p className="text-muted-foreground text-xs">
          You&apos;ll need to sign in to submit an application. Clicking apply will open the sign-in dialog.
        </p>
      )}
      <Button
        variant={isAvailable ? "primary" : "outline"}
        size="lg"
        onClick={handleOpen}
        disabled={!isAvailable}
      >
        {isAvailable ? <>Apply to adopt {petName}</> : <>Already adopted</>}
      </Button>

      <Dialog open={isOpen} onOpenChange={(open) => !open && setIsOpen(false)}>
        <DialogContent className="max-w-[640px] max-h-[85vh] overflow-y-auto w-full p-6 sm:p-8 rounded-card border-border bg-card shadow-2xl gap-5">
          <DialogHeader className="text-left gap-1.5 pr-8">
            <Badge variant="neutral">Adoption Application Wizard</Badge>
            <DialogTitle className="font-serif font-bold text-2xl sm:text-3xl text-foreground">
              Adoption Application for {petName}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs sm:text-sm">
              Complete the 3-step application form including identity verification so our team can review your application.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-between border-b border-border pb-3 mb-1">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors shrink-0",
                  step === 1 ? "bg-primary text-primary-foreground" : step > 1 ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"
                )}
              >
                {step > 1 ? <Check size={12} /> : "1"}
              </div>
              <span className={cn("text-2xs sm:text-xs font-semibold", step === 1 ? "text-foreground font-bold" : "text-muted-foreground")}>
                1. Housing
              </span>
            </div>
            <div className="h-[1px] flex-1 bg-border mx-2" />
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors shrink-0",
                  step === 2 ? "bg-primary text-primary-foreground" : step > 2 ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"
                )}
              >
                {step > 2 ? <Check size={12} /> : "2"}
              </div>
              <span className={cn("text-2xs sm:text-xs font-semibold", step === 2 ? "text-foreground font-bold" : "text-muted-foreground")}>
                2. Identity
              </span>
            </div>
            <div className="h-[1px] flex-1 bg-border mx-2" />
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors shrink-0",
                  step === 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}
              >
                3
              </div>
              <span className={cn("text-2xs sm:text-xs font-semibold", step === 3 ? "text-foreground font-bold" : "text-muted-foreground")}>
                3. Review
              </span>
            </div>
          </div>

          {step === 1 && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-foreground text-xs font-semibold tracking-wider uppercase font-condensed">Housing Arrangement *</label>
                <select
                  value={form.residentialStatus}
                  onChange={(e) => setForm({ ...form, residentialStatus: e.target.value })}
                  className="w-full bg-background border border-border rounded-btn px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-standard"
                  required
                >
                  <option value="owned">I own my home</option>
                  <option value="rented">I rent (Landlord approval required)</option>
                  <option value="other">Other housing arrangement</option>
                </select>
              </div>

              {form.residentialStatus === "rented" && (
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-muted/40 rounded-card border border-border">
                  <input
                    type="checkbox"
                    checked={form.hasLandlordApproval}
                    onChange={(e) => setForm({ ...form, hasLandlordApproval: e.target.checked })}
                    className="w-4 h-4 accent-primary rounded shrink-0"
                  />
                  <span className="text-sm text-foreground">I have explicit landlord approval to keep a dog in my residence</span>
                </label>
              )}

              <label className="flex items-center gap-3 cursor-pointer p-3 bg-muted/40 rounded-card border border-border">
                <input
                  type="checkbox"
                  checked={form.hasYardFence}
                  onChange={(e) => setForm({ ...form, hasYardFence: e.target.checked })}
                  className="w-4 h-4 accent-primary rounded shrink-0"
                />
                <span className="text-sm text-foreground">Residence has a secure enclosed yard / fenced outdoor space</span>
              </label>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-3">
                <Button type="button" variant="outline" size="md" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" variant="primary" size="md" onClick={() => setStep(2)}>
                  Next: Identity Verification
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-5">
              <AdoptionIdentityVerification value={identityData} onChange={setIdentityData} />
              {!identityData.primaryDocument && (
                <p className="text-xs text-amber-700 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-card">
                  Please connect your Primary Identity Document via DigiLocker above to proceed with the adoption application.
                </p>
              )}
              <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
                <Button type="button" variant="outline" size="md" onClick={() => setStep(1)}>
                  Back to Housing
                </Button>
                <Button type="button" variant="primary" size="md" disabled={!identityData.primaryDocument} onClick={() => setStep(3)}>
                  Next: Care & Review
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {submitError && (
                <Alert variant="error" title="Couldn't submit your application">
                  {submitError}
                </Alert>
              )}

              <div className="p-4 rounded-card bg-emerald-500/5 border border-emerald-500/20 flex flex-col gap-2.5">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck size={16} /> Verified Identity Attachment (Simulated Sandbox)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-foreground">
                  <div>
                    <span className="text-muted-foreground">Primary ID: </span>
                    <span className="font-semibold text-emerald-700">{identityData.primaryDocument?.document_label ?? "Not Connected"}</span>
                  </div>
                </div>
              </div>

              <Textarea
                label="Existing Pets & Medical Details (Optional)"
                placeholder="List any pets currently living in your household and their vaccination status..."
                value={form.existingPetsMedicalDetails}
                onChange={(e) => setForm({ ...form, existingPetsMedicalDetails: e.target.value })}
                rows={2}
              />

              <Textarea
                label="Pet Care Experience (Optional)"
                placeholder="Briefly describe your experience caring for dogs or animals..."
                value={form.petCareExperience}
                onChange={(e) => setForm({ ...form, petCareExperience: e.target.value })}
                rows={2}
              />

              <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
                <Button type="button" variant="outline" size="md" onClick={() => setStep(2)} disabled={submitting}>
                  Back to Identity
                </Button>
                <Button type="submit" variant="primary" size="md" isLoading={submitting}>
                  Submit Application
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
