"use client";

import { useEffect } from "react";

/**
 * Marks every [data-reveal] element as visible once it scrolls into view.
 * The animation itself is pure CSS (see globals.css), so server components
 * only need to add the attribute.
 */
export default function RevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-in", "true");
          observer.unobserve(entry.target);
        }
      },
      // No bottom rootMargin: items at the very end of the page (the footer)
      // would otherwise never get far enough into view to trigger.
      { threshold: 0.15 },
    );

    const watch = (root: ParentNode) =>
      root
        .querySelectorAll("[data-reveal]:not([data-in])")
        .forEach((element) => observer.observe(element));

    watch(document);

    // Pick up elements rendered after mount (client-side updates, hot reload);
    // otherwise they'd stay hidden forever.
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches("[data-reveal]:not([data-in])")) observer.observe(node);
          watch(node);
        });
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  return null;
}
