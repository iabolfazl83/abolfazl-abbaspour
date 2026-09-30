"use client";

/** Fires once the preloader has finished, so intro animations can start in sync. */
let ready = false;
const listeners = new Set<() => void>();

export function markReady() {
  if (ready) return;
  ready = true;
  listeners.forEach((cb) => cb());
  listeners.clear();
}

export function onReady(cb: () => void) {
  if (ready) {
    cb();
    return () => {};
  }
  listeners.add(cb);
  return () => listeners.delete(cb);
}
