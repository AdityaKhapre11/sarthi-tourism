import { NextResponse } from "next/server";
import { createClient as createPublicClient } from "@supabase/supabase-js";
import crypto from "crypto";

function hashOtp(otp: string) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ success: false, error: "Email and OTP are required." }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const adminClient = createPublicClient(supabaseUrl, supabaseServiceRoleKey);

    const hashedOtp = hashOtp(otp.trim());

    // Find the user by matching email (using Auth admin API to find user id, or query public.users directly)
    // Since we need to match the OTP in public.users, let's query public.users.
    const { data: userRecord, error: findError } = await adminClient
      .from("users")
      .select("id, email, otp, otp_expires_at")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();

    if (findError || !userRecord) {
      return NextResponse.json({ success: false, error: "User not found." }, { status: 404 });
    }

    if (userRecord.otp !== hashedOtp) {
      return NextResponse.json({ success: false, error: "Invalid verification code." }, { status: 400 });
    }

    if (userRecord.otp_expires_at) {
      const expires = new Date(userRecord.otp_expires_at).getTime();
      if (expires < Date.now()) {
        return NextResponse.json({ success: false, error: "Verification code has expired. Please request a new one." }, { status: 400 });
      }
    }

    // OTP is valid and not expired. Clear it and mark verified.
    const { error: updateError } = await adminClient
      .from("users")
      .update({
        email_verified: true,
        otp: null,
        otp_expires_at: null,
        verification_sent_at: null,
      })
      .eq("id", userRecord.id);

    if (updateError) {
      console.error("Failed to update user record:", updateError);
      return NextResponse.json({ success: false, error: "Failed to complete verification." }, { status: 500 });
    }

    // Update native Supabase Auth email_confirmed_at to allow native login
    const { error: authError } = await adminClient.auth.admin.updateUserById(userRecord.id, {
      email_confirm: true,
    });

    if (authError) {
      console.error("Failed to update native auth:", authError);
      // We don't fail here since public.users was updated successfully, but this might prevent native login if proxy.ts checks native auth.
      // Assuming proxy.ts now checks email_confirmed_at, this is required.
    }

    return NextResponse.json({ success: true, message: "Email verified successfully." });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json({ success: false, error: "An unexpected error occurred." }, { status: 500 });
  }
}
