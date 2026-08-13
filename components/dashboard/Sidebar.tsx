"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  User, 
  Map, 
  Heart, 
  CreditCard, 
  Bell, 
  LogOut,
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "My Bookings", href: "/dashboard/bookings", icon: Map },
  { name: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="flex flex-col w-64 bg-background/50 backdrop-blur-xl border-r border-white/10 min-h-screen pt-24 pb-8 px-4 sticky top-0">
      <div className="flex-1 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                isActive
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 flex-shrink-0 h-5 w-5 transition-colors",
                  isActive ? "text-blue-400" : "text-gray-500 group-hover:text-gray-300"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto pt-8 border-t border-white/10">
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className="w-full flex items-center justify-start px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all cursor-pointer"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
