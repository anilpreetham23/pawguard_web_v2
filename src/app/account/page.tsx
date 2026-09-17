import type { Metadata } from "next";
import AccountPageView from "./AccountPageView";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your PawGuard profile, pets, and security settings.",
};

export default function Page() {
  return <AccountPageView />;
}
