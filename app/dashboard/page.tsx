import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Map, Heart, PlaneTakeoff, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default async function DashboardOverview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch summary data
  const { count: upcomingCount } = await supabase
    .from("bookings")
    .select("*", { count: 'exact', head: true })
    .eq("user_id", user.id)
    .gte("travel_date", new Date().toISOString())
    .eq("booking_status", "confirmed");

  const { count: completedCount } = await supabase
    .from("bookings")
    .select("*", { count: 'exact', head: true })
    .eq("user_id", user.id)
    .lt("travel_date", new Date().toISOString())
    .eq("booking_status", "completed");

  const { count: wishlistCount } = await supabase
    .from("wishlists")
    .select("*", { count: 'exact', head: true })
    .eq("user_id", user.id);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome back, {user.user_metadata?.full_name?.split(' ')[0] || 'Traveler'}!</h1>
        <p className="text-gray-400">Here's an overview of your trips and account.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/bookings">
          <div className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer rounded-xl p-6">
            <div className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-gray-300">Upcoming Trips</h3>
              <PlaneTakeoff className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{upcomingCount || 0}</div>
            </div>
          </div>
        </Link>
        <Link href="/dashboard/bookings">
          <div className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer rounded-xl p-6">
            <div className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-gray-300">Completed Trips</h3>
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{completedCount || 0}</div>
            </div>
          </div>
        </Link>
        <Link href="/dashboard/wishlist">
          <div className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer rounded-xl p-6">
            <div className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-gray-300">Saved Packages</h3>
              <Heart className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{wishlistCount || 0}</div>
            </div>
          </div>
        </Link>
        <Link href="/dashboard/bookings">
          <div className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer rounded-xl p-6">
            <div className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-gray-300">Total Bookings</h3>
              <Map className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{(upcomingCount || 0) + (completedCount || 0)}</div>
            </div>
          </div>
        </Link>
      </div>
      
      {(!upcomingCount && !completedCount) && (
        <div className="rounded-2xl border border-dashed border-white/20 p-12 text-center flex flex-col items-center justify-center bg-white/5">
          <Map className="w-12 h-12 text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No trips planned yet</h3>
          <p className="text-gray-400 mb-6 max-w-md">You haven't booked any packages yet. Start exploring our premium packages and plan your next adventure!</p>
          <Link href="/packages" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            Explore Packages
          </Link>
        </div>
      )}
    </div>
  );
}
