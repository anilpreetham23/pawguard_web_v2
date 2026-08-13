import type { Metadata } from "next";
import LostFoundPage from "../pages/LostFoundPage";

export const metadata: Metadata = {
  title: "Lost & Found",
  description:
    "Browse lost-pet and found-animal reports across the PawGuard community and help reunite families with their companions.",
};

export default function Page() {
  return <LostFoundPage />;
}