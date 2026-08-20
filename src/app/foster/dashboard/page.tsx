import type { Metadata } from "next";
import FosterDashboardPage from "../../pages/FosterDashboardPage";

export const metadata: Metadata = {
  title: "Foster Dashboard | PawGuard",
  description:
    "View your PawGuard foster carer profile status, capacity, care preferences, and active placement overview.",
};

export default function Page() {
  return <FosterDashboardPage />;
}
