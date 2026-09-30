"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { experience, skills } from "@/lib/content";
import { SHAPES } from "@/lib/scene";
import SectionLabel from "./ui/SectionLabel";
import MaskHeading from "./ui/MaskHeading";

export default function Experience() {
  const timeline = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = timeline.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".timeline-progress",
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 70%", end: "bottom 60%", scrub: true } },
      );
      gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((item) => {
        gsap.fromTo(
          item.querySelector(".timeline-node"),
          { scale: 0.4, opacity: 0.3 },
          { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(3)", scrollTrigger: { trigger: item, start: "top 65%", toggleActions: "play none none reverse" } },
        );
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      data-scene
      data-scene-morph={SHAPES.portal}
      data-scene-alpha="0.35"
      data-scene-x="-3"
      data-scene-y="0"
      data-scene-scale="1"
      className="relative z-10 px-5 py-28 md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-[1600px]">
        <SectionLabel index="05" label="Experience" />
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <MaskHeading
                className="font-display text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-7xl"
                lines={[
                  "Where I've been",
                  <em key="b" className="font-serif font-normal italic tracking-[-0.02em] text-gradient">
                    building.
                  </em>,
                ]}
              />
              <div data-reveal="up" className="glass mt-10 rounded-3xl p-7">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">
                  <span>{experience.period}</span>
                  <span className="flex items-center gap-2">
                    <span className="status-dot" /> Current
                  </span>
                </div>
                <a href={experience.url} target="_blank" rel="noreferrer" className="mt-5 block font-display text-4xl font-semibold tracking-[-0.04em] hover:text-gradient">
                  {experience.company} ↗
                </a>
                <div className="mt-1 text-[var(--muted)]">{experience.role}</div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {experience.modules.map((m) => (
                    <span key={m} className="tag">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div ref={timeline} className="relative lg:col-span-6 lg:col-start-7">
            <div aria-hidden="true" className="absolute bottom-0 left-[11px] top-0 w-px bg-white/10">
              <div className="timeline-progress h-full w-full origin-top bg-gradient-to-b from-[var(--cyan)] to-[var(--violet)]" />
            </div>
            <ol className="space-y-16 md:space-y-24">
              {experience.items.map((item, i) => (
                <li key={item.title} className="timeline-item relative pl-12" data-reveal="up">
                  <span aria-hidden="true" className="timeline-node absolute left-0 top-1 grid h-6 w-6 place-items-center rounded-full border border-[var(--cyan)]/60 bg-[var(--bg)]">
                    <span className="h-2 w-2 rounded-full bg-[var(--cyan)]" />
                  </span>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">
                    Chapter 0{i + 1}
                  </div>
                  <h3 className="mt-3 font-display text-3xl font-semibold tracking-[-0.03em] md:text-4xl">{item.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-[var(--muted)] md:text-lg">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* toolkit */}
        <div className="mt-32 md:mt-44">
          <SectionLabel index="06" label="Toolkit" />
          <MaskHeading
            className="mb-12 font-display text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:mb-16 md:text-7xl"
            lines={[
              <>
                The <em className="font-serif font-normal italic tracking-[-0.02em] text-gradient">toolkit.</em>
              </>,
            ]}
          />
          <div className="border-t border-white/10">
            {skills.map((s, i) => (
              <div key={s.group} data-reveal="up" className="skill-row group grid gap-4 border-b border-white/10 py-6 md:grid-cols-12 md:items-center md:py-8">
                <div className="flex items-center gap-4 md:col-span-4">
                  <span className="font-mono text-[10px] tracking-[0.22em] text-[var(--cyan)]">0{i + 1}</span>
                  <span className="font-display text-2xl font-semibold tracking-[-0.03em] transition-transform duration-500 group-hover:translate-x-2 md:text-3xl">
                    {s.group}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 md:col-span-8">
                  {s.items.map((item) => (
                    <span key={item} className="tag tag-lg">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
