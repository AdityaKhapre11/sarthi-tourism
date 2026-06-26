export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { packages } from '@/data/packages';

export async function GET() {
  try {
    const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
    const AI_API_KEY = process.env.AI_API_KEY;

    // If keys are missing, return the fallback data
    // This allows the site to function beautifully while waiting for backend configuration
    if (!INSTAGRAM_ACCESS_TOKEN || !AI_API_KEY) {
      const sortedPackages = [...packages].sort((a, b) => b.id - a.id);
      return NextResponse.json(sortedPackages);
    }

    // --- PIPELINE SCAFFOLDING ---

    // For now, return the fallback as the implementation placeholder
    const sortedPackages = [...packages].sort((a, b) => b.id - a.id);
    return NextResponse.json(sortedPackages);

  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json(
      { error: "Failed to fetch packages from Instagram." },
      { status: 500 }
    );
  }
}
