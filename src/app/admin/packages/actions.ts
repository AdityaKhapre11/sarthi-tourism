"use server";

import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { Package } from '@/data/packages';

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const filepath = path.join(process.cwd(), 'public', 'images', filename);
    
    fs.writeFileSync(filepath, buffer);
    
    return { success: true, url: `/images/${filename}` };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { success: false, error: "Failed to upload image" };
  }
}

export async function updatePackage(id: string, data: Partial<Package>) {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'packages.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const packages = JSON.parse(fileData);

    const index = packages.findIndex((p: Package) => p.id.toString() === id.toString());
    
    if (index !== -1) {
      // Update existing package
      packages[index] = { ...packages[index], ...data, id: Number(id) };
      fs.writeFileSync(filePath, JSON.stringify(packages, null, 2));
      revalidatePath("/admin/packages");
      revalidatePath("/");
      return { success: true };
    } else {
      // If it doesn't exist, we could add it (for the "New Package" form later)
      packages.push({ ...data, id: Number(id) || Date.now() });
      fs.writeFileSync(filePath, JSON.stringify(packages, null, 2));
      revalidatePath("/admin/packages");
      revalidatePath("/");
      return { success: true };
    }
  } catch (error) {
    console.error("Error saving package:", error);
    return { success: false, error: "Failed to save package" };
  }
}

export async function createPackage(data: Omit<Package, 'id'>) {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'packages.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const packages = JSON.parse(fileData);

    // Generate a simple ID
    const nextId = packages.length > 0 ? Math.max(...packages.map((p: Package) => p.id)) + 1 : 1;
    
    packages.push({ ...data, id: nextId });
    fs.writeFileSync(filePath, JSON.stringify(packages, null, 2));
    
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
    const filePath = path.join(process.cwd(), 'src', 'data', 'packages.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const packages = JSON.parse(fileData);

    const index = packages.findIndex((p: Package) => p.id.toString() === id.toString());
    
    if (index !== -1) {
      packages.splice(index, 1);
      fs.writeFileSync(filePath, JSON.stringify(packages, null, 2));
      
      revalidatePath("/admin/packages");
      revalidatePath("/");
      return { success: true };
    }
    
    return { success: false, error: "Package not found" };
  } catch (error) {
    console.error("Error deleting package:", error);
    return { success: false, error: "Failed to delete package" };
  }
}
