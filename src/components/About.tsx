"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { about, profile } from "@/lib/content";
import { SHAPES } from "@/lib/scene";
import { prefersReducedMotion } from "@/lib/scroll";
import SectionLabel from "./ui/SectionLabel";
import StatCounter from "./StatCounter";

export default function About() {
  const text = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = text.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll(".word"),
        { opacity: 0.12 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.05,
          scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 55%", scrub: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  const words = about.statement.split(" ");

  return (
    <section
      id="about"
      data-scene
      data-scene-morph={SHAPES.helix}
      data-scene-alpha="0.8"
      data-scene-x="3.4"
      data-scene-y="0"
      data-scene-scale="0.95"
      className="relative z-10 px-5 py-28 md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-[1600px]">
        <SectionLabel index="01" label="About me" />

        <div className="grid gap-12 lg:grid-cols-12">
          <p
            ref={text}
            className="font-display text-[1.75rem] font-medium leading-[1.15] tracking-[-0.03em] sm:text-4xl lg:col-span-8 lg:text-[3.4rem]"
          >
            {words.map((w, i) => (
              <span key={i} className="word">
                {w}{" "}
              </span>
            ))}
          </p>

          <aside data-reveal="up" className="id-card self-start lg:col-span-4 lg:mt-3">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">
              <span>ID / 0001</span>
              <span className="flex items-center gap-2">
                <span className="status-dot" /> Online
              </span>
            </div>
            <div className="my-8 flex items-center gap-5">
              <div className="id-avatar grid h-20 w-20 shrink-0 place-items-center rounded-2xl font-display text-2xl font-semibold">
                AA
              </div>
              <div>
                <div className="font-display text-2xl font-semibold tracking-tight">{profile.name}</div>
                <div className="text-sm text-[var(--muted)]">{profile.role}</div>
              </div>
            </div>
            <dl className="space-y-3 font-mono text-[11px] uppercase tracking-[0.18em]">
              {[
                ["Focus", "React / Next.js"],
                ["Experience", "4+ years"],
                ["Languages", "English B2 · Persian"],
                ["Based", "Remote worldwide"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-t border-white/10 pt-3">
                  <dt className="text-[var(--muted)]">{k}</dt>
                  <dd className="text-right text-[var(--fg)]">{v}</dd>
                </div>
              ))}
            </dl>
            <a href={profile.resume} target="_blank" rel="noreferrer" className="btn-ghost mt-8 w-full justify-center">
              Download Resume <span aria-hidden="true">↓</span>
            </a>
          </aside>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:mt-28 lg:grid-cols-4">
          {about.stats.map((s) => (
            <div key={s.label} data-reveal="up" className="stat-cell bg-[var(--bg)]/80 p-6 backdrop-blur md:p-10">
              <div className="font-display text-5xl font-semibold tracking-[-0.05em] md:text-7xl">
                <StatCounter value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-3 max-w-[16ch] text-sm text-[var(--muted)]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
