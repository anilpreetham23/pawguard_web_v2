import type { Metadata } from "next";
import LegalDocumentPageView from "@/components/shared/LegalDocumentPageView";

export const metadata: Metadata = {
  title: "Privacy Policy | PawGuard",
  description: "How PawGuard manages and protects user data and animal emergency location details.",
};

export default function Page() {
  return <LegalDocumentPageView type="privacy" />;
}
