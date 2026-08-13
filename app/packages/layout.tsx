import { Metadata } from "next";
import { generatePageMetadata, getBreadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = generatePageMetadata({
  title: "All Tour Packages from  & Gujarat | International & Domestic Deals",
  description: "Explore all international and domestic tour packages from , Gujarat with Sarthi Tourism. Best deals on Japan, Dubai, Europe, Kashmir, Uttarakhand & Bali packages.",
  path: "/packages",
  keywords: [
    "tour packages from ",
    "holiday packages from Gujarat",
    "international tour packages ",
    "domestic travel packages Gujarat",
    "family tour deals ",
    "Sarthi Tourism packages",
  ],
});

export default function PackagesLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Tour Packages", item: "/packages" },
  ]);

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      {children}
    </>
  );
}
