import PrivacyPolicyIndex from "./index";
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = generatePageMetadata({
  title: "Privacy Policy",
  description: "Read the Privacy Policy of Sarthi Tourism. Learn how we collect, use, and protect your personal data when you use our travel booking services.",
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
