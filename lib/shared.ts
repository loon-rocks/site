import { githubUrl, siteName } from './mintlify/navigation';
import { docsPath, origin } from '../site.mjs';

export { docsPath, githubUrl, origin, siteName };

export const docsContentRoute = '/llms.mdx';
export const docsImageRoute = '/og';

export function getPageMarkdownUrl(page: { slugs: string[] }) {
  const segments = [...page.slugs, 'content.md'];
  return { segments, url: `${docsContentRoute}/${segments.join('/')}` };
}

export function getPageImageUrl(page: { slugs: string[] }) {
  const segments = [...page.slugs, 'image.png'];
  return { segments, url: `${docsImageRoute}/${segments.join('/')}` };
}

export function getPageSourceUrl(page: { path: string }) {
  return githubUrl ? `${githubUrl}/blob/main/docs/${page.path}` : undefined;
}
