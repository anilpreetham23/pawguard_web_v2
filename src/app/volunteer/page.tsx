import type { Metadata } from "next";
import VolunteerPageView from "./VolunteerPageView";

export const metadata: Metadata = {
  title: "Volunteer with PawGuard",
  description: "Join our rescue team as a volunteer driver, foster parent, or event organizer.",
};

export default function Page() {
  return <VolunteerPageView />;
}
