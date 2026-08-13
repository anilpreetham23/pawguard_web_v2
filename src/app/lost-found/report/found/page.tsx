import type { Metadata } from "next";
import LostFoundReportForm from "../../../pages/LostFoundReportForm";

export const metadata: Metadata = {
  title: "Report a Found Animal",
  description:
    "Report an animal you found so the PawGuard community can help reunite them with their family.",
};

export default function Page() {
  return <LostFoundReportForm kind="found" />;
}