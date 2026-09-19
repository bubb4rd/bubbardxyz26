"use client";

import { useSyncExternalStore } from "react";
import { profile } from "@/data/profile";

const timeZone = "America/Chicago";

const timeFormat = new Intl.DateTimeFormat("en-US", {
  timeZone,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});

const dateFormat = new Intl.DateTimeFormat("en-US", {
  timeZone,
  weekday: "long",
  month: "short",
  day: "numeric",
  year: "numeric",
});

const offsetFormat = new Intl.DateTimeFormat("en-US", {
  timeZone,
  timeZoneName: "shortOffset",
});

/** "GMT-5" → "GMT -5", so it also follows daylight saving. */
function offsetLabel(date: Date) {
  const part = offsetFormat
    .formatToParts(date)
    .find((p) => p.type === "timeZoneName");
  return (part?.value ?? "GMT").replace(/GMT([+-])/, "GMT $1");
}

// The snapshot is whole seconds since the epoch: stable within a second (so
// React doesn't re-render needlessly) and 0 on the server, which renders the
// placeholder until the client takes over.
function subscribe(onTick: () => void) {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
}

const getSnapshot = () => Math.floor(Date.now() / 1000);
const getServerSnapshot = () => 0;

const line = "block";

/**
 * Full-width dark band: Chicago time and date on the left, back-to-top and
 * availability in the middle, copyright on the right.
 */
export default function Footer() {
  const seconds = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const now = seconds ? new Date(seconds * 1000) : null;

  return (
    <footer
      data-reveal="fade"
      className="mt-24 grid gap-x-8 gap-y-6 bg-[#111210] px-6 py-8 text-[clamp(1.125rem,1.9vw,1.75rem)] font-medium leading-[1.2] tracking-[-0.02em] sm:py-10 text-ink md:grid-cols-3 sm:px-10"
    >
      <p className="tabular-nums">
        <span className={line}>
          Chicago {now ? timeFormat.format(now) : "--:--:-- --"}
        </span>
        <span className={line}>
          {now ? `${dateFormat.format(now)} (${offsetLabel(now)})` : " "}
        </span>
      </p>

      <p className="md:justify-self-center">
        <a href="#" className="group transition-colors hover:text-vermilion">
          Back to top{" "}
          <span
            aria-hidden
            className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5"
          >
            ↑
          </span>
        </a>
        <span className={line}>Available for hire</span>
      </p>

      <p className="self-end md:justify-self-end md:text-right">
        ©{new Date().getFullYear()} BUBBARD
      </p>
    </footer>
  );
}
