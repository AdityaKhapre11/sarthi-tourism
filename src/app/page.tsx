import {
  Hero,
  PopularDestinations,
  WhyChooseUs,
  FeaturedPackages,
  Statistics,
  Testimonials,
  GalleryPreview,
  ContactCTA,
} from "@/components/home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sarthi Tourism | Premium Travel & Tour Packages",
  description: "Explore the world with Sarthi Tourism. Discover premium tour packages, breathtaking destinations, and unforgettable experiences.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <PopularDestinations />
      <WhyChooseUs />
      <FeaturedPackages />
      {/* <Statistics /> */}
      <Testimonials />
      <GalleryPreview />
      <ContactCTA />
    </>
  );
}

