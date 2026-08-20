import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";
import AboutUsClient from "./AboutUsClient";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = generatePageMetadata({
  title: "About Us | Sarthi Tourism",
  description: "Learn about Sarthi Tourism, your trusted partner for unforgettable journeys. We offer personalized, comfortable, and memorable travel experiences.",
  path: "/about-us",
  keywords: [
    "about Sarthi Tourism",
    "travel agency",
    "tour packages",
    "domestic tours",
    "international tours",
    "travel partner"
  ],
});

export const dynamic = 'force-dynamic';

export default async function AboutUsPage() {
  const supabase = await createClient();
  
  // Fetch exact count of packages directly from Supabase
  const { count, error } = await supabase
    .from('packages')
    .select('*', { count: 'exact', head: true });

  const packagesCount = count || 0;
  
  // Hardcoded destinations since we reverted it to static "10+", 
  // but we pass 0 here since it's hardcoded in the client component anyway.
  const destinationsCount = 0;

  if (error) {
    console.error("Error fetching packages count:", error);
  }

  return <AboutUsClient stats={{ packagesCount, destinationsCount }} />;
}
