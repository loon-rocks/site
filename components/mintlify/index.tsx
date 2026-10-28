import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import { Accordion as FdAccordion, Accordions } from 'fumadocs-ui/components/accordion';
import { Card as FdCard } from 'fumadocs-ui/components/card';
import { Callout } from 'fumadocs-ui/components/callout';
import { Step as FdStep, Steps as FdSteps } from 'fumadocs-ui/components/steps';
import { Tab as FdTab, Tabs as FdTabs } from 'fumadocs-ui/components/tabs';
import { Icon } from './icon';

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const GRID_COLS: Record<number, string> = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-4',
};

function Grid({ cols = 2, children }: { cols?: number; children: ReactNode }) {
  return <div className={`not-prose my-6 grid grid-cols-1 gap-4 ${GRID_COLS[cols] ?? GRID_COLS[2]}`}>{children}</div>;
}

export function CardGroup({ cols, children }: { cols?: number; children: ReactNode }) {
  return <Grid cols={cols}>{children}</Grid>;
}

export function Columns({ cols, children }: { cols?: number; children: ReactNode }) {
  return <Grid cols={cols}>{children}</Grid>;
}

export function Column({ children }: { children: ReactNode }) {
  return <div className="prose-no-margin">{children}</div>;
}

export function Card({
  title,
  icon,
  href,
  children,
}: {
  title: string;
  icon?: string;
  href?: string;
  children?: ReactNode;
}) {
  return (
    <FdCard title={title} href={href} icon={icon ? <Icon icon={icon} className="text-fd-primary" /> : undefined}>
      {children}
    </FdCard>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return <Callout type="info">{children}</Callout>;
}

export function Info({ children }: { children: ReactNode }) {
  return <Callout type="info">{children}</Callout>;
}

export function Tip({ children }: { children: ReactNode }) {
  return <Callout type="idea">{children}</Callout>;
}

export function Warning({ children }: { children: ReactNode }) {
  return <Callout type="warning">{children}</Callout>;
}

export function Danger({ children }: { children: ReactNode }) {
  return <Callout type="error">{children}</Callout>;
}

export function Check({ children }: { children: ReactNode }) {
  return <Callout type="success">{children}</Callout>;
}

export function Steps({ children }: { children: ReactNode }) {
  return <FdSteps>{children}</FdSteps>;
}

export function Step({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <FdStep>
      {title && <p className="!mt-0 font-semibold text-fd-foreground">{title}</p>}
      {children}
    </FdStep>
  );
}

type Titled = ReactElement<{ title?: string; children?: ReactNode }>;

export function Tabs({ children }: { children: ReactNode }) {
  const tabs = Children.toArray(children).filter(isValidElement) as Titled[];
  const items = tabs.map((tab, i) => tab.props.title ?? `Tab ${i + 1}`);
  return (
    <FdTabs
      items={items}
      className="rounded-none border-0 bg-transparent [&>[role=tablist]]:border-b [&>[role=tablist]]:px-0 [&>[role=tabpanel]]:rounded-none [&>[role=tabpanel]]:bg-transparent [&>[role=tabpanel]]:px-0"
    >
      {tabs.map((tab, i) => (
        <FdTab key={items[i]} value={items[i]}>
          {tab.props.children}
        </FdTab>
      ))}
    </FdTabs>
  );
}

export function Tab({ children }: { title?: string; children: ReactNode }) {
  return <>{children}</>;
}

export function Accordion({ title, icon, children }: { title: string; icon?: string; children: ReactNode }) {
  return (
    <Accordions>
      <FdAccordion
        title={
          <span className="inline-flex items-center gap-2">
            <Icon icon={icon} />
            {title}
          </span>
        }
        value={title}
      >
        {children}
      </FdAccordion>
    </Accordions>
  );
}

export function AccordionGroup({ children }: { children: ReactNode }) {
  return <div className="my-6 flex flex-col gap-2">{children}</div>;
}

export function Frame({ caption, children }: { caption?: string; children: ReactNode }) {
  return (
    <figure className="not-prose my-6">
      <div className="overflow-hidden rounded-xl border bg-fd-card p-2 [&_img]:mx-auto [&_img]:rounded-lg">
        {children}
      </div>
      {caption && <figcaption className="mt-2 text-center text-sm text-fd-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}

function Field({
  id,
  name,
  type,
  required,
  deprecated,
  defaultValue,
  children,
}: {
  id: string;
  name: string;
  type?: string;
  required?: boolean;
  deprecated?: boolean;
  defaultValue?: string;
  children?: ReactNode;
}) {
  return (
    <div id={id} className="group scroll-mt-24 border-b py-5 first:pt-2 last:border-b-0">
      <div className="not-prose flex flex-wrap items-center gap-2 font-mono text-sm">
        <a href={`#${id}`} className="font-semibold text-fd-primary">
          {name}
        </a>
        {type && <span className="rounded-md bg-fd-accent px-2 py-0.5 text-xs text-fd-muted-foreground">{type}</span>}
        {defaultValue !== undefined && (
          <span className="rounded-md bg-fd-accent px-2 py-0.5 text-xs text-fd-muted-foreground">
            default: {defaultValue}
          </span>
        )}
        {required && (
          <span className="rounded-md bg-red-500/10 px-2 py-0.5 text-xs text-red-600 dark:text-red-400">required</span>
        )}
        {deprecated && (
          <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs text-amber-600 dark:text-amber-400">
            deprecated
          </span>
        )}
      </div>
      {children && <div className="mt-2 text-sm prose-no-margin">{children}</div>}
    </div>
  );
}

type ParamFieldProps = {
  path?: string;
  query?: string;
  body?: string;
  header?: string;
  name?: string;
  type?: string;
  required?: boolean;
  deprecated?: boolean;
  default?: string;
  children?: ReactNode;
};

export function ParamField(props: ParamFieldProps) {
  const name = props.path ?? props.query ?? props.body ?? props.header ?? props.name ?? '';
  return (
    <Field
      id={`param-${slugify(name)}`}
      name={name}
      type={props.type}
      required={props.required}
      deprecated={props.deprecated}
      defaultValue={props.default}
    >
      {props.children}
    </Field>
  );
}

export function ResponseField(props: {
  name: string;
  type?: string;
  required?: boolean;
  deprecated?: boolean;
  default?: string;
  children?: ReactNode;
}) {
  return (
    <Field
      id={`response-${slugify(props.name)}`}
      name={props.name}
      type={props.type}
      required={props.required}
      deprecated={props.deprecated}
      defaultValue={props.default}
    >
      {props.children}
    </Field>
  );
}

export function Expandable({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <details className="mt-3 rounded-lg border px-4 py-2">
      <summary className="cursor-pointer text-sm">{title ? `Show ${title}` : 'Show properties'}</summary>
      {children}
    </details>
  );
}

export function RequestExample({ children }: { children: ReactNode }) {
  return <section className="mt-10">{children}</section>;
}

export function ResponseExample({ children }: { children: ReactNode }) {
  return <section className="mt-6">{children}</section>;
}

export function InlineRequestExample({ children }: { children: ReactNode }) {
  return <section className="mt-10 xl:hidden">{children}</section>;
}

export function InlineResponseExample({ children }: { children: ReactNode }) {
  return <section className="mt-6 xl:hidden">{children}</section>;
}

export function PanelRequestExample({ children }: { children: ReactNode }) {
  return <div className="[&_figure]:my-0">{children}</div>;
}

export function PanelResponseExample({ children }: { children: ReactNode }) {
  return <div className="mt-4 [&_figure]:my-0">{children}</div>;
}

const PANEL_TYPES = new Set<unknown>([PanelRequestExample, PanelResponseExample]);

type Content = ReactElement<Record<string, unknown>, (props: Record<string, unknown>) => ReactElement<{ children?: ReactNode }>>;

export function ExamplesOnly({ children }: { children?: ReactNode }) {
  if (!isValidElement(children) || typeof children.type !== 'function') return null;
  const content = children as Content;
  const tree = content.type(content.props);
  return (
    <>{Children.toArray(tree.props.children).filter((child) => isValidElement(child) && PANEL_TYPES.has(child.type))}</>
  );
}

export function ExamplePanel({ children }: { children: ReactNode }) {
  return (
    <aside className="sticky top-(--fd-docs-row-1) flex max-h-[calc(var(--fd-docs-height)-var(--fd-docs-row-1))] w-(--fd-toc-width) flex-col overflow-y-auto pt-12 pe-6 pb-4 [grid-area:toc] xl:layout:[--fd-toc-width:440px] max-xl:hidden">
      {children}
    </aside>
  );
}

export function Update({
  label,
  description,
  tags,
  children,
}: {
  label: string;
  description?: string;
  tags?: string[];
  children: ReactNode;
}) {
  const id = slugify(label);
  return (
    <div
      id={id}
      data-update-tags={(tags ?? []).join(',')}
      className="relative flex scroll-mt-24 flex-col gap-4 border-b py-8 md:flex-row md:gap-8"
    >
      <div className="not-prose md:sticky md:top-24 md:w-40 md:shrink-0 md:self-start">
        <a
          href={`#${id}`}
          className="inline-block rounded-lg bg-fd-primary/10 px-2 py-1 text-sm font-semibold text-fd-primary"
        >
          {label}
        </a>
        {description && <p className="mt-2 text-sm text-fd-muted-foreground">{description}</p>}
        {tags && tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span key={tag} className="rounded bg-fd-accent px-1.5 py-0.5 text-xs text-fd-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1 prose-no-margin">{children}</div>
    </div>
  );
}
