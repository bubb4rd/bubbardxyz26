"use client";

import { useEffect, useRef } from "react";
import type { GalleryItem } from "./ProjectGallery";
import ProjectVisual, { pad } from "./ProjectVisual";

type Props = {
  items: GalleryItem[];
  active: number | null;
  onChange: (index: number | null) => void;
};

const monoLabel = "font-mono text-[11px] uppercase tracking-[0.14em]";

export default function ProjectModal({ items, active, onChange }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (active !== null && !dialog.open) dialog.showModal();
    if (active === null && dialog.open) dialog.close();
  }, [active]);

  const item = active === null ? null : items[active];

  function go(index: number) {
    onChange(index);
    ref.current?.scrollTo({ top: 0 });
  }

  const prev = active === null ? null : (active - 1 + items.length) % items.length;
  const next = active === null ? null : (active + 1) % items.length;

  return (
    <dialog
      ref={ref}
      onClose={() => onChange(null)}
      aria-labelledby="project-title"
      className="modal m-0 h-dvh max-h-none w-screen max-w-none overflow-y-auto bg-paper p-0 text-ink"
    >
      {item && active !== null && prev !== null && next !== null && (
        <>
          <div
            className={`sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper/90 px-6 py-4 backdrop-blur sm:px-10 ${monoLabel}`}
          >
            <span>
              <span className="text-vermilion">{items[active].project.title}</span> —
              Selected work
            </span>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="transition-colors hover:text-vermilion"
            >
              Close <span className="text-muted">[Esc]</span>
            </button>
          </div>

          <article className="px-6 pb-24 sm:px-10">
            <header className="pt-12 md:pt-16">
              <p className={`${monoLabel} text-muted`}>
                {item.project.category === "design" ? "Design" : "Engineering"}
              </p>
              <h2
                id="project-title"
                className="mt-4 font-display text-[clamp(2.25rem,6vw,5rem)] leading-[1] tracking-[-0.03em]"
              >
                {item.project.title}
              </h2>
              <p className="mt-3 font-display text-xl text-muted">
                {item.project.subtitle}
              </p>
            </header>

            <div className="relative mt-10 aspect-[16/9] overflow-hidden border border-line bg-paper-deep">
              <ProjectVisual
                project={item.project}
                src={item.src}
                index={active}
                sizes="100vw"
              />
            </div>

            <div className="mt-14 grid gap-12 md:grid-cols-12">
              <aside className="md:sticky md:top-24 md:col-span-4 md:self-start">
                <dl className={`divide-y divide-line border-y border-line ${monoLabel}`}>
                  <div className="grid grid-cols-[5rem_1fr] gap-4 py-3">
                    <dt className="text-muted">Type</dt>
                    <dd>
                      {item.project.category === "design"
                        ? "Design"
                        : "Engineering"}
                    </dd>
                  </div>
                  <div className="grid grid-cols-[5rem_1fr] gap-4 py-3">
                    <dt className="text-muted">Stack</dt>
                    <dd className="space-y-1">
                      {item.project.tags.map((tag) => (
                        <div key={tag}>{tag}</div>
                      ))}
                    </dd>
                  </div>
                  <div className="grid grid-cols-[5rem_1fr] gap-4 py-3">
                    <dt className="text-muted">Link</dt>
                    <dd>
                      <a
                        href={item.project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-vermilion underline-offset-4 hover:underline"
                      >
                        {item.project.href.includes("github.com")
                          ? "View source"
                          : "Visit project"}{" "}
                        ↗
                      </a>
                    </dd>
                  </div>
                </dl>
              </aside>

              <div className="md:col-span-7 md:col-start-6">
                <p className="font-display text-[clamp(1.25rem,2vw,1.75rem)] font-medium leading-[1.3]">
                  {item.project.description}
                </p>

                {item.project.highlights && (
                  <ul className="mt-12 divide-y divide-line border-y border-line">
                    {item.project.highlights.map((line, i) => (
                      <li
                        key={line}
                        className="grid grid-cols-[3rem_1fr] gap-4 py-4 text-[15px] leading-relaxed"
                      >
                        <span className={`${monoLabel} pt-0.5 text-vermilion`}>
                          {pad(i + 1)}
                        </span>
                        {line}
                      </li>
                    ))}
                  </ul>
                )}

                {item.project.sections?.map((section) => (
                  <section key={section.heading} className="mt-14">
                    <h3 className="font-display text-2xl leading-none">
                      {section.heading}
                    </h3>
                    <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed text-ink/80">
                      {section.body}
                    </p>
                  </section>
                ))}
              </div>
            </div>

            <nav
              aria-label="More projects"
              className="mt-24 grid gap-6 border-t border-line pt-6 sm:grid-cols-2"
            >
              {[
                { index: prev, label: "← Previous" },
                { index: next, label: "Next →" },
              ].map(({ index, label }, i) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => go(index)}
                  className={`group text-left ${i === 1 ? "sm:text-right" : ""}`}
                >
                  <span className={`${monoLabel} text-muted`}>
                    {label} · Fig. {pad(index + 1)}
                  </span>
                  <span className="mt-2 block font-display text-2xl leading-none transition-colors group-hover:text-vermilion">
                    {items[index].project.title}
                  </span>
                </button>
              ))}
            </nav>
          </article>
        </>
      )}
    </dialog>
  );
}
