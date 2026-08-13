import type { Metadata } from "next";
import LostFoundReportLanding from "../../pages/LostFoundReportLanding";

export const metadata: Metadata = {
  title: "Report to Lost & Found",
  description:
    "Report a lost pet or a found animal to the PawGuard Lost & Found community and help reunite families.",
};

export default function Page() {
  return <LostFoundReportLanding />;
}