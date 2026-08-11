"use client";

import { lazy, Suspense } from "react";
import Link from "next/link";
import {
  WifiOff,
  Wrench,
  Frown,
  ShieldAlert,
  LogIn,
} from "lucide-react";
import { cn } from "../ui/utils";

const LottieHappyDog = lazy(() =>
  import("../../../motion/components/lottie-happy-dog").then((m) => ({
    default: m.LottieHappyDog,
  })),
);

type ErrorPageVariant =
  | "offline"
  | "maintenance"
  | "serverError"
  | "forbidden"
  | "unauthorized";

interface ErrorPageAction {
  label: string;
  to?: string;
  reload?: boolean;
}

interface ErrorPageProps {
  variant: ErrorPageVariant;
  title?: string;
  description?: string;
  action?: ErrorPageAction;
  className?: string;
}

const presets: Record<ErrorPageVariant, { icon: typeof WifiOff; title: string; description: string; action: ErrorPageAction }> = {
  offline: {
    icon: WifiOff,
    title: "No internet connection",
    description: "You appear to be offline. Check your connection and try again.",
    action: { label: "Try Again", reload: true },
  },
  maintenance: {
    icon: Wrench,
    title: "Under maintenance",
    description: "We are currently performing scheduled maintenance. The site will be back shortly.",
    action: { label: "Back to Home", to: "/" },
  },
  serverError: {
    icon: Frown,
    title: "Something went wrong",
    description: "An unexpected error occurred. Please try refreshing the page.",
    action: { label: "Try Again", reload: true },
  },
  forbidden: {
    icon: ShieldAlert,
    title: "Access denied",
    description: "You do not have permission to access this page.",
    action: { label: "Back to Home", to: "/" },
  },
  unauthorized: {
    icon: LogIn,
    title: "Sign in required",
    description: "You need to sign in to access this page.",
    action: { label: "Sign In", to: "/" },
  },
};

export function ErrorPage({
  variant,
  title,
  description,
  action,
  className,
}: ErrorPageProps) {
  const preset = presets[variant];
  const Icon = preset.icon;
  const displayAction = action ?? preset.action;

  return (
    <div className={cn("min-h-screen pt-[var(--header-height)] flex flex-col", className)}>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className={cn("w-full text-center flex flex-col items-center", variant === "serverError" ? "max-w-[440px]" : "max-w-[420px]")}>
          {variant !== "serverError" && (
            <div className="w-14 h-14 bg-destructive/10 rounded-2xl flex items-center justify-center mb-5">
              <Icon size={24} className="text-destructive" />
            </div>
          )}
          <h1 className="font-serif font-bold text-2xl text-foreground">
            {title ?? preset.title}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed mt-5">
            {description ?? preset.description}
          </p>
          {variant === "serverError" && (
            <div className="w-full mt-8">
              <Suspense
                fallback={
                  <div
                    className="w-[420px] max-w-full mx-auto rounded-img bg-muted/50"
                    style={{ aspectRatio: "16 / 9" }}
                  />
                }
              >
                <LottieHappyDog width={420} />
              </Suspense>
            </div>
          )}
          {displayAction.reload ? (
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground font-semibold text-xs tracking-wider uppercase font-condensed px-6 py-3 rounded-btn hover:bg-primary-hover transition-all duration-fast mt-8"
            >
              {displayAction.label}
            </button>
          ) : (
            <Link
              href={displayAction.to ?? "/"}
              className="bg-primary text-primary-foreground font-semibold text-xs tracking-wider uppercase font-condensed px-6 py-3 rounded-btn hover:bg-primary-hover transition-all duration-fast mt-8"
            >
              {displayAction.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
