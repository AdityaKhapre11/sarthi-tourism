import { Suspense } from "react";
import AdminLoginIndex from "./index";
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Sign In to Your Account | Sarthi Tourism Travel Portal",
  description: "Sign in to your Sarthi Tourism account to manage your tour bookings, itineraries, and personalized travel services.",
  path: "/login",
});

export default function AdminLogin() {
  return (
    <Suspense>
      <AdminLoginIndex />
    </Suspense>
  );
}
