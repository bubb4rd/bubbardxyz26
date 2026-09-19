import Clock from "./Clock";

const links = ["Work", "About", "Contact"];

/** Fixed bar: wordmark left, links centred, clock and a bordered button right. */
export default function Nav() {
  return (
    <header
      data-reveal="fade"
      className="fixed inset-x-0 top-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center px-6 py-4 text-white mix-blend-difference sm:px-10"
    >
      <a
        href="#"
        className="font-display text-sm font-extrabold tracking-[0.04em] [font-stretch:125%]"
      >
        BUBBARD
      </a>

      <nav className="hidden gap-8 font-mono text-[11px] uppercase tracking-[0.14em] sm:flex">
        {links.map((label) => (
          <a
            key={label}
            href={`#${label.toLowerCase()}`}
            className="text-white/70 transition-colors hover:text-white"
          >
            {label}
          </a>
        ))}
      </nav>

      <div className="col-start-3 flex items-center justify-end gap-5">
        <a
          href="#contact"
          className="rounded-md border border-white/60 px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors bg-white text-black hover:bg-vermilion hover:border-vermilion hover:text-white"
        >
          Get in touch
        </a>
      </div>
    </header>
  );
}
