"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui";

export default function VerifyEmailSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      {/* Background styling to match the site's aesthetic */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10 mx-auto text-center backdrop-blur-xl bg-white/[0.02] border border-white/10 p-8 sm:p-12 rounded-3xl shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">Email Verified!</h1>
        
        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
          Your email has been verified successfully. You can now log in to your Sarthi Tourism account and start exploring our packages.
        </p>

        <Link href="/login" className="block w-full">
          <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-lg py-6 rounded-2xl transition-all shadow-[0_10px_30px_-10px_rgba(5,150,105,0.6)] hover:shadow-[0_20px_40px_-10px_rgba(5,150,105,0.8)] h-auto">
            Go to Login
          </Button>
        </Link>
      </div>
    </div>
  );
}
