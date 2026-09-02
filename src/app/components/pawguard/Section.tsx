"use client";

import { cn } from "../ui/utils";
import { useAmbientPause } from "../../hooks/useAmbientPause";

type SectionBg = "default" | "card" | "dark" | "crimson";

const bgStyles: Record<SectionBg, string> = {
  default: "bg-background",
  card: "bg-card",
  dark: "bg-section-dark",
  crimson: "bg-destructive",
};

interface SectionProps extends React.ComponentProps<"section"> {
  bg?: SectionBg;
  containerWidth?: "wide" | "narrow";
}

export function Section({
  className,
  bg = "default",
  containerWidth = "wide",
  children,
  ...props
}: SectionProps) {
  const ref = useAmbientPause<HTMLElement>();

  return (
    <section
      ref={ref}
      className={cn(
        "py-section-md lg:py-section-lg px-4 sm:px-6 lg:px-8 xl:px-12 relative",
        bgStyles[bg],
        bg === "dark" && "noise-overlay",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "mx-auto",
          containerWidth === "wide" && "max-w-[1440px] 2xl:max-w-[1536px]",
          containerWidth === "narrow" && "max-w-[720px]",
        )}
      >
        {children}
      </div>
    </section>
  );
}
