import type { Metadata } from "next";
import ContactPageView from "./ContactPageView";

export const metadata: Metadata = {
  title: "Contact & Grievance Support",
  description: "Get in touch with PawGuard support, report grievances, or find clinic locations.",
};

export default function Page() {
  return <ContactPageView />;
}
