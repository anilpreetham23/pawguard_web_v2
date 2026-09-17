import type { Metadata } from "next";
import LegalDocumentPageView from "@/app/components/pawguard/LegalDocumentPageView";

export const metadata: Metadata = {
  title: "Terms of Service | PawGuard",
  description: "Terms and conditions governing the use of PawGuard public website and services.",
};

export default function Page() {
  return <LegalDocumentPageView type="terms" />;
}
