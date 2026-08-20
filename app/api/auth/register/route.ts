import { NextResponse } from "next/server";
import { createClient as createPublicClient } from "@supabase/supabase-js";
import { sendOtpEmail } from "@/lib/email/nodemailer";
import crypto from "crypto";

// Helper to hash OTP for storage
function hashOtp(otp: string) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const supabase = createPublicClient(supabaseUrl, supabaseAnonKey);
    const adminClient = createPublicClient(supabaseUrl, supabaseServiceRoleKey);

    // 1. Sign up user via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        data: {
          full_name: fullName || "",
        },
      },
    });

    if (authError || !authData.user) {
      console.error("Supabase signUp error:", authError);
      let errorMsg = authError?.message || "Registration failed. Please try again.";
      if (errorMsg.includes("already registered")) {
        errorMsg = "An account with this email already exists.";
      }
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 400 }
      );
    }

    const userId = authData.user.id;

    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = hashOtp(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    // 3. Store OTP in public.users
    try {
      await adminClient.from("users").update({
        email_verified: false,
        otp: hashedOtp,
        otp_expires_at: expiresAt,
        verification_sent_at: new Date().toISOString(),
      }).eq("id", userId);
    } catch (dbErr) {
      console.warn("Public users table update warning:", dbErr);
    }

    // 4. Send OTP via Nodemailer
    await sendOtpEmail({
      to: email.toLowerCase().trim(),
      name: fullName || email.split("@")[0],
      otp,
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully. Please check your email for the verification code.",
    });
  } catch (error: unknown) {
    console.error("Registration route error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during registration." },
      { status: 500 }
    );
  }
}
