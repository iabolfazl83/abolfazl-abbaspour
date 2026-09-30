"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const d = dot.current;
    const r = ring.current;
    if (!d || !r) return;
    const html = document.documentElement;
    html.classList.add("has-cursor");

    const dx = gsap.quickTo(d, "x", { duration: 0.08, ease: "none" });
    const dy = gsap.quickTo(d, "y", { duration: 0.08, ease: "none" });
    const rx = gsap.quickTo(r, "x", { duration: 0.45, ease: "power3.out" });
    const ry = gsap.quickTo(r, "y", { duration: 0.45, ease: "power3.out" });

    let shown = false;
    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.set([d, r], { x: e.clientX, y: e.clientY });
        gsap.to([d, r], { opacity: 1, duration: 0.3 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };

    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const labelled = t.closest<HTMLElement>("[data-cursor]");
      const interactive = t.closest("a, button, [role='button'], input, textarea, label");
      if (labelled) {
        r.dataset.state = "label";
        if (label.current) label.current.textContent = labelled.dataset.cursor ?? "";
      } else if (interactive) {
        r.dataset.state = "hover";
      } else {
        r.dataset.state = "";
      }
    };
    const down = () => r.classList.add("is-down");
    const up = () => r.classList.remove("is-down");
    const leave = () => gsap.to([d, r], { opacity: 0, duration: 0.3 }).then(() => (shown = false));

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.addEventListener("pointerleave", leave);
    return () => {
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div aria-hidden="true" className="cursor-layer pointer-events-none fixed inset-0 z-[90] hidden [@media(pointer:fine)]:block">
      <div ref={ring} className="cursor-ring">
        <span ref={label} className="cursor-label" />
      </div>
      <div ref={dot} className="cursor-dot" />
    </div>
  );
}
