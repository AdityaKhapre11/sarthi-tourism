"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Mail, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function VerifyEmailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");
  const redirectUrl = searchParams.get("redirect") || "/login";

  const [email, setEmail] = useState(emailParam || "");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [error, setError] = useState("");

  const token = otp.join("");
  
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const digit = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (digit !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim().replace(/[^0-9]/g, "");
    if (!pastedData) return;
    const newOtp = [...otp];
    for (let i = 0; i < Math.min(6, pastedData.length); i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    const focusIndex = Math.min(5, pastedData.length);
    if (focusIndex < 6 && pastedData.length < 6) {
      inputRefs.current[focusIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const supabase = createClient();

  useEffect(() => {
    // If we have a cooldown, tick it down every second
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const verifySubmit = async (tokenToVerify: string) => {
    if (!email || !tokenToVerify) {
      setError("Please enter both email and the 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: tokenToVerify }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Invalid or expired verification code.");
        setLoading(false);
        return;
      }

      toast.success("Email verified successfully! Please log in.");
      
      // Redirect to login with email pre-filled
      const loginUrl = new URL("/login", window.location.origin);
      loginUrl.searchParams.set("email", email);
      if (redirectUrl && redirectUrl !== "/login") {
        loginUrl.searchParams.set("redirect", redirectUrl);
      }
      router.push(loginUrl.toString());
      
    } catch {
      setError("An unexpected error occurred during verification.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentToken = otp.join("");
    if (currentToken.length === 6 && email && !loading) {
      verifySubmit(currentToken);
    }
  }, [otp]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    verifySubmit(token);
  };

  const handleResend = async () => {
    if (!email) {
      setError("Please provide an email address first.");
      return;
    }

    if (cooldown > 0) return;

    setResending(true);
    setError("");

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to resend verification email.");
      } else {
        toast.success("Verification email sent! Please check your inbox.");
        setCooldown(60);
      }
    } catch {
      setError("An unexpected error occurred while resending the email.");
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    // Hide scrollbar globally for the auth page to allow clean native document scrolling
    document.documentElement.style.scrollbarWidth = 'none';
    const style = document.createElement('style');
    style.id = 'auth-hide-scrollbar';
    style.innerHTML = `
      body::-webkit-scrollbar { display: none !important; }
      html::-webkit-scrollbar { display: none !important; }
    `;
    document.head.appendChild(style);

    return () => {
      document.documentElement.style.scrollbarWidth = '';
      const existing = document.getElementById('auth-hide-scrollbar');
      if (existing) existing.remove();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row w-full bg-background text-foreground font-sans selection:bg-primary/30 selection:text-white">
      {/* Left Side - Image/Branding */}
      <div className="hidden lg:flex w-full lg:w-1/2 relative flex-col justify-center items-center overflow-hidden border-r border-white/5 p-12 lg:sticky lg:top-0 lg:h-screen">
        <div className="absolute inset-0">
          <Image
            src="/images/dubai.png"
            alt="Beautiful destination"
            fill
            className="object-cover opacity-40 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background" />
        </div>

        <div className="relative z-10 w-full max-w-sm flex justify-center items-center">
          <Image
            src="/images/logo1.png"
            alt="Sarthi Tourism"
            width={1000}
            height={600}
            className="object-contain mix-blend-screen opacity-90 w-full h-auto"
            priority
          />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-start p-8 sm:p-12 lg:p-24 relative overflow-x-hidden min-h-screen">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md relative z-10 mx-auto">
          <div className="mb-10 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start w-full mb-6">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]">
                <Mail className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">Verify your email</h2>
            <p className="text-gray-400 text-lg">
              We've sent a 6-digit verification code to <br className="hidden lg:block"/>
              <span className="font-semibold text-white">{email || "your email address"}</span>
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-sm mb-8 border border-red-500/20 flex flex-col gap-3 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            {!emailParam && (
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Email Address</label>
                <div className="relative group">
                  <input
                    type="email"
                    required
                    className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-300 text-white placeholder-gray-600 backdrop-blur-xl hover:bg-white/[0.05]"
                    placeholder="johndoe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider text-center lg:text-left">6-Digit Code</label>
              <div className="flex justify-between gap-2 sm:gap-4 mt-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    autoFocus={index === 0}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                    className="w-10 h-12 sm:w-14 sm:h-16 bg-white/[0.03] border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-300 text-white backdrop-blur-xl hover:bg-white/[0.05] text-center text-xl sm:text-2xl font-bold"
                  />
                ))}
              </div>
            </div>

            <div className="h-8">
              {/* Spacer to maintain layout height after removing verify button, or show loading state if verifying */}
              {loading && (
                <div className="w-full h-full flex items-center justify-center text-blue-500 font-semibold gap-2">
                  <Loader2 className="animate-spin h-5 w-5" />
                  Verifying...
                </div>
              )}
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Didn't receive the code?</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={resending || cooldown > 0}
                className="text-sm font-semibold text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Email"}
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Entered the wrong email?</span>
              <Link href="/register" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                Change Email
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
