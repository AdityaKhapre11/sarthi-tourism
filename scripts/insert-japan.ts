import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://eqzgikfszvufvkafstxk.supabase.co';
const supabaseAnonKey = 'sb_publishable_rSkc4w_P-tvbfQmPhzC-7Q_c-3mJ8yL';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

    const imagePath = 'C:\\Users\\adity\\.gemini\\antigravity-ide\\brain\\06806762-9530-4cbc-bd45-501d6af7c4cc\\japan_autumn_tour_1785830679288.png';
    const imageBuffer = fs.readFileSync(imagePath);
    const fileName = `packages/japan-autumn-${Date.now()}.png`;

    console.log("Uploading image...");
    const { error: uploadError } = await supabase.storage
      .from('sarthi-tourism-media')
      .upload(fileName, imageBuffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('sarthi-tourism-media')
      .getPublicUrl(fileName);
      
    const imageUrl = publicUrlData.publicUrl;
    console.log("Image uploaded! URL:", imageUrl);

    const packageData = {
      name: "Japan Autumn Grand Tour 2026",
      duration: "9 Nights / 10 Days",
      price: "₹3,45,000/- Per Person",
      image: imageUrl,
      gallery: [imageUrl],
      description: "Experience the breathtaking beauty of Japan during the autumn season. This 10-day grand tour takes you from the bustling streets of Tokyo to the majestic Mt. Fuji, the traditional charm of Kyoto, the lively food scene of Osaka, and the historic significance of Hiroshima. Witness the vibrant red and gold maple leaves framing iconic landmarks in one of the best seasons to visit the Land of the Rising Sun. Departure: November 2026.",
      highlights: ["Momiji (Autumn Leaves) Viewing", "Mt. Fuji & Hakone Ropeway", "Kyoto Temples & Shrines", "Hiroshima Peace Memorial"],
      included: ["Accommodation in 4-star hotels", "Daily Breakfast & Select Dinners", "Shinkansen (Bullet Train) Tickets", "Airport Transfers", "English-Speaking Guide", "Entry Fees for major attractions"],
      excluded: ["International Flights", "Visa Fees", "Personal Expenses", "Travel Insurance"],
      itinerary: [
        { day: 1, title: "Arrival in Tokyo", description: "Arrival in Tokyo. Transfer to hotel. Evening walk around Shinjuku." },
        { day: 2, title: "Tokyo Autumn Highlights", description: "Visit Shinjuku Gyoen National Garden for autumn colors, Meiji Shrine, and Shibuya Crossing." },
        { day: 3, title: "Tokyo to Nikko", description: "Day trip to Nikko to see Toshogu Shrine and the stunning autumn leaves at Lake Chuzenji and Kegon Falls." },
        { day: 4, title: "Mt. Fuji & Hakone", description: "Travel to Hakone. Enjoy the Lake Ashi cruise and Hakone Ropeway for views of Mt. Fuji." },
        { day: 5, title: "Bullet Train to Kyoto", description: "Arrive in Kyoto. Visit Kiyomizu-dera Temple and stroll through the historic Higashiyama district." },
        { day: 6, title: "Kyoto Autumn Charm", description: "Explore the Golden Pavilion (Kinkaku-ji), Arashiyama Bamboo Grove, and a scenic ride on the Sagano Romantic Train." },
        { day: 7, title: "Kyoto to Nara to Osaka", description: "Visit Nara Park to see the friendly deer and Todai-ji Temple, then proceed to Osaka. Evening in Dotonbori." },
        { day: 8, title: "Osaka to Hiroshima", description: "Take the Shinkansen to Hiroshima. Visit the Peace Memorial Park and Museum." },
        { day: 9, title: "Miyajima Island & Return", description: "Ferry to Miyajima to see the floating torii gate of Itsukushima Shrine. Return to Osaka." },
        { day: 10, title: "Departure", description: "Transfer to Kansai International Airport (KIX) for your flight home." }
      ]
    };

    console.log("Inserting package...");
    const { data: insertData, error: insertError } = await supabase
      .from('packages')
      .insert(packageData)
      .select();

    if (insertError) {
      console.error("Insert error:", insertError);
    } else {
      console.log("Package successfully inserted!", insertData);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
