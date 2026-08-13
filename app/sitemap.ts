import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { SITE_URL } from '@/constants/site';

export const revalidate = 3600; // Revalidate sitemap hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/packages`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  let packageRoutes: MetadataRoute.Sitemap = [];

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data: dbPackages } = await supabase
        .from('packages')
        .select('id, created_at, updated_at');

      if (dbPackages && dbPackages.length > 0) {
        packageRoutes = dbPackages.map((pkg) => {
          const dateValue = pkg.updated_at || pkg.created_at;
          const lastModified = dateValue ? new Date(dateValue) : new Date();
          return {
            url: `${SITE_URL}/packages/${pkg.id}`,
            lastModified: isNaN(lastModified.getTime()) ? new Date() : lastModified,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
          };
        });
      }
    }
  } catch (error) {
    console.error('Error fetching packages for sitemap:', error);
  }

  return [...staticRoutes, ...packageRoutes];
}
