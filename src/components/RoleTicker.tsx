"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";

const INTERVAL_MS = 2800;
const SLIDE_MS = 900;

type Metric = { left: number; right: number };

/**
 * Rotates through `roles`, showing two at a time (one on small screens).
 * Each step slides the left role out, slides the right role into its place
 * and brings the next one in from the right. Item positions are measured, so
 * the window follows the real text widths.
 */
export default function RoleTicker({
  roles,
  className = "",
}: {
  roles: string[];
  className?: string;
}) {
  const wide = useMediaQuery("(min-width: 640px)", true);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", false);
  const count = roles.length;
  const visible = Math.min(wide ? 2 : 1, count);

  const trackRef = useRef<HTMLSpanElement>(null);
  const pausedRef = useRef(false);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [step, setStep] = useState(0);
  const [animate, setAnimate] = useState(true);

  // Measure each role's text box; re-measure when the track resizes (fonts).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () =>
      setMetrics(
        Array.from(track.querySelectorAll<HTMLElement>("[data-rt]"), (el) => ({
          left: el.offsetLeft,
          right: el.offsetLeft + el.offsetWidth,
        })),
      );
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  // Advance one role at a time. Holds while a wrap-around reset is pending.
  useEffect(() => {
    if (reduced || count <= visible) return;
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setStep((s) => (s >= count ? s : s + 1));
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [reduced, count, visible]);

  // The list is rendered twice, so once we've slid a full cycle the view is
  // identical to step 0: jump back without animating.
  useEffect(() => {
    if (step < count) return;
    const id = setTimeout(() => {
      setAnimate(false);
      setStep((s) => s - count);
    }, SLIDE_MS + 50);
    return () => clearTimeout(id);
  }, [step, count]);

  useEffect(() => {
    if (animate) return;
    const id = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(id);
  }, [animate]);

  const current = metrics[step];
  const last = metrics[step + visible - 1];
  const ready = Boolean(current && last);
  const animated = animate && !reduced;
  const slide = (property: string) =>
    animated ? `${property} ${SLIDE_MS}ms var(--ease)` : "none";

  return (
    <p
      className={className}
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <span className="sr-only">{roles.join(", ")}</span>
      <span
        aria-hidden
        data-ready={ready ? "" : undefined}
        className="rt-window -mx-[0.1em] -my-[0.2em] inline-block overflow-hidden px-[0.1em] py-[0.2em] align-bottom"
        style={
          current && last
            ? {
                width: `calc(${last.right - current.left}px + 0.2em)`,
                transition: slide("width"),
              }
            : undefined
        }
      >
        <span
          ref={trackRef}
          className="relative flex w-max whitespace-nowrap"
          style={{
            transform: current ? `translateX(${-current.left}px)` : undefined,
            transition: slide("transform"),
          }}
        >
          {[...roles, ...roles].map((role, i) => (
            <span key={i} className={i >= count ? "rt-dup flex" : "flex"}>
              {i > 0 && (
                <span className="mx-[0.55em] not-italic text-muted">/</span>
              )}
              <span data-rt className="text-vermilion">
                {role}
              </span>
            </span>
          ))}
        </span>
      </span>
    </p>
  );
}
