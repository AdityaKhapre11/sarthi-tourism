import TermsOfServiceIndex from "./index";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Sarthi Tourism. Understand the rules and guidelines for using our website and services.",
  alternates: {
    canonical: "/terms-of-service",
  },
};

export default function TermsOfServicePage() {
  return <TermsOfServiceIndex />;
}
