import PackagesClient from "./PackagesClient";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 60;

export default async function PackagesPage() {
  let packages: any[] = [];
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching packages:", error);
      } else if (data) {
        packages = data;
      }
    }
  } catch (err) {
    console.error("Error in PackagesPage fetch:", err);
  }

  return <PackagesClient packages={packages} />;
}
