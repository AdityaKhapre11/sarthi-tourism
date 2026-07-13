import { notFound } from "next/navigation";
import PackageDetailsClient from "./PackageDetailsClient";
import { createClient } from "@/lib/supabase/server";

export default async function PackageDetailsIndex({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const supabase = await createClient();
  const { data: pkg, error } = await supabase
    .from('packages')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !pkg) {
    notFound();
  }

  // Format itinerary
  pkg.itinerary = pkg.itinerary?.sort((a: any, b: any) => a.day - b.day) || [];

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8780228628";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://sarthitourism.com");
  const packageUrl = `${baseUrl}/packages/${pkg.id}`;
  
  const highlightsText = pkg.highlights && pkg.highlights.length > 0 
    ? `\n✨ *Highlights:* ${pkg.highlights.join(" | ")}` 
    : "";

  const whatsappMessage = `Hi Sarthi Tourism! 👋\n\nI'm interested in booking the following package:\n\n🌴 *${pkg.name}*\n💰 *Price:* ${pkg.price}\n⏱️ *Duration:* ${pkg.duration}${highlightsText}\n\nCould you please share more details?\n\n🔗 *View Package Details:*\n${packageUrl}`;
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
