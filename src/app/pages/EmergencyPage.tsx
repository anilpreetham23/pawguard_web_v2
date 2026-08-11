"use client";

import { useState, useRef, useEffect } from "react";
import { Phone, Upload, AlertTriangle, CheckCircle2, MapPin, ArrowRight, Timer, Navigation } from "lucide-react";
import { toast } from "sonner";
import { useFocusOnError } from "../hooks/useFocusOnError";
import { Button, Input, Textarea, Card, Skeleton, RescueTimelineGSAP, DispatchReveal, PageShell } from "../components/pawguard";

type FormStep = "situation" | "details" | "review";

export default function EmergencyPage() {
  const [pageReady, setPageReady] = useState(false);
  const [step, setStep] = useState<FormStep>("situation");
  const [severity, setSeverity] = useState<"critical" | "non-critical">("critical");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { setRef } = useFocusOnError(errors);
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const draftNotified = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setPageReady(true), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("pawguard-emergency-draft");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.severity) setSeverity(data.severity);
        if (data.location) setLocation(data.location);
        if (data.description) setDescription(data.description);
        if (data.contact) setContact(data.contact);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "pawguard-emergency-draft",
      JSON.stringify({ severity, location, description, contact, step }),
    );
    if (!draftNotified.current && (location || description || contact)) {
      draftNotified.current = true;
      toast.info("Draft saved locally", { description: "Your progress is saved. You can close this page and come back." });
    }
  }, [severity, location, description, contact, step]);

  function validate(advancingTo: FormStep) {
    const e: Record<string, string> = {};
    if (advancingTo === "details" && !severity) e.severity = "Select the situation type";
    if (advancingTo === "review") {
      if (!location.trim()) e.location = "Location is required";
      if (!description.trim()) e.description = "Description is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate("review")) return;
    setIsLoading(true);
    setHasError(false);
    setTimeout(() => {
      setIsLoading(false);
      if (Math.random() < 0.15) {
        setHasError(true);
        return;
      }
      setSubmitted(true);
    }, 1500);
  }

  const reportNumber = `PG-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
  const [elapsed, setElapsed] = useState(0);
  const maxWait = severity === "critical" ? 12 : 240;
  const progress = Math.min(elapsed / maxWait, 1);

  useEffect(() => {
    if (!submitted) { setElapsed(0); return; }
    const t = setInterval(() => setElapsed((p) => p + 1), 60000);
    return () => clearInterval(t);
  }, [submitted]);

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-[calc(var(--header-height)+1rem)] lg:pt-[calc(var(--header-height)+2rem)] pb-20 lg:pb-28">
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
          <DispatchReveal><div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--space-12)] lg:gap-[var(--space-16)]">
            <div className="lg:col-span-8 flex flex-col gap-12">
              <div className="border-l-4 border-primary pl-6 py-2 flex flex-col gap-3">
                <p className="text-primary text-xs font-semibold tracking-widest uppercase">Emergency Report</p>
                <h1 className="font-serif font-bold text-4xl lg:text-5xl leading-tight tracking-tight text-foreground">Help is on the way.</h1>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-[480px]">
                  Tell us what you see. We will dispatch the nearest available unit. Every field you complete helps us respond faster.
                </p>
              </div>

              {hasError ? (
                <div className="flex flex-col gap-6" role="alert">
                  <div className="bg-card border border-border rounded-card p-6 lg:p-8 shadow-lg flex flex-col gap-5">
                    <div className="w-14 h-14 bg-destructive/10 rounded-2xl flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-destructive">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h2 className="text-foreground font-bold text-xl">Report failed to submit</h2>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Your emergency report could not be submitted. Please call our emergency line immediately.
                      </p>
                    </div>
                    <div className="bg-destructive/5 border border-destructive/10 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Phone size={14} className="text-destructive" />
                        <span className="text-foreground font-bold text-base">1-800-PAW-GUARD</span>
                      </div>
                      <p className="text-muted-foreground text-xs">Available 24/7 for emergencies.</p>
                    </div>
                    <Button variant="primary" size="md" onClick={() => setHasError(false)}>
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : submitted ? (
                <div className="flex flex-col gap-6 animate-fade-in" role="status" aria-live="polite">
                  <div className="bg-card border border-border rounded-card p-6 lg:p-8 shadow-lg">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-emergency rounded-full flex items-center justify-center animate-celebration-pop shrink-0">
                          <Navigation size={24} className="text-white" />
                        </div>
                        <div>
                          <h2 className="text-foreground font-bold text-2xl">Help is on the way</h2>
                          <p className="text-muted-foreground text-sm mt-0.5">
                            Report <span className="font-mono text-foreground font-semibold tracking-wider">{reportNumber}</span>
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground font-mono bg-muted px-2.5 py-1 rounded-full">
                        {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    <div className="bg-secondary rounded-xl p-5 mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Timer size={16} className="text-emergency" />
                          <span className="text-foreground font-semibold text-sm">Estimated arrival</span>
                        </div>
                        <span className="font-bold text-lg tabular-nums text-emergency">
                          {severity === "critical"
                            ? `${Math.max(maxWait - elapsed, 0)} min`
                            : `${Math.max(Math.ceil((maxWait - elapsed) / 60), 0)}h ${Math.max((maxWait - elapsed) % 60, 0)}m`}
                        </span>
                      </div>
                      <div className="h-2.5 bg-white/60 w-full rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emergency transition-all duration-deliberate ease-linear"
                          style={{ width: `${(1 - progress) * 100}%` }}
                        />
                      </div>
                      <p className="text-muted-foreground text-xs mt-2">
                        {severity === "critical"
                          ? "Nearest unit dispatched. ETA updated in real time."
                          : "Team scheduled. You will receive a confirmation call."}
                      </p>
                    </div>

                    <div className="bg-emergency/5 border border-emergency/10 rounded-xl p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <MapPin size={16} className="text-emergency shrink-0 mt-0.5" />
                        <div>
                          <p className="text-foreground font-semibold text-sm">Dispatch area</p>
                          <p className="text-muted-foreground text-sm mt-0.5">{location || "Coordinates received"}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-foreground font-semibold text-sm mb-3">While waiting</p>
                      <ul className="flex flex-col gap-2.5">
                        {[
                          "Keep a safe distance from the dog",
                          "Do not attempt to move or feed the dog",
                          "Keep other people and pets away from the area",
                          "If safe, keep the dog in sight from a distance",
                          "An operator may call you — answer if you can",
                        ].map((tip, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-muted-foreground text-sm leading-relaxed">
                            <CheckCircle2 size={14} className="text-emergency shrink-0 mt-0.5" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => { setSubmitted(false); setLocation(""); setDescription(""); setContact(""); setFileName(""); setErrors({}); localStorage.removeItem("pawguard-emergency-draft"); }}
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
                              : (step === "details" && s === "situation") || (step === "review" && s !== "review")
                                ? "bg-primary/20 text-primary"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {((step === "details" && s === "situation") || (step === "review" && s !== "review")) ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : (
                            i + 1
                          )}
                        </span>
                        <span className={step === s ? "text-foreground" : "text-muted-foreground"}>{s === "situation" ? "Situation" : s === "details" ? "Details" : "Review"}</span>
                        {i < 2 && <span className="w-6 h-px bg-border" />}
                      </div>
                    ))}
                  </div>

                  {step === "situation" && (
                    <div className="flex flex-col gap-3 animate-fade-in">
                      <label className="text-foreground text-xs font-semibold tracking-wider uppercase font-condensed">Situation Type</label>
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
                          <AlertTriangle size={16} className={`inline mr-2 -mt-0.5 ${severity === "critical" ? "animate-pulse-soft" : ""}`} />
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
                          <AlertTriangle size={14} /> Immediate dispatch activated
                        </p>
                      )}
                      <div className="mt-4">
                        <Button
                          type="button"
                          variant="primary"
                          size="md"
                          onClick={() => { if (validate("details")) setStep("details"); }}
                        >
                          Continue
                          <ArrowRight size={14} />
                        </Button>
                      </div>
                    </div>
                  )}

                  {step === "details" && (
                    <div className="flex flex-col gap-5 animate-fade-in">
                      <Input
                        label="Location"
                        placeholder="Current address or coordinates"
                        ref={setRef("location")}
                        value={location}
                        onChange={(e) => { setLocation(e.target.value); if (errors.location) setErrors({ ...errors, location: "" }); }}
                        error={errors.location}
                        prefix={<MapPin size={16} />}
                        autoComplete="street-address"
                      />

                      <Textarea
                        label="Dog Description"
                        placeholder="Breed, size, condition — describe the situation clearly"
                        ref={setRef("description")}
                        value={description}
                        onChange={(e) => { setDescription(e.target.value); if (errors.description) setErrors({ ...errors, description: "" }); }}
                        error={errors.description}
                        rows={5}
                      />

                      <div className="flex flex-col gap-2">
                        <label className="text-foreground text-xs font-semibold tracking-wider uppercase font-condensed">Visual Evidence <span className="text-muted-foreground font-normal normal-case tracking-normal">(Optional)</span></label>
                        <input
                          ref={fileRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                        />
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => fileRef.current?.click()}
                          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileRef.current?.click(); } }}
                          className="bg-card border-2 border-dashed border-border h-[140px] flex flex-col items-center justify-center gap-2.5 cursor-pointer hover:border-primary hover:bg-secondary/50 hover:shadow-sm transition-all duration-ui rounded-card group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                        >
                          <Upload size={22} className="text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                          <div className="flex flex-col items-center gap-0.5">
                            <span className="text-muted-foreground font-semibold text-xs tracking-wider uppercase font-condensed group-hover:text-foreground transition-colors duration-300">
                              {fileName || "Click to Upload Photo"}
                            </span>
                            <span className="text-muted-foreground text-xs">Attach for context (JPG, PNG)</span>
                          </div>
                        </div>
                      </div>

                      <Input
                        label="Your Contact Number"
                        type="tel"
                        placeholder="(555) 000-0000"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        autoComplete="tel"
                        inputMode="tel"
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
                          onClick={() => { if (validate("review")) setStep("review"); }}
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
                        <h3 className="text-foreground font-bold text-sm tracking-wider uppercase">Report Summary</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase font-condensed">Situation</span>
                            <span className={`font-bold text-sm ${severity === "critical" ? "text-destructive" : "text-primary"}`}>
                              {severity === "critical" ? "Critical — Immediate Dispatch" : "Non-Critical — Scheduled Response"}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase font-condensed">Location</span>
                            <span className="text-foreground text-sm font-medium">{location || "Not provided"}</span>
                          </div>
                          <div className="flex flex-col gap-1 sm:col-span-2">
                            <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase font-condensed">Description</span>
                            <span className="text-foreground text-sm">{description || "Not provided"}</span>
                          </div>
                          {contact && (
                            <div className="flex flex-col gap-1 sm:col-span-2">
                              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase font-condensed">Contact</span>
                              <span className="text-foreground text-sm">{contact}</span>
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
                  <p className="text-xs font-semibold tracking-wider uppercase font-condensed text-foreground mb-3">Emergency Contacts</p>
                  <div className="flex flex-col gap-3">
                    {[
                      { label: "PawGuard Emergency", number: "1-800-PAW-GUARD" },
                      { label: "Animal Control", number: "1-800-555-0199" },
                      { label: "Veterinary Helpline", number: "1-800-555-0177" },
                    ].map((c) => (
                      <div key={c.label} className="flex items-center justify-between">
                        <span className="text-muted-foreground text-xs">{c.label}</span>
                        <a href={`tel:${c.number}`} className="text-primary font-bold text-sm hover:underline font-mono tracking-tight">{c.number}</a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <aside className="lg:col-span-4 flex flex-col gap-5">
              <RescueTimelineGSAP severity={severity} />
              <div className="bg-card border border-border rounded-card p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emergency/10 rounded-lg flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-emergency" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-foreground font-bold text-lg font-mono tracking-tight">&lt;12 min</p>
                    <p className="text-muted-foreground text-xs">Average dispatch for critical cases</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
          </DispatchReveal>)}
        </div>
      </main>
    </PageShell>
  );
}
