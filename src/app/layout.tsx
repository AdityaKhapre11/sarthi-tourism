import type { Metadata } from "next";
import { Inter, Outfit, Geist } from "next/font/google";
import "./globals.css";
import { SmoothScroll, PublicLayout } from "@/components/layout";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://sarthitourism.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Sarthi Tourism | Premium Travel & Tour Packages",
  description:
    "Explore the world with Sarthi Tourism. Discover premium tour packages, breathtaking destinations, and unforgettable experiences.",
  openGraph: {
    title: "Sarthi Tourism | Premium Travel",
    description: "Explore the world with Sarthi Tourism. Discover premium tour packages, breathtaking destinations, and unforgettable experiences.",
    url: "https://sarthitourism.com", // Adjust to the actual production URL
    siteName: "Sarthi Tourism",

    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sarthi Tourism | Premium Travel",
    description: "Explore the world with Sarthi Tourism. Discover premium tour packages, breathtaking destinations, and unforgettable experiences.",

  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", inter.variable, outfit.variable, "font-sans", geist.variable)}>
      <body className="font-sans antialiased text-gray-100 bg-[#0a0a0a] min-h-screen flex flex-col selection:bg-blue-500/30 selection:text-white">
        <SmoothScroll>
          <PublicLayout>{children}</PublicLayout>
        </SmoothScroll>
        <div id="modal-root" className="relative z-[9999]"></div>
      </body>
    </html>
  );
}
