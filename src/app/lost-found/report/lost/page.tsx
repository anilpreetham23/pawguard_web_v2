import type { Metadata } from "next";
import LostFoundReportForm from "../../../pages/LostFoundReportForm";

export const metadata: Metadata = {
  title: "Report a Lost Pet",
  description:
    "File a lost-pet report so the PawGuard community can help search for your missing companion.",
};

export default function Page() {
  return <LostFoundReportForm kind="lost" />;
}