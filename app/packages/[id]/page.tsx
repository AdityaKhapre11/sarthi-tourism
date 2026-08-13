import PackageDetailsIndex from "./index";
import { Metadata } from "next";
import { createClient as createPublicClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { generatePackageMetadata } from "@/lib/seo";
import { redirect } from "next/navigation";

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
  const { id } = await params;

  // Server-side authentication check
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      redirect(`/login?redirect=/packages/${id}`);
    }
  } catch (err) {
    // If redirect was thrown, rethrow it so Next.js handles navigation
    if (err && typeof err === 'object' && 'digest' in err && typeof (err as { digest: string }).digest === 'string' && (err as { digest: string }).digest.startsWith('NEXT_REDIRECT')) {
      throw err;
    }
    redirect(`/login?redirect=/packages/${id}`);
  }

  return <PackageDetailsIndex params={params} />;
}
