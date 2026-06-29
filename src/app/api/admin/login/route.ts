import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (email === "admin@sarthitourism.com" && password === "Admin@123") {
      const response = NextResponse.json({ success: true });
      response.cookies.set({
        name: "admin_auth",
        value: "true",
        path: "/",
        maxAge: 86400, // 1 day
        httpOnly: false, // Explicitly false so the client side can read it
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      return response;
    }

    return NextResponse.json(
      { success: false, message: "Invalid email or password" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
