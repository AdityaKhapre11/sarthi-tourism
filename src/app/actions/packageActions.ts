"use server";

import { createClient } from "@/lib/supabase/server";

export async function fetchMorePackages(page: number, limit: number = 10) {
  const supabase = await createClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data: packages, error } = await supabase
    .from("packages")
    .select("*")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching more packages:", error);
    return [];
  }

  return packages || [];
}
