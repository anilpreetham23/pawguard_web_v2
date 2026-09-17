import type { Metadata } from "next";
import MyPetsPageView from "./MyPetsPageView";

export const metadata: Metadata = {
  title: "My Companion Pets",
  description: "Manage your registered pets, medical records, and PawGuard safety tags.",
};

export default function Page() {
  return <MyPetsPageView />;
}
