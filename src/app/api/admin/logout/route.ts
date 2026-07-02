import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  
  const response = NextResponse.json({ success: true });
  
  // Clear legacy cookies
  response.cookies.delete("admin_auth");
  
  // Supabase Auth tokens are typically deleted by signOut, but to be absolutely sure:
  // We can just rely on the signOut which modifies the NextResponse internally? 
  // No, signOut() on client doesn't clear server cookies reliably without middleware. 
  // Calling it here on the server clears it for this context, but we should also explicitly delete known keys.
  const allCookies = request.cookies.getAll();
  allCookies.forEach((cookie) => {
    if (cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token')) {
      response.cookies.delete(cookie.name);
    }
  });

  return response;
}
