import { Suspense } from "react";
import AdminLoginIndex from "./index";
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Login",
  description: "Sign in to your Sarthi Tourism account to manage bookings and access personalized travel services.",
  path: "/login",
});

export default function AdminLogin() {
  return (
    <Suspense>
      <AdminLoginIndex />
    </Suspense>
  );
}
