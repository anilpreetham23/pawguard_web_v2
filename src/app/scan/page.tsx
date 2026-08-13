import type { Metadata } from "next";
import ScanPage from "../pages/ScanPage";

export const metadata: Metadata = {
  title: "Scan Safety Tag",
  description:
    "Scan a PawGuard safety-tag QR code or enter a token to see public pet safety information. No sign-in required.",
};

export default function Page() {
  return <ScanPage />;
}