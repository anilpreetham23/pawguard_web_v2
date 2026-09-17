import type { Metadata } from "next";
import ScanPageView from "./ScanPageView";

export const metadata: Metadata = {
  title: "QR Safety Tag Scanner",
  description: "Scan a PawGuard QR safety tag to view owner emergency contact details.",
};

export default function Page() {
  return <ScanPageView />;
}
