import { existsSync } from "node:fs";
import path from "node:path";
import { projects } from "@/data/projects";
import ProjectGallery, { type GalleryItem } from "./ProjectGallery";
import Split from "./Split";

const pad = (n: number) => String(n).padStart(2, "0");

function resolveImage(src: string) {
  if (src.startsWith("http")) return src;
  return existsSync(path.join(process.cwd(), "public", src)) ? src : null;
}

const items: GalleryItem[] = projects.map((project) => ({
  project,
  src: resolveImage(project.image),
}));

export default function Gallery() {
  return (
    <section
      id="work"
      className="px-6 py-[clamp(4.5rem,10vw,8.75rem)] sm:px-10"
    >
      <div
        data-reveal="fade"
        className="flex items-end justify-between border-t border-line pt-4 font-mono text-[11px] uppercase tracking-[0.14em]"
      >
        <span>
          <span className="text-vermilion">§01</span> — Selected work
        </span>
        <span className="text-muted">{pad(items.length)} works</span>
      </div>

      <h2
        data-reveal="words"
        className="mt-10 max-w-[16ch] font-display text-[clamp(2rem,4.6vw,4rem)] leading-[1] tracking-[-0.03em]"
      >
        <Split
          parts={["Things I’ve", { text: "designed", em: true, className: "text-vermilion" }, "and built."]}
        />
      </h2>

      <ProjectGallery items={items} />
    </section>
  );
}
