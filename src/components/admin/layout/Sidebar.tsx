"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  MessageSquare,
  Settings,
  LogOut
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("admin-auth");
        window.location.replace("/admin/login");
      }
    }
  };

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Packages", href: "/admin/packages", icon: Map },
    { name: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 bg-card border-r border-white/5 flex flex-col">
      <div className="h-30 flex items-center justify-center border-b border-white/5">
        <Image
          src="/images/logo1.png"
          alt="Sarthi Tourism"
          width={100}
          height={40}
          className="object-contain opacity-90"
        />
      </div>

      <nav className="flex-1 py-6 px-4 spac overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                ? "bg-blue-600/10 text-blue-400 font-medium"
                : "text-gray-400 hover:bg-white/4 hover:text-gray-200"
                }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-blue-400" : "text-gray-500 group-hover:text-gray-300"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-white/5">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="flex items-center justify-start space-x-3 px-4 py-6 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-lg">Sign Out</span>
        </Button>
      </div>
    </aside>
  );
}
