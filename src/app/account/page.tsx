import type { Metadata } from "next";
import AccountPage from "../pages/AccountPage";

export const metadata: Metadata = {
  title: "My Account",
  description:
    "Your PawGuard profile — account details, adoption activity, donations, and dogs you've saved.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AccountPage />;
}