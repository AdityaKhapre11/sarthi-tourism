import { NextResponse } from "next/server";
import { createClient as createPublicClient } from "@supabase/supabase-js";
import { sendOtpEmail } from "@/lib/email/nodemailer";
import crypto from "crypto";

function hashOtp(otp: string) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required." }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const adminClient = createPublicClient(supabaseUrl, supabaseServiceRoleKey);

    const { data: userRecord, error: findError } = await adminClient
      .from("users")
      .select("id, full_name, email")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();

    if (findError || !userRecord) {
      return NextResponse.json({ success: false, error: "User not found." }, { status: 404 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = hashOtp(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error: updateError } = await adminClient
      .from("users")
      .update({
        otp: hashedOtp,
        otp_expires_at: expiresAt,
        verification_sent_at: new Date().toISOString(),
      })
      .eq("id", userRecord.id);

    if (updateError) {
      console.error("Failed to update user record for resend:", updateError);
      return NextResponse.json({ success: false, error: "Failed to generate new code." }, { status: 500 });
    }

    await sendOtpEmail({
      to: userRecord.email,
      name: userRecord.full_name || userRecord.email.split("@")[0],
      otp,
    });

    return NextResponse.json({ success: true, message: "A new verification code has been sent." });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json({ success: false, error: "An unexpected error occurred." }, { status: 500 });
  }
}
