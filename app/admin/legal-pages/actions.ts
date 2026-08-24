"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getLegalPage(key: 'privacy_policy' | 'terms_conditions') {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  if (error || !data) {
    return { title: "", content: "" };
  }
  return data.value;
}

export async function updateLegalPage(key: 'privacy_policy' | 'terms_conditions', title: string, content: string) {
  const supabase = await createClient();
  
  // First check if it exists
  const { data: existing } = await supabase
    .from("settings")
    .select("id")
    .eq("key", key)
    .maybeSingle();

  let error;
  if (existing) {
    const res = await supabase.from("settings").update({
      value: { title, content },
      updated_at: new Date().toISOString()
    }).eq("key", key);
    error = res.error;
  } else {
    const res = await supabase.from("settings").insert({
      key,
      value: { title, content },
      updated_at: new Date().toISOString()
    });
    error = res.error;
  }

  if (error) {
    return { success: false, error: error.message };
  }

  if (key === 'privacy_policy') {
    revalidatePath("/privacy-policy");
  } else {
    revalidatePath("/terms-of-service");
  }
  
  return { success: true };
}
