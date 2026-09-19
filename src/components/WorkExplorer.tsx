"use client";

import { useMemo, useState, type ReactNode } from "react";
import { delay } from "@/lib/reveal";
import type { GalleryItem } from "./ProjectGallery";
import ProjectModal from "./ProjectModal";
import ProjectVisual, { pad } from "./ProjectVisual";

const ALL = "All projects";

type Entry = { item: GalleryItem; index: number };

function Label({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-3 font-display text-lg font-medium">
      <span aria-hidden className="size-3.5 rounded-full bg-muted" />
      {children}
    </p>
  );
}

function FeaturedRow({
  entry,
  position,
  total,
  onOpen,
}: {
  entry: Entry;
  position: number;
  total: number;
  onOpen: () => void;
}) {
  const { project, src } = entry.item;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className="group grid w-full cursor-pointer gap-6 py-10 text-left first:pt-0 last:pb-0 md:grid-cols-10 md:gap-8"
    >
      <div data-reveal="clip" className="md:col-span-6">
        <div className="relative aspect-[3/2] overflow-hidden rounded-[3px] bg-paper-deep">
          <ProjectVisual
            project={project}
            src={src}
            index={entry.index}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>
      </div>

      <div data-reveal style={delay(2)} className="flex flex-col md:col-span-4">
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.06em]">
          Featured <span aria-hidden>←</span>
          <span className="border border-ink px-1 leading-4">
            {pad(position + 1)}/{pad(total)}
          </span>
        </p>
        <h3 className="mt-5 font-display text-3xl font-semibold tracking-[-0.03em] underline-offset-4 group-hover:underline">
          {project.title}
        </h3>
        <p className="mt-4 max-w-[36ch] text-lg leading-snug text-muted">
          {project.description}
        </p>

        {project.stat && (
          <div className="mt-auto pt-10">
            <span className="inline-block rounded-[3px] bg-paper-deep px-2.5 py-1 font-display text-2xl font-semibold">
              {project.stat.value}
            </span>
            <p className="mt-3 max-w-[30ch] font-display text-base font-medium leading-snug">
              {project.stat.label}
            </p>
          </div>
        )}
      </div>
    </button>
  );
}

function Card({
  entry,
  step,
  onOpen,
}: {
  entry: Entry;
  step: number;
  onOpen: () => void;
}) {
  const { project, src, previewSrc } = entry.item;
  const column = step % 3;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className="group block w-full cursor-pointer text-left"
    >
      <div data-reveal="clip" style={delay(column)}>
        <div className="relative aspect-square overflow-hidden rounded-md bg-paper-deep">
          <ProjectVisual
            project={project}
            src={previewSrc ?? src}
            focus={previewSrc ? "50% 50%" : undefined}
            index={entry.index}
            sizes="(min-width: 1024px) 26vw, (min-width: 640px) 45vw, 100vw"
            className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
          {project.featured && (
            <span className="absolute left-3 top-3 rounded-[2px] bg-paper/90 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em]">
              Featured
            </span>
          )}
        </div>
      </div>

      <div className="mt-4" data-reveal style={delay(column + 1)}>
        <h3 className="font-display text-xl font-semibold tracking-[-0.02em]">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-3 max-w-[34ch] text-[15px] leading-snug text-muted">
          {project.description}
        </p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {project.tags.slice(0, 4).map((tag) => (
            <li
              key={tag}
              className="rounded-[2px] bg-paper-deep px-2 py-0.5 font-display text-xs font-medium"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </button>
  );
}

export default function WorkExplorer({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState(ALL);
  const [active, setActive] = useState<number | null>(null);

  const entries = useMemo<Entry[]>(
    () => items.map((item, index) => ({ item, index })),
    [items],
  );
  const kinds = useMemo(
    () => [
      ALL,
      ...new Set(
        items
          .map((i) => i.project.kind)
          .filter((k): k is NonNullable<typeof k> => Boolean(k)),
      ),
    ],
    [items],
  );

  const featured = entries.filter(({ item }) => item.project.featured);
  const visible = entries.filter(
    ({ item }) => filter === ALL || item.project.kind === filter,
  );

  return (
    <>
      <div className="mt-28 grid gap-x-6 gap-y-10 border-t border-line pt-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <div className="md:sticky md:top-24">
            <ul className="mt-8 flex flex-wrap gap-2 md:flex-col md:items-start">
              {kinds.map((kind) => (
                <li key={kind}>
                  <button
                    type="button"
                    aria-pressed={filter === kind}
                    onClick={() => setFilter(kind)}
                    className={`rounded-md px-2.5 py-1 font-display text-[15px] font-medium transition-colors ${
                      filter === kind
                        ? "bg-ink text-paper"
                        : "bg-paper-deep text-muted hover:text-ink"
                    }`}
                  >
                    {kind}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-x-4 gap-y-12 sm:grid-cols-2 md:col-span-9 lg:grid-cols-3">
          {visible.map((entry, step) => (
            <li key={entry.item.project.id}>
              <Card
                entry={entry}
                step={step}
                onOpen={() => setActive(entry.index)}
              />
            </li>
          ))}
        </ul>
      </div>

      <ProjectModal items={items} active={active} onChange={setActive} />
    </>
  );
}
