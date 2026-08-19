"use client";

import { useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, Phone } from "lucide-react";
import Link from "next/link";
import SectionHeading from "../components/SectionHeading";
import { useFocusOnError } from "../hooks/useFocusOnError";
import PageHeader from "../components/PageHeader";
import { PageShell, Section, Button, Input, Textarea, Reveal, DispatchReveal, StaggerGrid, StaggerItem } from "../components/pawguard";
import { contactService } from "@/services/api/contact";
import { getErrorMessage } from "@/lib/api";

const FAQS = [
  { q: "How quickly does PawGuard respond to emergency reports?", a: "Our average response time is under 15 minutes for critical emergencies within our coverage area. Non-critical situations are typically attended within 4 hours." },
  { q: "Can I surrender a dog to PawGuard?", a: "Yes. We accept owner surrenders subject to intake availability. Please contact us before arriving to ensure we have space and can assess the dog's needs." },
  { q: "How do I check the status of my emergency report?", a: "After submitting a report you will receive a reference number. Call our operations line with that number and our team will provide a real-time status update." },
  { q: "Do you operate outside business hours?", a: "Our emergency response teams operate 24/7, 365 days a year. Administrative services are available Monday to Friday, 8am–6pm." },
  { q: "How are donations used?", a: "78% of all funds go directly to dog care programs. 12% covers administrative operations and 10% is held in reserve for emergency capacity." },
  { q: "Can I volunteer for a single event rather than ongoing?", a: "Absolutely. We have event-based volunteer opportunities throughout the year. Sign up through the Volunteer page." },
  { q: "How long does the adoption process take?", a: "The typical adoption process takes 3–7 business days from application to approval." },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { setRef } = useFocusOnError(errors);

  function validateField(field: string, value: string) {
    const e: Record<string, string> = {};
    if (!value.trim()) e[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    setErrors((prev) => ({ ...prev, ...e }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (!form.message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setHasError(false);
    contactService
      .submitContactMessage({
        email: form.email.trim(),
        subject: form.subject || "General inquiry",
        message: form.message.trim(),
      })
      .then(() => setSubmitted(true))
      .catch((err) => {
        setHasError(true);
        setFormError(getErrorMessage(err));
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <DispatchReveal><PageHeader
          eyebrow="Get in Touch"
          title="We reply within 24 hours. Often sooner."
        /></DispatchReveal>

        <DispatchReveal><div className="bg-destructive px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-white shrink-0" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="text-white font-semibold text-sm">Dog in immediate danger?</span>
                <span className="text-white/70 text-sm">Do not use this form. Use our emergency report page instead.</span>
              </div>
            </div>
            <Link href="/emergency" className="shrink-0 bg-white text-destructive font-bold text-xs tracking-wider uppercase font-condensed px-6 py-3 rounded-btn hover:bg-white/90 hover:shadow-sm transition-all duration-fast animate-pulse-emergency">
              Emergency Report
            </Link>
          </div>
        </div></DispatchReveal>

        <Reveal><div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-section-md lg:pt-section-lg pb-8 grid grid-cols-1 lg:grid-cols-12 gap-[var(--space-12)] lg:gap-[var(--space-16)]">
          <div className="lg:col-span-7 flex flex-col gap-12">
            <SectionHeading eyebrow="FAQ">
              Frequently Asked Questions
            </SectionHeading>
            <Accordion.Root type="single" collapsible className="flex flex-col">
              {FAQS.map((faq, i) => (
                <Accordion.Item key={i} value={`item-${i}`} className="border-t border-border last:border-b">
                  <Accordion.Trigger className="w-full flex items-center justify-between py-5 text-left gap-4 group min-h-[44px]">
                    <span className="text-foreground font-semibold text-base leading-snug group-hover:text-primary transition-colors duration-200">
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={18}
                      className="shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
                    />
                  </Accordion.Trigger>
                  <Accordion.Content className="overflow-hidden data-[state=open]:animate-[accordion-down_0.2s_ease-out] data-[state=closed]:animate-[accordion-up_0.2s_ease-out]">
                    <p className="text-muted-foreground text-sm leading-relaxed pb-5">{faq.a}</p>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-12">
            <Reveal><SectionHeading eyebrow="Send a Message">
              Get in Touch
            </SectionHeading>

            {hasError ? (
              <div className="bg-card border border-border rounded-modal p-7 flex flex-col gap-3 shadow-sm" role="alert">
                <div className="w-12 h-12 bg-destructive/10 rounded-2xl flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-destructive">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <h3 className="text-foreground font-bold text-xl">Message failed to send</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {formError || "Something went wrong. Please try again or email us directly at hello@pawguard.org."}
                </p>
                <Button variant="primary" size="md" onClick={() => { setHasError(false); setFormError(""); }} className="self-start">
                  Try Again
                </Button>
              </div>
            ) : submitted ? (
              <div className="bg-card border border-border rounded-modal p-7 flex flex-col gap-3 shadow-sm animate-celebration-pop" role="status" aria-live="polite">
                <h3 className="text-foreground font-bold text-xl">Message Sent</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Thank you for reaching out. We typically respond within 1–2 business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <Input
                  label="Name"
                  placeholder="Your full name"
                  ref={setRef("name")}
                  value={form.name}
                  onChange={(e) => { setForm({ ...form, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: "" }); }}
                  onBlur={() => { if (!form.name.trim()) validateField("name", form.name); }}
                  error={errors.name}
                  autoComplete="name"
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  ref={setRef("email")}
                  value={form.email}
                  onChange={(e) => { setForm({ ...form, email: e.target.value }); if (errors.email) setErrors({ ...errors, email: "" }); }}
                  onBlur={() => { if (!form.email.trim()) validateField("email", form.email); }}
                  error={errors.email}
                  autoComplete="email"
                  inputMode="email"
                />
                <div className="flex flex-col gap-2">
                  <label className="text-foreground text-xs font-semibold tracking-wider uppercase font-condensed">Subject</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full h-12 bg-input-background border border-border rounded-input px-4 text-foreground text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-standard"
                  >
                    <option value="">Select inquiry type</option>
                    <option value="General Enquiry">General Enquiry</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Complaint / Grievance">Complaint / Grievance</option>
                    <option>Adoption Inquiry</option>
                    <option>Volunteer Application</option>
                    <option>Donation / Fundraising</option>
                    <option>Partnership / Corporate</option>
                    <option>Media &amp; Press</option>
                    <option>Share My Story</option>
                  </select>
                </div>
                <Textarea
                  label="Message"
                  placeholder="Describe your inquiry..."
                  ref={setRef("message")}
                  value={form.message}
                  onChange={(e) => { setForm({ ...form, message: e.target.value }); if (errors.message) setErrors({ ...errors, message: "" }); }}
                  onBlur={() => { if (!form.message.trim()) validateField("message", form.message); }}
                  error={errors.message}
                  maxLength={1000}
                  rows={5}
                />
                <Button type="submit" variant="secondary" size="lg" isLoading={isLoading} context="contact">
                  Send Message
                </Button>
              </form>
            )}

            </Reveal>
          </div>
        </div></Reveal>

        <Reveal><div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-8 pb-20 lg:pb-28 border-t border-border">
          <div className="flex flex-col gap-4">
            <h3 className="text-foreground font-bold text-base">Direct Contacts</h3>
            <StaggerGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-grid-md" staggerDelay={0.05}>
              {[
                { label: "General Inquiries", value: "hello@pawguard.org" },
                { label: "Volunteer Coordinator", value: "volunteer@pawguard.org" },
                { label: "Adoption Team", value: "adopt@pawguard.org" },
                { label: "Operations Line", value: "+91 98765 43210" },
              ].map((c) => (
                <StaggerItem key={c.label}>
                <div className="bg-card border border-border rounded-card p-4 shadow-sm hover:shadow-md transition-all duration-ui">
                  <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase font-condensed">{c.label}</span>
                  <span className="text-primary font-semibold text-sm block mt-0.5">{c.value}</span>
                </div>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </div></Reveal>
      </main>
    </PageShell>
  );
}
