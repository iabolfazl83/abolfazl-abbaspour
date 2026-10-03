"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { sceneState } from "@/lib/scene";

type Range = { el: HTMLElement; top: number; bottom: number };

/**
 * Reads `data-scene-*` attributes from sections and points the particle field at the
 * section that owns the middle of the viewport. Section bounds are measured once per
 * layout change (ScrollTrigger refresh), so scrolling only compares numbers — no
 * layout reads on the scroll path.
 */
export default function SceneDirector() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
    let ranges: Range[] = [];
    let current: HTMLElement | null = null;

    const apply = (el: HTMLElement) => {
      const d = el.dataset;
      if (d.sceneMorph !== undefined) sceneState.morphTarget = parseFloat(d.sceneMorph);
      if (d.sceneAlpha !== undefined) sceneState.alphaTarget = parseFloat(d.sceneAlpha);
      if (d.sceneX !== undefined) sceneState.xTarget = parseFloat(d.sceneX);
      if (d.sceneY !== undefined) sceneState.yTarget = parseFloat(d.sceneY);
      if (d.sceneScale !== undefined) sceneState.scaleTarget = parseFloat(d.sceneScale);
    };

    const pick = () => {
      const mid = window.scrollY + window.innerHeight * 0.5;
      for (const r of ranges) {
        if (r.top <= mid && r.bottom >= mid) {
          if (r.el !== current) {
            current = r.el;
            apply(r.el);
          }
          return;
        }
      }
    };

    const measure = () => {
      const y = window.scrollY;
      ranges = sections.map((el) => {
        // A pinned section's real scroll range is its pin spacer.
        const box = el.parentElement?.classList.contains("pin-spacer") ? el.parentElement : el;
        const r = box.getBoundingClientRect();
        return { el, top: r.top + y, bottom: r.bottom + y };
      });
      pick();
    };

    measure();
    ScrollTrigger.addEventListener("refresh", measure);
    window.addEventListener("scroll", pick, { passive: true });
    return () => {
      ScrollTrigger.removeEventListener("refresh", measure);
      window.removeEventListener("scroll", pick);
    };
  }, []);

  return null;
}
