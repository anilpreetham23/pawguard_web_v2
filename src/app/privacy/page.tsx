import type { Metadata } from "next";
import LegalDocumentPage from "../pages/LegalDocumentPage";

export const metadata: Metadata = {
  title: "Privacy Policy | PawGuard",
  description: "How PawGuard manages and protects user data and animal emergency location details.",
};

export default function Page() {
  return <LegalDocumentPage type="privacy" />;
}
