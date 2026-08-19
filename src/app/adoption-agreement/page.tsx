import type { Metadata } from "next";
import LegalDocumentPage from "../pages/LegalDocumentPage";

export const metadata: Metadata = {
  title: "Adoption Agreement | PawGuard",
  description: "Terms and responsibilities governing animal adoptions through PawGuard shelter partners.",
};

export default function Page() {
  return <LegalDocumentPage type="adoption-agreement" />;
}
