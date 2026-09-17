import type { Metadata } from "next";
import VeterinaryPageView from "./VeterinaryPageView";

export const metadata: Metadata = {
  title: "Veterinary Clinic Directory",
  description: "Find verified partner veterinary clinics, emergency hospitals, and services.",
};

export default function Page() {
  return <VeterinaryPageView />;
}
