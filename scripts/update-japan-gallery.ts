import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://eqzgikfszvufvkafstxk.supabase.co';
const supabaseAnonKey = 'sb_publishable_rSkc4w_P-tvbfQmPhzC-7Q_c-3mJ8yL';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const imagePaths = [
  'C:\\Users\\adity\\.gemini\\antigravity-ide\\brain\\06806762-9530-4cbc-bd45-501d6af7c4cc\\japan_fushimi_inari_autumn_1785830963665.png',
  'C:\\Users\\adity\\.gemini\\antigravity-ide\\brain\\06806762-9530-4cbc-bd45-501d6af7c4cc\\japan_zen_garden_autumn_1785830975342.png',
  'C:\\Users\\adity\\.gemini\\antigravity-ide\\brain\\06806762-9530-4cbc-bd45-501d6af7c4cc\\japan_tokyo_street_night_1785830986640.png'
];

async function main() {
  try {
    console.log("Logging in...");
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@sarthitourism.com',
      password: 'Admin@123'
    });

    if (authError) {
      console.error("Auth error:", authError);
      return;
    }
    console.log("Logged in successfully!");

    console.log("Fetching Japan package...");
    const { data: packages, error: fetchError } = await supabase
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (fetchError || !packages || packages.length === 0) {
      console.error("Fetch error or package not found:", fetchError);
      return;
    }

    const japanPackage = packages[0];
    if (!japanPackage.name.includes("Japan")) {
      console.error("Most recent package is not Japan, it is:", japanPackage.name);
      return;
    }

    console.log(`Found package: ${japanPackage.name} (${japanPackage.id})`);
    
    const newGalleryUrls: string[] = [japanPackage.image]; // Start with the main image

    for (let i = 0; i < imagePaths.length; i++) {
      const imagePath = imagePaths[i];
      console.log(`Uploading gallery image ${i + 1}...`);
      
      const imageBuffer = fs.readFileSync(imagePath);
      const fileName = `gallery/japan-gallery-${i + 1}-${Date.now()}.png`;

      const { error: uploadError } = await supabase.storage
        .from('sarthi-tourism-media')
        .upload(fileName, imageBuffer, {
          contentType: 'image/png',
          upsert: true
        });

      if (uploadError) {
        console.error(`Upload error for image ${i + 1}:`, uploadError);
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from('sarthi-tourism-media')
        .getPublicUrl(fileName);
        
      newGalleryUrls.push(publicUrlData.publicUrl);
    }

    console.log("Updating package gallery...");
    const { error: updateError } = await supabase
      .from('packages')
      .update({ gallery: newGalleryUrls })
      .eq('id', japanPackage.id)
      .select();

    if (updateError) {
      console.error("Update error:", updateError);
    } else {
      console.log("Package gallery successfully updated!");
      console.log("New Gallery:", newGalleryUrls);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
