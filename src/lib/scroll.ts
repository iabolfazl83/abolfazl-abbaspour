"use client";

import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}

export function scrollToTarget(target: string | number) {
  if (instance) {
    instance.scrollTo(target, { duration: 1.6, offset: 0 });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  }
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
