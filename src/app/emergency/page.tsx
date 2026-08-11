import type { Metadata } from "next";
import EmergencyPage from "../pages/EmergencyPage";

export const metadata: Metadata = {
  title: "Emergency",
  description:
    "Report a dog in crisis. PawGuard dispatches emergency rescue teams within minutes.",
};

export default function Page() {
  return <EmergencyPage />;
}
