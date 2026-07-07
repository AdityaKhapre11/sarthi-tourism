import PackageDetailsIndex from "./index";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  const supabase = await createClient();
  const { data: pkg } = await supabase
    .from('packages')
    .select('*')
    .eq('id', id)
    .single();

  if (!pkg) return {};

  const description = pkg.description ? pkg.description.substring(0, 160) : `Book the ${pkg.name} tour package starting at ${pkg.price}.`;

  return {
    title: pkg.name,
    description: description,
    openGraph: {
      title: pkg.name,
      description: description,
    },
    twitter: {
      card: "summary_large_image",
      title: pkg.name,
      description: description,
    },
    alternates: {
      canonical: `/packages/${pkg.id}`,
    },
  };
}

export default function PackageDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  return <PackageDetailsIndex params={params} />;
}
