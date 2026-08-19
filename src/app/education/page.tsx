import type { Metadata } from "next";
import EducationPage from "../pages/EducationPage";

export const metadata: Metadata = {
  title: "Pet Care & Rescue Guides | PawGuard Education",
  description: "Educational resources on responsible pet ownership, vaccination, stray rescue safety, and emergency first aid.",
};

export default function Page() {
  return <EducationPage />;
}
