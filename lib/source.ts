import { docs } from '@/.source/server';
import { llms, loader } from 'fumadocs-core/source';
import { mintlifyTree } from './mintlify/navigation';
import { docsPath } from '../site.mjs';

export const source = loader({
  baseUrl: docsPath,
  source: docs.toFumadocsSource(),
});

export const pageTree = mintlifyTree((slug) => {
  const page = source.getPage(slug.split('/'));
  if (!page) return undefined;
  return { title: page.data.title, sidebarTitle: page.data.sidebarTitle, icon: page.data.icon };
});

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText('processed')}`,
});
