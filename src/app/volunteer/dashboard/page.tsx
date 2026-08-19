import type { Metadata } from "next";
import VolunteerDashboardPage from "../../pages/VolunteerDashboardPage";

export const metadata: Metadata = {
  title: "Volunteer Dashboard | PawGuard",
  description: "Track your volunteer applications, upcoming shelter shifts, skills profile, and service record.",
};

export default function Page() {
  return <VolunteerDashboardPage />;
}
