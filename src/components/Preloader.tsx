"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { markReady } from "@/lib/ready";
import { getLenis, prefersReducedMotion } from "@/lib/scroll";

const pad = (n: number) => String(Math.round(n)).padStart(3, "0");

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const frame = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (prefersReducedMotion() || !root.current) {
      markReady();
      setDone(true);
      return;
    }
    html.classList.add("is-loading");
    getLenis()?.stop();

    const state = { v: 0 };
    const ctx = gsap.context(() => {
      const count = gsap.to(state, {
        v: 100,
        duration: 2.1,
        ease: "power2.inOut",
        onUpdate: () => {
          if (counter.current) counter.current.textContent = pad(state.v);
          if (frame.current) frame.current.textContent = pad(state.v * 1.2);
          if (bar.current) bar.current.style.transform = `scaleX(${state.v / 100})`;
        },
      });

      const fonts = Promise.race([
        document.fonts?.ready ?? Promise.resolve(),
        new Promise((r) => setTimeout(r, 2500)),
      ]);

      Promise.all([count.then(), fonts]).then(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            html.classList.remove("is-loading");
            getLenis()?.start();
            setDone(true);
          },
        });
        tl.to("[data-pl-fade]", { yPercent: -120, opacity: 0, duration: 0.7, ease: "expo.in", stagger: 0.03 })
          .add(() => markReady(), "-=0.1")
          .to(root.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.15, ease: "expo.inOut" }, "-=0.15");
      });
    }, root);

    return () => {
      ctx.revert();
      html.classList.remove("is-loading");
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={root}
      className="preloader fixed inset-0 z-[100] flex flex-col justify-between bg-[var(--bg)] p-5 md:p-10"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      aria-hidden="true"
    >
      <div className="flex justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
        <span className="overflow-hidden"><span data-pl-fade className="inline-block">Abolfazl Abbaspour ©2026</span></span>
        <span className="overflow-hidden"><span data-pl-fade className="inline-block">Loading experience</span></span>
      </div>

      <div className="flex items-end justify-center overflow-hidden">
        <span data-pl-fade className="inline-flex items-start font-display text-[28vw] font-semibold leading-[0.8] tracking-[-0.06em] md:text-[18vw]">
          <span ref={counter} className="text-gradient tabular-nums">000</span>
          <span className="mt-[1vw] text-[6vw] text-[var(--muted)] md:text-[4vw]">%</span>
        </span>
      </div>

      <div>
        <div className="mb-4 flex justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
          <span className="overflow-hidden"><span data-pl-fade className="inline-block">Initializing particles</span></span>
          <span className="overflow-hidden">
            <span data-pl-fade className="inline-block">
              FR <span ref={frame}>000</span> / 120
            </span>
          </span>
        </div>
        <div className="h-px w-full bg-white/10">
          <div ref={bar} className="h-px w-full origin-left bg-gradient-to-r from-[var(--cyan)] to-[var(--violet)]" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </div>
  );
}
