"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function RegisterIndex() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Validate redirect URL
  let redirectUrl = searchParams.get("redirect");
  if (!redirectUrl || !redirectUrl.startsWith("/") || redirectUrl.startsWith("//")) {
    redirectUrl = "/";
  }

  // Initialize Supabase client
  const supabase = createClient();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        window.location.replace(redirectUrl);
      }
    };
    checkUser();
  }, [supabase.auth, redirectUrl]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!fullName.trim()) {
      setError("Full Name is required");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        console.error("Supabase signup error:", error);
        if (error.message && typeof error.message === "string") {
          if (error.message.includes("already registered")) {
            setError("An account with this email already exists.");
          } else if (error.message === "{}") {
            // Supabase sometimes returns an empty object string for database trigger errors
            setError("Registration failed. Please check your details or try again later.");
          } else {
            setError(error.message);
          }
        } else {
          setError("An unexpected error occurred during registration.");
        }
        setLoading(false);
        return;
      }

      if (data.user) {
        if (data.session) {
          // Explicitly handle the flow so the user is not treated as logged in
          await supabase.auth.signOut();
        }
        toast.success("Account created successfully. Please verify your email from Gmail before logging in.");
        router.push("/login?registered=true");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100vh] overflow-y-auto lg:overflow-hidden flex w-full bg-background text-foreground font-sans selection:bg-primary/30 selection:text-white">
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
      <div className="w-full lg:w-1/2 flex flex-col justify-start p-8 sm:p-12 lg:p-24 relative lg:overflow-hidden overflow-y-auto lg:pt-20 xl:pt-28">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md relative z-10 mx-auto pb-8 lg:pb-0">
          <div className="mb-8">
            {/* Mobile Logo */}
            <Image
              src="/images/logo1.png"
              alt="Sarthi Tourism"
              width={220}
              height={46}
              className="object-contain mix-blend-screen opacity-90 mb-10 lg:hidden"
            />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">Create Account</h2>
            <p className="text-gray-400 text-lg">Sign up to get started.</p>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-sm mb-8 border border-red-500/20 flex items-center backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300">
              <svg className="w-5 h-5 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Full Name</label>
              <div className="relative group">
                <input
                  type="text"
                  required
                  className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-300 text-white placeholder-gray-600 backdrop-blur-xl hover:bg-white/[0.05]"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Confirm Password</label>
              <div className="relative group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="w-full px-5 py-4 pr-12 bg-white/[0.03] border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-300 text-white placeholder-gray-600 backdrop-blur-xl hover:bg-white/[0.05]"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                  Creating Account...
                </span>
              ) : "Sign Up"}
            </Button>
            
            <div className="mt-6 text-center">
              <span className="text-gray-400 text-sm">
                Already have an account?{" "}
                <Link href={`/login${redirectUrl !== "/" ? `?redirect=${redirectUrl}` : ""}`} className="text-blue-500 hover:text-blue-400 font-semibold transition-colors">
                  Login
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
