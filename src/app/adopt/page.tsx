import type { Metadata } from "next";
import AdoptionPage from "../pages/AdoptionPage";

export const metadata: Metadata = {
  title: "Adopt",
  description:
    "Browse dogs available for adoption. Every dog is vaccinated, assessed, and ready for a permanent home.",
};

export default function Page() {
  return <AdoptionPage />;
}
