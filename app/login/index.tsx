"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { Loader } from "@/components/ui";
import { toast } from "sonner";

export default function AdminLoginIndex() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Validate redirect URL
  let redirectUrl = searchParams.get("redirect");
  if (!redirectUrl || !redirectUrl.startsWith("/") || redirectUrl.startsWith("//")) {
    redirectUrl = "/admin/dashboard";
  }

  // Initialize Supabase client
  const supabase = createClient();

  useEffect(() => {
    // Check for error parameters
    const errParam = searchParams.get("error");
    if (errParam === "admin_required") {
      setError("Access denied. Admin account required.");
    } else if (errParam === "verification_failed") {
      setError("Email verification failed. The link may have expired.");
    }
    
    // Check for registration success
    const registered = searchParams.get("registered");
    if (registered === "true") {
      setSuccessMsg("Registration successful. Please check your email and verify your account before logging in.");
      window.history.replaceState(null, "", pathname || "/login");
    }

    // Check for success verification
    const verified = searchParams.get("verified");
    if (verified === "true") {
      toast.success("Email verified successfully. You can now log in.");
      // Clear URL parameter so it doesn't show again on refresh
      window.history.replaceState(null, "", pathname || "/login");
    }

    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        if (!user.email_confirmed_at) {
          await supabase.auth.signOut();
          return;
        }
        // Middleware will handle proper role-based redirection, but we can fallback
        window.location.replace(redirectUrl);
      }
    };
    checkUser();
  }, [supabase.auth, redirectUrl, searchParams, pathname]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendVerification = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/login?verified=true`
      }
    });

    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Verification email sent!");
      setResendCooldown(60);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.toLowerCase().includes("email not confirmed")) {
          setError("Please verify your email address before logging in.");
        } else {
          setError(error.message);
        }
        setLoading(false);
        return;
      }

      if (data.user) {
        // Enforce email verification manually just in case
        if (!data.user.email_confirmed_at) {
          await supabase.auth.signOut();
          setError("Please verify your email address before logging in.");
          setLoading(false);
          return;
        }

        // Fetch user role using maybeSingle to avoid crash if no row exists yet (for older accounts)
        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("role")
          .eq("id", data.user.id)
          .maybeSingle();

        if (profileError) {
          setError("Failed to verify account permissions.");
          setLoading(false);
          return;
        }

        const role = profile?.role || "user";
        toast.success("Login successful.");
        
        if (role === "admin") {
          router.push(redirectUrl);
        } else {
          // If non-admin tries to access admin route, send to home
          if (redirectUrl.startsWith("/admin")) {
            router.push("/");
          } else {
            router.push(redirectUrl);
          }
        }
        router.refresh();
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };


  return (
    <div className="h-[100vh] overflow-hidden flex w-full bg-background text-foreground font-sans selection:bg-primary/30 selection:text-white">

      {/* Left Side - Image/Branding */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-center items-center overflow-hidden border-r border-white/5 p-12">
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
          {/* Desktop Logo */}
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
      <div className="w-full lg:w-1/2 flex flex-col justify-start p-8 sm:p-12 lg:p-24 relative lg:overflow-hidden overflow-y-auto pt-20 lg:pt-32">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md relative z-10 mx-auto">
          <div className="mb-10">
            {/* Mobile Logo */}
            <Image
              src="/images/logo1.png"
              alt="Sarthi Tourism"
              width={220}
              height={46}
              className="object-contain mix-blend-screen opacity-90 mb-10 lg:hidden"
            />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">Welcome Back</h2>
            <p className="text-gray-400 text-lg">Please sign in to your account.</p>
          </div>

          {successMsg && (
            <div className="bg-green-500/10 text-green-400 p-4 rounded-xl text-sm mb-8 border border-green-500/20 flex flex-col gap-3 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {successMsg}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-sm mb-8 border border-red-500/20 flex flex-col gap-3 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
              {error === "Please verify your email address before logging in." && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResendVerification}
                  disabled={loading || resendCooldown > 0}
                  className="w-full bg-white/5 hover:bg-white/10 text-white border-white/10 mt-1"
                >
                  {resendCooldown > 0 ? `Resend email in ${resendCooldown}s` : "Resend Verification Email"}
                </Button>
              )}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Email Address</label>
              <div className="relative group">
                <input
                  type="email"
                  required
                  className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-300 text-white placeholder-gray-600 backdrop-blur-xl hover:bg-white/[0.05]"
                  placeholder="admin@sarthitourism.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-5 py-4 pr-12 bg-white/[0.03] border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-300 text-white placeholder-gray-600 backdrop-blur-xl hover:bg-white/[0.05]"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-lg py-5 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 shadow-[0_10px_40px_-10px_rgba(37,99,235,0.6)] hover:shadow-[0_20px_40px_-10px_rgba(37,99,235,0.8)] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none h-auto"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Authenticating...
                </span>
              ) : "Sign In"}
            </Button>

            <div className="mt-6 text-center">
              <span className="text-gray-400 text-sm">
                Don't have an account?{" "}
                <Link href={`/register${redirectUrl !== "/admin/dashboard" ? `?redirect=${redirectUrl}` : ""}`} className="text-blue-500 hover:text-blue-400 font-semibold transition-colors">
                  Sign Up
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}