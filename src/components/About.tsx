import Image from "next/image";
import { profile } from "@/data/profile";
import { delay } from "@/lib/reveal";
import ScrollWords, { type Token } from "./ScrollWords";

const words = (text: string, em = false): Token[] =>
  text
    .split(" ")
    .filter(Boolean)
    .map((word) => ({ word, em }));

const [lead, ...body] = [
  "I am a Computer Science graduate based in Chicago, IL. I like to combine technical development with my eye for design, aiming to create products and software that are intuitive and engaging.",
  "My passion for problem-solving drives everything I do. I’m motivated, competitive, and persistent. I like the challenge of turning complex ideas into real solutions, especially if they improve how people interact with technology. I am always looking for ways to make software more meaningful and effective.",
  "My roots in technology started early through playing video games and building on sandbox platforms like Roblox, where I discovered the crossroads of problem-solving and creativity. That foundation continues to shape my approach — curious, iterative, and focused.",
];

const statement: Token[] = words(lead);

const ledger = [
  ["Degree", "B.S.", `Computer Science · Class of ${profile.graduated}`],
  ["School", "ASU", profile.school],
  ["Based in", "Chicago", "Illinois"],
  ["Focus", "Web + iOS", "Design · Engineering · Identity"],
];

export default function About() {
  return (
    <section
      id="about"
      className="px-6 py-[clamp(4.5rem,10vw,8.75rem)] sm:px-10"
    >
      <div
        data-reveal="fade"
        className="flex items-end justify-between border-t border-line pt-4 font-mono text-[11px] uppercase tracking-[0.14em]"
      >
        <span>
          <span className="text-vermilion">§02</span> — About
        </span>
        <span className="text-muted">Class of {profile.graduated}</span>
      </div>

      <h2 className="sr-only">About {profile.name}</h2>

      <div className="mt-12 grid gap-x-6 gap-y-12 md:grid-cols-12">
        <div className="md:col-span-8">
          <ScrollWords
            tokens={statement}
            className="font-display text-[clamp(1.5rem,3vw,2.75rem)] font-medium leading-[1.15] tracking-[-0.02em]"
          />

          <div className="mt-14 grid gap-x-10 gap-y-6 md:grid-cols-2">
            {body.map((text, i) => (
              <p
                key={i}
                data-reveal
                style={delay(i * 2)}
                className="text-base leading-relaxed text-ink/80"
              >
                {text}
              </p>
            ))}
          </div>
        </div>

        <figure className="max-w-xs md:sticky md:top-24 md:col-span-4 md:col-start-9 md:max-w-none md:self-start lg:col-span-3 lg:col-start-10">
          <div data-reveal="clip" style={delay(2)}>
            <div className="relative aspect-[4/5] overflow-hidden border border-line bg-paper-deep">
              <Image
                src="/images/bo-hubbard.jpg"
                alt={`${profile.name} in a graduation cap and gown`}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 320px"
                className="object-cover object-top"
              />
              <span className="absolute left-3 top-3 bg-paper/90 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]">
                Portrait
              </span>
            </div>
          </div>
          <figcaption
            data-reveal="fade"
            style={delay(4)}
            className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted"
          >
            Me — Commencement, May {profile.graduated}
          </figcaption>
        </figure>
      </div>

      <dl className="mt-20 grid border-t border-line sm:grid-cols-2 md:grid-cols-4">
        {ledger.map(([label, value, sub], i) => (
          <div
            key={label}
            data-reveal
            style={delay(i)}
            className="group border-b border-line py-6 md:border-b-0 md:border-l md:px-6 md:first:border-l-0 md:first:pl-0"
          >
            <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              {label}
            </dt>
            <dd>
              <span className="mt-6 block font-display text-[clamp(2rem,3.6vw,3.25rem)] leading-none tracking-[-0.03em] transition-colors duration-200 group-hover:text-vermilion">
                {value}
              </span>
              <span className="mt-3 block font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                {sub}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
