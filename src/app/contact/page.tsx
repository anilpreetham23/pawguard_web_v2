import type { Metadata } from "next";
import ContactPage from "../pages/ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with PawGuard. We reply within 24 hours.",
};

export default function Page() {
  return <ContactPage />;
}
