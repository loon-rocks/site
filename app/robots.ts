import type { MetadataRoute } from 'next';
import { origin } from '@/lib/shared';

export const revalidate = false;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: `${origin}/sitemap.xml`,
  };
}
