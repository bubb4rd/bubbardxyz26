import type { CSSProperties } from "react";

/**
 * Drifting orbs, from one huge wash down to tiny motes. Position/size are in %
 * of the hero, `tone` is the peak alpha of the pale-grey core (low values read
 * as dim, moody orbs), `blur` is px (small orbs need less or they vanish),
 * `dur` is the seconds for one drift, and `from`/`to` are the translate (% of
 * the orb's own size) and scale it eases between. Negative delays stagger them
 * so they never start in sync.
 */
const orbs = [
  { left: -10, top: -8, w: 80, h: 70, tone: 0.16, blur: 90, dur: 28, delay: -8, from: [-6, -4, 1], to: [10, 8, 1.12] },
  { left: 8, top: 4, w: 60, h: 55, tone: 0.3, blur: 60, dur: 14, delay: 0, from: [-8, -4, 1], to: [14, 8, 1.15] },
  { left: 52, top: 22, w: 46, h: 46, tone: 0.22, blur: 60, dur: 20, delay: -6, from: [6, 6, 1.1], to: [-16, -6, 0.9] },
  { left: 66, top: 0, w: 30, h: 34, tone: 0.1, blur: 50, dur: 22, delay: -4, from: [8, -6, 1], to: [-20, 14, 1.25] },
  { left: 30, top: 44, w: 18, h: 22, tone: 0.16, blur: 36, dur: 17, delay: -9, from: [-14, 4, 1.15], to: [12, -10, 0.85] },
  { left: -4, top: 30, w: 12, h: 15, tone: 0.12, blur: 24, dur: 26, delay: -11, from: [-4, 10, 0.9], to: [18, -12, 1.3] },
  { left: 14, top: 10, w: 10, h: 12, tone: 0.1, blur: 20, dur: 24, delay: -2, from: [-6, -8, 1.2], to: [24, 12, 0.9] },
  { left: 76, top: 40, w: 7, h: 9, tone: 0.08, blur: 14, dur: 30, delay: -15, from: [4, 8, 0.9], to: [-22, -8, 1.4] },
  { left: 44, top: 8, w: 5, h: 6, tone: 0.16, blur: 10, dur: 19, delay: -5, from: [-10, 6, 1], to: [16, -14, 1.3] },
] as const;

/** Grainy graphite scene behind the hero: pale glow, falling to the page colour. */
export default function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="hero-scene absolute inset-0" />
      {orbs.map((o, i) => {
        // Translate is relative to the orb's own size, so smaller orbs travel
        // proportionally further to cover a similar distance on screen.
        const k = Math.max(1, 60 / o.w);
        return (
          <div
            key={i}
            className="hero-glow absolute"
            style={
              {
                left: `${o.left}%`,
                top: `${o.top}%`,
                width: `${o.w}%`,
                height: `${o.h}%`,
                "--tone": o.tone,
                "--blur": `${o.blur}px`,
                "--dur": `${o.dur}s`,
                "--delay": `${o.delay}s`,
                "--x0": `${o.from[0] * k}%`,
                "--y0": `${o.from[1] * k}%`,
                "--s0": o.from[2],
                "--x1": `${o.to[0] * k}%`,
                "--y1": `${o.to[1] * k}%`,
                "--s1": o.to[2],
              } as CSSProperties
            }
          />
        );
      })}
      <div className="hero-halftone absolute inset-0" />
    </div>
  );
}
