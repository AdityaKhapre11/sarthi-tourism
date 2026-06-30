import { MetadataRoute } from 'next';
import { packages } from '@/data/packages';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sarthitourism.com';

  const staticRoutes = [
    '',
    '/packages',
    '/privacy-policy',
    '/terms-of-service',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const dynamicRoutes = packages.map((pkg) => ({
    url: `${baseUrl}/packages/${pkg.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
