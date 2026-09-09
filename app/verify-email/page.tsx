import { Suspense } from "react";
import VerifyEmailClient from "./VerifyEmailClient";

export const metadata = {
  title: "Verify Your Email Address | Sarthi Tourism Travel Portal",
  description: "Verify your email address to activate your Sarthi Tourism account and confirm your tour bookings.",
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-white">Loading...</div>}>
      <VerifyEmailClient />
    </Suspense>
  );
}
