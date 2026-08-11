"use client";

import SectionHeading from "../components/SectionHeading";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { PageShell, Section, Button, Card, Reveal, DispatchReveal, StaggerGrid, StaggerItem } from "../components/pawguard";

const TEAM = [
  { name: "Dr. Sarah Chen", role: "Executive Director", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&auto=format" },
  { name: "Marcus Osei", role: "Head of Rescue Operations", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format" },
  { name: "Elena Vasquez", role: "Veterinary Director", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&auto=format" },
  { name: "James Abara", role: "Community Outreach Lead", img: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=400&h=400&fit=crop&auto=format" },
];

const VALUES = [
  { title: "Compassion", desc: "Every decision is guided by genuine care for dog welfare and the communities we serve." },
  { title: "Reliability", desc: "We operate with military-grade coordination. When a dog is in need, systems don't fail." },
  { title: "Transparency", desc: "We publish annual financial reports, rescue statistics, and outcome data without exception." },
  { title: "Community", desc: "We are strongest when local communities are active participants, not passive recipients." },
];

export default function AboutPage() {
  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <DispatchReveal>
          <PageHeader
            eyebrow="About PawGuard"
            title="A rescue system built by veterinarians, for speed."
            subtitle="PawGuard coordinates emergency rescue, adoption, and veterinary care across 12 municipalities. We respond to critical emergencies in under 12 minutes."
            right={
              <div className="aspect-[4/3] lg:aspect-[16/9] bg-secondary rounded-img overflow-hidden shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=640&h=480&fit=crop&auto=format"
                  alt="Two rescue dogs running freely in a grassy field"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            }
          />
        </DispatchReveal>

        <Reveal><Section bg="card" className="py-section-sm lg:py-section-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--space-12)] lg:gap-[var(--space-16)] items-start">
            <div className="lg:col-span-6 flex flex-col gap-8">
              <SectionHeading eyebrow="Mission &amp; Vision" as="h2">
                Our Mission
              </SectionHeading>
              <p className="text-muted-foreground text-base leading-relaxed max-w-[540px]">
                To build coordinated, community-driven systems that ensure every dog in crisis receives rapid rescue, quality care, and a permanent home — without exception.
              </p>
              <div className="pl-6 border-l-2 border-primary max-w-[540px]">
                <p className="text-foreground font-serif italic font-bold text-xl leading-snug">
                  Our vision is a world where no dog suffers from neglect or abandonment because organized, compassionate networks stand ready to respond.
                </p>
              </div>
            </div>
            <div className="lg:col-span-6 flex flex-col gap-8">
              <SectionHeading eyebrow="Our Story" as="h2">
                From a single rescue to a regional network
              </SectionHeading>
              <div className="flex flex-col gap-5 text-muted-foreground text-base leading-relaxed max-w-[540px]">
                <p>
                  PawGuard began in 2018 when Dr. Sarah Chen, then a veterinary surgeon, responded to a series of uncoordinated dog rescue calls in her city and realized that good intentions were not enough. Dogs were slipping through gaps between organizations, jurisdictions, and volunteer networks.
                </p>
                <p>
                  She recruited Marcus Osei, a logistics coordinator with emergency services experience, and together they designed a triage and dispatch system modelled on human emergency response. Within six months, response times dropped by 60%. Within a year, adoption rates in partnered shelters rose by 40%.
                </p>
                <p>
                  Today, PawGuard operates across 12 municipalities, coordinates over 800 volunteers, and has facilitated more than 4,200 rescues. The systems are open-source and available to any organization ready to implement them.
                </p>
              </div>
            </div>
          </div>
        </Section></Reveal>

        <Reveal><Section bg="dark">
          <div className="flex flex-wrap items-center justify-between gap-8 lg:gap-12">
            {[
              { value: "4,200+", label: "Dogs Rescued" },
              { value: "1,850+", label: "Successful Adoptions" },
              { value: "800+", label: "Active Volunteers" },
              { value: "12", label: "Municipalities Served" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <span className="text-background font-serif font-bold text-3xl lg:text-4xl leading-none">{s.value}</span>
                <span className="text-white/70 text-xs font-medium tracking-wider uppercase font-condensed">{s.label}</span>
              </div>
            ))}
          </div>
        </Section></Reveal>

        <Reveal><Section bg="default">
          <div className="flex flex-col gap-12">
            <SectionHeading eyebrow="What We Stand For">
              Our Values
            </SectionHeading>
            <StaggerGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-grid-md">
              {VALUES.map((v, i) => (
                <StaggerItem key={v.title}>
                <Card className="hover:shadow-md transition-all duration-ui">
                  <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="text-foreground font-bold text-xl">{v.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
                </Card>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </Section></Reveal>

        <Reveal><Section bg="card">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--space-12)] lg:gap-[var(--space-16)] items-start">
            <div className="flex flex-col gap-6">
              <SectionHeading eyebrow="Accountability">
                Operational Transparency
              </SectionHeading>
              <p className="text-muted-foreground text-base leading-relaxed">
                We believe donor trust is earned through radical transparency. Every dollar is accounted for. Our annual reports, audit results, and program outcomes are published publicly without delay.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  { pct: "78%", label: "Direct program expenditure", color: "bg-primary" },
                  { pct: "12%", label: "Administrative overhead", color: "bg-muted-foreground" },
                  { pct: "10%", label: "Reserve & development", color: "bg-border" },
                ].map((r) => (
                  <div key={r.label} className="flex items-center gap-4">
                    <span className="text-primary font-bold text-lg w-[56px] shrink-0">{r.pct}</span>
                    <div className="flex-1 h-2.5 bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${r.color}`} style={{ width: r.pct }} />
                    </div>
                    <span className="text-muted-foreground text-sm shrink-0">{r.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <h3 className="text-foreground font-bold text-xl">Governance</h3>
              <div className="flex flex-col gap-0">
                {[
                  "Independent Board of Directors (7 members)",
                  "Annual external financial audit",
                  "Quarterly program outcome reports",
                  "Open-source operational systems",
                  "Registered 501(c)(3) nonprofit",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 py-3.5 border-b border-border last:border-0">
                    <Check size={16} className="text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section></Reveal>

        <Reveal><Section bg="default">
          <div className="flex flex-col gap-12">
            <SectionHeading eyebrow="Leadership">
              Our Team
            </SectionHeading>
            <StaggerGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-grid-md">
              {TEAM.map((member) => (
                <StaggerItem key={member.name} className="flex flex-col gap-4 group">
                  <div className="bg-secondary h-[260px] overflow-hidden rounded-img shadow-sm group-hover:shadow-md transition-all duration-ui">
                    <img src={member.img} alt={`${member.name} — ${member.role}`} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-gentle" loading="lazy" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-foreground font-bold text-base">{member.name}</h3>
                    <p className="text-muted-foreground text-sm">{member.role}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </Section></Reveal>

        <Reveal><Section bg="default" containerWidth="narrow">
          <div className="text-center flex flex-col gap-6 items-center">
            <h2 className="text-foreground font-serif font-bold text-3xl lg:text-4xl leading-tight tracking-tight">Join the mission</h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Whether you volunteer, adopt, foster, or donate — every form of support directly protects dogs in need.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Button variant="primary" size="md" asLink={{ href: "/volunteer" }}>
                Volunteer
              </Button>
              <Button variant="outline" size="md" asLink={{ href: "/donate" }}>
                Donate <ArrowRight size={14} />
              </Button>
            </div>
          </div>
        </Section></Reveal>
      </main>
    </PageShell>
  );
}
