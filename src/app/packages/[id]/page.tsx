import { notFound } from "next/navigation";
import { packages } from "@/data/packages";
import PackageDetailsClient from "./PackageDetailsClient";
import { Metadata } from "next";

export async function generateStaticParams() {
  return packages.map((pkg) => ({
    id: pkg.id.toString(),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const pkg = packages.find((p) => p.id.toString() === id);
  if (!pkg) return {};

  return {
    title: pkg.name,
    description: pkg.description ? pkg.description.substring(0, 160) : `Book the ${pkg.name} tour package starting at ${pkg.price}. Duration: ${pkg.duration}.`,
    openGraph: {
      title: pkg.name,
      description: pkg.description ? pkg.description.substring(0, 160) : `Book the ${pkg.name} tour package starting at ${pkg.price}.`,
      images: [
        {
          url: pkg.image,
          width: 1200,
          height: 630,
          alt: pkg.name,
        },
      ],
    },
    alternates: {
      canonical: `/packages/${pkg.id}`,
    },
  };
}

export default async function PackageDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pkg = packages.find((p) => p.id.toString() === id);

  if (!pkg) {
    notFound();
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8780228628";
  const whatsappMessage = `Hi, I'm interested in the ${pkg.name} package (${pkg.duration}). Could you please share more details?`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": pkg.name,
    "image": pkg.image,
    "description": pkg.description || `Tour package: ${pkg.name}`,
    "offers": {
      "@type": "Offer",
      "price": pkg.price.replace(/[^0-9]/g, ""),
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "url": `https://sarthitourism.com/packages/${pkg.id}`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PackageDetailsClient pkg={pkg} whatsappUrl={whatsappUrl} />
    </>
  );
}
