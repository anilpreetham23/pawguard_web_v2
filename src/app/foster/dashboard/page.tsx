import type { Metadata } from "next";
import FosterDashboardPageView from "./FosterDashboardPageView";

export const metadata: Metadata = {
  title: "Foster Parent Dashboard",
  description: "Track foster placements, medical schedules, and supply requests.",
};

export default function Page() {
  return <FosterDashboardPageView />;
}
