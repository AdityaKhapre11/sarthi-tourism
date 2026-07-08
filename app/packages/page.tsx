import PackagesClient from "./PackagesClient";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60; // Optional: revalidate every 60 seconds or use dynamic rendering

export default async function PackagesPage() {
  const supabase = await createClient();
  
  const { data: packages, error } = await supabase
    .from("packages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching packages:", error);
  }

  return <PackagesClient packages={packages || []} />;
}
