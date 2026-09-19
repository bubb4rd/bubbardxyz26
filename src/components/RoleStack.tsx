"use client";

import { useEffect, useRef, useState } from "react";
import { delay } from "@/lib/reveal";
import { useMediaQuery } from "@/lib/useMediaQuery";

const VISIBLE = 1;
const INTERVAL_MS = 2400;
const SLIDE_MS = 800;
// Rows are a little taller than the line so descenders don't spill into the
// neighbouring row.
const ROW = "1.2em";

/**
 * Rotates through the roles vertically, one at a time, in vermilion. Each step
 * slides the current role up and out while the next rises in from below. Rows
 * are a fixed height, so the slide distance is just one row. `VISIBLE` can be
 * raised to show several at once (the lower ones slide up into the gap). Pauses
 * on hover; with reduced motion it holds the first role.
 */
export default function RoleStack({
  roles,
  className = "",
}: {
  roles: string[];
  className?: string;
}) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", false);
  const count = roles.length;
  const visible = Math.min(VISIBLE, count);

  const pausedRef = useRef(false);
  const [step, setStep] = useState(0);
  const [animate, setAnimate] = useState(true);

  // Advance one role at a time. Holds while a wrap-around reset is pending.
  useEffect(() => {
    if (reduced || count <= visible) return;
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setStep((s) => (s >= count ? s : s + 1));
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [reduced, count, visible]);

  // The list is rendered twice, so after a full cycle the view matches step 0:
  // jump back without animating.
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

  return (
    <div
      data-reveal
      style={delay(4)}
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
      className={`font-display text-[clamp(1.375rem,2.2vw,2rem)] leading-[1.2] text-vermilion ${className}`}
    >
      <span className="sr-only">Roles: {roles.join(", ")}</span>
      <div
        aria-hidden
        className="overflow-hidden"
        style={{ height: `calc(${visible} * ${ROW})` }}
      >
        <div
          style={{
            transform: `translateY(calc(${-step} * ${ROW}))`,
            transition:
              animate && !reduced
                ? `transform ${SLIDE_MS}ms var(--ease)`
                : "none",
          }}
        >
          {[...roles, ...roles].map((role, i) => (
            <div key={i} className="whitespace-nowrap" style={{ height: ROW }}>
              {role}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
