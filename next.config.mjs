import path from 'node:path';
import { createMDX } from 'fumadocs-mdx/next';
import { docsDir } from './site.mjs';

const withMDX = createMDX();

function commonRoot(a, b) {
  const relative = path.relative(a, b);
  if (!relative.startsWith('..') && !path.isAbsolute(relative)) return a;
  return commonRoot(path.dirname(a), b);
}

const root = commonRoot(import.meta.dirname, docsDir);

const config = {
  output: 'export',
  reactStrictMode: true,
  turbopack: {
    root,
    resolveAlias: { 'site-mdx-components': './components/mdx.tsx' },
  },
  outputFileTracingRoot: root,
};

export default withMDX(config);
