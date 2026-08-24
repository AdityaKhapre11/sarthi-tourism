"use server";

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function deleteInquiry(id: string) {
  try {
    const supabase = await createClient();
    
    // Server-side role check (defense in depth)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile || profile.role !== "admin") {
      return { success: false, error: "Forbidden: Admins only" };
    }

    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id);

    if (error) throw error;
      
    revalidatePath("/admin/inquiries");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    return { success: false, error: "Failed to delete inquiry" };
  }
}

export async function updateInquiryStatus(id: string, status: string) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile || profile.role !== "admin") {
      return { success: false, error: "Forbidden: Admins only" };
    }

    const { error } = await supabase
      .from('inquiries')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
      
    revalidatePath("/admin/inquiries");
    return { success: true };
  } catch (error) {
    console.error("Error updating inquiry status:", error);
    return { success: false, error: "Failed to update inquiry status" };
  }
}

export async function markInquiryAsRead(id: string) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile || profile.role !== "admin") {
      return { success: false, error: "Forbidden: Admins only" };
    }

    const { error } = await supabase
      .from('inquiries')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
      
    // Intentionally omitting revalidatePath here because we update the UI optimistically
    // and rely on realtime to update the dashboard count.
    
    return { success: true };
  } catch (error) {
    console.error("Error marking inquiry as read:", error);
    return { success: false, error: "Failed to mark inquiry as read" };
  }
}
