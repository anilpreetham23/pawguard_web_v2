import type { Metadata } from "next";
import MyApplicationsPageView from "./MyApplicationsPageView";

export const metadata: Metadata = {
  title: "My Applications",
  description: "Track your active adoption, foster, and volunteer applications.",
};

export default function Page() {
  return <MyApplicationsPageView />;
}
