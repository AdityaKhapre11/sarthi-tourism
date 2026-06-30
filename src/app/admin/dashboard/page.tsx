import { Map, Users, TrendingUp, CalendarCheck } from "lucide-react";
import fs from "fs";
import path from "path";

import { StatCard, RecentInquiriesList, QuickActionsPanel } from "@/components/admin/dashboard";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  
  // Read data dynamically
  const packagesPath = path.join(process.cwd(), 'src', 'data', 'packages.json');
  const inquiriesPath = path.join(process.cwd(), 'src', 'data', 'inquiries.json');
  
  let packagesCount = 0;
  if (fs.existsSync(packagesPath)) {
    const pkgs = JSON.parse(fs.readFileSync(packagesPath, 'utf8'));
    packagesCount = pkgs.length;
  }

  let inquiries = [];
  let inquiriesCount = 0;
  if (fs.existsSync(inquiriesPath)) {
    inquiries = JSON.parse(fs.readFileSync(inquiriesPath, 'utf8'));
    // Sort inquiries newest first
    inquiries = inquiries.sort((a: { createdAt: string }, b: { createdAt: string }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    inquiriesCount = inquiries.length;
  }

  const recentInquiries = inquiries.slice(0, 3);

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
          <p className="text-gray-400 mt-1">Welcome back, Admin. Here's what's happening today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.name} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentInquiriesList inquiries={recentInquiries} />
        <QuickActionsPanel />
      </div>
    </div>
  );
}
