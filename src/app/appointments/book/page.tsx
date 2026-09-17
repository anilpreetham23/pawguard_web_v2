import { Suspense } from "react";
import type { Metadata } from "next";
import AppointmentBookPageView from "./AppointmentBookPageView";

export const metadata: Metadata = {
  title: "Book Veterinary Appointment",
  description: "Schedule a veterinary appointment with partner clinics.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AppointmentBookPageView />
    </Suspense>
  );
}
