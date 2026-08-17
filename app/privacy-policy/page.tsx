import PrivacyPolicyIndex from "./index";
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Privacy Policy",
  description: "Read the Privacy Policy of Sarthi Tourism. Learn how we collect, use, and protect your personal data when you use our travel booking services.",
  path: "/privacy-policy",
  keywords: [
    "privacy policy",
    "data protection",
    "Sarthi Tourism privacy",
  ],
});

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyIndex />;
}
