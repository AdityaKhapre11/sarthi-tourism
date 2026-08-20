"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { EmailVerificationAlert } from "@/components/auth/EmailVerificationAlert";

export default function AdminLoginIndex() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [email, setEmail] = useState(() => searchParams.get("email") || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(() => {
    const errParam = searchParams.get("error");
    if (errParam === "admin_required") return "Access denied. Admin account required.";
    if (errParam === "verification_failed") return "Email verification failed. The link may have expired.";
    return "";
  });
  const [successMsg] = useState(() => {
    return searchParams.get("registered") === "true"
      ? "Registration successful. Please check your email and verify your account before logging in."
      : "";
  });
  const [loading, setLoading] = useState(false);

  // Validate redirect URL
  let redirectUrl = searchParams.get("redirect");
  if (!redirectUrl || !redirectUrl.startsWith("/") || redirectUrl.startsWith("//")) {
    redirectUrl = "/admin/dashboard";
  }

  // Initialize Supabase client
  const supabase = createClient();

  useEffect(() => {
    // Check for registration success - clear URL state if present
    if (searchParams.get("registered") === "true") {
      window.history.replaceState(null, "", pathname || "/login");
    }

    // Check for success verification
    const verified = searchParams.get("verified");
    if (verified === "true") {
      toast.success("Email verified successfully. You can now log in.");
      window.history.replaceState(null, "", pathname || "/login");
    } else if (verified === "already") {
      toast.success("Your email is already verified. You can log in.");
      window.history.replaceState(null, "", pathname || "/login");
    }

    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch role before checking email confirmation
        const { data: profile } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();
        const role = profile?.role || "user";

        if (!user.email_confirmed_at && role !== "admin") {
          await supabase.auth.signOut();
          return;
        }
        // Middleware will handle proper role-based redirection, but we can fallback
        window.location.replace(redirectUrl);
      }
    };
    checkUser();
  }, [supabase, supabase.auth, redirectUrl, searchParams, pathname]);

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
        // Fetch user profile from public.users to check role
        const { data: profile } = await supabase
          .from("users")
          .select("role")
          .eq("id", data.user.id)
          .maybeSingle();

        // 1. Determine role FIRST
        const role = profile?.role || "user";

        // 2. Enforce email verification ONLY for non-admin users
        if (role !== "admin" && !data.user.email_confirmed_at) {
          await supabase.auth.signOut();
          router.push(`/verify-email?email=${encodeURIComponent(email)}`);
          return;
        }

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
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] overflow-hidden flex w-full bg-background text-foreground font-sans selection:bg-primary/30 selection:text-white">

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
      <div className="w-full lg:w-1/2 flex flex-col justify-start p-8 sm:p-12 lg:p-24 relative lg:overflow-hidden overflow-y-auto overflow-x-hidden pt-20 lg:pt-32">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md relative z-10 mx-auto">
          <div className="mb-10">
            {/* Mobile Logo */}
            <div className="flex justify-center w-full lg:hidden mb-10">
              <Image
                src="/images/logo1.png"
                alt="Sarthi Tourism"
                width={220}
                height={46}
                className="object-contain mix-blend-screen opacity-90"
              />
            </div>
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

          {error && error === "Please verify your email address before logging in." ? (
            <EmailVerificationAlert email={email} />
          ) : error ? (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-sm mb-8 border border-red-500/20 flex flex-col gap-3 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          ) : null}

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
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">Password</label>
                <Link href="/forgot-password" className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors cursor-pointer">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoFocus={!!searchParams.get("email")}
                  className="w-full px-5 py-4 pr-12 bg-white/[0.03] border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-300 text-white placeholder-gray-600 backdrop-blur-xl hover:bg-white/[0.05]"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors focus:outline-none"
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
                Don&apos;t have an account?{" "}
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