"use server";

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "packages";
    if (!file) {
      return { success: false, error: "No file provided" };
    }
    
    const supabase = await createClient();
    const filename = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    
    const { data, error } = await supabase
      .storage
      .from('sarthi-tourism-media')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error("Supabase storage error:", error);
      return { success: false, error: "Failed to upload image to Supabase" };
    }
    
    const { data: publicUrlData } = supabase
      .storage
      .from('sarthi-tourism-media')
      .getPublicUrl(filename);
      
    return { success: true, url: publicUrlData.publicUrl };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { success: false, error: "Failed to upload image" };
  }
}

export async function updatePackage(id: string, data: any) {
  try {
    const supabase = await createClient();
    
    // Separate non-updatable properties from the rest of the package data
    const { id: _id, itineraries, created_at, updated_at, ...packageData } = data;

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

export async function createPackage(data: any) {
  try {
    const supabase = await createClient();
    
    // itineraries property is only from joined selects in the past, but let's ensure it is stripped if it exists
    const { itineraries, ...packageData } = data;

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
