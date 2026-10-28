import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { pageSchema } from 'fumadocs-core/source/schema';
import { z } from 'zod';
import { mintlify } from './lib/mintlify/remark';

export const docs = defineDocs({
  dir: 'dive/docs',
  docs: {
    files: ['**/*.mdx', '!snippets/**', '!shared/**', '!shots/**'],
    schema: pageSchema.extend({
      title: z.string().default(''),
      sidebarTitle: z.string().optional(),
      icon: z.string().optional(),
      keywords: z.array(z.string()).optional(),
      playground: z.string().optional(),
      rss: z.boolean().optional(),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    files: ['__none__/*.json'],
  },
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: (defaults) => [...mintlify, ...defaults],
    remarkImageOptions: false,
    providerImportSource: 'site-mdx-components',
  },
});
