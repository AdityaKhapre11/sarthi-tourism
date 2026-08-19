import PackagesClient from "./PackagesClient";
import { createClient } from "@supabase/supabase-js";

import { Package } from "@/data/packages";

export const revalidate = 60;

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const page = typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page, 10) : 1;
  const limit = typeof resolvedParams.limit === "string" ? parseInt(resolvedParams.limit, 10) : 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let packages: Package[] = [];
  let totalItems = 0;
  let totalPages = 0;

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data, count, error } = await supabase
        .from("packages")
        .select("*", { count: 'exact' })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        console.error("Error fetching packages:", error);
      } else if (data) {
        packages = data;
        totalItems = count || 0;
        totalPages = Math.ceil(totalItems / limit);
      }
    }
  } catch (err) {
    console.error("Error in PackagesPage fetch:", err);
  }

  return (
    <PackagesClient 
      packages={packages} 
      currentPage={page} 
      totalPages={totalPages} 
      totalItems={totalItems} 
      limit={limit} 
    />
  );
}
