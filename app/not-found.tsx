"use client";

import Link from "next/link";
import { Compass, Home } from "lucide-react";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-background to-background -z-10" />
      
      <div className="max-w-md w-full text-center space-y-8 relative z-10">
        <div className="relative">
          <h1 className="text-9xl font-black text-white/5 font-outfit select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-blue-500/20 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)]">
              <Compass className="w-12 h-12 text-blue-500 animate-[spin_4s_linear_infinite]" />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-bold font-outfit text-white">Lost Your Way?</h2>
          <p className="text-gray-400 text-lg">
            We couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
        </div>

        <div className="pt-4">
          <Link href="/">
            <Button
              className="bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2 mx-auto px-8 py-6 rounded-full text-lg shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)] transition-all hover:-translate-y-1"
            >
              <Home className="w-5 h-5" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
