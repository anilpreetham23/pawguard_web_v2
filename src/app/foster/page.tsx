import type { Metadata } from "next";
import FosterPage from "../pages/FosterPage";

export const metadata: Metadata = {
  title: "Foster Care Program | PawGuard",
  description:
    "Become a PawGuard foster family. Provide temporary care for dogs recovering from rescue. PawGuard covers 100% of medical expenses, food, and supplies.",
};

export default function Page() {
  return <FosterPage />;
}
