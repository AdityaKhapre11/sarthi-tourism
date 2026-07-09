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

  let ogImage = pkg.image;
  if (ogImage && ogImage.includes('/storage/v1/object/public/')) {
    ogImage = ogImage.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/') + '?width=1200&height=630&resize=cover&quality=80';
  }

  return {
    title: pkg.name,
    description: description,
    openGraph: {
      title: pkg.name,
      description: description,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: pkg.name,
      description: description,
      images: ogImage ? [ogImage] : undefined,
    },
    alternates: {
      canonical: `/packages/${pkg.id}`,
    },
  };
}

export default function PackageDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  return <PackageDetailsIndex params={params} />;
}
