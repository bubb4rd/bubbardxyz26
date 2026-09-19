import { delay } from "@/lib/reveal";
import { profile } from "@/data/profile";
import HeroBackdrop from "./HeroBackdrop";
import RoleStack from "./RoleStack";
import Split from "./Split";
import Stamp from "./Stamp";

const button =
  "px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors";

/**
 * Graphite hero: a small centred block (name, rolling role, résumé buttons)
 * floats above an oversized BUBBARD wordmark that fills the width and is
 * cropped by the bottom edge.
 */
export default function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden">
      <HeroBackdrop />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-[12vw] pt-28 text-center sm:px-10">
        <p
          data-reveal
          style={delay(3)}
          className="font-display text-[clamp(2rem,4.2vw,3.5rem)] font-semibold leading-none tracking-[-0.03em]"
        >
          {profile.name}
        </p>

        <RoleStack roles={profile.roles} className="mt-4 text-center" />

        <div
          data-reveal
          style={delay(6)}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="/cv.pdf"
            download="Bo-Hubbard-CV.pdf"
            className={`${button} rounded-md bg-ink text-paper hover:bg-vermilion`}
          >
            Download CV ↓
          </a>
          <a
            href="#about"
            className={`${button} hover:border-vermilion hover:text-vermilion`}
          >
            Learn more
          </a>
        </div>

        <p
          data-reveal
          style={delay(7)}
          className="mt-8 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em]"
        >
          <span
            aria-hidden
            className="pulse-dot inline-block size-1.5 rounded-full bg-vermilion"
          />
          Available for hire
        </p>
      </div>

      <Stamp className="absolute bottom-[19vw] right-[7%] z-20 max-sm:hidden" />

      <h1
        data-reveal="words"
        aria-label="BUBBARD"
        className="relative z-10 -mb-[2.2vw] flex select-none justify-center whitespace-nowrap [&>.word]:shrink-0 font-display text-[16.9vw] font-black uppercase leading-[0.8] tracking-[0.03em] text-ink [font-stretch:105%]"
      >
        <Split parts={["BUBBARD"]} by="char" />
      </h1>
    </section>
  );
}
