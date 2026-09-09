import PrivacyPolicyIndex from "./index";
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = generatePageMetadata({
  title: "Privacy Policy | Sarthi Tourism Travel Agency Gujarat",
  description: "Read the Privacy Policy of Sarthi Tourism. Learn how we protect your personal data when booking tour packages with us.",
  path: "/privacy-policy",
  keywords: [
    "privacy policy",
    "data protection",
    "Sarthi Tourism privacy",
  ],
});

export default async function PrivacyPolicyPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("settings").select("value").eq("key", "privacy_policy").maybeSingle();
  const content = data?.value?.content || "";
  return <PrivacyPolicyIndex content={content} />;
}
