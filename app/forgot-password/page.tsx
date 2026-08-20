import { Suspense } from "react";
import ForgotPasswordIndex from "./ForgotPasswordClient";
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Forgot Password",
  description: "Reset your Sarthi Tourism account password.",
  path: "/forgot-password",
});

export default function ForgotPassword() {
  return (
    <Suspense>
      <ForgotPasswordIndex />
    </Suspense>
  );
}
