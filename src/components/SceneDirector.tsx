"use client";

import { useEffect } from "react";
import { sceneState } from "@/lib/scene";

/**
 * Reads `data-scene-*` attributes from sections and points the particle field at the
 * section that currently owns the middle of the viewport. Checking position on every
 * scroll (instead of enter/leave callbacks) keeps it right even after big jumps.
 */
export default function SceneDirector() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
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
      const mid = window.innerHeight * 0.5;
      for (const el of sections) {
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) {
          if (el !== current) {
            current = el;
            apply(el);
          }
          return;
        }
      }
    };

    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, []);

  return null;
}
