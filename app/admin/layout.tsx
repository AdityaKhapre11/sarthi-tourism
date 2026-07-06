"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/admin/layout";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();



  // If we are on the login page, don't show the sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden selection:bg-primary/30 selection:text-white">
      <Sidebar />

      {/* Main Content */}
      <main id="admin-main-content" className="flex-1 overflow-y-auto relative">
        {/* Subtle background glow for the main content area */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
