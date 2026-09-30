"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/scroll";

/** Wires up every `data-reveal` element on the page. */
export default function Reveals() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const ups = gsap.utils.toArray<HTMLElement>('[data-reveal="up"]');
      gsap.set(ups, { y: 48, opacity: 0 });
      ScrollTrigger.batch(ups, {
        start: "top 90%",
        once: true,
        onEnter: (els) =>
          gsap.to(els, { y: 0, opacity: 1, duration: 1.1, ease: "expo.out", stagger: 0.08, overwrite: true }),
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal="mask"]').forEach((el) => {
        const inner = el.querySelectorAll(".mask-inner");
        gsap.set(inner, { y: 0, yPercent: 115 });
        gsap.to(inner, {
          yPercent: 0,
          duration: 1.3,
          ease: "expo.out",
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal="line"]').forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: el, start: "top 92%", once: true } },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const amount = parseFloat(el.dataset.parallax || "0.2");
        gsap.fromTo(
          el,
          { yPercent: -amount * 50 },
          {
            yPercent: amount * 50,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
