import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  
  const response = NextResponse.json({ success: true });
  // Also clear the legacy cookie just in case
  response.cookies.delete("admin_auth");
  return response;
}
