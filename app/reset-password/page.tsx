import { Suspense } from "react";
import ResetPasswordIndex from "./ResetPasswordClient";
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Reset Password | Secure Your Sarthi Tourism Account",
  description: "Set a strong, secure new password for your Sarthi Tourism account to manage bookings and trips safely.",
  path: "/reset-password",
});

export default function ResetPassword() {
  return (
    <Suspense>
      <ResetPasswordIndex />
    </Suspense>
  );
}
