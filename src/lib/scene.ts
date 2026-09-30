/**
 * Shared state between the DOM (scroll triggers) and the WebGL particle field.
 * Sections write `*Target` values; the render loop eases the live values towards them
 * every frame, so scrubbed and triggered changes never fight each other.
 */
export const sceneState = {
  morph: 0,
  morphTarget: 0,
  alpha: 0,
  alphaTarget: 1,
  x: 0,
  xTarget: 0,
  y: 0,
  yTarget: 0,
  scale: 1,
  scaleTarget: 1,
  velocity: 0,
};

/** Shape order used by the particle field. */
export const SHAPES = {
  sphere: 0,
  helix: 1,
  galaxy: 2,
  grid: 3,
  code: 4,
  portal: 5,
  globe: 6,
} as const;
