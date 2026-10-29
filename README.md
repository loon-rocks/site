# loon.rocks

The [loon.rocks](https://loon.rocks) site: a landing page at `/` and the Dive documentation at `/docs`, built with Next.js and [Fumadocs](https://fumadocs.dev) as a static site in `out/`.

The documentation pages live in the [dive](https://github.com/loon-rocks/dive) repo under `docs/`, next to the code they describe, and come in here through the `dive` submodule, which tracks dive's `docs-live` branch (moved to each release tag). Pages, `docs.json` navigation (including `$ref` files), redirects, variables, `/snippets` imports, images and the favicon are all read in place. Root-relative links and images in those pages are moved under `/docs` at compile time.

```bash
git clone --recurse-submodules git@github.com:loon-rocks/site.git
mise run sync    # move dive/ to the tip of docs-live
mise run dev     # http://localhost:3000
mise run build   # static export into out/
```

To preview unreleased docs, check out another dive ref inside `dive/` (`git -C dive fetch origin main && git -C dive checkout FETCH_HEAD`).

## From a dive commit to loon.rocks/docs

```
dive main ──release vX.Y.Z──▶ dive docs-live ──repository_dispatch──▶ site deploy.yaml ──▶ Cloudflare
 docs/                         (moved to the tag)   (event docs-live)     clone, build, deploy
```

1. Docs are written in dive's `docs/` and merged to dive's `main` with the code they describe. Nothing is published yet.
2. dive's release workflow (`.github/workflows/release.yaml`, `docs` job) runs after the GitHub release is created. It moves `docs-live` to the release tag, then sends a `docs-live` `repository_dispatch` to this repo using the `SITE_DISPATCH_TOKEN` secret.
3. `.github/workflows/deploy.yaml` here clones `docs-live` into `dive/` with a fresh shallow clone, ignoring the submodule pointer. It then runs `npm run build` and deploys `out/` with Wrangler. Pushes to `main` and manual runs do the same, so the site always serves `docs-live` as it is when the build runs. Pull requests upload a preview version aliased `pr-<n>` and leave production alone.

So the submodule pointer committed here only matters for local builds; production always reads the tip of `docs-live`. Docs merged to dive's `main` between releases appear on loon.rocks with the next release, or locally after checking out `main` inside `dive/`.

The site reads `dive/docs` in place; nothing is copied into this repo. `public/favicon.svg` and `public/docs/images` are symlinks into the submodule, and `source.config.ts` collects every `**/*.mdx` under `dive/docs` except `snippets/`, `shared/` and `shots/`, which are only imported by other pages.

The build has three parts:

- **Content**: Fumadocs MDX compiles each page through the remark plugins in `lib/docs/remark.ts` (snippet imports, `docs.json` variables, code-block titles and tabs, `/docs` prefixing of root-relative URLs) and renders it with the components in `components/docs/`.
- **Structure**: `lib/docs/navigation.tsx` reads `docs.json` for the sidebar, the section eyebrow above each title, redirects, the site name and the GitHub link. `app/docs/[[...slug]]/page.tsx` renders pages and generates a refresh page for each redirect.
- **Machine-readable copies**: `app/llms.mdx`, `app/llms.txt` and `app/llms-full.txt` emit the processed Markdown, `app/og` the Open Graph images, `app/api/search` the static search index, and `app/sitemap.ts` the sitemap. `worker/index.ts` serves the Markdown copy of `/` or any `/docs/*` page to requests that send `Accept: text/markdown`.

Because pages are compiled against `docs.json`, a dive docs change that uses a component, frontmatter field or `docs.json` key this site doesn't handle needs a change here too. Land it before the dive release that ships the page, since that release rebuilds the site immediately.

## How the docs are built

| Source | Here |
| --- | --- |
| `docs.json` navigation | `lib/docs/navigation.tsx` builds the sidebar tree; top-level groups are section headings, nested groups are folders, `root` pages are folder index pages |
| `redirects` | static pages with `<meta http-equiv="refresh">` and a canonical link; `:slug*` sources are expanded against the destination's pages |
| `variables` (`{{release_version}}`) | `lib/docs/remark.ts`, in prose, inline code, code blocks and links |
| `/snippets/...` imports | rewritten to relative paths at compile time |
| Code block titles (` ```yaml Plan step `), `CodeGroup` | converted to Fumadocs titles and code tabs |
| `RequestExample` / `ResponseExample` | sticky right-hand panel in place of the table of contents on wide screens, inline below the content otherwise |
| `ParamField` / `ResponseField` | `#param-<name>` / `#response-<name>` anchors |
| `Update` + `tags` | changelog rows with a tag filter panel |
| `Card`, `CardGroup`, `Columns`, `Steps`, `Tabs`, `Accordion`, `Frame`, callouts | `components/docs/` |
| Font Awesome icons | Font Awesome Free; the four Pro-only icons the docs use are swapped for close Free ones in `components/docs/icon.tsx` |
| Search | Fumadocs static Orama index (`/api/search`) |
| Copy page / view as Markdown, `llms.txt` | `/llms.mdx/<page>/content.md`, `/llms.txt`, `/llms-full.txt` |
