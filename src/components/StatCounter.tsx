"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function StatCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const state = { v: 0 };
    el.textContent = `00${suffix}`;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () =>
        gsap.to(state, {
          v: value,
          duration: 1.8,
          ease: "expo.out",
          onUpdate: () => {
            el.textContent = `${String(Math.round(state.v)).padStart(2, "0")}${suffix}`;
          },
        }),
    });
    return () => st.kill();
  }, [value, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      {String(value).padStart(2, "0")}
      {suffix}
    </span>
  );
}
