import type { Metadata } from "next";
import VolunteerPage from "../pages/VolunteerPage";

export const metadata: Metadata = {
  title: "Volunteer",
  description:
    "Join 800+ PawGuard volunteers. Roles include foster care, transport, events, and shelter support.",
};

export default function Page() {
  return <VolunteerPage />;
}
