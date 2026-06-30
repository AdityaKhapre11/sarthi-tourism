import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tour Packages",
  description: "Browse our comprehensive collection of premium tour packages, customized trips, and exciting travel itineraries.",
  alternates: {
    canonical: "/packages",
  },
};

export default function PackagesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
