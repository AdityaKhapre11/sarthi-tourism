import TermsOfServiceIndex from "./index";
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = generatePageMetadata({
  title: "Terms of Service",
  description: "Terms of Service for Sarthi Tourism. Understand the rules and guidelines for using our website and travel booking services.",
  path: "/terms-of-service",
  keywords: [
    "terms of service",
    "terms and conditions",
    "Sarthi Tourism terms",
  ],
});

export default async function TermsOfServicePage() {
  const supabase = await createClient();
  const { data } = await supabase.from("settings").select("value").eq("key", "terms_conditions").maybeSingle();
  const content = data?.value?.content || "";
  return <TermsOfServiceIndex content={content} />;
}
