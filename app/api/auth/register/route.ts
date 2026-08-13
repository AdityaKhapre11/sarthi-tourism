import { NextResponse } from "next/server";
import { createClient as createPublicClient } from "@supabase/supabase-js";
import { generateVerificationToken } from "@/lib/auth/verification";
import { sendVerificationEmail } from "@/lib/email/nodemailer";

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

    // Use standard public Supabase client so registration works in all environments
    const supabase = createPublicClient(supabaseUrl, supabaseAnonKey);
    // Use admin client for database updates to bypass RLS during unauthenticated signup
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

    // 2. Generate secure verification token
    const { rawToken, hashedToken, expiresAt } = generateVerificationToken();
    console.log("[DEBUG] register: Token generated: yes");
    console.log("[DEBUG] register: Token hash generated: yes");
    console.log("[DEBUG] register: User ID:", userId);

    // 3. Create or update user row in public.users
    try {
      const { error: updateError } = await adminClient.from("users").update({
        email_verified: false,
        verification_token_hash: hashedToken,
        verification_token_expires_at: expiresAt,
        verification_sent_at: new Date().toISOString(),
      }).eq("id", userId);
      
      if (updateError) {
        console.error("[DEBUG] register: Admin users table update failed:", updateError);
      } else {
        console.log("[DEBUG] register: Admin update succeeded.");
      }
    } catch (dbErr) {
      console.warn("Public users table update warning:", dbErr);
    }

    // 4. Send verification email via Nodemailer
    await sendVerificationEmail({
      to: email.toLowerCase().trim(),
      name: fullName || email.split("@")[0],
      token: rawToken,
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully. Please check your email to verify your account.",
    });
  } catch (error: unknown) {
    console.error("Registration route error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during registration." },
      { status: 500 }
    );
  }
}
