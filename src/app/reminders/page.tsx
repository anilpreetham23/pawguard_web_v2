import type { Metadata } from "next";
import { Suspense } from "react";
import RemindersPage from "../pages/RemindersPage";

export const metadata: Metadata = {
  title: "Smart Reminders",
  description:
    "Track vaccination and medication schedules for your pets, including reminders your veterinary clinic sets automatically.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense>
      <RemindersPage />
    </Suspense>
  );
}
