import type { Metadata } from "next";
import { Suspense } from "react";
import LostFoundReportForm from "../../../pages/LostFoundReportForm";

export const metadata: Metadata = {
  title: "Report a Lost Dog",
  description:
    "File a lost-dog report so the PawGuard community can help search for your missing dog.",
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[760px] mx-auto px-6 lg:px-8 pt-[calc(var(--header-height)+2rem)] pb-section-lg">
          <div className="h-8 w-1/2 bg-muted rounded animate-pulse mb-4" />
          <div className="h-4 w-1/3 bg-muted rounded animate-pulse mb-10" />
          <div className="h-64 rounded-card bg-muted animate-pulse" />
        </div>
      }
    >
      <LostFoundReportForm kind="lost" />
    </Suspense>
  );
}