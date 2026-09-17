import type { Metadata } from "next";
import VolunteerDashboardPageView from "./VolunteerDashboardPageView";

export const metadata: Metadata = {
  title: "Volunteer Dashboard",
  description: "View active rescue assignments, volunteer hours, and community tasks.",
};

export default function Page() {
  return <VolunteerDashboardPageView />;
}
