import ContactClient from "./ContactClient";
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Contact Us",
  description: "Get in touch with Sarthi Tourism for customized holiday packages, flight bookings, and travel inquiries. Reach us via WhatsApp, phone, or email.",
  path: "/contact",
  keywords: [
    "contact Sarthi Tourism",
    "travel agency contact",
    "book tour package",
    "travel inquiry",
  ],
});

export default function ContactPage() {
  return <ContactClient />;
}
