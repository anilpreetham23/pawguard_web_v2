import type { Metadata } from "next";
import MyPetsPage from "../../pages/MyPetsPage";

export const metadata: Metadata = {
  title: "My Pets",
  description:
    "Your adopted dogs and companion-pet profiles — book veterinary visits, manage reminders, and use the QR safety tag.",
};

export default function Page() {
  return <MyPetsPage />;
}
