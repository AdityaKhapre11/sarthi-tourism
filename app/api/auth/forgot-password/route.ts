import { NextResponse } from "next/server";
import { createClient as createPublicClient } from "@supabase/supabase-js";
import { sendPasswordResetEmail } from "@/lib/email/nodemailer";

export async function POST(request: Request) {
  try {
    const { email, origin } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email address is required." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    // Use admin client to generate the recovery link bypassing RLS
    const adminClient = createPublicClient(supabaseUrl, supabaseServiceRoleKey);

    // Get user details to personalize the email if possible
    const { data: userData } = await adminClient
      .from('users')
      .select('full_name')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    const userName = userData?.full_name || email.split("@")[0];

    const baseUrl = origin || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Generate the recovery link
    const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
      type: "recovery",
      email: email.toLowerCase().trim(),
    });

    if (linkError || !linkData?.properties?.action_link) {
      console.error("[API/forgot-password] Error generating link:", linkError);
      return NextResponse.json({
        success: true,
        message: "If an account exists, a password reset link has been sent.",
      });
    }

    // Extract the token from the generated action_link
    const actionUrl = new URL(linkData.properties.action_link);
    const tokenHash = actionUrl.searchParams.get("token");

    // Construct our own direct reset URL that bypasses Supabase's verify endpoint
    // so we can manually handle the PKCE flow using verifyOtp on the client.
    const resetUrl = `${baseUrl}/reset-password?token_hash=${tokenHash}`;

    // Send the email via Nodemailer
    const emailSent = await sendPasswordResetEmail({
      to: email.toLowerCase().trim(),
      name: userName,
      resetUrl,
    });

    if (!emailSent) {
      return NextResponse.json(
        { success: false, error: "Failed to send the reset email. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists, a password reset link has been sent.",
    });
  } catch (error: unknown) {
    console.error("[API/forgot-password] route error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
