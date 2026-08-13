import { NextResponse } from "next/server";
import { createClient as createPublicClient } from "@supabase/supabase-js";
import { hashToken } from "@/lib/auth/verification";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawToken = searchParams.get("token");
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://sarthitourism.com").replace(/\/+$/, '');

  if (!rawToken) {
    console.log("[DEBUG] verify-email: Token is missing from URL.");
    return NextResponse.redirect(`${siteUrl}/verify-email/error?reason=missing_token`);
  }

  try {
    console.log("[DEBUG] verify-email: Raw token received (length: " + rawToken.length + ")");
    const hashedToken = hashToken(rawToken);
    console.log("[DEBUG] verify-email: Token hash generated.");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const supabase = createPublicClient(supabaseUrl, supabaseServiceRoleKey);

    // Query user with matching hashed token
    const { data: user, error: findError } = await supabase
      .from("users")
      .select("id, email, email_verified, verification_token_expires_at")
      .eq("verification_token_hash", hashedToken)
      .maybeSingle();
      
    console.log("[DEBUG] verify-email: Database query executed.");
    console.log("[DEBUG] verify-email: Verification record found:", !!user);
    if (findError) console.error("[DEBUG] verify-email: Database error:", findError);

    if (findError || !user) {
      console.error("Verification error - token not found:", findError);
      return NextResponse.redirect(`${siteUrl}/verify-email/error?reason=invalid_token`);
    }

    // Check if email is already verified
    if (user.email_verified) {
      console.log("[DEBUG] verify-email: Email already verified. Redirecting to login.");
      return NextResponse.redirect(`${siteUrl}/login?verified=already&email=${encodeURIComponent(user.email)}`);
    }

    // Check if token has expired
    if (user.verification_token_expires_at) {
      const expires = new Date(user.verification_token_expires_at).getTime();
      const isExpired = expires < Date.now();
      console.log("[DEBUG] verify-email: Token expired:", isExpired);
      if (isExpired) {
        console.warn("Verification error - token expired for user:", user.email);
        return NextResponse.redirect(`${siteUrl}/verify-email/error?reason=token_expired&email=${encodeURIComponent(user.email)}`);
      }
    }

    // Update user record: mark email as verified and clear token fields
    const { error: updateError } = await supabase
      .from("users")
      .update({
        email_verified: true,
        verification_token_hash: null,
        verification_token_expires_at: null,
        verification_sent_at: null,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Failed to update verified status:", updateError);
      return NextResponse.redirect(`${siteUrl}/verify-email/error?reason=verification_failed`);
    }

    console.log("[DEBUG] verify-email: Verification successful. Redirecting to login.");
    return NextResponse.redirect(`${siteUrl}/login?verified=true&email=${encodeURIComponent(user.email)}`);
  } catch (error) {
    console.error("Verify email route error:", error);
    return NextResponse.redirect(`${siteUrl}/verify-email/error?reason=verification_failed`);
  }
}
