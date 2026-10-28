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
