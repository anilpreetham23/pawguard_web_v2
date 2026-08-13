import type { Metadata } from "next";
import AppointmentBookPage from "../../pages/AppointmentBookPage";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Schedule a veterinary appointment for your companion at one of our partner clinics.",
};

export default function Page() {
  return <AppointmentBookPage />;
}
