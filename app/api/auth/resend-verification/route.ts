import { NextResponse } from "next/server";
import { createClient as createPublicClient } from "@supabase/supabase-js";
import { generateVerificationToken } from "@/lib/auth/verification";
import { sendVerificationEmail } from "@/lib/email/nodemailer";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email address is required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const supabase = createPublicClient(supabaseUrl, supabaseServiceRoleKey);

    // Query user in public.users
    const { data: user } = await supabase
      .from("users")
      .select("id, email, full_name, email_verified, verification_sent_at")
      .eq("email", cleanEmail)
      .maybeSingle();

    const genericSuccess = {
      success: true,
      message: "If an unverified account exists with that email address, a verification link has been sent.",
    };

    if (!user) {
      return NextResponse.json(genericSuccess);
    }

    if (user.email_verified) {
      return NextResponse.json({
        success: true,
        message: "Your email is already verified. You can log in directly.",
      });
    }

    // Cooldown check (60 seconds)
    if (user.verification_sent_at) {
      const lastSent = new Date(user.verification_sent_at).getTime();
      const now = Date.now();
      const cooldownMs = 60 * 1000;

      if (now - lastSent < cooldownMs) {
        const remainingSec = Math.ceil((cooldownMs - (now - lastSent)) / 1000);
        return NextResponse.json(
          {
            success: false,
            error: `Please wait ${remainingSec} seconds before requesting another verification email.`,
            remainingSec,
          },
          { status: 429 }
        );
      }
    }

    // Generate new secure token
    const { rawToken, hashedToken, expiresAt } = generateVerificationToken();

    // Update database token fields
    await supabase
      .from("users")
      .update({
        verification_token_hash: hashedToken,
        verification_token_expires_at: expiresAt,
        verification_sent_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    // Send email via Nodemailer
    await sendVerificationEmail({
      to: user.email,
      name: user.full_name || user.email.split("@")[0],
      token: rawToken,
    });

    return NextResponse.json(genericSuccess);
  } catch (error) {
    console.error("Resend verification route error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while resending verification email." },
      { status: 500 }
    );
  }
}
