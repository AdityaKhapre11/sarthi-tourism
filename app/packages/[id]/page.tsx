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
  
  let optimizedImageUrl = pkg.image;
  let imageType = "image/png";

  if (pkg.image && pkg.image.includes("/storage/v1/object/public/")) {
    optimizedImageUrl = pkg.image.replace(
      "/storage/v1/object/public/",
      "/storage/v1/render/image/public/"
    ) + "?width=1200&height=630&resize=cover&quality=80";
    imageType = "image/jpeg";
  }

  // Conditionally set images to allow falling back to layout.tsx default OG image if no package image exists.
  const images = pkg.image ? [
    {
      url: optimizedImageUrl,
      width: 1200,
      height: 630,
      alt: pkg.name,
      type: imageType,
    }
  ] : undefined;

  return {
    title: pkg.name,
    description: description,
    openGraph: {
      title: pkg.name,
      description: description,
      ...(images && { images }),
    },
    twitter: {
      card: "summary_large_image",
      title: pkg.name,
      description: description,
      ...(images && { images }),
    },
    alternates: {
      canonical: `/packages/${pkg.id}`,
    },
  };
}

export default function PackageDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  return <PackageDetailsIndex params={params} />;
}
