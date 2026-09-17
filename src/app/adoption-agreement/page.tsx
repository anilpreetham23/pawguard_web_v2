import type { Metadata } from "next";
import LegalDocumentPageView from "@/components/shared/LegalDocumentPageView";

export const metadata: Metadata = {
  title: "Adoption Agreement | PawGuard",
  description: "Terms and responsibilities governing animal adoptions through PawGuard shelter partners.",
};

export default function Page() {
  return <LegalDocumentPageView type="adoption-agreement" />;
}
