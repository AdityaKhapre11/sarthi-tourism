/**
 * Single Source of Truth for SEO and Site Origin
 * Canonical origin MUST be https://sarthitourism.com without trailing slashes.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://sarthitourism.com').replace(/\/+$/, '');

export function getAbsoluteUrl(path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}
