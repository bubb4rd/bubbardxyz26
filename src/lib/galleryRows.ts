export type RowVariant =
  | "feature-solo" // featured project alone, full width
  | "feature-left" // featured (wide) + the next project beside it
  | "feature-right" // a lone project before a featured one, then the feature
  | "stagger" // three frames stepping down
  | "duo" // wide landscape + tall portrait
  | "duo-flip" // the same, mirrored
  | "even" // three equal frames on one line
  | "solo"; // a single leftover project

export type Row = { variant: RowVariant; indices: number[] };

const CYCLE = ["stagger", "duo", "even"] as const;
const SIZE = { stagger: 3, duo: 2, even: 3 } as const;

/**
 * Lays projects out in order, given which of them are featured.
 *
 * - A featured project gets a wide frame. The next project (if it isn't also
 *   featured) sits beside it; otherwise the feature takes the whole row.
 * - A single ordinary project sitting right before a featured one pairs with
 *   it, so it isn't stranded on a row of its own.
 * - Other projects cycle through the stagger / duo / even layouts, never
 *   leaving a lone project at the end of the list.
 */
export function planRows(featured: boolean[]): Row[] {
  const rows: Row[] = [];
  const count = featured.length;
  let cycle = 0;
  let duos = 0;
  let i = 0;

  while (i < count) {
    if (featured[i]) {
      if (i + 1 < count && !featured[i + 1]) {
        rows.push({ variant: "feature-left", indices: [i, i + 1] });
        i += 2;
      } else {
        rows.push({ variant: "feature-solo", indices: [i] });
        i += 1;
      }
      continue;
    }

    let end = i;
    while (end < count && !featured[end]) end++;
    const remaining = end - i;
    const beforeFeature = end < count;

    if (remaining === 1 && beforeFeature) {
      rows.push({ variant: "feature-right", indices: [i, end] });
      i = end + 1;
      continue;
    }

    const preferred = CYCLE[cycle++ % CYCLE.length];
    let size: number = SIZE[preferred];
    if (remaining <= 3) {
      size = remaining;
    } else if (remaining - size === 1 && !beforeFeature) {
      size = size === 3 ? 2 : 3;
    }

    let variant: RowVariant;
    if (size === 1) variant = "solo";
    else if (size === 2) variant = duos++ % 2 === 0 ? "duo" : "duo-flip";
    else variant = SIZE[preferred] === 3 ? preferred : "stagger";

    rows.push({
      variant,
      indices: Array.from({ length: size }, (_, k) => i + k),
    });
    i += size;
  }

  return rows;
}
