import { createClient } from "@/lib/supabase/server";
import { Hero } from "@/components/home";
import dynamic from "next/dynamic";

const PopularDestinations = dynamic(() => import("@/components/home").then(mod => mod.PopularDestinations), { ssr: true });
const WhyChooseUs = dynamic(() => import("@/components/home").then(mod => mod.WhyChooseUs), { ssr: true });
const FeaturedPackages = dynamic(() => import("@/components/home").then(mod => mod.FeaturedPackages), { ssr: true });
const Testimonials = dynamic(() => import("@/components/home").then(mod => mod.Testimonials), { ssr: true });
const GalleryPreview = dynamic(() => import("@/components/home").then(mod => mod.GalleryPreview), { ssr: true });
const ContactCTA = dynamic(() => import("@/components/home").then(mod => mod.ContactCTA), { ssr: true });

export default async function HomeIndex() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Sarthi Tourism",
    "image": "https://sarthitourism.com/images/logo1.png",
    "@id": "https://sarthitourism.com",
    "url": "https://sarthitourism.com",
    "telephone": "+918780228628",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "India",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://facebook.com/sarthitourism",
      "https://instagram.com/sarthitourism"
    ]
  };

  const supabase = await createClient();
  const { data: dbPackages, error } = await supabase
    .from('packages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching packages from Supabase:", error);
  }

  const formattedPackages = (dbPackages || []).map(pkg => ({
    ...pkg,
    itinerary: pkg.itinerary?.sort((a: any, b: any) => a.day - b.day) || []
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <PopularDestinations />
      <WhyChooseUs />
      <FeaturedPackages initialPackages={formattedPackages} />
      <Testimonials />
      <GalleryPreview />
      <ContactCTA />
    </>
  );
}
