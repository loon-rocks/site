type Env = { ASSETS: { fetch(request: Request): Promise<Response> } };

function markdownPath(pathname: string) {
  const path = pathname.replace(/\/+$/, '');
  if (path === '') return '/index.md';
  if (path.startsWith('/docs/')) return `/llms.mdx${path.slice('/docs'.length)}/content.md`;
  return undefined;
}

function wantsMarkdown(request: Request) {
  return (request.headers.get('Accept') ?? '').toLowerCase().includes('text/markdown');
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    const target = markdownPath(url.pathname);

    if (target && wantsMarkdown(request)) {
      const markdown = await env.ASSETS.fetch(new Request(new URL(target, url)));
      if (markdown.ok) {
        const body = await markdown.text();
        return new Response(request.method === 'HEAD' ? null : body, {
          headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            Vary: 'Accept',
            'x-markdown-tokens': String(Math.ceil(body.length / 4)),
          },
        });
      }
    }

    const response = await env.ASSETS.fetch(request);
    if (!target) return response;
    const headers = new Headers(response.headers);
    headers.append('Vary', 'Accept');
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  },
};
