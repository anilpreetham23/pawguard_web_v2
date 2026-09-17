import type { Metadata } from "next";
import LostFoundPageView from "./LostFoundPageView";

export const metadata: Metadata = {
  title: "Lost & Found Pets Directory",
  description: "Report lost dogs, submit sighting alerts, and help reunite pets with families.",
};

export default function Page() {
  return <LostFoundPageView />;
}
