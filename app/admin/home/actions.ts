"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function getHomeSettings() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "home_hero_images")
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No row found, return empty
        return { success: true, images: [], activeImage: null };
      }
      throw error;
    }

    return { 
      success: true, 
      images: data?.value?.images || [],
      activeImage: data?.value?.activeImage || null 
    };
  } catch (error) {
    console.error("Error fetching home settings:", error);
    return { success: false, images: [], activeImage: null, error: "Failed to fetch settings" };
  }
}

export async function updateHomeSettings(images: string[], activeImage: string | null) {
  try {
    const supabase = await createClient();
    
    // Check if row exists
    const { data: existing } = await supabase
      .from("settings")
      .select("id")
      .eq("key", "home_hero_images")
      .single();

    if (existing) {
      // Update
      const { error } = await supabase
        .from("settings")
        .update({ value: { images, activeImage }, updated_at: new Date().toISOString() })
        .eq("key", "home_hero_images");
      if (error) throw error;
    } else {
      // Insert
      const { error } = await supabase
        .from("settings")
        .insert({ key: "home_hero_images", value: { images, activeImage } });
      if (error) throw error;
    }

    revalidatePath("/");
    revalidatePath("/admin/home");
    return { success: true };
  } catch (error) {
    console.error("Error updating home settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}

export async function deleteHeroImage(url: string, currentImages: string[], currentActiveImage: string | null) {
  try {
    const supabase = await createClient();
    
    // 1. Delete from Storage
    // Extract the storage path from the public URL
    // URL format: https://[project-ref].supabase.co/storage/v1/object/public/sarthi-tourism-media/home/[filename]
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/public/sarthi-tourism-media/');
    
    if (pathParts.length === 2) {
      const storagePath = pathParts[1];
      const { error: storageError } = await supabase.storage
        .from('sarthi-tourism-media')
        .remove([storagePath]);
        
      if (storageError) {
        console.error("Failed to delete from storage:", storageError);
        // Continue anyway to clean up database
      }
    }

    // 2. Remove from database
    const newImages = currentImages.filter(img => img !== url);
    const newActiveImage = currentActiveImage === url ? null : currentActiveImage;
    
    return await updateHomeSettings(newImages, newActiveImage);
  } catch (error: unknown) {
    console.error("Error deleting hero image:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete image" };
  }
}
