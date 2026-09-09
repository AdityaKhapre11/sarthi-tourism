import HomeIndex from "./index";
import { Metadata } from "next";
import { generatePageMetadata, getWebSiteSchema, getFAQPageSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = generatePageMetadata({
  title: "Sarthi Tourism | Premium Travel & Tour Packages in Gujarat",
  description: "Book premium domestic & international tour packages with Sarthi Tourism. Custom itineraries & unforgettable journeys.",
  path: "/",
  ogImage: "/images/og-image.png",
  keywords: [
    "best travel agency",
    "tour operator",
    "international travel agency",
    "holiday packages",
    "tour packages",
    "Sarthi Tourism",
  ],
});

export default function Home() {
  const websiteSchema = getWebSiteSchema();
  const homepageFaqs = getFAQPageSchema([
    {
      question: "Which tour packages does Sarthi Tourism offer?",
      answer: "Sarthi Tourism offers international tour packages (Japan, Dubai, Europe, Bali, Thailand) and domestic tour packages (Kashmir, Uttarakhand, Himachal, Kerala, Rajasthan, Gujarat) departing from Gujarat."
    },
    {
      question: "Can Sarthi Tourism customize travel itineraries for families and groups?",
      answer: "Yes! Sarthi Tourism specializes in customized family packages, honeymoon trips, group tours, and corporate itineraries with personalized hotel selections and guided sightseeing."
    },
    {
      question: "Where is Sarthi Tourism located?",
      answer: `Sarthi Tourism is located in Gujarat, India. You can contact us directly via phone or WhatsApp at +91 ${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8780228628"}.`
    }
  ]);

  return (
    <>
      <JsonLd schema={[websiteSchema, homepageFaqs]} />
      <HomeIndex />
    </>
  );
}
