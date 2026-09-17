import type { Metadata } from "next";
import AppointmentsPageView from "./AppointmentsPageView";

export const metadata: Metadata = {
  title: "My Veterinary Appointments",
  description: "Manage scheduled veterinary consultations and checkups.",
};

export default function Page() {
  return <AppointmentsPageView />;
}
