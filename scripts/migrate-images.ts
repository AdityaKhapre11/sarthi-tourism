import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadFile(localPath: string, folder: string): Promise<string | null> {
  if (!localPath.startsWith('/images/')) return localPath; // Already a full URL or different format

  const fullLocalPath = path.join(process.cwd(), 'public', localPath);
  
  if (!fs.existsSync(fullLocalPath)) {
    console.warn(`File not found locally: ${fullLocalPath}`);
    return null; // Return null if file doesn't exist so we don't break the record
  }

  const fileBuffer = fs.readFileSync(fullLocalPath);
  const fileName = path.basename(localPath);
  const remotePath = `${folder}/${Date.now()}-${fileName}`;
  
  // Basic content type inference
  let contentType = 'application/octet-stream';
  if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) contentType = 'image/jpeg';
  else if (fileName.endsWith('.png')) contentType = 'image/png';
  else if (fileName.endsWith('.webp')) contentType = 'image/webp';
  else if (fileName.endsWith('.svg')) contentType = 'image/svg+xml';

  const { data, error } = await supabase.storage
    .from('sarthi-tourism-media')
    .upload(remotePath, fileBuffer, {
      contentType: contentType,
      upsert: false
    });

  if (error) {
    console.error(`Failed to upload ${localPath}:`, error);
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from('sarthi-tourism-media')
    .getPublicUrl(remotePath);

  return publicUrlData.publicUrl;
}

async function migrateImages() {
  console.log("Authenticating as Admin...");
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@sarthitourism.com',
    password: 'Admin@123'
  });

  if (authError) {
    console.warn("Could not authenticate automatically. Migration might fail if RLS blocks updates.", authError.message);
  }

  console.log("Fetching packages from database...");
  const { data: packages, error: fetchError } = await supabase
    .from('packages')
    .select('*');

  if (fetchError || !packages) {
    console.error("Failed to fetch packages:", fetchError);
    return;
  }

  console.log(`Found ${packages.length} packages to process.`);

  for (const pkg of packages) {
    let needsUpdate = false;
    let newImage = pkg.image;
    let newGallery = [...(pkg.gallery || [])];

    if (newImage && newImage.startsWith('/images/')) {
      console.log(`Uploading main image for package: ${pkg.name}`);
      const uploadedUrl = await uploadFile(newImage, 'packages');
      if (uploadedUrl && uploadedUrl !== newImage) {
        newImage = uploadedUrl;
        needsUpdate = true;
      }
    }

    for (let i = 0; i < newGallery.length; i++) {
      if (newGallery[i] && newGallery[i].startsWith('/images/')) {
        console.log(`Uploading gallery image ${i + 1} for package: ${pkg.name}`);
        const uploadedUrl = await uploadFile(newGallery[i], 'gallery');
        if (uploadedUrl && uploadedUrl !== newGallery[i]) {
          newGallery[i] = uploadedUrl;
          needsUpdate = true;
        }
      }
    }

    if (needsUpdate) {
      console.log(`Updating package ${pkg.name} with new image URLs...`);
      const { error: updateError } = await supabase
        .from('packages')
        .update({ image: newImage, gallery: newGallery })
        .eq('id', pkg.id);

      if (updateError) {
        console.error(`Failed to update package ${pkg.name}:`, updateError);
      } else {
        console.log(`Successfully updated package: ${pkg.name}`);
      }
    } else {
      console.log(`No images to migrate for package: ${pkg.name}`);
    }
  }

  console.log("Image migration complete!");
}

migrateImages();
