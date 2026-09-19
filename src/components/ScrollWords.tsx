"use client";

import { Fragment, useEffect, useRef } from "react";

export type Token = { word: string; em?: boolean };

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/**
 * A paragraph whose words fill from faint to full ink as it scrolls through
 * the viewport. Opacity is written straight to the DOM in a rAF loop, so
 * scrolling never re-renders React.
 */
export default function ScrollWords({
  tokens,
  className = "",
}: {
  tokens: Token[];
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-sw]"));
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.35;
      const progress = clamp((start - rect.top) / (start - end + rect.height));

      nodes.forEach((node, i) => {
        const t = clamp((progress * (nodes.length + 4) - i) / 4);
        node.style.opacity = String(0.18 + 0.82 * t);
      });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <p ref={ref} className={className}>
      {tokens.map((token, i) => (
        <Fragment key={i}>
          <span data-sw className="sw">
            {token.em ? <em>{token.word}</em> : token.word}
          </span>{" "}
        </Fragment>
      ))}
    </p>
  );
}
