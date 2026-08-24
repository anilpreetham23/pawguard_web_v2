"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Twitter, Instagram, Facebook, Heart, Shield, Mail, Phone, MapPin, ChevronRight } from "lucide-react";
import { Button, Input } from "./pawguard";
import { useMotionStore } from "../../motion/motion-store";
import { duration, ease } from "../../motion/motion.config";

const SOCIALS = [
  { icon: Twitter, label: "Twitter / X", href: "https://twitter.com/pawguard" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/pawguard" },
  { icon: Facebook, label: "Facebook", href: "https://facebook.com/pawguard" },
];

const SERVICES = [
  { label: "Emergency Rescue", to: "/emergency" },
  { label: "Dog Adoption", to: "/adopt" },
  { label: "Foster Program", to: "/foster" },
  { label: "Scan Safety Tag", to: "/scan" },
  { label: "Volunteer", to: "/volunteer" },
  { label: "Donate", to: "/donate" },
  { label: "Education & Guides", to: "/education" },
];

const COMPANY = [
  { label: "About Us", to: "/about" },
  { label: "Success Stories", to: "/stories" },
  { label: "Contact", to: "/contact" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
  { label: "Adoption Agreement", to: "/adoption-agreement" },
  { label: "Data Usage", to: "/data-usage" },
];

const CONTACTS = [
  { icon: Mail, label: "support@pawguard.org", href: "mailto:support@pawguard.org" },
  { icon: Phone, label: "+91 98765 43210", href: "tel:+919876543210" },
  { icon: MapPin, label: "12 Jubilee Hills Road, Hyderabad, Telangana", href: "#" },
];

const TRUST = [
  { label: "501(c)(3)", sub: "Verified Nonprofit" },
  { label: "AVMA", sub: "Member" },
  { label: "Charity Navigator", sub: "4/4 Stars" },
  { label: "GuideStar", sub: "Gold Seal" },
  { label: "Stripe", sub: "Secure Payments" },
];

const staggerItem = (i: number, tier: string) => {
  const shouldAnimate = tier === "full";
  return {
    initial: shouldAnimate ? { opacity: 0, y: 16 } : { opacity: 1, y: 0 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" },
    transition: shouldAnimate
      ? { duration: duration.gentle / 1000, ease: ease.gentle, delay: i * 0.06 }
      : { duration: 0 },
  };
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const motionTier = useMotionStore((s) => s.motionTier);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubLoading(true);
    setTimeout(() => {
      setSubLoading(false);
      setSubscribed(true);
    }, 1200);
  }

  return (
    <footer data-nav-anchor="footer" className="relative bg-footer-bg pt-6 pb-4 lg:pt-8 lg:pb-5 overflow-hidden" role="contentinfo">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-primary/8 via-primary/3 to-transparent rounded-full blur-[80px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-destructive/3 rounded-full blur-[100px]" />
        <div
          className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,214,150,0.12) 0%, rgba(255,214,150,0) 62%)",
          }}
        />
        <svg
          className="animate-footer-network-fade absolute inset-x-0 top-0 h-[420px] w-full"
          viewBox="0 0 1280 420"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <g fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="0.6">
            <polyline points="140,150 320,90 520,150 700,70" />
            <polyline points="560,220 740,300 940,220" />
            <polyline points="320,90 420,250 560,220" />
            <polyline points="880,120 1040,60 1240,140" />
            <polyline points="520,150 660,260 880,120" />
          </g>
          <g fill="rgba(255,255,255,0.9)">
            <circle cx="140" cy="150" r="2" />
            <circle cx="320" cy="90" r="2" />
            <circle cx="520" cy="150" r="2" />
            <circle cx="700" cy="70" r="2" />
            <circle cx="560" cy="220" r="2" />
            <circle cx="740" cy="300" r="2" />
            <circle cx="940" cy="220" r="2" />
            <circle cx="420" cy="250" r="2" />
            <circle cx="880" cy="120" r="2" />
            <circle cx="1040" cy="60" r="2" />
            <circle cx="1240" cy="140" r="2" />
            <circle cx="660" cy="260" r="2" />
          </g>
        </svg>
      </div>

      <div className="relative z-10 max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-6 lg:px-8 xl:px-12">
        <motion.div
          initial={motionTier === "full" ? { opacity: 0 } : { opacity: 1 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: duration.narrative / 1000, ease: ease.narrative, delay: motionTier === "full" ? 0.2 : 0 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-start gap-6 lg:gap-8 py-5 lg:py-6 border-b border-white/5">
            <motion.div
              {...staggerItem(0, motionTier)}
              className="flex flex-col gap-3 lg:col-span-3 lg:order-1"
            >
              <Link href="/" className="flex items-center gap-2.5 group">
                <img
                  src="/images/rescue-process/assets/Logo.png"
                  alt="PawGuard Logo"
                  className="h-10 w-auto object-contain transition-transform duration-fast group-hover:scale-105"
                />
                <span className="font-bold text-white text-lg tracking-tight">PawGuard</span>
              </Link>
              <p className="text-white/60 text-sm leading-relaxed max-w-[220px]">
                Coordinating emergency rescue, adoption, and veterinary care for dogs across the region.
              </p>
              <div className="flex items-center gap-2.5">
                {SOCIALS.map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-gentle ease-gentle"
                    aria-label={label}
                  >
                    <Icon size={14} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </motion.div>

            <motion.div
              {...staggerItem(1, motionTier)}
              className="order-3 lg:order-2 lg:col-span-4"
            >
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                <nav aria-label="Services">
                  <h4 className="text-white font-semibold text-xs tracking-widest uppercase mb-2.5">Services</h4>
                  <ul className="flex flex-col gap-1.5">
                    {SERVICES.map(({ label, to }) => (
                      <li key={to}>
                        <Link
                          href={to}
                          className="group flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors duration-fast"
                        >
                          <ChevronRight size={12} className="text-white/20 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-gentle ease-gentle -ml-0.5" />
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <nav aria-label="Company">
                  <h4 className="text-white font-semibold text-xs tracking-widest uppercase mb-2.5">Company</h4>
                  <ul className="flex flex-col gap-1.5">
                    {COMPANY.map(({ label, to }) => (
                      <li key={label}>
                        <Link
                          href={to}
                          className="group flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors duration-fast"
                        >
                          <ChevronRight size={12} className="text-white/20 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-gentle ease-gentle -ml-0.5" />
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </motion.div>

            <motion.div
              {...staggerItem(2, motionTier)}
              className="order-2 lg:order-3 lg:col-span-5 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h4 className="text-white font-semibold text-xs tracking-widest uppercase">Get in Touch</h4>
                <Button variant="destructive" size="sm" asLink={{ href: "/emergency" }} className="shrink-0">
                  Report Emergency
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                {CONTACTS.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="group flex items-center gap-2.5 text-sm text-white/50 hover:text-white transition-colors duration-gentle ease-gentle w-fit"
                  >
                    <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-gentle ease-gentle">
                      <Icon size={13} className="text-white/60 group-hover:text-white transition-colors duration-ui" />
                    </span>
                    {label}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-5 lg:gap-10 py-4 lg:py-5 border-b border-white/5">
            <motion.div
              {...staggerItem(0, motionTier)}
              className="lg:col-span-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6"
            >
              <div className="sm:max-w-[220px] shrink-0">
                <h3 className="text-white font-semibold text-xs tracking-widest uppercase mb-0.5">
                  Stay Updated
                </h3>
                <p className="text-white/60 text-sm leading-snug">
                  Rescue news, adoption updates, and volunteer opportunities.
                </p>
              </div>
              <div className="w-full sm:flex-1 sm:max-w-[380px]">
                {subscribed ? (
                  <p className="text-white font-semibold text-sm animate-celebration-pop flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    You&rsquo;re subscribed. Welcome to the pack.
                  </p>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full">
                    <div className="flex-1 w-full min-w-0">
                      <Input
                        type="email"
                        required
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/50 h-10 w-full text-sm"
                        aria-label="Email for newsletter"
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="light"
                      size="sm"
                      isLoading={subLoading}
                      isSuccess={false}
                      context="newsletter"
                      className="shrink-0 w-full sm:w-auto px-5 h-10"
                    >
                      Subscribe
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>

            <motion.div
              {...staggerItem(1, motionTier)}
              className="lg:col-span-5 flex flex-col gap-2.5"
            >
              <p className="text-white/70 text-xs font-semibold tracking-widest uppercase">
                Trusted Partners &amp; Accreditation
              </p>
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-2.5">
                {TRUST.map((p) => (
                  <li key={p.label} className="flex items-center gap-2 group">
                    <span className="w-7 h-7 rounded-lg bg-white/[0.08] border border-white/[0.14] flex items-center justify-center group-hover:bg-white/15 group-hover:border-white/30 transition-all duration-gentle ease-gentle shrink-0">
                      <Shield size={13} className="text-white/50 group-hover:text-white/80 transition-colors duration-ui" />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-white/90 text-xs font-semibold leading-tight">{p.label}</span>
                      <span className="text-white/55 text-2xs leading-tight">{p.sub}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>

        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-white/50 flex items-center gap-1.5">
            &copy; {new Date().getFullYear()} PawGuard Enterprise. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-white/20 text-xs">
            <Heart size={12} className="text-destructive/60" />
            Built with compassion for every dog.
          </div>
        </div>
      </div>
    </footer>
  );
}