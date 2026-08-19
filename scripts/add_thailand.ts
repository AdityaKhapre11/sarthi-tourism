import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadImage(filePath: string, filename: string): Promise<string> {
  const fileBuffer = fs.readFileSync(filePath);
  const { data, error } = await supabase.storage
    .from('sarthi-tourism-media')
    .upload(`packages/${Date.now()}-${filename}`, fileBuffer, {
      contentType: 'image/jpeg',
      upsert: false
    });

  if (error) {
    console.error("Error uploading image:", error);
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from('sarthi-tourism-media')
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}

async function main() {
  try {
    console.log("Uploading Hero Image...");
    const heroPath = "C:\\Users\\adity\\.gemini\\antigravity-ide\\brain\\a380049b-4c19-4cfb-aca5-babe1c983df8\\thailand_hero_1787115015862.jpg";
    const heroUrl = await uploadImage(heroPath, 'thailand_hero.jpg');
    
    console.log("Uploading Gallery Images...");
    const g1Path = "C:\\Users\\adity\\.gemini\\antigravity-ide\\brain\\a380049b-4c19-4cfb-aca5-babe1c983df8\\thailand_gallery_1_1787115282312.jpg";
    const g1Url = await uploadImage(g1Path, 'thailand_gallery_1.jpg');

    const g2Path = "C:\\Users\\adity\\.gemini\\antigravity-ide\\brain\\a380049b-4c19-4cfb-aca5-babe1c983df8\\thailand_gallery_2_1787115305284.jpg";
    const g2Url = await uploadImage(g2Path, 'thailand_gallery_2.jpg');

    const g3Path = "C:\\Users\\adity\\.gemini\\antigravity-ide\\brain\\a380049b-4c19-4cfb-aca5-babe1c983df8\\thailand_gallery_3_1787115367761.jpg";
    const g3Url = await uploadImage(g3Path, 'thailand_gallery_3.jpg');

    console.log("Images uploaded successfully.");

    const packageData = {
      name: "Thailand Getaway",
      image: heroUrl,
      duration: "5 Nights / 6 Days",
      price: "₹67,599/-",
      description: "Escape to the turquoise waters of Phuket & Krabi with our 5N/6D Thailand Getaway — filled with island adventures, stunning beaches, comfortable stays, and unforgettable moments.\n\n3 Nights Phuket & 2 Nights Krabi\nDeparture: Ex. Ahmedabad\n\nStarting at ₹67,599/- per person\nCall: 9824164417",
      highlights: [
        "3 Nights Phuket",
        "2 Nights Krabi",
        "Ex. Ahmedabad",
        "Island Adventures",
        "Stunning Beaches"
      ],
      included: [
        "Hotel Accommodation",
        "Daily Breakfast",
        "Airport Transfers",
        "Island Tours & Sightseeing"
      ],
      excluded: [],
      gallery: [heroUrl, g1Url, g2Url, g3Url],
      itinerary: []
    };

    console.log("Inserting Package into Database...");
    const { data, error } = await supabase
      .from('packages')
      .insert([packageData])
      .select();

    if (error) {
      console.error("Error inserting package:", error);
      throw error;
    }

    console.log("Package inserted successfully!", data);

  } catch (err) {
    console.error("Script failed:", err);
  }
}

main();
