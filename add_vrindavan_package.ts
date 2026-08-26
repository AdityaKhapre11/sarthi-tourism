import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve('.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase credentials");
}

const supabase = createClient(supabaseUrl, supabaseKey);

const imagePaths = [
  "C:\\Users\\adity\\.gemini\\antigravity-ide\\brain\\2a8fe91d-5474-4bbc-969d-ed0e4df9956e\\prem_mandir_evening_1787720749332.jpg",
  "C:\\Users\\adity\\.gemini\\antigravity-ide\\brain\\2a8fe91d-5474-4bbc-969d-ed0e4df9956e\\banke_bihari_temple_1787720764841.jpg",
  "C:\\Users\\adity\\.gemini\\antigravity-ide\\brain\\2a8fe91d-5474-4bbc-969d-ed0e4df9956e\\nidhivan_vrindavan_1787720776565.jpg",
  "C:\\Users\\adity\\.gemini\\antigravity-ide\\brain\\2a8fe91d-5474-4bbc-969d-ed0e4df9956e\\mathura_janmabhoomi_1787720820861.jpg",
  "C:\\Users\\adity\\.gemini\\antigravity-ide\\brain\\2a8fe91d-5474-4bbc-969d-ed0e4df9956e\\iskcon_vrindavan_1787720846200.jpg"
];

const destDir = path.join(__dirname, 'public', 'images', 'packages');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const publicImageUrls = [];
for (const imgPath of imagePaths) {
  if (fs.existsSync(imgPath)) {
    const filename = path.basename(imgPath);
    const destPath = path.join(destDir, filename);
    fs.copyFileSync(imgPath, destPath);
    publicImageUrls.push(`/images/packages/${filename}`);
  }
}

const packageData = {
  name: "Special Janmashtami Yatra | Vrindavan & Mathura",
  category: "Domestic",
  duration: "3 Nights / 4 Days",
  price: "INR 12999",
  image: publicImageUrls[0] || "",
  description: "This Janmashtami, experience the divine charm of Krishna's land with a memorable journey through the temples, ghats and spiritual treasures of Vrindavan & Mathura. Minimum 4 Pax Required.",
  highlights: [
    "Prem Mandir & its spectacular evening illumination",
    "Banke Bihari Temple",
    "Shri Krishna Janmabhoomi",
    "Nidhivan & Seva Kunj",
    "ISKCON Temple"
  ],
  included: [
    "Hotel Stay",
    "Breakfast & Dinner",
    "Transfers",
    "Sightseeing"
  ],
  excluded: [
    "Personal Expenses",
    "Train/Air Tickets",
    "Guide fees unless specified"
  ],
  gallery: publicImageUrls.slice(1),
  itinerary: [
    {
      day: 1,
      title: "Arrival in Mathura & Shri Krishna Janmabhoomi",
      description: "Arrive in Mathura, the birthplace of Lord Krishna. Check in to your hotel and rest. In the afternoon, visit the revered Shri Krishna Janmabhoomi temple complex. Experience the spiritual energy and peaceful environment. Evening at leisure."
    },
    {
      day: 2,
      title: "Vrindavan Temples & Prem Mandir",
      description: "After breakfast, proceed to Vrindavan. Visit the famous Banke Bihari Temple and experience the vibrant atmosphere and devotion. Later, visit the beautiful ISKCON Temple. In the evening, witness the spectacular illumination of the majestic Prem Mandir."
    },
    {
      day: 3,
      title: "Mystical Nidhivan & Seva Kunj",
      description: "Today, explore the sacred and mystical Nidhivan forest, where it is believed Lord Krishna performs Raas Leela every night. Visit Seva Kunj and other prominent Ghats of Vrindavan. Soak in the divine aura."
    },
    {
      day: 4,
      title: "Departure",
      description: "After a delicious breakfast, check out from the hotel. If time permits, do some local shopping before transferring to your onward destination with divine memories."
    }
  ]
};

async function insertPackage() {
  console.log("Inserting package...");
  const { data, error } = await supabase.from('packages').insert(packageData).select();
  if (error) {
    console.error("Error inserting package:", error);
  } else {
    console.log("Package inserted successfully:", data);
  }
}

insertPackage();
