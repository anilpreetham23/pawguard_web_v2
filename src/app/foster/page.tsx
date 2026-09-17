import type { Metadata } from "next";
import FosterPageView from "./FosterPageView";

export const metadata: Metadata = {
  title: "Foster a Rescue Dog",
  description: "Provide temporary home care for dogs awaiting permanent adoption.",
};

export default function Page() {
  return <FosterPageView />;
}
