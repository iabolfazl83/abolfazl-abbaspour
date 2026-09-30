"use client";

import { useEffect, useRef } from "react";

const two = (n: number) => String(n).padStart(2, "0");

/** A recording-style timecode that ticks at 24 frames per second. */
export default function HudTimecode({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    let lastFrame = -1;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const total = Math.floor(((now - start) / 1000) * 24);
      if (total === lastFrame || !ref.current) return;
      lastFrame = total;
      const f = total % 24;
      const s = Math.floor(total / 24) % 60;
      const m = Math.floor(total / 1440) % 60;
      const h = Math.floor(total / 86400);
      ref.current.textContent = `${two(h)}:${two(m)}:${two(s)}:${two(f)}`;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      00:00:00:00
    </span>
  );
}
