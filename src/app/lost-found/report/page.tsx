import type { Metadata } from "next";
import LostFoundReportLandingView from "./LostFoundReportLandingView";

export const metadata: Metadata = {
  title: "Report Lost or Found Pet",
  description: "Choose whether to report a lost pet or submit a found pet sighting.",
};

export default function Page() {
  return <LostFoundReportLandingView />;
}
