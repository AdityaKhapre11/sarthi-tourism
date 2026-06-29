"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Client-side check to prevent seeing the login page via browser back button after logging in
    if (document.cookie.includes("admin_auth=true")) {
      window.location.replace("/admin/dashboard");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/admin/dashboard");
      } else {
        setError(data.message || "Invalid email or password");
        setLoading(false);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="h-[100vh] overflow-hidden flex w-full bg-[#030712] text-gray-200 font-sans selection:bg-blue-500 selection:text-white">

      {/* Left Side - Image/Branding */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-center items-center overflow-hidden border-r border-white/5 p-12">
        <div className="absolute inset-0">
          <Image
            src="/images/dubai.png"
            alt="Beautiful destination"
            fill
            className="object-cover opacity-40 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#030712]" />
        </div>

        <div className="relative z-10 w-full max-w-2xl flex justify-center items-center">
          {/* Desktop Logo */}
          <Image
            src="/images/logo11.png"
            alt="Sarthi Tourism"
            width={1000}
            height={600}
            className="object-contain invert grayscale brightness-200 mix-blend-screen opacity-90 w-full h-auto scale-110"
            priority
          />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-start p-8 sm:p-12 lg:p-24 relative overflow-hidden pt-20 lg:pt-32">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md relative z-10 mx-auto">
          <div className="mb-10">
            {/* Mobile Logo */}
            <Image
              src="/images/logo11.png"
              alt="Sarthi Tourism"
              width={260}
              height={54}
              className="object-contain invert grayscale brightness-200 mix-blend-screen opacity-90 mb-10 lg:hidden"
            />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">Welcome Back</h2>
            <p className="text-gray-400 text-lg">Please sign in to your admin account.</p>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-sm mb-8 border border-red-500/20 flex items-center backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300">
              <svg className="w-5 h-5 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
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
                  type="password"
                  required
                  className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-300 text-white placeholder-gray-600 backdrop-blur-xl hover:bg-white/[0.05]"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
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
          </form>
        </div>
      </div>
    </div>
  );
}
