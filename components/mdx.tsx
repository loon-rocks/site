import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import * as All from './docs';

const {
  ExamplePanel,
  ExamplesOnly,
  InlineRequestExample,
  InlineResponseExample,
  PanelRequestExample,
  PanelResponseExample,
  slugify: _slugify,
  ...DocsComponents
} = All;

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    ...DocsComponents,
    ...components,
  } satisfies MDXComponents;
}

export function bodyComponents(components?: MDXComponents) {
  return getMDXComponents({
    RequestExample: InlineRequestExample,
    ResponseExample: InlineResponseExample,
    ...components,
  });
}

export function panelComponents() {
  return getMDXComponents({
    RequestExample: PanelRequestExample,
    ResponseExample: PanelResponseExample,
    wrapper: ExamplesOnly,
  });
}

export { ExamplePanel };

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
