import type { Metadata } from "next";
import RemindersPage from "../pages/RemindersPage";

export const metadata: Metadata = {
  title: "Smart Reminders",
  description:
    "Track vaccination and medication schedules for your companion pets, including reminders your veterinary clinic sets automatically.",
};

export default function Page() {
  return <RemindersPage />;
}