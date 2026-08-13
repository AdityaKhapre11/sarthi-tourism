import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function performLogout(router: AppRouterInstance): Promise<boolean> {
  try {
    // 1. Call server logout endpoint to clear HTTP cookies
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    // 2. Sign out from client-side Supabase authentication
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Supabase signOut error:", error);
      toast.error(error.message || "Failed to log out. Please try again.");
      return false;
    }

    // 3. Clear local & session storage caches
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin-auth");
      localStorage.removeItem("user-auth");
      sessionStorage.clear();
    }

    // 4. Show success toast
    toast.success("Logged out successfully");

    // 5. Immediately replace route to Home Page (/) & refresh Next App Router cache
    router.replace("/");
    router.refresh();
    return true;
  } catch (err: unknown) {
    console.error("Logout error:", err);
    toast.error("Logout failed. Please try again.");
    return false;
  }
}
