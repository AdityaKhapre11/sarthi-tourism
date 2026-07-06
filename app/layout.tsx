import type { Metadata } from "next";
import { Inter, Outfit, Geist } from "next/font/google";
import "./globals.css";
import { SmoothScroll, PublicLayout } from "@/components/layout";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

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

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://sarthitourism.com");

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Sarthi Tourism | Premium Travel & Tour Packages",
    template: "%s | Sarthi Tourism",
  },
  description:
    "Explore the world with Sarthi Tourism. Discover premium tour packages, breathtaking destinations, and unforgettable experiences.",
  keywords: ["travel", "tourism", "tour packages", "vacation", "holiday", "Sarthi Tourism", "travel agency", "premium travel"],
  authors: [{ name: "Sarthi Tourism" }],
  creator: "Sarthi Tourism",
  publisher: "Sarthi Tourism",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/images/logo1.png",
    apple: "/images/logo1.png",
  },
  openGraph: {
    title: {
      default: "Sarthi Tourism | Premium Travel",
      template: "%s | Sarthi Tourism",
    },
    description: "Discover premium tour packages, breathtaking destinations, and unforgettable experiences.",
    url: baseUrl,
    siteName: "Sarthi Tourism",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Sarthi Tourism | Premium Travel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: "Sarthi Tourism | Premium Travel",
      template: "%s | Sarthi Tourism",
    },
    description: "Discover premium tour packages, breathtaking destinations, and unforgettable experiences.",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", inter.variable, outfit.variable, "font-sans", geist.variable)}>
      <body className="font-sans antialiased text-foreground bg-background min-h-screen flex flex-col selection:bg-primary/30 selection:text-white">
        <SmoothScroll>
          <PublicLayout>{children}</PublicLayout>
        </SmoothScroll>
        <div id="modal-root" className="relative z-[9999]"></div>
        <Toaster 
          position="top-center" 
          theme="dark"
          toastOptions={{
            classNames: {
              toast: 'backdrop-blur-xl border',
              success: 'bg-emerald-300/10 border-emerald-500/20 text-emerald-400',
              error: 'bg-red-500/10 border-red-500/20 text-red-400',
              info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
              warning: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
            }
          }}
        />
      </body>
    </html>
  );
}
