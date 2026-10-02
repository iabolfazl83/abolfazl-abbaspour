"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { process as steps } from "@/lib/content";
import { sceneState, SHAPES } from "@/lib/scene";
import SectionLabel from "./ui/SectionLabel";

const TOTAL_FRAMES = 720;
const FPS = 24;
const two = (n: number) => String(n).padStart(2, "0");
const shapeNames = ["NEBULA", "WIREFRAME", "SOURCE", "PORTAL"];

/**
 * Pinned, scroll-scrubbed sequence. Scroll position is mapped to a frame number,
 * and every frame drives the particle morph — like scrubbing a film timeline.
 */
export default function Process() {
  const root = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLSpanElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const n = steps.length;
    let current = -1;

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: () => `+=${window.innerHeight * 3.2}`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;
        // Each step holds its shape for most of its slice, then morphs into the next one.
        const x = Math.min(p * n, n - 0.0001);
        const i = Math.floor(x);
        const local = x - i;
        const hold = 0.55;
        const t = i < n - 1 ? Math.max(0, (local - hold) / (1 - hold)) : 0;
        const eased = t * t * (3 - 2 * t);
        sceneState.morphTarget = SHAPES.galaxy + i + eased;
        sceneState.alphaTarget = 1;
        sceneState.xTarget = 2.7;
        sceneState.yTarget = 0;
        sceneState.scaleTarget = 1;

        const step = Math.min(n - 1, local > 0.8 && i < n - 1 ? i + 1 : i);
        if (step !== current) {
          current = step;
          setActive(step);
        }

        const frame = Math.round(p * TOTAL_FRAMES);
        if (frameRef.current) frameRef.current.textContent = String(frame).padStart(4, "0");
        if (tcRef.current) {
          const s = Math.floor(frame / FPS);
          tcRef.current.textContent = `00:00:${two(s)}:${two(frame % FPS)}`;
        }
        if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      },
    });

    return () => st.kill();
  }, []);

  return (
    <section
      id="process"
      ref={root}
      data-scene
      data-scene-alpha="1"
      data-scene-x="2.7"
      data-scene-y="0"
      data-scene-scale="1"
      className="relative z-10 h-[100svh] overflow-hidden px-5 md:px-10"
    >
      <div aria-hidden="true" className="hud-corners pointer-events-none absolute inset-4 md:inset-6" />
      <div aria-hidden="true" className="film-strip film-strip--left" />
      <div aria-hidden="true" className="film-strip film-strip--right" />

      <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-between pb-8 pt-24 md:pb-10 md:pt-28">
        <div className="flex items-start justify-between gap-6">
          <div>
            <SectionLabel index="03" label="Process" />
            <h2 className="-mt-4 font-display text-3xl [@media(min-width:375px)]:text-4xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-6xl">
              From idea to launch —
              <br />
              <em className="font-serif font-normal italic tracking-[-0.02em] text-gradient">frame by frame.</em>
            </h2>
          </div>
          <div className="hidden text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.22em] text-[var(--muted)] md:block">
            <div>
              Frame <span ref={frameRef} className="text-[var(--fg)] tabular-nums">0000</span> / {TOTAL_FRAMES}
            </div>
            <div>
              TC <span ref={tcRef} className="tabular-nums text-[var(--fg)]">00:00:00:00</span>
            </div>
            <div>
              SEQ <span className="text-[var(--cyan)]">{shapeNames[active]}</span>
            </div>
          </div>
        </div>

        {/* step panels */}
        <div className="relative min-h-[300px] max-w-xl md:min-h-[340px]">
          {steps.map((s, i) => (
            <div
              key={s.step}
              className={`process-panel absolute inset-x-0 bottom-0 ${i === active ? "is-active" : i < active ? "is-past" : ""}`}
              aria-hidden={i !== active}
            >
              <div className="flex items-baseline gap-4">
                <span className="font-display text-[3rem] [@media(min-width:375px)]:text-[4rem] [@media(min-width:425px)]:text-[5.5rem] font-semibold leading-none tracking-[-0.06em] text-outline md:text-[9rem]">
                  {s.step}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">
                  / 0{steps.length}
                </span>
              </div>
              <h3 className="mt-2 font-display text-3xl [@media(min-width:375px)]:text-4xl font-semibold tracking-[-0.04em] md:text-6xl">{s.title}</h3>
              <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--muted)] md:text-lg">{s.body}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {s.points.map((p) => (
                  <li key={p} className="tag">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* timeline scrubber */}
        <div>
          <div className="mb-3 grid grid-cols-4 gap-2 font-mono text-[10px] uppercase tracking-[0.22em]">
            {steps.map((s, i) => (
              <div key={s.step} className={`transition-colors duration-500 ${i <= active ? "text-[var(--fg)]" : "text-[var(--muted)]/60"}`}>
                {s.step} <span className="hidden sm:inline">— {s.title}</span>
              </div>
            ))}
          </div>
          <div className="timeline-ticks relative h-6">
            <div ref={barRef} className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gradient-to-r from-[var(--cyan)] to-[var(--violet)]" style={{ transform: "scaleX(0)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
