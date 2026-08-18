import type { Metadata } from "next";
import NotificationsPage from "../pages/NotificationsPage";

export const metadata: Metadata = {
  title: "Notifications",
  description:
    "Your PawGuard alerts — adoption application updates, rescue dispatches, appointment reminders, and more.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <NotificationsPage />;
}
