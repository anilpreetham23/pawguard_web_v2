import type { Metadata } from "next";
import MyApplicationsPage from "../pages/MyApplicationsPage";

export const metadata: Metadata = {
  title: "My Adoption Applications",
  description:
    "Track the status of your adoption applications — screening, interview, home check, and approval.",
};

export default function Page() {
  return <MyApplicationsPage />;
}
