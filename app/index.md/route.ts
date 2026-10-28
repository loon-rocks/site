import { docsPath, githubUrl, origin, siteName } from '@/lib/shared';
import { source } from '@/lib/source';

export const revalidate = false;

export function GET() {
  const description = source.getPage(['introduction'])?.data.description;
  const lines = [
    `# ${siteName}`,
    '',
    ...(description ? [description, ''] : []),
    `- [Get started](${origin}${docsPath}/quickstart)`,
    `- [Read the docs](${origin}${docsPath}/introduction)`,
    `- [Documentation index](${origin}/llms.txt)`,
    ...(githubUrl ? [`- [GitHub](${githubUrl})`] : []),
  ];
  return new Response(`${lines.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
