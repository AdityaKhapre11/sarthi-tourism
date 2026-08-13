import HomeIndex from "./index";
import { Metadata } from "next";
import { generatePageMetadata, getWebSiteSchema, getFAQPageSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = generatePageMetadata({
  title: "Sarthi Tourism | Premium Travel & Tour Packages",
  description: "Sarthi Tourism is a premier travel agency offering customized international & domestic tour packages, family vacations, and honeymoon trips.",
  path: "/",
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
      question: "Which tour packages does Sarthi Tourism offer from Surat?",
      answer: "Sarthi Tourism offers international tour packages (Japan, Dubai, Europe, Bali, Thailand) and domestic tour packages (Kashmir, Uttarakhand, Himachal, Kerala, Rajasthan, Gujarat) departing from Surat and Gujarat."
    },
    {
      question: "Can Sarthi Tourism customize travel itineraries for families and groups?",
      answer: "Yes! Sarthi Tourism specializes in customized family packages, honeymoon trips, group tours, and corporate itineraries with personalized hotel selections and guided sightseeing."
    },
    {
      question: "Where is Sarthi Tourism located?",
      answer: "Sarthi Tourism is located in Surat, Gujarat, India. You can contact us directly via phone or WhatsApp at +91 8780228628."
    }
  ]);

  return (
    <>
      <JsonLd schema={[websiteSchema, homepageFaqs]} />
      <HomeIndex />
    </>
  );
}
