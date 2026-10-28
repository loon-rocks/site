import type { MetadataRoute } from 'next';
import { origin } from '@/lib/shared';
import { source } from '@/lib/source';

export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${origin}/` },
    ...source.getPages().map((page) => ({ url: `${origin}${page.url}` })),
  ];
}
