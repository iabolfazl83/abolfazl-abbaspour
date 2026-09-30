"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { onReady } from "@/lib/ready";
import { prefersReducedMotion } from "@/lib/scroll";
import { profile } from "@/lib/content";
import { SHAPES } from "@/lib/scene";
import SplitChars from "./ui/SplitChars";
import Magnetic from "./ui/Magnetic";
import HudTimecode from "./HudTimecode";
import Clock from "./Clock";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const chars = el.querySelectorAll(".hero-char");
      const fades = el.querySelectorAll("[data-hero-fade]");
      gsap.set(chars, { y: 0, yPercent: 115, rotate: 6 });
      gsap.set(fades, { y: 24, opacity: 0 });

      // name drifts up and dims as you scroll away
      gsap.to("[data-hero-title]", {
        yPercent: -18,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
    }, el);

    const off = onReady(() => {
      ctx.add(() => {
        const chars = el.querySelectorAll(".hero-char");
        const fades = el.querySelectorAll("[data-hero-fade]");
        if (reduced) {
          gsap.set(chars, { y: 0, yPercent: 0, rotate: 0 });
          gsap.set(fades, { y: 0, opacity: 1 });
          return;
        }
        gsap
          .timeline({ delay: 0.15 })
          .to(chars, { yPercent: 0, rotate: 0, duration: 1.5, ease: "expo.out", stagger: 0.035 })
          .to(fades, { y: 0, opacity: 1, duration: 1.1, ease: "expo.out", stagger: 0.08 }, "-=1.1");
      });
    });

    return () => {
      off();
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="top"
      ref={root}
      data-scene
      data-scene-morph={SHAPES.sphere}
      data-scene-alpha="1"
      data-scene-x="2.6"
      data-scene-y="0.2"
      data-scene-scale="1"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-5 pb-6 pt-28 md:px-10 md:pb-8"
    >
      {/* HUD corners */}
      <div aria-hidden="true" className="hud-corners pointer-events-none absolute inset-4 md:inset-6" />

      <div className="relative z-10 mx-auto w-full max-w-[1600px]">
        <div data-hero-fade className="mb-6 flex flex-wrap items-center gap-3 md:mb-8">
          <span className="chip">
            <span className="status-dot" /> Available for new projects
          </span>
          <span className="chip hidden sm:inline-flex">{profile.location}</span>
        </div>

        <h1 data-hero-title className="font-display font-semibold leading-[0.84] tracking-[-0.06em]">
          <span className="block overflow-hidden pb-[0.04em] text-[15vw] md:text-[13.5vw] xl:text-[12.5vw]">
            <SplitChars text={profile.firstName} charClassName="hero-char" />
          </span>
          <span className="flex items-end gap-[2vw] overflow-hidden pb-[0.06em] text-[15vw] sm:pl-[6vw] md:pl-[9vw] md:text-[13.5vw] xl:text-[12.5vw]">
            <span className="hero-char mb-[2.4vw] hidden font-serif text-[4vw] font-normal italic tracking-normal text-[var(--muted)] md:inline-block">
              (dev)
            </span>
            <SplitChars text={profile.lastName} charClassName="hero-char text-gradient-soft" />
          </span>
        </h1>

        <div className="mt-8 grid gap-8 border-t border-white/10 pt-6 md:mt-10 md:grid-cols-12 md:gap-6">
          <div data-hero-fade className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.2em] text-[var(--muted)] md:col-span-3">
            <span className="block text-[var(--fg)]">{profile.role}</span>
            <span className="block">React · Next.js · TypeScript</span>
          </div>
          <p data-hero-fade className="max-w-xl text-lg leading-snug text-[var(--fg)]/90 md:col-span-5 md:text-2xl">
            I design and build <em className="font-serif text-[1.15em] italic text-gradient">fast</em>, modern and{" "}
            <em className="font-serif text-[1.15em] italic text-gradient">unforgettable</em> web experiences that turn
            visitors into customers.
          </p>
          <div data-hero-fade className="flex flex-wrap items-start gap-3 md:col-span-4 md:justify-end">
            <Magnetic>
              <a href="#contact" className="btn-primary btn-lg">
                Start a project
                <span aria-hidden="true" className="btn-arrow">↗</span>
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#work" className="btn-ghost btn-lg">
                View work
              </a>
            </Magnetic>
          </div>
        </div>

        <div
          data-hero-fade
          className="mt-10 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--muted)] md:mt-14"
        >
          <a href="#about" className="flex items-center gap-3">
            <span className="scroll-line" aria-hidden="true" />
            Scroll to explore
          </a>
          <span className="hidden md:block">
            <Clock />
          </span>
          <span className="flex items-center gap-2">
            <span className="rec-dot" aria-hidden="true" /> REC <HudTimecode />
          </span>
        </div>
      </div>
    </section>
  );
}
