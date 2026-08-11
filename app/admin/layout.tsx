import { ReactNode } from "react";
import { Sidebar } from "@/components/admin/layout";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin/dashboard");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    redirect("/login?error=admin_required");
  }
  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden selection:bg-primary/30 selection:text-white">
      <Sidebar />

      {/* Main Content */}
      <main id="admin-main-content" className="flex-1 overflow-y-auto relative">
        {/* Subtle background glow for the main content area */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
