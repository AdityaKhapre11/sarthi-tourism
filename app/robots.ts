import { MetadataRoute } from 'next';
import { SITE_URL } from '@/constants/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/dashboard/', '/profile/', '/login', '/register'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
