import { existsSync } from "node:fs";
import path from "node:path";
import { projects } from "@/data/projects";
import type { GalleryItem } from "./ProjectGallery";
import Split from "./Split";
import WorkExplorer from "./WorkExplorer";

const pad = (n: number) => String(n).padStart(2, "0");

function resolveImage(src: string) {
  if (src.startsWith("http")) return src;
  return existsSync(path.join(process.cwd(), "public", src)) ? src : null;
}

const items: GalleryItem[] = projects.map((project) => ({
  project,
  src: resolveImage(project.image),
  previewSrc: project.preview ? resolveImage(project.preview) : null,
}));

const heading =
  "font-display text-[clamp(3rem,9vw,8.5rem)] font-bold leading-[0.9] tracking-[-0.05em]";

/**
 * Light "Selected work" band: a huge heading with a count, featured stories
 * first, then every project in a filterable grid.
 */
export default function Work() {
  return (
    <section
      id="work"
      className="theme-light bg-paper px-6 py-[clamp(4.5rem,10vw,8.75rem)] text-ink sm:px-10"
    >
      <div className="flex items-end justify-between gap-6">
        <h2 data-reveal="words" className={`${heading} max-w-[9ch]`}>
          <Split parts={["Selected", "work"]} />
        </h2>
        <span aria-hidden data-reveal="fade" className={heading}>
          {pad(items.length)}
        </span>
      </div>

      <WorkExplorer items={items} />
    </section>
  );
}
