"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { sceneState } from "@/lib/scene";
import { marquee } from "@/lib/content";

function Row({ items, reverse, outline }: { items: string[]; reverse?: boolean; outline?: boolean }) {
  const content = (
    <div className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className={`px-6 md:px-10 ${outline ? "text-outline" : ""}`}>{item}</span>
          <span className="text-[0.45em] text-[var(--cyan)]" aria-hidden="true">✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className={`marquee-track flex w-max ${reverse ? "marquee-reverse" : ""}`}>
      {content}
      <div aria-hidden="true" className="flex shrink-0">{content}</div>
    </div>
  );
}

export default function Marquee() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const skew = gsap.quickTo(el, "skewY", { duration: 0.5, ease: "power3.out" });
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      skew(Math.max(-4, Math.min(4, sceneState.velocity * -0.12)));
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section aria-label="Skills" className="relative z-10 overflow-hidden border-y border-white/10 bg-black/30 py-6 backdrop-blur-sm md:py-8">
      <div ref={ref} className="space-y-3 font-display text-4xl font-semibold tracking-[-0.03em] md:text-6xl">
        <Row items={marquee} />
        <Row
          items={["Available for freelance", "Websites that convert", "Web apps that scale", "Let's build together"]}
          reverse
          outline
        />
      </div>
    </section>
  );
}
