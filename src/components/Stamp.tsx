import { delay } from "@/lib/reveal";

/** Round "Selected work" stamp: text ring rotates, the arrow stays put. */
export default function Stamp({ className = "" }: { className?: string }) {
  return (
    <a
      href="#work"
      aria-label="Scroll to selected work"
      data-reveal="fade"
      style={delay(6)}
      className={`group grid size-28 place-items-center rounded-full bg-paper text-vermilion shadow-[0_0_0_1px_var(--line)] ${className}`}
    >
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        className="stamp-ring col-start-1 row-start-1 size-full"
      >
        <defs>
          <path
            id="stamp-path"
            d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0"
          />
        </defs>
        <text
          fontSize="8.4"
          fontFamily="var(--font-geist-mono), monospace"
          fill="currentColor"
        >
          <textPath href="#stamp-path" textLength="228" lengthAdjust="spacing">
            SELECTED WORK · SELECTED WORK · SELECTED WORK · 
          </textPath>
        </text>
      </svg>
      <span
        aria-hidden
        className="col-start-1 row-start-1 text-2xl transition-transform duration-300 group-hover:translate-y-1"
      >
        ↓
      </span>
    </a>
  );
}
