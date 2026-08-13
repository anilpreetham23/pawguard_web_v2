import type { Metadata } from "next";
import VeterinaryPage from "../pages/VeterinaryPage";

export const metadata: Metadata = {
  title: "Veterinary Directory",
  description:
    "Find a verified partner veterinary clinic from the PawGuard network — including 24/7 emergency care near you.",
};

export default function Page() {
  return <VeterinaryPage />;
}