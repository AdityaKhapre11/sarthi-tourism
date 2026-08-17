import TermsOfServiceIndex from "./index";
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Terms of Service",
  description: "Terms of Service for Sarthi Tourism. Understand the rules and guidelines for using our website and travel booking services.",
  path: "/terms-of-service",
  keywords: [
    "terms of service",
    "terms and conditions",
    "Sarthi Tourism terms",
  ],
});

export default function TermsOfServicePage() {
  return <TermsOfServiceIndex />;
}
