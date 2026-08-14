import PackageDetailsIndex from "./index";
import { Metadata } from "next";
import { createClient as createPublicClient } from "@supabase/supabase-js";
import { generatePackageMetadata } from "@/lib/seo";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createPublicClient(supabaseUrl, supabaseAnonKey);
      const { data: pkg } = await supabase
        .from('packages')
        .select('*')
        .eq('id', id)
        .single();

      if (pkg) {
        return generatePackageMetadata(pkg);
      }
    }
  } catch (error) {
    console.error("Error generating package metadata:", error);
  }

  return {
    title: "Tour Package Details | Sarthi Tourism",
  };
}

export default async function PackageDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Auth redirect is handled by middleware.ts (bots are allowed through for OG metadata)
  return <PackageDetailsIndex params={params} />;
}
