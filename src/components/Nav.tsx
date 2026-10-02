"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { navLinks, profile } from "@/lib/content";
import { getLenis } from "@/lib/scroll";
import { onReady } from "@/lib/ready";
import Scramble from "./ui/Scramble";
import Magnetic from "./ui/Magnetic";
import Clock from "./Clock";

export default function Nav() {
  const bar = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // intro + hide on scroll down / show on scroll up
  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    gsap.set(el, { yPercent: -120 });
    const off = onReady(() => gsap.to(el, { yPercent: 0, duration: 1.2, ease: "expo.out", delay: 0.6 }));

    let lastY = window.scrollY;
    let hidden = false;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      const down = y > lastY && y > 300;
      if (down !== hidden) {
        hidden = down;
        gsap.to(el, { yPercent: down ? -120 : 0, duration: 0.6, ease: "power3.out" });
      }
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      off();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // full-screen mobile menu
  const firstRun = useRef(true);
  useEffect(() => {
    const m = menu.current;
    if (!m) return;
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const lenis = getLenis();
    if (open) {
      lenis?.stop();
      document.documentElement.classList.add("menu-open");
      gsap.set(m, { display: "flex" });
      gsap.fromTo(m, { clipPath: "circle(0% at 100% 0%)" }, { clipPath: "circle(150% at 100% 0%)", duration: 0.9, ease: "expo.inOut" });
      gsap.fromTo(
        m.querySelectorAll("[data-menu-item]"),
        { yPercent: 110 },
        { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.06, delay: 0.3 },
      );
    } else {
      lenis?.start();
      document.documentElement.classList.remove("menu-open");
      gsap.to(m, {
        clipPath: "circle(0% at 100% 0%)",
        duration: 0.7,
        ease: "expo.inOut",
        onComplete: () => void gsap.set(m, { display: "none" }),
      });
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        ref={bar}
        className="fixed inset-x-0 top-0 z-[80] px-4 pt-4 md:px-8 md:pt-5"
      >
        <nav
          aria-label="Primary"
          className={`mx-auto flex max-w-[1600px] items-center justify-between rounded-full border px-3 py-2 transition-colors duration-500 md:px-4 ${
            scrolled || open ? "border-white/10 bg-black/40 backdrop-blur-xl" : "border-transparent bg-transparent"
          }`}
        >
          <a href="#top" className="group flex items-center gap-3" aria-label="Back to top">
            <span className="logo-mark relative grid h-10 w-10 place-items-center rounded-full border border-white/15 font-display text-sm font-semibold">
              AA
            </span>
            <span className="hidden font-mono text-[11px] uppercase leading-tight tracking-[0.18em] text-[var(--muted)] sm:block">
              <span className="block text-[var(--fg)]">{profile.name}</span>
              <span className="block">{profile.role}</span>
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="nav-link rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
                >
                  <Scramble text={l.label} />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Clock className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] xl:block" />
            <Magnetic strength={0.25}>
              <a href="#contact" className="btn-primary">
                <span className="status-dot" />
                Let&apos;s talk
              </a>
            </Magnetic>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="menu-btn grid h-10 w-10 place-items-center rounded-full border border-white/15 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span className={`menu-icon ${open ? "is-open" : ""}`}>
                <span />
                <span />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <div
        id="mobile-menu"
        ref={menu}
        className="fixed inset-0 z-[70] hidden flex-col justify-between bg-[var(--bg)] px-6 pb-10 pt-28"
        style={{ clipPath: "circle(0% at 100% 0%)" }}
      >
        <div className="menu-glow" aria-hidden="true" />
        <ul className="relative space-y-1">
          {navLinks.map((l, i) => (
            <li key={l.href} className="overflow-hidden">
              <a
                data-menu-item
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 font-display text-[13vw] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-7xl"
              >
                <span className="font-mono text-xs tracking-normal text-[var(--cyan)]">0{i + 1}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="relative space-y-4 font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
          <div className="overflow-hidden">
            <a data-menu-item href={`mailto:${profile.email}`} className="block text-[var(--fg)]">
              {profile.email}
            </a>
          </div>
          <div className="flex gap-6 overflow-hidden flex-wrap">
            <a data-menu-item href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a>
            <a data-menu-item href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
            <a data-menu-item href={profile.telegram} target="_blank" rel="noreferrer">Telegram ↗</a>
            <a data-menu-item href={profile.resume} target="_blank" rel="noreferrer">Resume ↗</a>
          </div>
        </div>
      </div>
    </>
  );
}
