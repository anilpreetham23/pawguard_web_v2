import type { Metadata } from "next";
import LegalDocumentPageView from "@/app/components/pawguard/LegalDocumentPageView";

export const metadata: Metadata = {
  title: "Data Usage & Transparency | PawGuard",
  description: "Our commitment to open transparency, public statistics, and responsible data handling.",
};

export default function Page() {
  return <LegalDocumentPageView type="data-usage" />;
}
