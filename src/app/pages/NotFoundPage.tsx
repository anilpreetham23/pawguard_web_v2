"use client";

import { lazy, Suspense } from "react";
import Link from "next/link";
import { Home, Siren, Heart } from "lucide-react";
import { PageShell, Button } from "../components/pawguard";

const LottieHappyDog = lazy(() =>
  import("../../motion/components/lottie-happy-dog").then((m) => ({
    default: m.LottieHappyDog,
  })),
);

export default function NotFoundPage() {
  return (
    <PageShell>
      <main id="main-content" className="flex-1 flex flex-col justify-center px-6 relative overflow-hidden pt-[var(--header-height)]">
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full opacity-[0.03]" viewBox="0 0 100 100" preserveAspectRatio="none">
            {Array.from({ length: 20 }).map((_, r) =>
              Array.from({ length: 20 }).map((_, c) => (
                <circle key={`${r}-${c}`} cx={c * 5 + 2.5} cy={r * 5 + 2.5} r="0.8" fill="currentColor" className="text-primary" />
              ))
            )}
          </svg>
        </div>
        <div className="max-w-[480px] mx-auto w-full text-center flex flex-col items-center py-12 relative">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold tracking-widest uppercase font-condensed">
            <span className="w-8 h-px bg-primary" />
            Page Not Found
            <span className="w-8 h-px bg-primary" />
          </div>
          <Suspense
            fallback={
              <div
                className="w-[440px] max-w-full rounded-img bg-muted/50"
                style={{ aspectRatio: "16 / 9" }}
              />
            }
          >
            <LottieHappyDog width={440} />
          </Suspense>
          <h1 className="font-serif font-bold text-3xl lg:text-4xl leading-tight tracking-tight text-foreground max-w-[400px] mt-8">
            This dog wandered off.
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-[380px] mt-5">
            The page you are looking for has been adopted, moved, or never existed. Let us point you somewhere useful.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <Button variant="primary" size="md" asLink={{ href: "/" }}>
              <Home size={14} />
              Home
            </Button>
            <Button variant="outline" size="md" asLink={{ href: "/adopt" }}>
              <Heart size={14} />
              Adopt
            </Button>
            <Button variant="destructive" size="md" className="font-bold" asLink={{ href: "/emergency" }}>
              <Siren size={14} />
              Emergency
            </Button>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
