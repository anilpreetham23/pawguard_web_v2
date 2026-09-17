import type { Metadata } from "next";
import NotificationsPageView from "./NotificationsPageView";

export const metadata: Metadata = {
  title: "Notifications",
  description: "View your rescue alerts, application updates, and appointment reminders.",
};

export default function Page() {
  return <NotificationsPageView />;
}
