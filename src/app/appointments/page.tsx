import type { Metadata } from "next";
import AppointmentsPage from "../pages/AppointmentsPage";

export const metadata: Metadata = {
  title: "My Appointments",
  description:
    "Review your veterinary appointments, check their status, and manage cancellations for your pets.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AppointmentsPage />;
}
