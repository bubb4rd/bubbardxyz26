import { Fragment, type CSSProperties } from "react";

type Part = string | { text: string; em?: boolean; className?: string };

/**
 * Splits text into masked words (or single letters with `by="char"`) for the
 * `data-reveal="words"` animation. Put it inside an element that carries that
 * attribute.
 */
export default function Split({
  parts,
  by = "word",
}: {
  parts: Part[];
  by?: "word" | "char";
}) {
  const words = parts.flatMap((part) => {
    const { text, em, className } =
      typeof part === "string"
        ? { text: part, em: false, className: "" }
        : { em: false, className: "", ...part };
    const pieces = by === "char" ? [...text] : text.split(" ").filter(Boolean);
    return pieces.map((word) => ({ word, em, className }));
  });

  return (
    <>
      {words.map(({ word, em, className }, i) => (
        <Fragment key={i}>
          <span className="word">
            <span className="word-in" style={{ "--i": i } as CSSProperties}>
              {em ? <em className={className}>{word}</em> : word}
            </span>
          </span>
          {by === "word" && " "}
        </Fragment>
      ))}
    </>
  );
}
