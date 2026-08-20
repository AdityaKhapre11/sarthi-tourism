import { Suspense } from "react";
import ResetPasswordIndex from "./ResetPasswordClient";
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Reset Password",
  description: "Set a new password for your Sarthi Tourism account.",
  path: "/reset-password",
});

export default function ResetPassword() {
  return (
    <Suspense>
      <ResetPasswordIndex />
    </Suspense>
  );
}
