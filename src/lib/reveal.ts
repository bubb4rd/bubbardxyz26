import type { CSSProperties } from "react";

/** Stagger step (in 90ms units) consumed by the [data-reveal] CSS in globals.css. */
export const delay = (step: number) => ({ "--d": step }) as CSSProperties;
