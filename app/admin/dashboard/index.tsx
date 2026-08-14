import { Map, Users, TrendingUp, CalendarCheck } from "lucide-react";
import fs from "fs";
import path from "path";

import { StatCard, RecentInquiriesList, QuickActionsPanel } from "@/components/admin/dashboard";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardIndex() {
  const supabase = await createClient();
  
  // Fetch packages count from Supabase
  const { count } = await supabase
    .from('packages')
    .select('*', { count: 'exact', head: true });
    
  const packagesCount = count || 0;

  // Fetch real inquiries from Supabase
  const { data: recentInquiriesData, count: totalInquiries } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(3);

  const inquiriesCount = totalInquiries || 0;
  const recentInquiries = recentInquiriesData || [];

  const stats = [
    { name: "Total Packages", value: packagesCount.toString(), icon: Map, color: "text-blue-400", bg: "bg-blue-400/10" },
    { name: "Active Inquiries", value: inquiriesCount.toString(), icon: Users, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { name: "Bookings This Month", value: "15", icon: CalendarCheck, color: "text-purple-400", bg: "bg-purple-400/10" },
    { name: "Revenue (Est)", value: "₹4.2L", icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-400/10" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-400 mt-1">Welcome back, Admin. Here&apos;s what&apos;s happening today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.name} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <RecentInquiriesList inquiries={recentInquiries} />
        <QuickActionsPanel />
      </div>
    </div>
  );
}
