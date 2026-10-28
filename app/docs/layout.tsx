import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { pageTree } from '@/lib/source';
import { githubUrl, siteName } from '@/lib/shared';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout tree={pageTree} nav={{ title: siteName, url: '/' }} githubUrl={githubUrl}>
      {children}
    </DocsLayout>
  );
}
