"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const email = searchParams.get("email");

  let title = "Verification Failed";
  let message = "We could not verify your email address. The link may be invalid or has expired.";

  if (reason === "missing_token") {
    title = "Invalid Link";
    message = "The verification link is incomplete or missing its security token.";
  } else if (reason === "invalid_token") {
    title = "Invalid or Used Link";
    message = "This verification link is invalid. It may have already been used to verify your account.";
  } else if (reason === "token_expired") {
    title = "Link Expired";
    message = `This verification link has expired. Please request a new one${email ? ` for ${email}` : ""}.`;
  } else if (reason === "already_verified") {
    title = "Email Already Verified";
    message = "Your email address has already been verified.";
  } else if (reason === "verification_failed") {
    title = "Verification Error";
    message = "An unexpected error occurred while verifying your account. Please try again or request a new link.";
  }

  return (
    <div className="w-full max-w-md relative z-10 mx-auto text-center backdrop-blur-xl bg-white/[0.02] border border-white/10 p-8 sm:p-12 rounded-3xl shadow-2xl">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/30">
          {reason === "token_expired" ? (
            <AlertCircle className="w-10 h-10 text-red-400" />
          ) : (
            <XCircle className="w-10 h-10 text-red-400" />
          )}
        </div>
      </div>

      <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>
      
      <p className="text-gray-400 text-lg mb-8 leading-relaxed">
        {message}
      </p>

      <Link href="/login" className="block w-full">
        <Button className="w-full bg-red-600/20 border border-red-500/50 hover:bg-red-600/40 text-red-100 font-semibold text-lg py-6 rounded-2xl transition-all h-auto">
          Return to Login
        </Button>
      </Link>
    </div>
  );
}

export default function VerifyEmailErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      {/* Background styling */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 blur-[100px] rounded-full pointer-events-none" />

      <Suspense fallback={<div className="w-full max-w-md h-[400px] bg-white/[0.02] border border-white/10 rounded-3xl animate-pulse" />}>
        <ErrorContent />
      </Suspense>
    </div>
  );
}
