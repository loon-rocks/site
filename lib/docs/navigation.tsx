import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { Folder, Item, Node, Root } from 'fumadocs-core/page-tree';
import { Icon } from '@/components/docs/icon';
import { docsPath } from '../../site.mjs';

type Entry = string | Group | Ref;
type Ref = { $ref: string };
type Group = {
  group: string;
  icon?: string;
  expanded?: boolean;
  root?: string;
  pages: Entry[] | Ref;
};

export type PageInfo = { title: string; sidebarTitle?: string; icon?: string };

const DOCS_DIR = path.resolve(process.cwd(), 'dive/docs');

function readJson(relative: string) {
  return JSON.parse(readFileSync(path.join(DOCS_DIR, relative), 'utf8'));
}

function expand(entry: Entry): Entry[] {
  if (typeof entry === 'object' && '$ref' in entry) {
    const target = readJson(entry.$ref);
    return Array.isArray(target) ? target.flatMap(expand) : expand(target);
  }
  return [entry];
}

function children(group: Group): Entry[] {
  const pages = Array.isArray(group.pages) ? group.pages : [group.pages];
  return pages.flatMap(expand);
}

export function navigationTree(lookup: (slug: string) => PageInfo | undefined): Root {
  const manifest = readJson('docs.json');

  const item = (slug: string): Item | undefined => {
    const page = lookup(slug);
    if (!page) return undefined;
    return {
      type: 'page',
      $id: slug,
      name: page.sidebarTitle ?? page.title,
      url: `${docsPath}/${slug}`,
      icon: page.icon ? <Icon icon={page.icon} /> : undefined,
    };
  };

  const folder = (group: Group, trail: string): Folder => ({
    type: 'folder',
    $id: trail,
    name: group.group,
    icon: group.icon ? <Icon icon={group.icon} /> : undefined,
    index: group.root ? item(group.root) : undefined,
    children: children(group).flatMap((entry) => node(entry, trail)),
  });

  const node = (entry: Entry, trail: string): Node[] => {
    if (typeof entry === 'string') {
      const page = item(entry);
      return page ? [page] : [];
    }
    if ('$ref' in entry) return expand(entry).flatMap((e) => node(e, trail));
    return [folder(entry, `${trail}/${entry.group}`)];
  };

  const top = (manifest.navigation.pages as Entry[]).flatMap(expand).flatMap((entry): Node[] => {
    if (typeof entry === 'string' || '$ref' in entry) return node(entry, '');
    if (entry.root) return [folder(entry, entry.group)];
    return [
      {
        type: 'separator',
        $id: `section:${entry.group}`,
        name: entry.group,
        icon: entry.icon ? <Icon icon={entry.icon} /> : undefined,
      },
      ...children(entry).flatMap((e) => node(e, entry.group)),
    ];
  });

  return { name: manifest.name, children: top };
}

export function pageGroups(): Map<string, string> {
  const groups = new Map<string, string>();
  const walk = (entry: Entry, group: string | undefined) => {
    if (typeof entry === 'string') {
      if (group) groups.set(entry, group);
      return;
    }
    if ('$ref' in entry) {
      expand(entry).forEach((e) => walk(e, group));
      return;
    }
    if (entry.root) groups.set(entry.root, entry.group);
    children(entry).forEach((e) => walk(e, entry.group));
  };
  (readJson('docs.json').navigation.pages as Entry[]).forEach((e) => walk(e, undefined));
  return groups;
}

export type Redirect = { source: string; destination: string };

export function redirectRules(): Redirect[] {
  return readJson('docs.json').redirects ?? [];
}

export const siteName: string = readJson('docs.json').name;
export const githubUrl: string | undefined = readJson('docs.json').footer?.socials?.github;
