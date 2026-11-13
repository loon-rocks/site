import { existsSync, mkdirSync, rmSync, symlinkSync } from 'node:fs';
import path from 'node:path';
import { docsDir } from '../site.mjs';

if (!existsSync(path.join(docsDir, 'docs.json'))) {
  console.error(`no docs.json in ${docsDir}; run \`mise run sync\` or set DIVE_DOCS to a dive checkout's docs directory`);
  process.exit(1);
}

const links = {
  'public/favicon.svg': 'favicon.svg',
  'public/docs/images': 'images',
};

for (const [link, target] of Object.entries(links)) {
  mkdirSync(path.dirname(link), { recursive: true });
  rmSync(link, { force: true });
  symlinkSync(path.join(docsDir, target), link);
}
