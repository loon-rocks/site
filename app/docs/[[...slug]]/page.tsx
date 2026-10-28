import { source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { bodyComponents, ExamplePanel, panelComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { docsPath, getPageImageUrl, getPageMarkdownUrl, getPageSourceUrl } from '@/lib/shared';
import { mintlifyGroups, mintlifyRedirects } from '@/lib/mintlify/navigation';
import { UpdateFilters } from '@/components/mintlify/update-filters';

const HOME = '/introduction';
const groups = mintlifyGroups();

function redirects(): Map<string, string> {
  const urls = source.getPages().map((page) => `/${page.slugs.join('/')}`);
  const out = new Map<string, string>([['/', HOME]]);
  for (const { source: from, destination } of mintlifyRedirects()) {
    if (from.endsWith('/:slug*')) {
      const fromPrefix = from.slice(0, -'/:slug*'.length);
      const toPrefix = destination.slice(0, -'/:slug*'.length);
      for (const url of urls) {
        if (url.startsWith(`${toPrefix}/`)) out.set(fromPrefix + url.slice(toPrefix.length), url);
      }
    } else {
      out.set(from, destination);
    }
  }
  for (const url of urls) out.delete(url);
  return out;
}

function urlOf(slug: string[] | undefined) {
  return `/${(slug ?? []).join('/')}`;
}

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) {
    const to = redirects().get(urlOf(params.slug));
    if (!to) notFound();
    const target = `${docsPath}${to}`;
    return (
      <>
        <meta httpEquiv="refresh" content={`0;url=${target}`} />
        <link rel="canonical" href={target} />
        <p className="p-8">
          Moved to <a href={target}>{target}</a>.
        </p>
      </>
    );
  }

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;
  const raw = await page.data.getText('raw');
  const eyebrow = groups.get(page.slugs.join('/'));
  const hasExamples = /<(RequestExample|ResponseExample)\b/.test(raw);
  const updateTags = [
    ...new Set([...raw.matchAll(/<Update\b[^>]*tags=\{(\[[^\]]*\])\}/g)].flatMap((m) => JSON.parse(m[1]) as string[])),
  ];

  const tableOfContent = hasExamples
    ? {
        component: (
          <ExamplePanel>
            <MDX components={panelComponents()} />
          </ExamplePanel>
        ),
      }
    : updateTags.length > 0
      ? { component: <UpdateFilters tags={updateTags} /> }
      : undefined;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={tableOfContent}
      breadcrumb={{ enabled: false }}
    >
      {eyebrow && <p className="text-sm font-semibold text-fd-primary">{eyebrow}</p>}
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover markdownUrl={markdownUrl} githubUrl={getPageSourceUrl(page)} />
      </div>
      <DocsBody>
        <MDX
          components={bodyComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  const pages = source.generateParams();
  const extra = [...redirects().keys()].map((url) => ({ slug: url.split('/').filter(Boolean) }));
  return [...pages, ...extra];
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) return {};

  return {
    title: page.data.title,
    description: page.data.description,
    keywords: page.data.keywords,
    openGraph: {
      images: getPageImageUrl(page).url,
    },
  };
}
