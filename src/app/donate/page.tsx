import type { Metadata } from "next";
import DonatePageView from "./DonatePageView";

export const metadata: Metadata = {
  title: "Donate",
  description: "Support emergency rescue operations, medical care, and shelter supplies.",
};

export default function Page() {
  return <DonatePageView />;
}
