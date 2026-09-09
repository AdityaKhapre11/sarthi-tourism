import { Suspense } from "react";
import ForgotPasswordIndex from "./ForgotPasswordClient";
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Forgot Password | Reset Your Sarthi Tourism Account",
  description: "Recover access to your Sarthi Tourism account. Request a secure password reset link for your travel portal.",
  path: "/forgot-password",
});

export default function ForgotPassword() {
  return (
    <Suspense>
      <ForgotPasswordIndex />
    </Suspense>
  );
}
