import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { Code, Root, Text } from 'mdast';
import type { MdxjsEsm } from 'mdast-util-mdxjs-esm';
import type { MdxJsxFlowElement } from 'mdast-util-mdx-jsx';
import { visit, SKIP } from 'unist-util-visit';
import type { VFile } from 'vfile';
import { docsPath } from '../../site.mjs';

export const DOCS_DIR = path.resolve(process.cwd(), 'dive/docs');

const manifest = JSON.parse(readFileSync(path.join(DOCS_DIR, 'docs.json'), 'utf8'));
const variables: Record<string, string> = manifest.variables ?? {};

const VARIABLE = /\{\{\s*([a-z_][a-z0-9_]*)\s*\}\}/gi;

function substitute(value: string): string {
  return value.replace(VARIABLE, (whole, name: string) => variables[name] ?? whole);
}

function remarkVariables() {
  return (tree: Root) => {
    visit(tree, (node, index, parent) => {
      if (node.type === 'text' || node.type === 'inlineCode' || node.type === 'code') {
        node.value = substitute(node.value);
        return;
      }
      if (node.type === 'link') {
        node.url = substitute(node.url);
        return;
      }
      if (
        (node.type === 'mdxTextExpression' || node.type === 'mdxFlowExpression') &&
        parent &&
        index !== undefined
      ) {
        const match = /^\s*\{\s*([a-z_][a-z0-9_]*)\s*\}\s*$/i.exec(node.value);
        if (match && match[1] in variables) {
          const text: Text = { type: 'text', value: variables[match[1]] };
          parent.children.splice(index, 1, text as never);
          return [SKIP, index];
        }
      }
    });
  };
}

function remarkSnippetImports() {
  return (tree: Root, file: VFile) => {
    const from = path.dirname(file.path);
    visit(tree, 'mdxjsEsm', (node: MdxjsEsm) => {
      const program = node.data?.estree;
      if (!program) return;
      for (const statement of program.body) {
        if (statement.type !== 'ImportDeclaration') continue;
        const source = statement.source;
        if (typeof source.value !== 'string' || !source.value.startsWith('/')) continue;
        const relative = path.relative(from, path.join(DOCS_DIR, source.value));
        const resolved = relative.startsWith('.') ? relative : `./${relative}`;
        node.value = node.value.split(source.value).join(resolved);
        source.value = resolved;
        source.raw = JSON.stringify(resolved);
      }
    });
  };
}

const MINTLIFY_FLAGS = new Set(['wrap', 'lines', 'expandable']);

function codeTitle(meta: string): string | undefined {
  const quoted = /title="([^"]*)"/.exec(meta);
  if (quoted) return quoted[1];
  const rest = meta
    .replace(/\{[^}]*\}/g, '')
    .replace(/\w+="[^"]*"/g, '')
    .split(/\s+/)
    .filter((word) => word && !MINTLIFY_FLAGS.has(word))
    .join(' ');
  return rest || undefined;
}

function remarkCodeMeta() {
  return (tree: Root) => {
    visit(tree, 'code', (node: Code) => {
      if (!node.meta) return;
      const title = codeTitle(node.meta);
      node.meta = title ? `title=${JSON.stringify(title)}` : null;
    });
  };
}

const TABBED = new Set(['CodeGroup', 'RequestExample', 'ResponseExample']);

function remarkCodeGroups() {
  return (tree: Root) => {
    visit(tree, 'mdxJsxFlowElement', (node: MdxJsxFlowElement, index, parent) => {
      if (!node.name || !TABBED.has(node.name)) return;
      node.children.forEach((child, i) => {
        if (child.type !== 'code') return;
        const title = (child.meta && /title="([^"]*)"/.exec(child.meta)?.[1]) || child.lang || `Tab ${i + 1}`;
        child.meta = `tab=${JSON.stringify(title)}`;
      });
      if (node.name === 'CodeGroup' && parent && index !== undefined) {
        parent.children.splice(index, 1, ...(node.children as never[]));
        return [SKIP, index];
      }
    });
  };
}

function rooted(url: string) {
  return url.startsWith('/') && !url.startsWith('//') ? `${docsPath}${url}` : url;
}

const URL_ATTRIBUTES = new Set(['src', 'href']);

function remarkDocsPath() {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (node.type === 'image' || node.type === 'link') {
        node.url = rooted(node.url);
        return;
      }
      if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
        for (const attr of node.attributes) {
          if (attr.type === 'mdxJsxAttribute' && URL_ATTRIBUTES.has(attr.name) && typeof attr.value === 'string') {
            attr.value = rooted(attr.value);
          }
        }
      }
    });
  };
}

export const mintlify = [remarkSnippetImports, remarkVariables, remarkCodeMeta, remarkCodeGroups, remarkDocsPath];
