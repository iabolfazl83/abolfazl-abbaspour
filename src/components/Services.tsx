"use client";

import { useRef, type PointerEvent } from "react";
import { services } from "@/lib/content";
import { SHAPES } from "@/lib/scene";
import SectionLabel from "./ui/SectionLabel";
import MaskHeading from "./ui/MaskHeading";

const icons = [
  // web apps — stacked windows
  <svg key="0" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="6" y="12" width="30" height="24" rx="3" /><path d="M6 18h30" /><path d="M12 6h30v24" /><circle cx="10" cy="15" r=".8" fill="currentColor" /><circle cx="13" cy="15" r=".8" fill="currentColor" /></svg>,
  // landing pages — page + cursor
  <svg key="1" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="6" y="6" width="36" height="28" rx="3" /><path d="M12 14h16M12 20h10" /><path d="M28 24l12 5-5 2-2 5z" /></svg>,
  // dashboards — bars
  <svg key="2" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 40h36" /><rect x="10" y="24" width="6" height="12" rx="1" /><rect x="21" y="14" width="6" height="22" rx="1" /><rect x="32" y="8" width="6" height="28" rx="1" /></svg>,
  // modernization — cycle
  <svg key="3" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M38 20a14 14 0 0 0-26-5" /><path d="M10 28a14 14 0 0 0 26 5" /><path d="M12 8v7h7M36 40v-7h-7" /></svg>,
  // performance — gauge
  <svg key="4" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 34a16 16 0 1 1 32 0" /><path d="M24 34l8-12" /><circle cx="24" cy="34" r="2.5" /><path d="M12 22l2 1.5M24 16v2.5M36 22l-2 1.5" /></svg>,
  // UI — component grid
  <svg key="5" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="6" y="6" width="15" height="15" rx="3" /><rect x="27" y="6" width="15" height="15" rx="7.5" /><rect x="6" y="27" width="15" height="15" rx="3" /><path d="M34.5 27l7.5 13h-15z" /></svg>,
];

export default function Services() {
  const grid = useRef<HTMLDivElement>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    grid.current?.querySelectorAll<HTMLElement>(".spot-card").forEach((card) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  };

  return (
    <section
      id="services"
      data-scene
      data-scene-morph={SHAPES.galaxy}
      data-scene-alpha="0.4"
      data-scene-x="0"
      data-scene-y="0"
      data-scene-scale="1.25"
      className="relative z-10 px-5 py-28 md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-[1600px]">
        <SectionLabel index="02" label="Services" />
        <div className="mb-14 grid items-end gap-8 md:mb-20 lg:grid-cols-12">
          <MaskHeading
            className="font-display text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-7xl lg:col-span-8 lg:text-[6.5rem]"
            lines={[
              "What I can build",
              <>
                <em className="font-serif font-normal italic tracking-[-0.02em] text-gradient">for you</em>.
              </>,
            ]}
          />
          <p data-reveal="up" className="max-w-md text-lg text-[var(--muted)] lg:col-span-4">
            Whether you need a brand-new product or a rescue for an aging codebase — every project gets the same care
            for every pixel and every line of code.
          </p>
        </div>

        <div ref={grid} onPointerMove={onMove} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((s, i) => (
            <article key={s.title} data-reveal="up" className="spot-card group">
              <div className="spot-card__inner flex h-full flex-col p-7 md:p-9">
                <div className="flex items-start justify-between">
                  <div className="service-icon h-12 w-12 text-[var(--cyan)]">{icons[i]}</div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">{s.code}</span>
                </div>
                <h3 className="mt-12 font-display text-2xl font-semibold tracking-[-0.03em] md:text-3xl">{s.title}</h3>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[var(--muted)]">{s.body}</p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
