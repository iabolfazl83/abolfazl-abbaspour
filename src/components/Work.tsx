"use client";

import { useEffect, useRef, type PointerEvent } from "react";
import { gsap } from "@/lib/gsap";
import { projects, type Project } from "@/lib/content";
import { SHAPES } from "@/lib/scene";
import SectionLabel from "./ui/SectionLabel";
import MaskHeading from "./ui/MaskHeading";
import { DevJobsMock, EnterpriseMock, HabitsMock } from "./Mockups";

const mocks: Record<Project["mockup"], () => React.ReactElement> = {
  devjobs: DevJobsMock,
  habits: HabitsMock,
  enterprise: EnterpriseMock,
};

function Tilt({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(ref.current, { rotateY: x * 10, rotateX: -y * 8, duration: 0.8, ease: "power3.out" });
  };
  const onLeave = () => ref.current && gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 1.2, ease: "elastic.out(1, 0.4)" });
  return (
    <div onPointerMove={onMove} onPointerLeave={onLeave} className="[perspective:1400px]">
      <div ref={ref} className="will-change-transform [transform-style:preserve-3d]">
        {children}
      </div>
    </div>
  );
}

export default function Work() {
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = list.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray<HTMLElement>(".project-card", el);
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.to(card.querySelector(".project-card__body"), {
          scale: 0.92,
          opacity: 0.35,
          filter: "blur(2px)",
          ease: "none",
          scrollTrigger: {
            trigger: next,
            start: "top bottom",
            end: `top ${parseFloat(getComputedStyle(next).top) || 0}px`,
            scrub: true,
          },
        });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      id="work"
      data-scene
      data-scene-morph={SHAPES.portal}
      data-scene-alpha="0.3"
      data-scene-x="0"
      data-scene-y="0"
      data-scene-scale="1.35"
      className="relative z-10 px-5 py-28 md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-[1600px]">
        <SectionLabel index="04" label="Selected work" />
        <div className="mb-14 grid items-end gap-8 md:mb-20 lg:grid-cols-12">
          <MaskHeading
            className="font-display text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-7xl lg:col-span-8 lg:text-[6.5rem]"
            lines={[
              "Real products.",
              <>
                Real <em className="font-serif font-normal italic tracking-[-0.02em] text-gradient">results.</em>
              </>,
            ]}
          />
          <p data-reveal="up" className="max-w-md text-lg text-[var(--muted)] lg:col-span-4">
            A selection of things I&apos;ve designed, engineered and shipped — from enterprise HR software to
            full-stack side projects you can try right now.
          </p>
        </div>

        <div ref={list} className="space-y-6 lg:space-y-[12vh]">
          {projects.map((p, i) => {
            const Mock = mocks[p.mockup];
            return (
              <article
                key={p.title}
                className="project-card lg:sticky"
                style={{ top: `calc(10vh + ${i * 28}px)` }}
              >
                <div className="project-card__body grid grid-cols-1 gap-10 overflow-hidden rounded-[2rem] border border-white/10 p-6 md:p-10 lg:min-h-[76vh] lg:grid-cols-12 lg:items-center lg:gap-12 lg:p-14">
                  <div className="lg:col-span-5">
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">
                      <span>
                        <span className="text-[var(--cyan)]">{p.index}</span> / 0{projects.length}
                      </span>
                      <span>{p.kind}</span>
                    </div>
                    <h3 className="mt-8 font-display text-5xl font-semibold tracking-[-0.05em] md:text-7xl">{p.title}</h3>
                    <p className="mt-5 text-base leading-relaxed text-[var(--muted)] md:text-lg">{p.description}</p>
                    <ul className="mt-6 space-y-3">
                      {p.highlights.map((h) => (
                        <li key={h} className="flex gap-3 text-[15px] leading-snug text-[var(--fg)]/85">
                          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-[var(--cyan)] to-[var(--violet)]" />
                          {h}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-7 flex flex-wrap gap-2">
                      {p.stack.map((s) => (
                        <span key={s} className="tag">
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="mt-9 flex flex-wrap gap-3">
                      {p.live && (
                        <a href={p.live} target="_blank" rel="noreferrer" className="btn-primary" data-cursor="Open">
                          {p.mockup === "enterprise" ? "Visit HRBOX" : "Live demo"} <span aria-hidden="true">↗</span>
                        </a>
                      )}
                      {p.repo && (
                        <a href={p.repo} target="_blank" rel="noreferrer" className="btn-ghost" data-cursor="Code">
                          Source code <span aria-hidden="true">↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="relative px-2 py-8 md:px-8 lg:col-span-7">
                    <div aria-hidden="true" className="mock-glow" />
                    <Tilt>
                      <Mock />
                    </Tilt>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
