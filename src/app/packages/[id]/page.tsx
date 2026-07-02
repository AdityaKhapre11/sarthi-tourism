import { notFound } from "next/navigation";
import PackageDetailsClient from "./PackageDetailsClient";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  const supabase = await createClient();
  const { data: pkg } = await supabase
    .from('packages')
    .select('*')
    .eq('id', id)
    .single();

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
  
  const supabase = await createClient();
  const { data: pkg, error } = await supabase
    .from('packages')
    .select('*, itineraries(*)')
    .eq('id', id)
    .single();

  if (error || !pkg) {
    notFound();
  }

  // Format itinerary
  pkg.itinerary = pkg.itineraries?.sort((a: any, b: any) => a.day - b.day) || [];

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
