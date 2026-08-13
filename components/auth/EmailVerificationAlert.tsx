"use client";

import { useState, useEffect } from "react";
import { Loader2, Mail, AlertTriangle, CheckCircle2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui";

interface EmailVerificationAlertProps {
  email: string;
}

export function EmailVerificationAlert({ email }: EmailVerificationAlertProps) {
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResend = async () => {
    if (!email) {
      toast.error("Please enter your email address first.");
      return;
    }
    if (resendCooldown > 0 || loading) return;

    setLoading(true);
    setSuccess(false);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        toast.success(data.message || "Verification email sent. Please check your inbox.");
        setResendCooldown(60);
      } else {
        toast.error(data.error || "Failed to resend verification email.");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl mb-8 flex flex-col gap-3 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-500" />
          <div className="flex-1">
            <h3 className="font-semibold text-sm text-emerald-300">Verification email sent successfully!</h3>
            <p className="text-sm mt-1 opacity-90">
              Please check your inbox at <span className="font-medium text-white">{email}</span>.
            </p>
          </div>
        </div>
        {resendCooldown > 0 && (
          <div className="text-xs font-medium opacity-80 pl-8">
            Didn&apos;t receive it? Resend available in {resendCooldown}s
          </div>
        )}
        {resendCooldown === 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResend}
            disabled={loading}
            className="w-full mt-2 hover:bg-emerald-500/10 text-emerald-400 justify-start h-9 px-3 transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
            {loading ? "Sending..." : "Send it again"}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-5 rounded-xl mb-8 flex flex-col gap-4 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5 text-amber-500" />
        <div className="flex-1">
          <h3 className="font-semibold text-base text-amber-300">Email Verification Required</h3>
          <p className="text-sm mt-1 opacity-90">
            Please verify your email address before logging in.
          </p>
        </div>
      </div>
      
      <Button
        type="button"
        onClick={handleResend}
        disabled={loading || resendCooldown > 0}
        className="w-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 hover:border-amber-500/50 shadow-sm transition-all duration-300 h-11 group active:scale-[0.98]"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Sending...
          </>
        ) : resendCooldown > 0 ? (
          <>
            <Mail className="w-5 h-5 mr-2 opacity-50" />
            Resend available in {resendCooldown}s
          </>
        ) : (
          <>
            <Mail className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Resend Verification Email
          </>
        )}
      </Button>
    </div>
  );
}
