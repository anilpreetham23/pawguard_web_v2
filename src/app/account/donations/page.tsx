import type { Metadata } from "next";
import MyDonationsPageView from "./MyDonationsPageView";

export const metadata: Metadata = {
  title: "My Donations",
  description: "View your contribution history and tax receipts.",
};

export default function Page() {
  return <MyDonationsPageView />;
}
