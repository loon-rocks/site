import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

const config = {
  output: 'export',
  reactStrictMode: true,
  turbopack: {
    root: import.meta.dirname,
    resolveAlias: { 'site-mdx-components': './components/mdx.tsx' },
  },
  outputFileTracingRoot: import.meta.dirname,
};

export default withMDX(config);
