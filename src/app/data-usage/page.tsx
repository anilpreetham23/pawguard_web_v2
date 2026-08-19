import type { Metadata } from "next";
import LegalDocumentPage from "../pages/LegalDocumentPage";

export const metadata: Metadata = {
  title: "Data Usage & Transparency | PawGuard",
  description: "Our commitment to open transparency, public statistics, and responsible data handling.",
};

export default function Page() {
  return <LegalDocumentPage type="data-usage" />;
}
