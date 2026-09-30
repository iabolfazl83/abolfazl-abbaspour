"use client";

import { useCallback, useEffect, useRef } from "react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#01ABCDEFXYZ";

type Props = {
  text: string;
  className?: string;
  /** "hover" scrambles on pointer enter, "view" once when scrolled into view. */
  trigger?: "hover" | "view" | "both";
};

/** Decodes text frame by frame, like a terminal resolving a signal. */
export default function Scramble({ text, className, trigger = "hover" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const raf = useRef(0);

  const run = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const total = text.length;
    // Time-based so it always resolves in ~0.3s + 35ms per char, whatever the frame rate.
    const step = (now: number) => {
      const elapsed = now - start;
      let out = "";
      let resolved = 0;
      for (let i = 0; i < total; i++) {
        const ch = text[i];
        if (ch === " " || elapsed >= 260 + i * 35) {
          out += ch;
          resolved++;
        } else {
          out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }
      el.textContent = out;
      if (resolved < total) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  }, [text]);

  useEffect(() => {
    if (trigger === "hover") return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf.current);
    };
  }, [run, trigger]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true" onPointerEnter={trigger === "view" ? undefined : run}>
        {text}
      </span>
    </span>
  );
}
