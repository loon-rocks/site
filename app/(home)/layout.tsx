import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { docsPath, githubUrl, siteName } from '@/lib/shared';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <HomeLayout
      nav={{ title: siteName, url: '/' }}
      githubUrl={githubUrl}
      links={[{ text: 'Docs', url: `${docsPath}/introduction`, active: 'nested-url' }]}
    >
      {children}
    </HomeLayout>
  );
}
