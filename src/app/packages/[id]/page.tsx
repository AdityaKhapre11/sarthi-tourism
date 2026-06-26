import { notFound } from "next/navigation";
import { packages } from "@/data/packages";
import PackageDetailsClient from "./PackageDetailsClient";

export async function generateStaticParams() {
  return packages.map((pkg) => ({
    id: pkg.id.toString(),
  }));
}

export default async function PackageDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pkg = packages.find((p) => p.id.toString() === id);

  if (!pkg) {
    notFound();
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8780228628";
  const whatsappMessage = `Hi, I'm interested in the ${pkg.name} package (${pkg.duration}). Could you please share more details?`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return <PackageDetailsClient pkg={pkg} whatsappUrl={whatsappUrl} />;
}
