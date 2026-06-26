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

export default function Home() {
  return (
    <>
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

