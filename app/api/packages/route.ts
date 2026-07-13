export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching from Supabase:", error);
      return NextResponse.json({ error: "Failed to fetch packages." }, { status: 500 });
    }

    // Format the data to match the expected frontend structure
    const formattedPackages = data.map(pkg => ({
      ...pkg,
      itinerary: pkg.itinerary?.sort((a: any, b: any) => a.day - b.day) || []
    }));

    return NextResponse.json(formattedPackages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json(
      { error: "Failed to fetch packages from database." },
      { status: 500 }
    );
  }
}
