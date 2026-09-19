import Image from "next/image";
import type { Project } from "@/data/projects";

type Props = {
  project: Project;
  /** Resolved image source, or null when the file isn't available yet. */
  src: string | null;
  index: number;
  sizes: string;
  /** Overrides `project.focus`, e.g. for an image that is already square. */
  focus?: string;
  className?: string;
};

export const pad = (n: number) => String(n).padStart(2, "0");

export default function ProjectVisual({
  project,
  src,
  index,
  sizes,
  focus,
  className = "",
}: Props) {
  if (src) {
    return (
      <Image
        src={src}
        alt={`${project.title} — ${project.subtitle}`}
        fill
        sizes={sizes}
        style={{ objectPosition: focus ?? project.focus ?? "50% 0%" }}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div className="absolute inset-0 grid place-items-center">
      <span className="font-display font-black text-[clamp(6rem,14vw,12rem)] leading-none text-ink/10">
        {pad(index + 1)}
      </span>
      <span className="absolute bottom-3 left-3 font-mono text-[10px] text-muted">
        {project.image}
      </span>
    </div>
  );
}
