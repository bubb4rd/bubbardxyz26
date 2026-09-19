"use client";

import { useState } from "react";

type Status = "idle" | "copied" | "failed";

const labels: Record<Status, string> = {
  idle: "Copy",
  copied: "Copied ✓",
  failed: "Copy failed",
};

export default function CopyButton({ text }: { text: string }) {
  const [status, setStatus] = useState<Status>("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    setTimeout(() => setStatus("idle"), 1800);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-vermilion"
    >
      {labels[status]}
    </button>
  );
}
