import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const itinerary = [
  {
    day: 1,
    title: "Arrival in Phuket",
    description: "Arrive at Phuket Airport. Meet our representative and get transferred to your hotel. Spend the rest of the day at leisure exploring the local area or relaxing by the beach."
  },
  {
    day: 2,
    title: "Phi Phi Island Tour",
    description: "After breakfast, embark on a full-day tour to the beautiful Phi Phi Islands. Enjoy snorkeling in the crystal clear turquoise waters and relax on the pristine white sand beaches."
  },
  {
    day: 3,
    title: "Phuket City Tour",
    description: "Explore the cultural sights of Phuket. Visit the famous viewpoint, the Big Buddha, and the gorgeous Wat Chalong temple. Evening free for shopping and exploring local markets."
  },
  {
    day: 4,
    title: "Transfer to Krabi",
    description: "After breakfast, check out from the hotel and take a scenic transfer to Krabi. Check-in to your resort in Krabi and spend the evening enjoying the sunset."
  },
  {
    day: 5,
    title: "Krabi 4 Islands Tour",
    description: "Set off on the famous Krabi 4 Islands Tour. Visit Phra Nang Cave Beach, Tup Island, Chicken Island, and Poda Island. Enjoy the stunning limestone cliffs and marine life."
  },
  {
    day: 6,
    title: "Departure",
    description: "Enjoy your final breakfast at the resort. Check out and transfer to the airport for your onward journey back home, taking with you unforgettable memories of Thailand."
  }
];

async function main() {
  try {
    console.log("Updating Itinerary...");
    const { data, error } = await supabase
      .from('packages')
      .update({ itinerary })
      .eq('name', 'Thailand Getaway')
      .select();

    if (error) {
      console.error("Error updating package:", error);
      throw error;
    }

    console.log("Itinerary added successfully!", data);

  } catch (err) {
    console.error("Script failed:", err);
  }
}

main();
