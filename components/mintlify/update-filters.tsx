'use client';

import { useEffect, useState } from 'react';

export function UpdateFilters({ tags }: { tags: string[] }) {
  const [active, setActive] = useState<Set<string>>(new Set());

  useEffect(() => {
    document.querySelectorAll<HTMLElement>('[data-update-tags]').forEach((el) => {
      const own = (el.dataset.updateTags ?? '').split(',').filter(Boolean);
      el.hidden = active.size > 0 && !own.some((tag) => active.has(tag));
    });
  }, [active]);

  const toggle = (tag: string) =>
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });

  return (
    <aside className="sticky top-(--fd-docs-row-1) flex w-(--fd-toc-width) flex-col pt-12 pe-4 [grid-area:toc] xl:layout:[--fd-toc-width:268px] max-xl:hidden">
      <p className="mb-3 text-sm font-medium">Filters</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggle(tag)}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${
              active.has(tag) ? 'bg-fd-primary text-fd-primary-foreground' : 'bg-fd-accent text-fd-muted-foreground hover:bg-fd-accent'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </aside>
  );
}
