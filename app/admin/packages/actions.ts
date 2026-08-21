"use server";

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { PackageFormData } from '@/components/admin/packages/PackageForm';

export async function updatePackage(id: string, data: PackageFormData | Record<string, unknown>) {
  try {
    const supabase = await createClient();
    
    // Copy data and strip non-updatable database properties
    const packageData = { ...data } as Record<string, unknown>;
    delete packageData.id;
    delete packageData.created_at;
    delete packageData.updated_at;
    delete packageData.itineraries;

    const { error: packageError } = await supabase
      .from('packages')
      .update(packageData)
      .eq('id', id);

    if (packageError) {
      console.error("Supabase package update error:", packageError);
      throw packageError;
    }

    revalidatePath("/admin/packages");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating package:", error);
    return { success: false, error: "Failed to update package" };
  }
}

export async function createPackage(data: PackageFormData | Record<string, unknown>) {
  try {
    const supabase = await createClient();
    
    const packageData = { ...data } as Record<string, unknown>;
    delete packageData.itineraries;

    const { error: packageError } = await supabase
      .from('packages')
      .insert(packageData);

    if (packageError) throw packageError;

    revalidatePath("/admin/packages");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Error creating package:", error);
    return { success: false, error: "Failed to create package" };
  }
}

export async function deletePackage(id: string | number) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('packages')
      .delete()
      .eq('id', id);

    if (error) throw error;
      
    revalidatePath("/admin/packages");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting package:", error);
    return { success: false, error: "Failed to delete package" };
  }
}
