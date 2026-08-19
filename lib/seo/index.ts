import { Metadata } from 'next';
import { SITE_URL } from '@/constants/site';

export interface SeoPageProps {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  keywords?: string[];
}

/**
 * Ensures an OG image URL is absolute.
 * - If already absolute (https://...), returns as-is.
 * - If relative (/path/...), prepends SITE_URL.
 * - Falls back to the root opengraph-image route.
 */
function resolveOgImageUrl(ogImage?: string): string {
  if (!ogImage) {
    return `${SITE_URL}/images/hero.png`;
  }
  // Already an absolute URL
  if (ogImage.startsWith('http://') || ogImage.startsWith('https://')) {
    return ogImage;
  }
  // Relative path — make absolute
  const cleanPath = ogImage.startsWith('/') ? ogImage : `/${ogImage}`;
  return `${SITE_URL}${cleanPath}`;
}

export function generatePageMetadata({
  title,
  description,
  path = '',
  ogImage,
  keywords = [],
}: SeoPageProps = {}): Metadata {
  const defaultTitle = "Sarthi Tourism | Premium Travel & Tour Packages from  & Gujarat";
  const defaultDescription = "Sarthi Tourism is 's leading travel agency offering premium international and domestic tour packages, customized family vacations, and honeymoon trips from Gujarat.";
  const defaultKeywords = [
    "Sarthi Tourism",
    "travel agency in ",
    "tour operator ",
    "international tour packages from ",
    "domestic tours Gujarat",
    "holiday packages ",
    "customized travel agency Gujarat",
  ];

  const metaTitle = title ? `${title} | Sarthi Tourism` : defaultTitle;
  const metaDescription = description || defaultDescription;
  const canonicalUrl = `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const metaKeywords = Array.from(new Set([...defaultKeywords, ...keywords]));

  const image = resolveOgImageUrl(ogImage);

  const openGraph: Metadata['openGraph'] = {
    title: metaTitle,
    description: metaDescription,
    url: canonicalUrl,
    siteName: "Sarthi Tourism",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: image,
        width: 1200,
        height: 630,
        alt: metaTitle,
      },
    ],
  };

  const twitter: Metadata['twitter'] = {
    card: "summary_large_image",
    title: metaTitle,
    description: metaDescription,
    images: [image],
  };

  return {
    metadataBase: new URL(SITE_URL),
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    authors: [{ name: "Sarthi Tourism", url: SITE_URL }],
    creator: "Sarthi Tourism",
    publisher: "Sarthi Tourism",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph,
    twitter,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generatePackageMetadata(pkg: {
  id: string | number;
  name: string;
  description?: string;
  duration?: string;
  price?: string;
  image?: string;
  highlights?: string[];
}): Metadata {
  const cleanName = pkg.name.trim();
  const title = `${cleanName} Tour Package from  & Gujarat | Sarthi Tourism`;

  const formattedPrice = pkg.price ? ` starting at ${pkg.price}` : '';
  const formattedDuration = pkg.duration ? ` (${pkg.duration})` : '';
  const baseDesc = pkg.description ? pkg.description.substring(0, 140) : `Explore ${cleanName} with Sarthi Tourism.`;
  const description = `Book ${cleanName}${formattedDuration}${formattedPrice} from , Gujarat with Sarthi Tourism. ${baseDesc}`;

  const destinationKeyword = cleanName.replace(/tour|package|2026|2025|grand|autumn|spring|summer|winter/gi, '').trim();

  const keywords = [
    `${cleanName}`,
    `${destinationKeyword} tour package from `,
    `${destinationKeyword} trip from Gujarat`,
    `Sarthi Tourism ${destinationKeyword}`,
    `${destinationKeyword} family tour package`,
    `${destinationKeyword} honeymoon package `,
    `best travel agency for ${destinationKeyword} in `,
  ];

  // The file-based `app/packages/[id]/opengraph-image.tsx` generates a branded
  // OG image. However, we also set the package's hero image as the og:image in
  // metadata so crawlers that support direct image URLs get the best result.
  // The file-based route takes priority via Next.js conventions when both exist.
  return generatePageMetadata({
    title,
    description,
    path: `/packages/${pkg.id}`,
    ogImage: pkg.image || undefined,
    keywords,
  });
}


/**
 * Structured Data (JSON-LD) Generators
 */

export function getTravelAgencySchema() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${SITE_URL}/#organization`,
    "name": "Sarthi Tourism",
    "url": SITE_URL,
    "logo": `${SITE_URL}/images/logo1.png`,
    "image": `${SITE_URL}/images/logo1.png`,
    "telephone": "+918780228628",
    "email": "admin@sarthitourism.com",
    "priceRange": "₹₹ - ₹₹₹",
    "description": "Sarthi Tourism is a premier travel agency based in , Gujarat offering custom international and domestic tour packages, family vacations, honeymoon trips, and corporate travel.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "",
      "addressRegion": "Gujarat",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "21.1702",
      "longitude": "72.8311"
    },
    "areaServed": [
      { "@type": "City", "name": "" },
      { "@type": "State", "name": "Gujarat" },
      { "@type": "Country", "name": "India" }
    ],
    "sameAs": [
      `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8780228628'}`
    ]
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    "url": SITE_URL,
    "name": "Sarthi Tourism",
    "description": "Premium Travel & Tour Packages from , Gujarat",
    "publisher": {
      "@id": `${SITE_URL}/#organization`
    }
  };
}

export function getBreadcrumbSchema(items: { name: string; item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((it, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": it.name,
      "item": it.item.startsWith('http') ? it.item : `${SITE_URL}${it.item.startsWith('/') ? it.item : `/${it.item}`}`
    }))
  };
}

export function getTouristTripSchema(pkg: {
  id: string | number;
  name: string;
  description?: string;
  duration?: string;
  price?: string;
  image?: string;
  itinerary?: { day: number; title: string; description: string }[];
}) {
  const numericPrice = pkg.price ? pkg.price.replace(/[^0-9]/g, '') : null;

  return {
    "@context": "https://schema.org",
    "@type": ["TouristTrip", "Product"],
    "name": pkg.name,
    "description": pkg.description || `Tour package for ${pkg.name} offered by Sarthi Tourism .`,
    "image": pkg.image || `${SITE_URL}/images/logo1.png`,
    "provider": {
      "@type": "TravelAgency",
      "name": "Sarthi Tourism",
      "url": SITE_URL,
      "telephone": "+918780228628"
    },
    "offers": {
      "@type": "Offer",
      "url": `${SITE_URL}/packages/${pkg.id}`,
      "priceCurrency": "INR",
      "price": numericPrice || "0",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString()
    },
    "itinerary": pkg.itinerary ? pkg.itinerary.map(item => ({
      "@type": "ItemList",
      "name": `Day ${item.day}: ${item.title}`,
      "description": item.description
    })) : undefined
  };
}

export function getFAQPageSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}
