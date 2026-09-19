"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/data/projects";
import { planRows, type RowVariant } from "@/lib/galleryRows";
import { delay } from "@/lib/reveal";
import ProjectModal from "./ProjectModal";
import ProjectVisual, { pad } from "./ProjectVisual";

export type GalleryItem = {
  project: Project;
  /** Resolved image source, or null when the file isn't available yet. */
  src: string | null;
  /** Resolved square preview for gallery cards, when one exists. */
  previewSrc?: string | null;
};

type Slot = {
  col: string;
  ratio: string;
  offset: string;
  sizes: string;
  featured?: boolean;
};

const side = "(min-width: 768px) 33vw, 100vw";

// One entry per frame in a row, in visual order. Offsets and mixed ratios keep
// rows reading as pieces hung on a wall rather than a card grid.
const layouts: Record<RowVariant, Slot[]> = {
  "feature-solo": [
    {
      col: "md:col-span-12",
      ratio: "aspect-[4/3] md:aspect-[21/9]",
      offset: "",
      sizes: "100vw",
      featured: true,
    },
  ],
  "feature-left": [
    {
      col: "md:col-span-8",
      ratio: "aspect-[4/3] md:aspect-[16/10]",
      offset: "",
      sizes: "(min-width: 768px) 66vw, 100vw",
      featured: true,
    },
    { col: "md:col-span-4", ratio: "aspect-[4/5]", offset: "", sizes: side },
  ],
  "feature-right": [
    { col: "md:col-span-4", ratio: "aspect-[4/5]", offset: "", sizes: side },
    {
      col: "md:col-span-8",
      ratio: "aspect-[4/3] md:aspect-[16/10]",
      offset: "",
      sizes: "(min-width: 768px) 66vw, 100vw",
      featured: true,
    },
  ],
  stagger: [
    { col: "md:col-span-5", ratio: "aspect-[4/5]", offset: "", sizes: "(min-width: 768px) 42vw, 100vw" },
    { col: "md:col-span-4", ratio: "aspect-square", offset: "md:mt-24", sizes: side },
    { col: "md:col-span-3", ratio: "aspect-[3/4]", offset: "md:mt-48", sizes: "(min-width: 768px) 25vw, 100vw" },
  ],
  duo: [
    { col: "md:col-span-7", ratio: "aspect-[4/3]", offset: "", sizes: "(min-width: 768px) 58vw, 100vw" },
    { col: "md:col-span-5", ratio: "aspect-[4/5]", offset: "md:mt-20", sizes: "(min-width: 768px) 42vw, 100vw" },
  ],
  "duo-flip": [
    { col: "md:col-span-5", ratio: "aspect-[4/5]", offset: "md:mt-20", sizes: "(min-width: 768px) 42vw, 100vw" },
    { col: "md:col-span-7", ratio: "aspect-[4/3]", offset: "", sizes: "(min-width: 768px) 58vw, 100vw" },
  ],
  even: [
    { col: "md:col-span-4", ratio: "aspect-[4/3]", offset: "", sizes: side },
    { col: "md:col-span-4", ratio: "aspect-[4/3]", offset: "", sizes: side },
    { col: "md:col-span-4", ratio: "aspect-[4/3]", offset: "", sizes: side },
  ],
  solo: [
    { col: "md:col-span-7 md:col-start-2", ratio: "aspect-[3/2]", offset: "", sizes: "(min-width: 768px) 58vw, 100vw" },
  ],
};

function Frame({
  item,
  index,
  slot,
  step,
  onOpen,
}: {
  item: GalleryItem;
  index: number;
  slot: Slot;
  step: number;
  onOpen: () => void;
}) {
  const { project, src } = item;
  const featured = slot.featured;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className={`group block cursor-pointer text-left ${slot.col} ${slot.offset}`}
    >
      <div data-reveal="clip" style={delay(step * 2)}>
        <div
          className={`relative overflow-hidden border border-line bg-paper-deep transition-colors duration-300 group-hover:border-ink ${slot.ratio}`}
        >
          <ProjectVisual
            project={project}
            src={src}
            index={index}
            sizes={slot.sizes}
            className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />

          <span className="absolute left-3 top-3 bg-paper/90 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]">
            Fig. {pad(index + 1)}
            {featured && <span className="text-vermilion"> · Featured</span>}
          </span>
          <span className="absolute right-3 top-3 bg-paper/90 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-vermilion opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            Open ↗
          </span>
        </div>
      </div>

      <div className="mt-4" data-reveal style={delay(step * 2 + 2)}>
        <h3
          className={`font-display leading-none ${
            featured
              ? "text-3xl tracking-[-0.03em] md:text-4xl"
              : "text-2xl tracking-[-0.02em]"
          }`}
        >
          {project.title}
        </h3>
        <p
          className={`mt-1.5 font-display text-muted ${
            featured ? "text-base" : "text-sm"
          }`}
        >
          {project.subtitle}
        </p>
        {featured && (
          <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-ink/80">
            {project.description}
          </p>
        )}
        <p className="mt-3 font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-muted">
          {project.tags.join(" · ")}
        </p>
      </div>
    </button>
  );
}

export default function ProjectGallery({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState<number | null>(null);
  const rows = useMemo(
    () => planRows(items.map((item) => Boolean(item.project.featured))),
    [items],
  );

  return (
    <>
      <div className="mt-16 space-y-24">
        {rows.map((row, r) => (
          <div
            key={r}
            className="grid gap-x-6 gap-y-14 md:grid-cols-12 md:items-start"
          >
            {row.indices.map((itemIndex, step) => (
              <Frame
                key={items[itemIndex].project.id}
                item={items[itemIndex]}
                index={itemIndex}
                slot={layouts[row.variant][step]}
                step={step}
                onOpen={() => setActive(itemIndex)}
              />
            ))}
          </div>
        ))}
      </div>

      <ProjectModal items={items} active={active} onChange={setActive} />
    </>
  );
}
