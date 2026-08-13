import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  
  const response = NextResponse.json({ success: true });
  
  // Clear legacy cookies
  response.cookies.delete("admin_auth");
  
  // Explicitly delete all Supabase auth cookies
  const allCookies = request.cookies.getAll();
  allCookies.forEach((cookie) => {
    if (cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token')) {
      response.cookies.delete(cookie.name);
    }
  });

  return response;
}
