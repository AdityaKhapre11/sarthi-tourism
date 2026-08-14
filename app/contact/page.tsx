import ContactClient from "./ContactClient";
import { getAbsoluteUrl } from "@/constants/site";

export const metadata = {
  title: "Contact Us | Sarthi Tourism",
  description: "Get in touch with Sarthi Tourism for customized holiday packages, flight bookings, and travel inquiries.",
  alternates: {
    canonical: getAbsoluteUrl("/contact"),
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
