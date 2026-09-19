import { contact } from "@/data/contact";
import { delay } from "@/lib/reveal";
import CopyButton from "./CopyButton";
import Split from "./Split";

export default function Contact() {
  return (
    <section
      id="contact"
      className="px-6 pt-[clamp(4.5rem,10vw,8.75rem)] sm:px-10"
    >
      <div
        data-reveal="fade"
        className="flex items-end justify-between border-t border-line pt-4 font-mono text-[11px] uppercase tracking-[0.14em]"
      >
        <span>
          <span className="text-vermilion">§03</span> — Contact
        </span>
        <span className="flex items-center gap-2">
          <span
            aria-hidden
            className="pulse-dot inline-block size-1.5 rounded-full bg-vermilion"
          />
          Available for hire
        </span>
      </div>

      <h2
        data-reveal="words"
        className="mt-10 max-w-[14ch] font-display text-[clamp(2.25rem,6vw,5.5rem)] leading-[1] tracking-[-0.03em]"
      >
        <Split
          parts={[
            "Let’s make",
            { text: "something", em: true, className: "text-vermilion" },
            "worth looking at.",
          ]}
        />
      </h2>

      <div
        data-reveal
        style={delay(4)}
        className="mt-14 flex flex-wrap items-baseline gap-x-8 gap-y-3"
      >
        <a
          href={`mailto:${contact.email}`}
          className="group break-all border-b border-ink/30 pb-1 font-display text-[clamp(1.25rem,3.4vw,3rem)] leading-none transition-colors hover:border-vermilion hover:text-vermilion"
        >
          {contact.email}{" "}
          <span
            aria-hidden
            className="inline-block transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
          >
            ↗
          </span>
        </a>
        <CopyButton text={contact.email} />
      </div>

      <dl
        data-reveal
        style={delay(5)}
        className="mt-20 grid gap-4 border-t border-line pt-4 font-mono text-[11px] uppercase tracking-[0.14em] md:grid-cols-12"
      >
        <dt className="text-muted md:col-span-3">Elsewhere</dt>
        <dd className="flex flex-wrap gap-x-8 gap-y-2 md:col-span-9">
          {contact.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-vermilion"
            >
              {link.label} ↗
            </a>
          ))}
        </dd>
      </dl>
    </section>
  );
}
