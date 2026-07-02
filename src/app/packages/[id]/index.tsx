import { notFound } from "next/navigation";
import PackageDetailsClient from "./PackageDetailsClient";
import { createClient } from "@/lib/supabase/server";

export default async function PackageDetailsIndex({ params }: { params: Promise<{ id: string }> }) {
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
