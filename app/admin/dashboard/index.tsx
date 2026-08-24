import { Map, CalendarCheck, MessageSquare } from "lucide-react";

import { StatCard, RecentInquiriesList, QuickActionsPanel, RealtimeInquiriesCard } from "@/components/admin/dashboard";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardIndex() {
  const supabase = await createClient();
  
  // Fetch packages count from Supabase
  const { count } = await supabase
    .from('packages')
    .select('*', { count: 'exact', head: true });
    
  const packagesCount = count || 0;

  // Fetch real inquiries from Supabase
  const { data: recentInquiriesData } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

  // Fetch unread inquiries count
  const { count: unreadCount } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true })
    .or('is_read.is.null,is_read.eq.false');

  // Fetch total inquiries count
  const { count: totalInquiries } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true });

  const inquiriesCount = unreadCount || 0;
  const recentInquiries = recentInquiriesData || [];

  const stats = [
    { name: "Total Inquiries", value: (totalInquiries || 0).toString(), icon: MessageSquare, color: "text-indigo-400", bg: "bg-indigo-400/10" },
    { name: "Total Packages", value: packagesCount.toString(), icon: Map, color: "text-blue-400", bg: "bg-blue-400/10" },
    { name: "Monthly Bookings", value: "15", icon: CalendarCheck, color: "text-purple-400", bg: "bg-purple-400/10" },
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
        <RealtimeInquiriesCard initialUnreadCount={inquiriesCount} />
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
