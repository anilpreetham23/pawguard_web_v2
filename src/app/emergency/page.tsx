import type { Metadata } from "next";
import EmergencyPageView from "./EmergencyPageView";

export const metadata: Metadata = {
  title: "Emergency SOS Rescue",
  description: "Dispatch urgent emergency medical rescue for injured or trapped animals.",
};

export default function Page() {
  return <EmergencyPageView />;
}
