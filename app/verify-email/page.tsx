import { Suspense } from "react";
import VerifyEmailClient from "./VerifyEmailClient";

export const metadata = {
  title: "Verify Email",
  description: "Verify your Sarthi Tourism account",
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-white">Loading...</div>}>
      <VerifyEmailClient />
    </Suspense>
  );
}
