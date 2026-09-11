import type { Metadata } from "next";
import MyDonationsPage from "../../pages/MyDonationsPage";

export const metadata: Metadata = {
  title: "My Donations | PawGuard",
  description: "View your contribution history, impact, and official tax receipts.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <MyDonationsPage />;
}
