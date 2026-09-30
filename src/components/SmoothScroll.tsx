"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { sceneState } from "@/lib/scene";
import { prefersReducedMotion, scrollToTarget, setLenis } from "@/lib/scroll";

export default function SmoothScroll() {
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    // In-page anchor links scroll smoothly (with or without Lenis).
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      e.preventDefault();
      scrollToTarget(href === "#top" ? 0 : href);
    };
    document.addEventListener("click", onClick);

    if (prefersReducedMotion()) {
      return () => document.removeEventListener("click", onClick);
    }

    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
    setLenis(lenis);
    if (document.documentElement.classList.contains("is-loading")) lenis.stop();
    lenis.on("scroll", (l: Lenis) => {
      sceneState.velocity = l.velocity;
      ScrollTrigger.update();
    });
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
