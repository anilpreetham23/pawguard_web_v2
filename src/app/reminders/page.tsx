import { Suspense } from "react";
import type { Metadata } from "next";
import RemindersPageView from "./RemindersPageView";

export const metadata: Metadata = {
  title: "Medical & Care Reminders",
  description: "Manage vaccination, deworming, and health checkup reminders for your pets.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <RemindersPageView />
    </Suspense>
  );
}
