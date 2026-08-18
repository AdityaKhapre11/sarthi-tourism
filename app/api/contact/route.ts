import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email/nodemailer";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    // Basic server-side validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Name, email, subject, and message are required fields." },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address format." },
        { status: 400 }
      );
    }

    // Message word count validation
    const countWords = (text: string) => text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    if (countWords(message) > 500) {
      return NextResponse.json(
        { error: "Message cannot exceed 200 words." },
        { status: 400 }
      );
    }

    // Phone format validation
    if (phone && phone.length !== 13) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const supabase = await createClient();
    const { error: dbError } = await supabase.from("inquiries").insert([
      {
        full_name: name,
        email,
        phone: phone || null,
        subject,
        message,
      },
    ]);

    if (dbError) {
      console.error("[Contact API Error - Supabase]:", dbError);
      return NextResponse.json(
        { error: "Failed to save your message. Please try again later." },
        { status: 500 }
      );
    }

    // Call Nodemailer logic (non-blocking for the user if it fails)
    const success = await sendContactEmail({
      name,
      email,
      phone,
      subject,
      message,
    });

    if (!success) {
      console.error("[Contact API Error - Nodemailer]: Failed to send notification email. Database insertion was successful.");
      // We still return 200 because the inquiry was successfully stored in the database.
      // This prevents the user from clicking Submit again and creating duplicate database records.
    }

    return NextResponse.json(
      { message: "Contact message sent successfully!" },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error("[Contact API Error]:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
